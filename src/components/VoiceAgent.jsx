/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Helper to generate calling sound effects using Web Audio API (no external file dependencies)
class CallAudioHelper {
  constructor() {
    this.audioCtx = null;
    this.ringInterval = null;
    this.dialTimeout = null;
  }

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  playDialTone(onComplete) {
    this.init();
    try {
      // Simulating DTMF keypress sounds
      const playKey = (f1, f2, start, dur) => {
        const osc1 = this.audioCtx.createOscillator();
        const osc2 = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc1.frequency.value = f1;
        osc2.frequency.value = f2;
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.05, start + 0.01);
        gain.gain.setValueAtTime(0.05, start + dur - 0.02);
        gain.gain.linearRampToValueAtTime(0, start + dur);
        
        osc1.start(start);
        osc2.start(start);
        osc1.stop(start + dur);
        osc2.stop(start + dur);
      };

      const now = this.audioCtx.currentTime;
      // Play a rapid sequence of 3 mock keypad presses
      playKey(697, 1209, now, 0.15); // Key '1'
      playKey(770, 1336, now + 0.25, 0.15); // Key '5'
      playKey(852, 1477, now + 0.5, 0.15); // Key '9'

      this.dialTimeout = setTimeout(onComplete, 800);
    } catch (e) {
      console.warn("Dial tone error", e);
      this.dialTimeout = setTimeout(onComplete, 800);
    }
  }

  startRinging(onComplete) {
    this.init();
    let ringCount = 0;
    
    const playRing = () => {
      try {
        const osc1 = this.audioCtx.createOscillator();
        const osc2 = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        // Standard US Ringing tones: 440Hz + 480Hz
        osc1.frequency.value = 440;
        osc2.frequency.value = 480;

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.audioCtx.destination);

        const now = this.audioCtx.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.1);
        gain.gain.setValueAtTime(0.06, now + 1.2);
        gain.gain.linearRampToValueAtTime(0, now + 1.4);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.5);
        osc2.stop(now + 1.5);

        ringCount++;
        if (ringCount >= 2) {
          clearInterval(this.ringInterval);
          setTimeout(onComplete, 1800);
        }
      } catch (e) {
        console.warn("Ringing tone error", e);
        clearInterval(this.ringInterval);
        setTimeout(onComplete, 1800);
      }
    };

    // Play first ring immediately
    playRing();
    // Then repeat every 3 seconds
    this.ringInterval = setInterval(playRing, 3000);
  }

  playConnectedBeep() {
    this.init();
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);
      
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.25);
    } catch (e) {
      console.warn("Connection tone error", e);
    }
  }

  playDisconnectBeep() {
    this.init();
    try {
      const now = this.audioCtx.currentTime;
      const playBeep = (freq, start, dur) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        gain.gain.setValueAtTime(0.05, start);
        gain.gain.linearRampToValueAtTime(0, start + dur);
        osc.start(start);
        osc.stop(start + dur);
      };
      // High-to-low double beep
      playBeep(400, now, 0.15);
      playBeep(300, now + 0.18, 0.2);
    } catch (e) {
      console.warn("Disconnect tone error", e);
    }
  }

  stopAll() {
    if (this.ringInterval) clearInterval(this.ringInterval);
    if (this.dialTimeout) clearTimeout(this.dialTimeout);
  }
}

// Voice Knowledge Base
const KNOWLEDGE_BASE = {
  intro: "Hello there! I am Sohail's AI Voice Assistant. I'm here to give you details about Sohail's portfolio, technical skills, projects, and contact info, or help you schedule a call with him. How can I help you today?",
  skills: "Sohail specializes in both UI/UX design and full-stack development. His core skills include Figma, UI/UX Design, HTML, Tailwind CSS, React, Next.js, and MongoDB, alongside backend and DevOps technologies like Node.js, Express, TypeScript, Docker, CI/CD pipelines, REST APIs, and Framer Motion.",
  projects: "Sohail has worked on several key projects: first, this AI Telecaller & Voice Agent built directly into the portfolio; second, SkillShare Hub, a peer-to-peer mentoring platform; third, a Dockerized application deployment showcasing DevOps and CI/CD pipelines; and fourth, a premium UI/UX learning mobile app. You can click on the Projects section to check them out directly!",
  contact: "You can reach Sohail Khan by filling out the Contact form at the bottom of this website. Alternatively, you can drop an email or check his GitHub profile linked in the projects. I can also note down a message for you if you'd like to dictate one!",
  about: "Sohail Khan is a UI/UX Designer and Full Stack Developer who creates user-centered, highly interactive, and scalable web applications. He bridges the gap between creative visual designs in Figma and robust backend architectures using Node, Express, and Docker, always focusing on performance and modern aesthetics.",
  default: "I understand. I can help you with details about Sohail's skills, projects, background, or let you know how to contact him. What would you like to discuss next?",
  thanks: "You're very welcome! Let me know if there's anything else about Sohail's portfolio you'd like to explore.",
  bye: "Thank you for calling Sohail's AI Agent. Have an amazing day! Goodbye!"
};

export default function VoiceAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [callState, setCallState] = useState("idle"); // idle, dialing, ringing, connected, ended
  const [timer, setTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [responseText, setResponseText] = useState("");
  const [speakingState, setSpeakingState] = useState("listening"); // listening, thinking, speaking
  const [typedMessage, setTypedMessage] = useState("");

  const canvasRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioHelperRef = useRef(new CallAudioHelper());
  const timerIntervalRef = useRef(null);
  const waveAnimFrameRef = useRef(null);
  const currentUtteranceRef = useRef(null);

  // Event listener ref pattern to handle global triggers to start voice call
  const handleStartCallRef = useRef(null);
  useEffect(() => {
    handleStartCallRef.current = handleStartCall;
  });

  useEffect(() => {
    const handleStartVoiceCall = () => {
      if (handleStartCallRef.current) {
        handleStartCallRef.current();
      }
    };
    window.addEventListener("start-voice-call", handleStartVoiceCall);
    return () => {
      window.removeEventListener("start-voice-call", handleStartVoiceCall);
    };
  }, []);

  // Suggested questions
  const suggestions = [
    { label: "What are your skills?", query: "skills" },
    { label: "Tell me about your projects", query: "projects" },
    { label: "How can I contact you?", query: "contact" },
    { label: "Tell me about yourself", query: "about" }
  ];

  // Call timer effect
  useEffect(() => {
    if (callState === "connected") {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [callState]);

  // Voice Wave Animation Effect
  useEffect(() => {
    if (callState === "connected" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      let phase = 0;

      const drawWaves = () => {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const width = canvas.width;
        const height = canvas.height;
        const centerY = height / 2;

        ctx.lineWidth = 2.5;

        // Wave characteristics based on speakingState
        let waveCount = 4;
        let amplitude = 15;
        let speed = 0.08;

        if (speakingState === "speaking") {
          amplitude = 30 + Math.sin(phase * 2) * 10;
          speed = 0.15;
          waveCount = 5;
        } else if (speakingState === "thinking") {
          amplitude = 8;
          speed = 0.04;
          waveCount = 3;
        } else if (speakingState === "listening") {
          amplitude = 3 + Math.random() * 3; // ambient mic noise
          speed = 0.06;
          waveCount = 2;
        }

        // Draw multiple overlapping sine waves
        for (let i = 0; i < waveCount; i++) {
          ctx.beginPath();
          // Color styles
          const opacity = (1 - i / waveCount) * 0.7;
          ctx.strokeStyle = i % 2 === 0 
            ? `rgba(59, 130, 246, ${opacity})`  // Blue
            : `rgba(147, 51, 234, ${opacity})`; // Purple

          const offset = i * (Math.PI / 4);

          for (let x = 0; x < width; x++) {
            // Sine math simulating audio frequency waves
            const relativeX = x / 40;
            const y = centerY + Math.sin(relativeX + phase + offset) * amplitude * Math.sin(x / width * Math.PI);
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }

        phase += speed;
        waveAnimFrameRef.current = requestAnimationFrame(drawWaves);
      };

      drawWaves();
    } else {
      if (waveAnimFrameRef.current) cancelAnimationFrame(waveAnimFrameRef.current);
    }

    return () => {
      if (waveAnimFrameRef.current) cancelAnimationFrame(waveAnimFrameRef.current);
    };
  }, [callState, speakingState]);

  // Speech Recognition Setup
  const initializeSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onresult = (event) => {
        const lastResultIndex = event.results.length - 1;
        const text = event.results[lastResultIndex][0].transcript.trim();
        if (text) {
          setTranscript(text);
          processUserInput(text);
        }
      };

      rec.onerror = (e) => {
        console.warn("Speech recognition error:", e.error);
        // If mic fails, we still allow suggestions & text input
      };

      rec.onend = () => {
        // Automatically restart listening if still connected and not speaking
        if (callState === "connected" && speakingState === "listening" && !isMuted) {
          try {
            rec.start();
          } catch (e) {
            console.log("Restart error", e);
          }
        }
      };

      recognitionRef.current = rec;
    }
  };

  // Start Call Flow
  const handleStartCall = () => {
    audioHelperRef.current.stopAll();
    setIsOpen(true);
    setCallState("dialing");
    setTranscript("");
    setResponseText("");
    setSpeakingState("listening");

    // Initialize speech engines
    initializeSpeech();

    // 1. Play DTMF dialing beeps
    audioHelperRef.current.playDialTone(() => {
      // 2. Switch to ringing state
      setCallState("ringing");
      audioHelperRef.current.startRinging(() => {
        // 3. Connect call
        audioHelperRef.current.playConnectedBeep();
        setCallState("connected");
        setTimer(0);
        // Start listening & speak initial greeting
        speak(KNOWLEDGE_BASE.intro);
      });
    });
  };

  // Hang Up Call Flow
  const handleHangUp = () => {
    // Stop sounds
    audioHelperRef.current.stopAll();
    audioHelperRef.current.playDisconnectBeep();

    // Stop speaking
    stopSpeaking();

    // Stop speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log("Recognition stop error", e);
      }
    }

    setCallState("ended");
    setTimeout(() => {
      setIsOpen(false);
      setCallState("idle");
    }, 1200);
  };

  // Speak text out loud using browser SpeechSynthesis
  const speak = (text) => {
    if (!isSpeakerOn) {
      setResponseText(text);
      setSpeakingState("listening");
      startListening();
      return;
    }

    stopSpeaking();
    setResponseText(text);
    setSpeakingState("speaking");

    // Pause speech recognition while speaking to avoid agent hearing itself
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log("Speech stop before speak failed", e);
      }
    }

    if (typeof window === "undefined" || !window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      setSpeakingState("listening");
      startListening();
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Find a good english voice if available
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith("en") && v.name.includes("Google")) || 
                           voices.find(v => v.lang.startsWith("en")) || 
                           voices[0];
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setSpeakingState("listening");
        startListening();
      };

      utterance.onerror = (e) => {
        console.warn("Speech synthesis error:", e);
        setSpeakingState("listening");
        startListening();
      };

      currentUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Synthesis failed", err);
      setSpeakingState("listening");
      startListening();
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const startListening = () => {
    if (recognitionRef.current && callState === "connected" && !isMuted) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Already listening
        console.log("Listening already active");
      }
    }
  };

  // Main intelligence processing user inputs
  const processUserInput = (input) => {
    setSpeakingState("thinking");
    const cleanInput = input.toLowerCase();

    let response = KNOWLEDGE_BASE.default;

    if (cleanInput.includes("skill") || cleanInput.includes("expertise") || cleanInput.includes("technolog")) {
      response = KNOWLEDGE_BASE.skills;
    } else if (cleanInput.includes("project") || cleanInput.includes("work") || cleanInput.includes("portfolio")) {
      response = KNOWLEDGE_BASE.projects;
    } else if (cleanInput.includes("contact") || cleanInput.includes("email") || cleanInput.includes("reach") || cleanInput.includes("hire") || cleanInput.includes("call")) {
      response = KNOWLEDGE_BASE.contact;
    } else if (cleanInput.includes("about") || cleanInput.includes("who is") || cleanInput.includes("tell me about yourself") || cleanInput.includes("sohail")) {
      response = KNOWLEDGE_BASE.about;
    } else if (cleanInput.includes("thank") || cleanInput.includes("awesome") || cleanInput.includes("great")) {
      response = KNOWLEDGE_BASE.thanks;
    } else if (cleanInput.includes("bye") || cleanInput.includes("quit") || cleanInput.includes("hang up")) {
      response = KNOWLEDGE_BASE.bye;
      setTimeout(handleHangUp, 3500);
    }

    // Simulate thinking delay
    setTimeout(() => {
      speak(response);
    }, 600);
  };

  const handleSendText = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    setTranscript(typedMessage);
    const msg = typedMessage;
    setTypedMessage("");
    processUserInput(msg);
  };

  // Format call timer
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // React to voice recognition mute toggle
  useEffect(() => {
    if (callState === "connected") {
      if (isMuted) {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (e) {
            console.log("Mute stop failed", e);
          }
        }
      } else {
        if (speakingState === "listening") {
          startListening();
        }
      }
    }
  }, [isMuted, callState, speakingState]);

  // Clean up synthesis on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  return (
    <>
      {/* Floating Call Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={handleStartCall}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-colors group cursor-pointer"
        >
          {/* Outer glowing pulsing circle */}
          <span className="absolute inset-0 rounded-full bg-blue-500/40 animate-ping opacity-75"></span>
          
          <svg
            className="w-7 h-7 text-white relative z-10 transition-transform group-hover:rotate-12 duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 00.906.671h1.363a1 1 0 00.906-.671l.548-2.2a1 1 0 01.94-.725H19a2 2 0 012 2v3.28a1 1 0 01-.725.94l-2.2.548a1 1 0 00-.671.906v1.363a1 1 0 00.671.906l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-3.28a1 1 0 01-.94-.725l-.548-2.2a1 1 0 00-.906-.671h-1.363a1 1 0 00-.906.671l-.548 2.2a1 1 0 01-.94.725H5a2 2 0 01-2-2v-3.28a1 1 0 01.725-.94l2.2-.548a1 1 0 00.671-.906V11a1 1 0 00-.671-.906l-2.2-.548A1 1 0 013 9V5z"
            />
          </svg>

          {/* Floating dynamic hint */}
          <span className="absolute right-20 bg-gray-900 border border-gray-800 text-gray-200 text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 shadow-md">
            Call Sohail's AI Agent
          </span>
        </motion.button>
      </div>

      {/* Calling Screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-md my-auto overflow-y-auto rounded-2xl sm:rounded-3xl bg-gray-900/90 border border-gray-800 shadow-2xl flex flex-col items-center p-4 sm:p-6 text-center max-h-[95vh] sm:max-h-[90vh]"
            >
              {/* Top notch indicator */}
              <div className="w-12 h-1 bg-gray-700 rounded-full mb-4 sm:mb-6 flex-shrink-0"></div>

              {/* Header Title */}
              <p className="text-xs sm:text-sm font-semibold tracking-widest text-blue-400 uppercase flex-shrink-0">
                AI Telecaller Connection
              </p>

              {/* Status and Name */}
              <h3 className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-white flex-shrink-0">Sohail's AI Agent</h3>

              {callState === "dialing" && (
                <p className="mt-1 text-xs sm:text-sm text-gray-400 animate-pulse flex-shrink-0">Dialing secure voice line...</p>
              )}
              {callState === "ringing" && (
                <p className="mt-1 text-xs sm:text-sm text-gray-400 animate-pulse flex-shrink-0">Ringing...</p>
              )}
              {callState === "connected" && (
                <p className="mt-1 text-xs sm:text-sm text-emerald-400 font-mono flex-shrink-0">
                  Active • {formatTime(timer)}
                </p>
              )}
              {callState === "ended" && (
                <p className="mt-1 text-xs sm:text-sm text-red-500 font-semibold flex-shrink-0">Call Ended</p>
              )}

              {/* Animated Avatar / Ringing Circle */}
              <div className="relative my-4 sm:my-8 flex items-center justify-center flex-shrink-0">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow-lg relative z-10">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </div>

                {/* Ringing effect ring animations */}
                {(callState === "dialing" || callState === "ringing") && (
                  <>
                    <span className="absolute inset-0 w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 border-blue-500/40 animate-ping scale-150"></span>
                    <span className="absolute inset-0 w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 border-purple-500/30 animate-ping scale-125"></span>
                  </>
                )}

                {/* Connected pulsing state */}
                {callState === "connected" && speakingState === "speaking" && (
                  <span className="absolute inset-0 w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-blue-500/20 animate-pulse scale-110"></span>
                )}
              </div>

              {/* Audio visualizer canvas */}
              {callState === "connected" && (
                <div className="w-full h-12 sm:h-16 bg-gray-950/50 rounded-xl overflow-hidden mb-3 sm:mb-4 border border-gray-800/40 flex items-center justify-center flex-shrink-0">
                  <canvas ref={canvasRef} width={360} height={64} className="w-full h-full" />
                </div>
              )}

              {/* Transcript Text Box (what user said and AI said) */}
              <div className="w-full flex-grow min-h-[90px] max-h-[120px] sm:min-h-[120px] sm:max-h-[160px] overflow-y-auto mb-3 sm:mb-4 p-3 sm:p-4 rounded-2xl bg-black/40 text-left border border-gray-800 flex flex-col gap-2 sm:gap-2.5">
                {transcript && (
                  <div className="text-[11px] sm:text-xs">
                    <span className="text-blue-400 font-semibold">You: </span>
                    <span className="text-gray-300">{transcript}</span>
                  </div>
                )}
                {responseText && (
                  <div className="text-[11px] sm:text-xs">
                    <span className="text-purple-400 font-semibold">AI Agent: </span>
                    <span className="text-gray-100">{responseText}</span>
                  </div>
                )}
                {!transcript && !responseText && (
                  <p className="text-[11px] sm:text-xs text-gray-500 italic text-center my-auto">
                    {callState === "connected" 
                      ? "Listening... Speak directly or tap suggestions below."
                      : "Establishing link..."}
                  </p>
                )}
              </div>

              {/* Suggestions chips (visible when connected) */}
              {callState === "connected" && (
                <div className="w-full mb-3 sm:mb-4 flex-shrink-0">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setTranscript(s.label);
                          processUserInput(s.query);
                        }}
                        className="text-[10px] sm:text-[11px] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gray-800 hover:bg-blue-600 border border-gray-700 text-gray-300 hover:text-white transition duration-200 cursor-pointer"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Fallback Text Input (If Speech recognition is offline or user prefers typing) */}
              {callState === "connected" && (
                <form onSubmit={handleSendText} className="w-full flex gap-2 mb-4 sm:mb-6 flex-shrink-0">
                  <input
                    type="text"
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    placeholder="Type a message instead..."
                    className="flex-grow text-xs p-2.5 sm:p-3 rounded-xl bg-black/50 border border-gray-800 focus:outline-none focus:border-blue-400 text-gray-200"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition"
                  >
                    Send
                  </button>
                </form>
              )}

              {/* In-Call Action Control Buttons */}
              <div className="w-full flex items-center justify-around mt-auto border-t border-gray-800/80 pt-4 sm:pt-5 flex-shrink-0">
                {/* Mute button */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  disabled={callState !== "connected"}
                  className={`flex flex-col items-center gap-1 sm:gap-1.5 focus:outline-none transition group cursor-pointer ${
                    callState !== "connected" ? "opacity-30 cursor-not-allowed" : "hover:opacity-100"
                  }`}
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border transition-all duration-200 ${
                      isMuted 
                        ? "bg-red-500/20 border-red-500 text-red-500 shadow-inner" 
                        : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {isMuted ? (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth={2} />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-medium text-gray-400 group-hover:text-gray-200">
                    {isMuted ? "Muted" : "Mute"}
                  </span>
                </button>

                {/* Hang Up Main Button */}
                <button
                  onClick={handleHangUp}
                  className="flex flex-col items-center gap-1 sm:gap-1.5 focus:outline-none hover:scale-105 transition group cursor-pointer"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 transform rotate-[135deg]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 15.46l-5.27-.61-2.52 2.52c-2.9-1.56-5.28-3.94-6.84-6.84l2.52-2.52L8.28 3H3c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-5.28c0-.55-.45-1-1-1z" />
                    </svg>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-semibold text-red-500">Hang Up</span>
                </button>

                {/* Speaker button */}
                <button
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  disabled={callState !== "connected"}
                  className={`flex flex-col items-center gap-1 sm:gap-1.5 focus:outline-none transition group cursor-pointer ${
                    callState !== "connected" ? "opacity-30 cursor-not-allowed" : "hover:opacity-100"
                  }`}
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border transition-all duration-200 ${
                      !isSpeakerOn 
                        ? "bg-amber-500/20 border-amber-500 text-amber-500" 
                        : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {isSpeakerOn ? (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth={2} />
                      </svg>
                    )}
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-medium text-gray-400 group-hover:text-gray-200">
                    {isSpeakerOn ? "Speaker" : "Speaker Off"}
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
