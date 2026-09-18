"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, Send, Loader2, Video, VideoOff, Sparkles, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useRouter } from "next/navigation";

const TextInterviewFlow = () => {
    const router = useRouter();
    const [targetRole, setTargetRole] = useState("");
    const [hasStarted, setHasStarted] = useState(false);
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    // Initialize speech synthesis
    useEffect(() => {
        if (typeof window !== 'undefined') {
            synthRef.current = window.speechSynthesis;
        }
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Start video camera
    const startVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }, 
                audio: false 
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsVideoEnabled(true);
        } catch (error) {
            console.error("Error accessing camera:", error);
            setIsVideoEnabled(false);
        }
    };

    // Stop video camera
    const stopVideo = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsVideoEnabled(false);
    };

    // Toggle video
    const toggleVideo = () => {
        if (isVideoEnabled) {
            stopVideo();
        } else {
            startVideo();
        }
    };

    // Initialize Speech Recognition
    const initSpeechRecognition = () => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setUserInput(transcript);
                    setIsListening(false);
                };

                recognition.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error);
                    setIsListening(false);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current = recognition;
            }
        }
    };

    // Start listening
    const startListening = () => {
        if (!recognitionRef.current) {
            initSpeechRecognition();
        }
        
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (error) {
                console.error('Error starting recognition:', error);
            }
        } else {
            alert('Speech recognition not supported in your browser');
        }
    };

    // Stop listening
    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    // Text to Speech
    const speak = (text: string) => {
        if (!isVoiceEnabled || !synthRef.current) return;

        // Cancel any ongoing speech
        synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        synthRef.current.speak(utterance);
    };

    // Stop speaking
    const stopSpeaking = () => {
        if (synthRef.current) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        }
    };

    // Toggle voice
    const toggleVoice = () => {
        if (isVoiceEnabled) {
            stopSpeaking();
        }
        setIsVoiceEnabled(!isVoiceEnabled);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopVideo();
            stopSpeaking();
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const handleStart = async () => {
        if (!targetRole.trim()) return;
        
        setHasStarted(true);
        setIsLoading(true);
        
        // Start video automatically
        await startVideo();
        
        // Initial AI greeting
        try {
            const response = await fetch('/api/interview/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetRole })
            });
            
            const data = await response.json();
            setMessages([{ role: 'assistant', content: data.message }]);
            
            // Speak the greeting
            speak(data.message);
        } catch (error) {
            console.error(error);
            const greeting = `Welcome! I'm your AI interviewer for the ${targetRole} position. Let's begin. Please introduce yourself and tell me about your relevant experience.`;
            setMessages([{ role: 'assistant', content: greeting }]);
            speak(greeting);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!userInput.trim() || isLoading) return;

        const newUserMessage = { role: 'user', content: userInput };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput("");
        setIsLoading(true);

        // Stop any ongoing speech
        stopSpeaking();

        try {
            const response = await fetch('/api/interview/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    targetRole,
                    messages: [...messages, newUserMessage]
                })
            });
            
            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
            
            // Speak the AI response
            speak(data.message);
        } catch (error) {
            console.error(error);
            const fallback = 'Sorry, I encountered an error. Please try again.';
            setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
            speak(fallback);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEndInterview = async () => {
        setIsLoading(true);
        stopVideo();
        
        try {
            const response = await fetch('/api/interview/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetRole, messages })
            });
            
            const data = await response.json();
            router.push('/interview');
        } catch (error) {
            console.error(error);
            router.push('/interview');
        }
    };

    if (!hasStarted) {
        return (
            <div className="max-w-4xl mx-auto relative mt-20 lg:mt-28">
                <div className="relative overflow-hidden bg-[#050505]/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_80px_-15px_rgba(var(--color-primary),0.2)]">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="w-full flex flex-col items-center justify-center relative">
                        <div className="w-full max-w-2xl bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
                            <div className="w-full space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                                    Target Role
                                </label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="e.g. Full Stack Developer"
                                        className="bg-[#1a1a1a] border-white/5 focus-visible:ring-primary/50 pl-11 h-14 text-base rounded-2xl"
                                        value={targetRole}
                                        onChange={(e) => setTargetRole(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleStart()}
                                    />
                                </div>
                            </div>

                            <Button
                                size="lg"
                                className="w-full h-14 rounded-2xl text-base font-bold bg-primary hover:bg-primary/90"
                                disabled={!targetRole || isLoading}
                                onClick={handleStart}
                            >
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                                Start Interview
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm font-bold text-white uppercase tracking-wider">Live Interview</span>
                </div>
                <div className="text-sm text-muted-foreground">{targetRole}</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Video Panel */}
                <div className="lg:col-span-1">
                    <div className="relative rounded-2xl overflow-hidden border-2 border-white/10 bg-black aspect-video">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`w-full h-full object-cover ${!isVideoEnabled && 'hidden'}`}
                        />
                        {!isVideoEnabled && (
                            <div className="w-full h-full flex items-center justify-center bg-[#111]">
                                <VideoOff className="w-12 h-12 text-muted-foreground" />
                            </div>
                        )}
                        <button
                            onClick={toggleVideo}
                            className="absolute bottom-4 right-4 p-3 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 hover:bg-black/80 transition-all"
                            title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
                        >
                            {isVideoEnabled ? (
                                <Video className="w-5 h-5 text-white" />
                            ) : (
                                <VideoOff className="w-5 h-5 text-white" />
                            )}
                        </button>
                        <button
                            onClick={toggleVoice}
                            className="absolute bottom-4 left-4 p-3 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 hover:bg-black/80 transition-all"
                            title={isVoiceEnabled ? "Mute AI voice" : "Enable AI voice"}
                        >
                            {isVoiceEnabled ? (
                                <Volume2 className="w-5 h-5 text-white" />
                            ) : (
                                <VolumeX className="w-5 h-5 text-white" />
                            )}
                        </button>
                        {isSpeaking && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
                                <div className="flex items-center gap-2">
                                    <Volume2 className="w-4 h-4 text-primary animate-pulse" />
                                    <span className="text-xs text-primary font-bold">AI Speaking...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Panel */}
                <div className="lg:col-span-2 flex flex-col gap-4 bg-[#050505]/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-6">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 max-h-[500px] pr-2">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                                    msg.role === 'user' 
                                        ? 'bg-primary text-white' 
                                        : 'bg-[#111] text-white border border-white/10'
                                }`}>
                                    {msg.role === 'assistant' && (
                                        <div className="flex items-center gap-2 mb-2 text-xs text-primary uppercase font-bold tracking-wider">
                                            <Sparkles className="w-3 h-3" />
                                            AI Interviewer
                                        </div>
                                    )}
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-[#111] border border-white/10 rounded-2xl px-6 py-4">
                                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="flex gap-3">
                        <Textarea
                            placeholder="Type your response or use voice..."
                            className="flex-1 bg-[#1a1a1a] border-white/5 focus-visible:ring-primary/50 rounded-2xl resize-none"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            rows={3}
                        />
                        <div className="flex flex-col gap-2">
                            <Button
                                size="icon"
                                className={`h-12 w-12 rounded-xl ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-secondary hover:bg-secondary/90'}`}
                                onClick={isListening ? stopListening : startListening}
                                title={isListening ? "Stop listening" : "Start voice input"}
                            >
                                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </Button>
                            <Button
                                size="icon"
                                className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90"
                                onClick={handleSendMessage}
                                disabled={!userInput.trim() || isLoading}
                            >
                                <Send className="w-5 h-5" />
                            </Button>
                            <Button
                                size="icon"
                                variant="destructive"
                                className="h-12 w-12 rounded-xl"
                                onClick={handleEndInterview}
                            >
                                End
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextInterviewFlow;
