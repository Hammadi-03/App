import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function LegalPageLayout({ title, lastUpdated, children }) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200 font-sans selection:bg-indigo-500/30 overflow-y-auto">
      
      {/* Background blobs for aesthetics */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-700/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20">
        
        {/* Navigation / Back Button */}
        <button 
          onClick={() => window.location.href = '/'}
          className="group flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors mb-12 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full w-fit border border-white/5"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Back to Murjan
        </button>

        {/* Header */}
        <header className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">{title}</h1>
          {lastUpdated && (
            <p className="text-gray-500 text-sm">Last updated: {lastUpdated}</p>
          )}
        </header>

        {/* Content Body */}
        <article className="prose prose-invert prose-indigo max-w-none prose-p:text-gray-300 prose-p:leading-relaxed prose-headings:text-white prose-headings:font-semibold prose-a:text-indigo-400 hover:prose-a:text-indigo-300 prose-li:text-gray-300">
          {children}
        </article>
        
        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Murjan AI. All rights reserved.</p>
        </footer>

      </div>
    </div>
  );
}
