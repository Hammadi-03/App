import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Loader2, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function ResetPasswordPage({ onResetPassword }) {
  const [token, setToken] = useState('');
  const [formData, setFormData] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (!t) {
      setStatus('error');
      setMessage('No reset token found. Please request a new password reset link.');
    } else {
      setToken(t);
    }
  }, []);

  const inputClasses = "w-full bg-[#343b54]/60 border border-[#434b66]/50 focus:border-indigo-400 rounded-full py-3.5 pl-12 pr-12 text-white placeholder:text-gray-400 outline-none transition-all focus:ring-2 focus:ring-indigo-400/20";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      setStatus('error');
      setMessage('Password must be at least 8 characters.');
      return;
    }

    if (formData.password !== formData.confirm) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const result = await onResetPassword(token, formData.password);
      if (result.success) {
        setStatus('success');
        setMessage(result.message || 'Password updated successfully!');
      } else {
        setStatus('error');
        setMessage(result.error || 'Reset failed. Your link may have expired.');
      }
    } catch {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    window.history.pushState({}, '', '/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#2a3048] to-[#171a27] text-white font-sans">

      {/* Background glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-700/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-8"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
            <Sparkles size={16} className="text-indigo-400" />
          </div>
          <span className="text-lg font-semibold text-white/80 tracking-wide">Murjan AI</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-[28px] md:text-[34px] font-bold leading-tight tracking-tight mb-3">
            Set new password
          </h1>
          <p className="text-[#aeb5cc] text-[14px] leading-relaxed max-w-[300px] mx-auto">
            Choose a strong password with at least 8 characters
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="w-full bg-[#1e212b]/70 border border-white/8 rounded-3xl p-6 backdrop-blur-xl shadow-2xl"
        >

          {/* ── Success state ─────────────────────────────────────────────── */}
          {status === 'success' ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"
              >
                <CheckCircle2 className="text-emerald-400" size={32} />
              </motion.div>
              <h2 className="text-lg font-semibold text-white">Password Updated!</h2>
              <p className="text-[#aeb5cc] text-[13px] leading-relaxed max-w-[240px]">
                Your password has been changed successfully. You can now sign in with your new password.
              </p>
              <button
                onClick={goToLogin}
                className="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-full transition-all duration-200 shadow-lg shadow-indigo-500/20"
              >
                Go to Sign In
              </button>
            </div>

          ) : status === 'error' && !token ? (
            /* ── Invalid/missing token state ─────────────────────────────── */
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <AlertCircle className="text-red-400" size={32} />
              </div>
              <h2 className="text-lg font-semibold text-white">Invalid Link</h2>
              <p className="text-[#aeb5cc] text-[13px] leading-relaxed max-w-[240px]">{message}</p>
              <button
                onClick={goToLogin}
                className="mt-2 w-full bg-[#3b4361] hover:bg-[#464e70] border border-[#525a7a]/50 text-white font-medium py-3.5 rounded-full transition-colors"
              >
                Back to Login
              </button>
            </div>

          ) : (
            /* ── Form ─────────────────────────────────────────────────────── */
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">

              <div className="relative group/field">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/field:text-indigo-300 transition-colors" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="New password"
                  required
                  className={inputClasses}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative group/field">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/field:text-indigo-300 transition-colors" size={18} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirm"
                  value={formData.confirm}
                  onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
                  placeholder="Confirm new password"
                  required
                  className={inputClasses}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password strength hint */}
              {formData.password.length > 0 && (
                <div className="px-1">
                  <div className="flex gap-1 mb-1">
                    {[...Array(4)].map((_, i) => {
                      const strength = Math.min(Math.floor(formData.password.length / 3), 4);
                      const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500'];
                      return (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < strength ? colors[strength - 1] : 'bg-white/10'}`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[11px] text-gray-500">
                    {formData.password.length < 8 ? 'At least 8 characters required' :
                     formData.password.length < 10 ? 'Weak password' :
                     formData.password.length < 14 ? 'Good password' : 'Strong password'}
                  </span>
                </div>
              )}

              {/* Error message */}
              <AnimatePresence>
                {status === 'error' && token && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-[12px] px-4 py-2.5 rounded-2xl flex items-center gap-2 border text-red-400 bg-red-500/10 border-red-500/20"
                  >
                    <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-red-500" />
                    <p>{message}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-full transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Set New Password'}
              </button>

            </form>
          )}

        </motion.div>

        {/* Back to login */}
        {status !== 'success' && (
          <button
            onClick={goToLogin}
            className="mt-5 text-[13px] text-[#aeb5cc] hover:text-white transition-colors"
          >
            Back to <span className="text-indigo-400 font-medium">Sign In</span>
          </button>
        )}

      </div>
    </div>
  );
}
