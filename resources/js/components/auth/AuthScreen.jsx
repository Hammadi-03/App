import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Loader2, Eye, EyeOff, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';
import { Card } from '@/components/ui/card';

// ─── Google Icon SVG ──────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// ─── View types ───────────────────────────────────────────────────────────────
const VIEWS = { LOGIN: 'login', REGISTER: 'register', FORGOT: 'forgot' };

export default function AuthScreen({ onLogin, onRegister, onForgotPassword, onGoogleSignIn }) {
  const [view, setView] = useState(VIEWS.LOGIN);
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // Handle Google OAuth callback code in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('google_code');
    if (code && onGoogleSignIn) {
      setGoogleLoading(true);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      onGoogleSignIn(code).then((result) => {
        if (!result.success) {
          setMessage({ type: 'error', text: result.error || 'Google Sign-In failed.' });
        }
        setGoogleLoading(false);
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const switchView = (newView) => {
    setView(newView);
    setMessage(null);
    setForgotSent(false);
    setFormData({ username: '', password: '', email: '' });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (view === VIEWS.LOGIN) {
        const result = await onLogin(formData.username, formData.password);
        if (!result.success) setMessage({ type: 'error', text: result.error });

      } else if (view === VIEWS.REGISTER) {
        const result = await onRegister(formData.username, formData.password, formData.email);
        if (result.success) {
          switchView(VIEWS.LOGIN);
          setMessage({ type: 'success', text: 'Account created! Please log in.' });
        } else {
          setMessage({ type: 'error', text: result.error });
        }

      } else if (view === VIEWS.FORGOT) {
        const result = await onForgotPassword(formData.email);
        if (result.success) {
          setForgotSent(true);
        } else {
          setMessage({ type: 'error', text: result.error });
        }
      }
    } catch {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!onGoogleSignIn) {
      setMessage({ type: 'error', text: 'Google Sign-In is not configured yet.' });
      return;
    }
    setGoogleLoading(true);
    setMessage(null);
    try {
      // Get the Google Auth URL from the backend
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_BASE}/api/auth/google/url`);
      const data = await res.json();
      if (res.ok && data.url) {
        // Redirect user to Google's consent screen
        window.location.href = data.url;
      } else {
        setMessage({ type: 'error', text: data.error || 'Google Sign-In is not available.' });
        setGoogleLoading(false);
      }
    } catch {
      setMessage({ type: 'error', text: 'Could not connect to server.' });
      setGoogleLoading(false);
    }
  };

  const inputClasses = "w-full bg-[#343b54]/60 border border-[#434b66]/50 focus:border-blue-500 rounded-full py-3.5 pl-12 pr-4 text-white placeholder:text-gray-400 outline-none transition-all focus:ring-2 focus:ring-blue-500/20";

  const headings = {
    [VIEWS.LOGIN]: { title: 'Welcome back', sub: 'Sign in to continue your conversations with Murjan AI' },
    [VIEWS.REGISTER]: { title: 'Create account', sub: 'Join Murjan AI and start chatting with intelligent AI models' },
    [VIEWS.FORGOT]: { title: 'Forgot password?', sub: "No worries — enter your email and we'll send you a reset link" },
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 bg-[#0a0a0f] text-white font-sans selection:bg-blue-500/30 overflow-hidden relative">
      
      <Card className="w-full max-w-6xl h-[90vh] min-h-[600px] bg-[#12141c] border-white/5 relative overflow-hidden flex shadow-2xl rounded-3xl">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        
        {/* Left content: Auth Forms */}
        <div className="flex-1 p-6 md:p-10 relative z-10 flex flex-col justify-center overflow-y-auto custom-scrollbar">
          <div className="w-full max-w-[320px] mx-auto relative flex flex-col items-center">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8 mt-6 md:mt-12"
        >
          <img src="/Layer_2.svg" alt="Murjan AI Logo" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-bold text-white tracking-wide">MurjanAI</span>
        </motion.div>

        {/* Heading */}
        <AnimatePresence mode="wait">
          <motion.div
            key={view + '-heading'}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-[28px] md:text-[34px] font-bold leading-tight tracking-tight mb-3">
              {headings[view].title}
            </h1>
            <p className="text-[#aeb5cc] text-[14px] leading-relaxed max-w-[300px] mx-auto">
              {headings[view].sub}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -12 }}
            transition={{ duration: 0.22 }}
            className="w-full bg-[#1e212b]/70 border border-white/8 rounded-3xl p-6 backdrop-blur-xl shadow-2xl"
          >

            {/* ── FORGOT PASSWORD – success state ──────────────────────────── */}
            {view === VIEWS.FORGOT && forgotSent ? (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 className="text-emerald-400" size={28} />
                </div>
                <h2 className="text-lg font-semibold text-white">Check your inbox</h2>
                <p className="text-[#aeb5cc] text-[13px] leading-relaxed max-w-[260px]">
                  If <strong className="text-white">{formData.email}</strong> is registered, you'll receive a reset link shortly.
                </p>
                <p className="text-[11px] text-gray-500 mt-1">Check your spam folder if you don't see it.</p>
                <button
                  onClick={() => switchView(VIEWS.LOGIN)}
                  className="mt-3 flex items-center gap-2 text-blue-400 hover:text-blue-300 text-[13px] font-medium transition-colors"
                >
                  <ArrowLeft size={14} /> Back to login
                </button>
              </div>

            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                {/* Register: Email first */}
                {view === VIEWS.REGISTER && (
                  <div className="relative group/field">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/field:text-blue-400 transition-colors" size={18} />
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange}
                      placeholder="Email address" required
                      className={inputClasses}
                    />
                  </div>
                )}

                {/* Forgot: Email only */}
                {view === VIEWS.FORGOT && (
                  <div className="relative group/field">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/field:text-blue-400 transition-colors" size={18} />
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange}
                      placeholder="Your registered email" required
                      className={inputClasses}
                    />
                  </div>
                )}

                {/* Login + Register: Username */}
                {(view === VIEWS.LOGIN || view === VIEWS.REGISTER) && (
                  <div className="relative group/field">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/field:text-blue-400 transition-colors" size={18} />
                    <input
                      type="text" name="username" value={formData.username} onChange={handleChange}
                      placeholder="Username" required
                      className={inputClasses}
                    />
                  </div>
                )}

                {/* Login + Register: Password */}
                {(view === VIEWS.LOGIN || view === VIEWS.REGISTER) && (
                  <div className="relative group/field">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/field:text-blue-400 transition-colors" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password" value={formData.password} onChange={handleChange}
                      placeholder="Password" required
                      className={`${inputClasses} pr-12`}
                    />
                    <button
                      type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                )}

                {/* Login: Forgot password link */}
                {view === VIEWS.LOGIN && (
                  <div className="flex justify-end -mt-1">
                    <button
                      type="button"
                      onClick={() => switchView(VIEWS.FORGOT)}
                      className="text-[12px] text-blue-400 hover:text-blue-300 transition-colors font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Status message */}
                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`text-[12px] px-4 py-2.5 rounded-2xl flex items-center gap-2 border ${
                        message.type === 'success'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          : 'text-red-400 bg-red-500/10 border-red-500/20'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <p>{message.text}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <button
                  type="submit" disabled={loading}
                  className="mt-1 w-full bg-[#111B2F] hover:bg-[#1c2c4d] border border-[#2E83C4]/30 text-white font-semibold py-3.5 rounded-full transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      {view === VIEWS.LOGIN && 'Sign In'}
                      {view === VIEWS.REGISTER && 'Create Account'}
                      {view === VIEWS.FORGOT && 'Send Reset Link'}
                    </>
                  )}
                </button>

                {/* Divider + Google button (login & register only) */}
                {(view === VIEWS.LOGIN || view === VIEWS.REGISTER) && (
                  <>
                    <div className="flex items-center gap-3 my-1">
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-[11px] text-gray-500 uppercase tracking-wider">or</span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={googleLoading}
                      className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-medium py-3.5 rounded-full transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                      {googleLoading ? (
                        <Loader2 className="animate-spin text-gray-500" size={18} />
                      ) : (
                        <>
                          <GoogleIcon />
                          <span className="text-[14px]">
                            {view === VIEWS.LOGIN ? 'Sign in with Google' : 'Sign up with Google'}
                          </span>
                        </>
                      )}
                    </button>
                  </>
                )}

              </form>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom toggles */}
        <div className="mt-5 text-center">
          {view === VIEWS.LOGIN && (
            <button
              onClick={() => switchView(VIEWS.REGISTER)}
              className="text-[13px] text-[#aeb5cc] hover:text-white transition-colors"
            >
              Don't have an account?{' '}
              <span className="text-blue-400 hover:text-blue-300 font-medium">Sign up</span>
            </button>
          )}
          {view === VIEWS.REGISTER && (
            <button
              onClick={() => switchView(VIEWS.LOGIN)}
              className="text-[13px] text-[#aeb5cc] hover:text-white transition-colors"
            >
              Already have an account?{' '}
              <span className="text-blue-400 hover:text-blue-300 font-medium">Sign in</span>
            </button>
          )}
          {view === VIEWS.FORGOT && !forgotSent && (
            <button
              onClick={() => switchView(VIEWS.LOGIN)}
              className="flex items-center gap-1.5 text-[13px] text-[#aeb5cc] hover:text-white transition-colors mx-auto"
            >
              <ArrowLeft size={14} /> Back to login
            </button>
          )}
        </div>

          </div>

        </div>

        {/* Right content: 3D Spline Scene */}
        <div className="hidden lg:flex flex-1 relative bg-black/20 border-l border-white/5 flex-col overflow-hidden">
          {/* Text block */}
          <div className="w-full px-12 pt-12 pb-4 z-20 pointer-events-none">
            <h1 className="text-3xl xl:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              Welcome to MurjanLab
            </h1>
            <p className="mt-4 text-neutral-400 max-w-sm text-sm leading-relaxed">
              Experience the cutting-edge of artificial intelligence. MurjanAI brings you intelligent, seamless, and powerful conversations tailored for the future.
            </p>
          </div>
          
          {/* 3D Model block */}
          <div className="flex-1 w-full relative z-10 flex items-center justify-center">
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full transform scale-[1.15] translate-y-4"
            />
          </div>
        </div>
      </Card>

      {/* Legal Footer Links */}
      <div className="mt-4 md:mt-5 w-full text-center flex justify-center items-center gap-4 text-xs text-gray-500 z-20">
        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
        <span>•</span>
        <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">Terms of Service</a>
      </div>
    </div>
  );
}
