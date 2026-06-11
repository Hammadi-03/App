import { useEffect, useRef, useState } from 'react';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef(null);
  const synth = useRef(window.speechSynthesis);

  const speak = (text, options = {}) => {
    // Cancel any ongoing speech
    synth.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // GPT-style settings - natural, clear voice
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 0.9;

    // Try to find a good voice (prefer a natural female voice similar to ChatGPT)
    const voices = synth.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google US English') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Victoria') ||
      voice.name.includes('Karen')
    ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      options.onStart?.();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      options.onEnd?.();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      options.onError?.(event);
    };

    utteranceRef.current = utterance;
    synth.current.speak(utterance);
  };

  const pause = () => {
    if (synth.current.paused) {
      synth.current.resume();
      setIsPaused(false);
    } else {
      synth.current.pause();
      setIsPaused(true);
    }
  };

  const stop = () => {
    synth.current.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  useEffect(() => {
    return () => {
      synth.current.cancel();
    };
  }, []);

  return {
    speak,
    pause,
    stop,
    isSpeaking,
    isPaused,
  };
};
