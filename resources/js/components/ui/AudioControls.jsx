import React from 'react';
import { Volume2, Pause, Play, X } from 'lucide-react';
import { motion } from 'framer-motion';

export const AudioControls = ({ 
  isSpeaking, 
  isPaused, 
  onPlay, 
  onPause, 
  onStop 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2 mt-3 px-3 py-2 bg-white/5 rounded-lg border border-white/10 w-fit"
    >
      {!isSpeaking ? (
        <button
          onClick={onPlay}
          className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-blue-400 hover:text-blue-300"
          title="Read aloud"
        >
          <Volume2 size={16} />
        </button>
      ) : (
        <>
          <Volume2 size={16} className="text-green-400 animate-pulse" />
          <button
            onClick={onPause}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            onClick={onStop}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-red-400"
            title="Stop"
          >
            <X size={16} />
          </button>
        </>
      )}
    </motion.div>
  );
};
