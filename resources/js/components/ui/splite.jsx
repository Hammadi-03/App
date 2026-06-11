import React, { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export function SplineScene({ scene, className }) {
  const handleLoad = (splineApp) => {
    // Attempt to trigger standard interaction events to start animations like waving
    setTimeout(() => {
      try {
        splineApp.emitEvent('mouseHover');
        // If the scene requires clicking to wave:
        // splineApp.emitEvent('mouseDown');
      } catch (e) {}
    }, 800);
  };

  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="w-8 h-8 border-4 border-[#2E83C4]/30 border-t-[#2E83C4] rounded-full animate-spin"></span>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
        onLoad={handleLoad}
      />
    </Suspense>
  );
}
