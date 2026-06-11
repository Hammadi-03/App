import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, X, Loader2, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({ name: '', username: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || ''
      });
      setMessage(null);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = await onSave(formData);
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Profile updated successfully!' });
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while saving.' });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-[#343b54]/60 border border-[#434b66]/50 focus:border-indigo-400 rounded-xl py-3 px-4 text-white placeholder:text-gray-400 outline-none transition-all focus:ring-2 focus:ring-indigo-400/20";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-md bg-[#1e212b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex justify-between items-center relative z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User size={20} className="text-indigo-400" />
            Account Settings
          </h2>
          <button 
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 relative z-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-300 ml-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your display name"
                className={inputClasses}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-300 ml-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Unique username"
                required
                minLength={3}
                className={inputClasses}
              />
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-[13px] font-medium text-gray-300 ml-1">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className={`${inputClasses} opacity-60 cursor-not-allowed`}
              />
              <span className="text-[11px] text-gray-500 ml-1">Email cannot be changed directly.</span>
            </div>

            {/* Status Message */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mt-2 text-[13px] px-4 py-3 rounded-xl flex items-center gap-2 border ${
                    message.type === 'success'
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : 'text-red-400 bg-red-500/10 border-red-500/20'
                  }`}
                >
                  {message.type === 'success' ? (
                    <CheckCircle2 size={16} className="shrink-0" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-red-500" />
                  )}
                  <p>{message.text}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || (formData.name === (user?.name || '') && formData.username === user?.username)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Changes
              </button>
            </div>
            
          </form>
        </div>
      </motion.div>
    </div>
  );
}
