import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
import { dbQuery } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'murjan-ai-secret-key-12345';
const APP_URL = process.env.APP_URL || 'http://localhost:5173';

// ─── Email transporter ────────────────────────────────────────────────────────
function createTransporter() {
  const user = process.env.MAIL_FROM_ADDRESS;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.warn('[Mail] MAIL_FROM_ADDRESS or GMAIL_APP_PASSWORD not set. Emails will be logged only.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

async function sendEmail({ to, subject, html }) {
  const from = process.env.MAIL_FROM_ADDRESS || 'noreply@murjan.ai';
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`[DEV EMAIL] To: ${to} | Subject: ${subject}`);
    console.log(`[DEV EMAIL] Body:\n${html.replace(/<[^>]*>/g, '')}`);
    return;
  }

  await transporter.sendMail({ from: `"Murjan AI" <${from}>`, to, subject, html });
}

// ─── Google OAuth2 Client ─────────────────────────────────────────────────────
function getGoogleClient() {
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || `${APP_URL}/auth/google/callback`
  );
}

// ─── Register ─────────────────────────────────────────────────────────────────
export const register = async (c) => {
  try {
    const { username, password, email } = await c.req.json();

    if (!username || !password) {
      return c.json({ error: 'Username and password are required' }, 400);
    }

    // Check if user exists
    const existingUsername = await dbQuery('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUsername.length > 0) {
      return c.json({ error: 'Username already exists' }, 400);
    }

    if (email) {
      const existingEmail = await dbQuery('SELECT id FROM users WHERE email = ?', [email]);
      if (existingEmail.length > 0) {
        return c.json({ error: 'Email already registered' }, 400);
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbQuery(
      'INSERT INTO users (username, password, email, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [username, hashedPassword, email || null]
    );

    return c.json({ message: 'User registered successfully' }, 201);
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────
export const login = async (c) => {
  try {
    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json({ error: 'Username and password are required' }, 400);
    }

    const users = await dbQuery('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const user = users[0];

    if (!user.password) {
      return c.json({ error: 'This account uses Google Sign-In. Please use "Sign in with Google".' }, 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return c.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

// ─── Me ───────────────────────────────────────────────────────────────────────
export const me = async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const users = await dbQuery('SELECT id, username, email, avatar FROM users WHERE id = ?', [decoded.id]);
    if (users.length === 0) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ user: users[0] });
  } catch (error) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
};

// ─── Forgot Password ──────────────────────────────────────────────────────────
export const forgotPassword = async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    const users = await dbQuery('SELECT id, username, email FROM users WHERE email = ?', [email]);

    // Always return success to prevent email enumeration
    if (users.length === 0) {
      return c.json({ message: 'If that email is registered, a reset link has been sent.' });
    }

    const user = users[0];

    // Invalidate any existing tokens for this email
    await dbQuery('DELETE FROM password_reset_tokens WHERE email = ?', [email]);

    // Generate a secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await dbQuery(
      'INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)',
      [email, token, expiresAt]
    );

    const resetLink = `${APP_URL}/reset-password?token=${token}`;

    await sendEmail({
      to: email,
      subject: 'Reset your Murjan AI password',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="background:#171a27;color:#fff;font-family:sans-serif;padding:40px 0;margin:0;">
          <div style="max-width:480px;margin:0 auto;background:#1e212b;border-radius:16px;padding:40px;border:1px solid rgba(255,255,255,0.08);">
            <h1 style="color:#818cf8;font-size:24px;margin:0 0 8px;">Murjan AI</h1>
            <p style="color:#aeb5cc;margin:0 0 24px;font-size:14px;">Password Reset Request</p>
            <p style="color:#e2e8f0;margin:0 0 16px;">Hi <strong>${user.username}</strong>,</p>
            <p style="color:#aeb5cc;font-size:15px;line-height:1.6;margin:0 0 28px;">
              We received a request to reset your password. Click the button below to choose a new password. This link will expire in <strong style="color:#e2e8f0;">1 hour</strong>.
            </p>
            <a href="${resetLink}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#818cf8);color:#fff;text-decoration:none;padding:14px 32px;border-radius:100px;font-size:15px;font-weight:600;margin-bottom:28px;">
              Reset Password
            </a>
            <p style="color:#64748b;font-size:12px;margin:0;line-height:1.6;">
              If you didn't request this, you can safely ignore this email. Your password won't change.<br><br>
              Or paste this link: <span style="color:#818cf8;">${resetLink}</span>
            </p>
          </div>
        </body>
        </html>
      `
    });

    return c.json({ message: 'If that email is registered, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

// ─── Reset Password ───────────────────────────────────────────────────────────
export const resetPassword = async (c) => {
  try {
    const { token, password } = await c.req.json();

    if (!token || !password) {
      return c.json({ error: 'Token and new password are required' }, 400);
    }

    if (password.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters' }, 400);
    }

    const tokens = await dbQuery(
      'SELECT * FROM password_reset_tokens WHERE token = ? AND used = 0 AND expires_at > NOW()',
      [token]
    );

    if (tokens.length === 0) {
      return c.json({ error: 'This reset link is invalid or has expired.' }, 400);
    }

    const resetToken = tokens[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    await dbQuery('UPDATE users SET password = ?, updated_at = NOW() WHERE email = ?', [hashedPassword, resetToken.email]);
    await dbQuery('UPDATE password_reset_tokens SET used = 1 WHERE token = ?', [token]);

    return c.json({ message: 'Password updated successfully. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

// ─── Google OAuth2 – Get URL ──────────────────────────────────────────────────
export const googleAuthUrl = async (c) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return c.json({ error: 'Google Sign-In is not configured on this server.' }, 503);
    }

    const client = getGoogleClient();
    const url = client.generateAuthUrl({
      access_type: 'offline',
      scope: ['openid', 'email', 'profile'],
      prompt: 'select_account',
    });

    return c.json({ url });
  } catch (error) {
    console.error('Google auth URL error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

// ─── Google OAuth2 – Callback ─────────────────────────────────────────────────
export const googleCallback = async (c) => {
  try {
    const { code } = await c.req.json();

    if (!code) {
      return c.json({ error: 'Authorization code is required' }, 400);
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return c.json({ error: 'Google Sign-In is not configured on this server.' }, 503);
    }

    const client = getGoogleClient();
    const { tokens: googleTokens } = await client.getToken(code);
    client.setCredentials(googleTokens);

    // Get user info from Google
    const ticket = await client.verifyIdToken({
      idToken: googleTokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { sub: googleId, email, name, picture } = payload;

    // Find existing user by google_id or email
    let user = null;
    const byGoogleId = await dbQuery('SELECT * FROM users WHERE google_id = ?', [googleId]);

    if (byGoogleId.length > 0) {
      user = byGoogleId[0];
      // Update avatar and name in case they changed
      await dbQuery('UPDATE users SET avatar = ?, name = ?, updated_at = NOW() WHERE id = ?', [picture, name, user.id]);
      user.avatar = picture;
    } else {
      // Check if user registered with this email manually
      const byEmail = await dbQuery('SELECT * FROM users WHERE email = ?', [email]);
      if (byEmail.length > 0) {
        // Link Google account to existing user
        user = byEmail[0];
        await dbQuery('UPDATE users SET google_id = ?, avatar = ?, name = ?, updated_at = NOW() WHERE id = ?', [googleId, picture, name, user.id]);
        user.google_id = googleId;
        user.avatar = picture;
      } else {
        // Create new user from Google profile
        const baseUsername = (name || email.split('@')[0]).toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        let username = baseUsername;
        let attempt = 0;

        // Ensure username is unique
        while (true) {
          const existing = await dbQuery('SELECT id FROM users WHERE username = ?', [username]);
          if (existing.length === 0) break;
          attempt++;
          username = `${baseUsername}_${attempt}`;
        }

        const result = await dbQuery(
          'INSERT INTO users (username, email, name, google_id, avatar, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
          [username, email, name, googleId, picture]
        );

        const newUsers = await dbQuery('SELECT * FROM users WHERE id = ?', [result.insertId]);
        user = newUsers[0];
      }
    }

    const jwtToken = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return c.json({
      message: 'Google Sign-In successful',
      token: jwtToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      }
    });
  } catch (error) {
    console.error('Google callback error:', error);
    return c.json({ error: 'Google Sign-In failed. Please try again.' }, 500);
  }
};

// ─── Update Profile ───────────────────────────────────────────────────────────
export const updateProfile = async (c) => {
  try {
    const user = c.get('user');
    const { name, username } = await c.req.json();

    if (!user || !user.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    if (!username || username.length < 3) {
      return c.json({ error: 'Username must be at least 3 characters long' }, 400);
    }

    // Check if new username is already taken by someone else
    const existing = await dbQuery('SELECT id FROM users WHERE username = ? AND id != ?', [username, user.id]);
    if (existing.length > 0) {
      return c.json({ error: 'Username is already taken' }, 400);
    }

    await dbQuery(
      'UPDATE users SET name = ?, username = ?, updated_at = NOW() WHERE id = ?',
      [name || null, username, user.id]
    );

    // Fetch the updated user
    const updatedUsers = await dbQuery('SELECT id, username, email, name, avatar FROM users WHERE id = ?', [user.id]);

    return c.json({
      message: 'Profile updated successfully',
      user: updatedUsers[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};
