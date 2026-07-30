"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { BrainCircuit, Loader2, Sparkles, AlertCircle, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { generateQuizQuestions, submitQuizAndGetFeedback } from '@/actions/quiz';
import { useRouter } from 'next/navigation';

export default function StartQuizPage() {
    const router = useRouter();
    
    // Step 1: Config
    const [topic, setTopic] = useState("");
    const [mode, setMode] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Step 2: Active Quiz State
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({}); // index -> selected option string
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Timer Logic
    useEffect(() => {
        if (questions.length === 0) return;
        
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmitQuiz(); // Auto submit on zero
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [questions]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleGenerate = async () => {
        if (!topic.trim() || !mode) return;
        setIsGenerating(true);
        try {
            const result = await generateQuizQuestions(topic, mode);
            if (result.success) {
                setQuestions(result.questions);
                setTimeLeft(30 * 60); // Reset timer
            }
        } catch (e: any) {
            alert(e.message || "Failed to generate");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSelectOption = (optionStr: string) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: optionStr
        }));
    };

    const handleSubmitQuiz = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        // Grade internally first
        let correctCount = 0;
        const processedQuestions = questions.map((q, idx) => {
            const userAnswer = answers[idx] || null;
            const isCorrect = userAnswer === q.answer;
            if (isCorrect) correctCount++;
            return {
                ...q,
                userAnswer,
                isCorrect
            };
        });

        try {
            const result = await submitQuizAndGetFeedback(topic, mode, correctCount, processedQuestions);
            if (result.success) {
                router.push(`/prep-quiz/result/${result.assessmentId}`);
            }
        } catch (e) {
            alert("Error submitting quiz results.");
            setIsSubmitting(false);
        }
    };

    if (questions.length === 0) {
        return (
            <div className='min-h-screen bg-black pt-24 pb-20 relative flex items-center justify-center'>
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                 
                 <div className="relative z-10 w-full max-w-xl mx-auto px-4">
                     <div className="text-center mb-10">
                         <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_var(--color-primary)]">
                             <BrainCircuit className="w-8 h-8 text-primary" />
                         </div>
                         <h1 className="text-3xl font-black text-white mb-3">Configure Your Quiz</h1>
                         <p className="text-muted-foreground text-sm">Tell us what you want to practice. The AI will mix conceptual and coding challenges into a strict 30-minute test.</p>
                     </div>

                     <Card className="bg-[#0a0a0a]/90 backdrop-blur border-white/10 shadow-2xl">
                         <CardContent className="p-8 space-y-6">
                             <div className="space-y-2">
                                 <label className="text-sm font-semibold text-white/80">Broad Topic (e.g. React, Python)</label>
                                 <Input 
                                    className="bg-black/50 border-white/10"
                                    placeholder="Enter topic..."
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                 />
                             </div>
                             <div className="space-y-4">
                                 <label className="text-sm font-semibold text-white/80">Difficulty Level</label>
                                 <div className="grid grid-cols-3 gap-3">
                                     {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                                         <Button 
                                             key={lvl}
                                             variant="outline"
                                             onClick={() => setMode(lvl)}
                                             className={`h-12 border transition-all duration-300 hover:bg-primary/20 hover:border-primary/50 hover:text-primary hover:scale-[1.05] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.6)] ${mode === lvl ? 'bg-primary text-white border-primary scale-[1.05] shadow-[0_0_20px_0px_rgba(139,92,246,0.6)]' : 'bg-black/50 border-white/10 text-white/70'}`}
                                         >
                                             {lvl}
                                         </Button>
                                     ))}
                                 </div>
                             </div>

                             <Button 
                                onClick={handleGenerate} 
                                disabled={isGenerating || !topic.trim()}
                                className="w-full mt-4 h-12 text-md font-bold"
                             >
                                 {isGenerating ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating Mock Quiz...</>
                                 ) : (
                                    <><Sparkles className="mr-2 h-5 w-5" /> Start 30-Min Challenge</>
                                 )}
                             </Button>
                         </CardContent>
                     </Card>
                 </div>
            </div>
        );
    }

    const currentQ = questions[currentQuestionIndex];
    const isAnswerSelected = !!answers[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    return (
        <div className='min-h-screen bg-black pt-24 pb-20 relative'>
            <div className="container max-w-4xl mx-auto px-4 relative z-10">
                
                {/* Header Bar */}
                <div className="flex items-center justify-between mb-8 bg-[#0a0a0a] border border-white/10 p-4 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/20 px-4 py-2 rounded-xl border border-primary/20">
                            <span className="text-primary font-bold">{currentQuestionIndex + 1}</span>
                            <span className="text-white/40 font-medium"> / {questions.length}</span>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Category</p>
                            <p className="text-white font-medium text-sm">{topic} - {mode}</p>
                        </div>
                    </div>
                    
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${timeLeft < 300 ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-white/5 border-white/10 text-white'}`}>
                        <Clock className="w-4 h-4" />
                        <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-white/5 rounded-full mb-12 overflow-hidden">
                    <div 
                        className="h-full bg-primary transition-all duration-300" 
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>

                {/* Question Area */}
                <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed mb-8">
                        {currentQ.question}
                    </h2>

                    <div className="space-y-4">
                        {currentQ.options.map((opt: string, idx: number) => {
                            const isSelected = answers[currentQuestionIndex] === opt;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleSelectOption(opt)}
                                    className={`w-full p-5 rounded-2xl border text-left transition-all flex items-start gap-4 ${
                                        isSelected 
                                        ? 'bg-primary/10 border-primary text-white scale-[1.01]' 
                                        : 'bg-[#0a0a0a] hover:bg-white/5 border-white/10 text-white/80 hover:text-white'
                                    }`}
                                >
                                    <div className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center mt-0.5 ${isSelected ? 'border-primary' : 'border-white/20'}`}>
                                        {isSelected && <div className="w-3 h-3 bg-primary rounded-full" />}
                                    </div>
                                    <span className="text-lg">{opt}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Controls Area */}
                <div className="flex justify-between items-center pt-8 border-t border-white/10">
                    <Button 
                        variant="ghost" 
                        onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                        disabled={currentQuestionIndex === 0}
                        className="text-white/60 hover:text-white"
                    >
                        Previous
                    </Button>

                    <div className="flex items-center gap-2">

                        {!isLastQuestion ? (
                            <Button 
                                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                className="font-bold px-8"
                            >
                                Next <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        ) : (
                            <Button 
                                onClick={handleSubmitQuiz}
                                disabled={isSubmitting}
                                className="font-bold px-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                                ) : (
                                    <><CheckCircle2 className="mr-2 h-4 w-4" /> Submit Quiz</>
                                )}
                            </Button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
