import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import BodyLanguageDetector from './BodyLanguageDetector';

export default function ArtifactsSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-6 mb-6 px-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-2 w-full text-gray-400 hover:text-gray-200 transition-colors"
      >
        <label className="text-[10px] uppercase tracking-widest font-bold cursor-pointer">Features</label>
        <ChevronDown
          size={16}
          className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2">
          <BodyLanguageDetector />
        </div>
      )}
    </div>
  );
}
