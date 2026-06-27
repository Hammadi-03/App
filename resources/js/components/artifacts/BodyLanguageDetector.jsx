import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Volume2, AlertCircle } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

export default function BodyLanguageDetector() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detectedText, setDetectedText] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const animationRef = useRef(null);
  const poseNetRef = useRef(null);
  
  const { speak, isSpeaking } = useTextToSpeech();

  // Load PoseNet model from CDN
  useEffect(() => {
    if (isOpen && !modelRef.current && !isLoading) {
      loadModel();
    }
  }, [isOpen]);

  const loadModel = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load TensorFlow.js from CDN if not already loaded
      if (!window.tf) {
        const tfScript = document.createElement('script');
        tfScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0';
        document.head.appendChild(tfScript);
        await new Promise(resolve => {
          tfScript.onload = resolve;
        });
      }

      // Load PoseNet from CDN if not already loaded
      if (!window.posenet) {
        const poseNetScript = document.createElement('script');
        poseNetScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet@2.2.0';
        document.head.appendChild(poseNetScript);
        await new Promise(resolve => {
          poseNetScript.onload = resolve;
        });
      }

      // Load the model
      const net = await window.posenet.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: { width: 640, height: 480 },
        multiplier: 0.75,
      });
      modelRef.current = net;
      poseNetRef.current = window.posenet;
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load pose detection model');
      setIsLoading(false);
      console.error(err);
    }
  };

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsDetecting(true);
          detectPose();
        };
      }
    } catch (err) {
      setError('Could not access camera. Please check permissions.');
      console.error(err);
    }
  };

  const stopCamera = () => {
    setIsDetecting(false);
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const analyzeBodyLanguage = (keypoints) => {
    if (!keypoints || keypoints.length === 0) return null;

    // Find key body positions
    const shoulder_left = keypoints.find(kp => kp.part === 'leftShoulder');
    const shoulder_right = keypoints.find(kp => kp.part === 'rightShoulder');
    const hip_left = keypoints.find(kp => kp.part === 'leftHip');
    const hip_right = keypoints.find(kp => kp.part === 'rightHip');
    const nose = keypoints.find(kp => kp.part === 'nose');
    const leftHand = keypoints.find(kp => kp.part === 'leftWrist');
    const rightHand = keypoints.find(kp => kp.part === 'rightWrist');

    if (!nose || !shoulder_left || !shoulder_right) return null;

    let analysis = [];

    // Head tilt
    const shoulderDiff = Math.abs(shoulder_left.position.y - shoulder_right.position.y);
    if (shoulderDiff > 30) {
      analysis.push('tilting head');
    }

    // Posture
    if (hip_left && hip_right) {
      const hipToShoulderLeft = Math.abs(shoulder_left.position.y - hip_left.position.y);
      const hipToShoulderRight = Math.abs(shoulder_right.position.y - hip_right.position.y);
      
      if (hipToShoulderLeft > 150 && hipToShoulderRight > 150) {
        analysis.push('standing upright with good posture');
      } else if (hipToShoulderLeft < 100 || hipToShoulderRight < 100) {
        analysis.push('slouching');
      }
    }

    // Hand position
    if (leftHand && rightHand) {
      const handsRaised = leftHand.position.y < nose.position.y || rightHand.position.y < nose.position.y;
      if (handsRaised) {
        analysis.push('hands raised');
      } else {
        analysis.push('hands down');
      }
    }

    // Confidence check
    const avgConfidence = keypoints.reduce((acc, kp) => acc + kp.score, 0) / keypoints.length;
    if (avgConfidence > 0.5) {
      return analysis.length > 0 ? analysis.join(', ') : 'Neutral body language';
    }

    return null;
  };

  const detectPose = async () => {
    if (!modelRef.current || !videoRef.current) return;

    try {
      const pose = await modelRef.current.estimateSinglePose(videoRef.current, {
        flipHorizontal: true,
      });

      if (pose && pose.keypoints) {
        const bodyLanguage = analyzeBodyLanguage(pose.keypoints);
        if (bodyLanguage) {
          setDetectedText(bodyLanguage);
          speak(bodyLanguage);
        }
      }

      // Detect every 1.5 seconds to avoid too frequent updates
      animationRef.current = setTimeout(() => {
        detectPose();
      }, 1500);
    } catch (err) {
      console.error('Pose detection error:', err);
      if (isDetecting) {
        animationRef.current = setTimeout(() => {
          detectPose();
        }, 1500);
      }
    }
  };

  const closeDetector = () => {
    stopCamera();
    setIsOpen(false);
    setDetectedText('');
    setError(null);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 text-white font-medium hover:bg-white/5 py-2 px-3 rounded-lg transition-colors w-full"
      >
        <Camera size={20} />
        <span className="text-[17px]">Body Language</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeDetector}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#1e212b] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Camera size={24} className="text-blue-400" />
                  <div>
                    <h2 className="text-xl font-bold text-white">Body Language Detector</h2>
                    <p className="text-xs text-gray-400">Real-time pose analysis with audio feedback</p>
                  </div>
                </div>
                <button
                  onClick={closeDetector}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                  >
                    <AlertCircle size={20} className="text-red-400 mt-0.5 shrink-0" />
                    <p className="text-red-200 text-sm">{error}</p>
                  </motion.div>
                )}

                {/* Video Container */}
                {isDetecting ? (
                  <div className="relative rounded-xl overflow-hidden bg-black/50 border border-white/10 aspect-video">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover scale-x-[-1]"
                      playsInline
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                        <div className="text-center">
                          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                          <p className="text-white text-sm">Loading pose detection...</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={startCamera}
                    disabled={isLoading}
                    className="w-full p-8 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-2 border-dashed border-blue-400/50 rounded-xl hover:border-blue-400 hover:bg-blue-500/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Camera size={32} className="mx-auto mb-3 text-blue-400" />
                    <p className="text-white font-semibold">Start Camera</p>
                    <p className="text-gray-400 text-sm">Click to enable camera and begin detection</p>
                  </button>
                )}

                {/* Detected Text */}
                {detectedText && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white/5 border border-white/10 rounded-xl"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Detected Body Language</label>
                      {isSpeaking && (
                        <Volume2 size={16} className="text-green-400 animate-pulse" />
                      )}
                    </div>
                    <p className="text-gray-200 text-sm capitalize">{detectedText}</p>
                  </motion.div>
                )}

                {/* Controls */}
                {isDetecting && (
                  <button
                    onClick={stopCamera}
                    className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold rounded-xl border border-red-500/30 hover:border-red-500/50 transition-all"
                  >
                    Stop Detection
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
