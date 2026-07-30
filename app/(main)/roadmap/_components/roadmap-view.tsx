"use client";

import React from 'react';
import { 
    CheckCircle2, 
    ArrowDown, 
    Rocket, 
    Book, 
    Code, 
    Cpu, 
    Briefcase, 
    Award, 
    Star,
    Layers,
    Terminal,
    Wrench,
    GraduationCap,
    Workflow,
    ChevronDown,
    Sparkles,
    MousePointer2,
    Database,
    Cloud,
    Shield,
    Smartphone,
    Search,
    Brain,
    Palette,
    BarChart3,
    Clock,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const IconMap: Record<string, any> = {
    Rocket,
    Book,
    Code,
    Cpu,
    Briefcase,
    Award,
    Star,
    Layers,
    Terminal,
    Wrench,
    GraduationCap,
    Workflow,
    CheckCircle2,
    Sparkles,
    MousePointer2,
    Database,
    Cloud,
    Shield,
    Smartphone,
    Search,
    Brain,
    Palette,
    BarChart3,
    Clock,
    Zap
};

interface Phase {
    title: string;
    description: string;
    icon: string;
    skillsToLearn: string[];
}

interface RoadmapData {
    role: string;
    description: string;
    estimatedTime: string;
    phases: Phase[];
}

function RoadmapStep({ phase, index, isLast, isFirst }: { phase: Phase, index: number, isLast: boolean, isFirst: boolean }) {
    const IconComponent = IconMap[phase.icon] || (index === 0 ? Rocket : index === 6 ? Award : Star);

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto relative group">
            {/* Connection Line Background */}
            {!isLast && (
                <div 
                    className="absolute left-1/2 top-[100%] w-[2px] h-16 -translate-x-1/2 z-0" 
                    style={{ background: 'linear-gradient(to bottom, rgba(124, 58, 237, 0.4), transparent)' }}
                />
            )}

            {/* Step Card */}
            <div 
                className="w-full bg-[#0c0b11]/60 backdrop-blur-2xl border p-8 md:p-10 rounded-[3rem] transition-all duration-700 hover:-translate-y-2 relative overflow-hidden z-10"
                style={{ 
                    borderColor: 'rgba(168, 85, 247, 0.2)',
                    boxShadow: '0 0 40px -15px rgba(124, 58, 237, 0.5)',
                }}
            >
                {/* Radiant Glow on Hover */}
                <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" 
                    style={{ background: 'linear-gradient(to bottom right, rgba(124, 58, 237, 0.1), transparent, transparent)' }}
                />
                
                    <div 
                        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-2xl transition-transform duration-500 group-hover:scale-110 ${isLast ? "text-black" : "border"}`}
                        style={{ 
                            background: isLast ? 'linear-gradient(to bottom right, #a855f7, #7c3aed)' : 'rgba(255, 255, 255, 0.05)',
                            borderColor: isLast ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
                            color: isLast ? '#000000' : '#a855f7'
                        }}
                    >
                        <IconComponent className="w-8 h-8" />
                    </div>
                    
                    <div className="space-y-4 w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <h3 className="text-2xl font-black tracking-tight" style={{ color: isLast ? '#ffffff' : '#f4f4f5' }}>
                                {phase.title}
                            </h3>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border" style={{ color: '#71717a', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>Step {index + 1}</span>
                        </div>
                <p className="text-sm font-medium leading-relaxed max-w-md" style={{ color: '#a1a1aa' }}>
                    {phase.description}
                </p>
                        
                        <div className="flex flex-wrap gap-2 pt-2">
                            {phase.skillsToLearn.slice(0, 4).map((skill, i) => (
                                <span 
                                    key={i} 
                                    className="px-4 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-xl border transition-all duration-500"
                                    style={{
                                        backgroundColor: isLast ? 'rgba(124, 58, 237, 0.1)' : '#0c0b11',
                                        borderColor: isLast ? 'rgba(124, 58, 237, 0.2)' : '#1e1b2e',
                                        color: isLast ? '#a855f7' : '#a1a1aa'
                                    }}
                                >
                                    {skill}
                                </span>
                            ))}
                    </div>
                </div>

                {/* Corner Glow for all cards */}
                <div 
                    className="absolute -right-12 -top-12 w-32 h-32 blur-[60px] rounded-full pointer-events-none" 
                    style={{ backgroundColor: isLast ? 'rgba(124, 58, 237, 0.4)' : 'rgba(124, 58, 237, 0.1)' }}
                />
            </div>

            {/* Connector Arrow */}
            {!isLast && (
                <div className="h-16 flex items-center justify-center relative z-20">
                    <div 
                        className="w-10 h-10 rounded-full bg-[#050507] border flex items-center justify-center shadow-xl group-hover:border-primary/40 transition-colors"
                        style={{ borderColor: 'rgba(124, 58, 237, 0.2)' }}
                    >
                        <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-all" style={{ color: 'rgba(124, 58, 237, 0.6)' }} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default function RoadmapView({ data }: { data: RoadmapData }) {
    if (!data || !data.phases) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-16 pb-24">
            <div className="space-y-16 p-8" style={{ backgroundColor: '#030207' }}>
                {/* Header Section */}
            <div className="text-center space-y-6 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 blur-[100px] pointer-events-none" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }} />
                
                <div 
                    className="inline-flex items-center gap-2 px-4 py-2 border rounded-full text-xs font-black uppercase tracking-[0.3em] relative z-10 animate-pulse"
                    style={{ color: '#a855f7', borderColor: 'rgba(124, 58, 237, 0.2)', backgroundColor: 'rgba(124, 58, 237, 0.1)' }}
                >
                    <Zap className="w-3 h-3" style={{ fill: '#a855f7' }} />
                    AI-Driven Career Path
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter relative z-10">
                    The <span style={{ color: '#a855f7' }}>{data.role}</span> Blueprint
                </h1>
                
                <p className="text-xl font-medium max-w-2xl mx-auto leading-relaxed relative z-10" style={{ color: '#a1a1aa' }}>
                    {data.description}
                </p>

                <div className="flex items-center justify-center gap-8 relative z-10">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl font-black" style={{ color: '#ffffff' }}>{data.estimatedTime}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#71717a' }}>Est. Duration</span>
                    </div>
                    <div className="w-px h-10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl font-black" style={{ color: '#ffffff' }}>{data.phases.length}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#71717a' }}>Key Milestones</span>
                    </div>
                </div>
            </div>

                {/* Flowchart Section */}
                <div className="space-y-0 relative">
                    {data.phases.map((phase: Phase, i: number) => (
                        <RoadmapStep 
                            key={i} 
                            phase={phase} 
                            index={i} 
                            isFirst={i === 0}
                            isLast={i === data.phases.length - 1} 
                        />
                    ))}
                </div>
            </div>

            {/* Call to Action */}
            <div className="text-center pt-8">
                <div className="p-10 bg-gradient-to-br from-[#0a0a0f] to-black rounded-[2.5rem] border border-white/5 space-y-8 max-w-2xl mx-auto shadow-[0_0_50px_-20px_var(--color-primary)] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    
                    <div className="space-y-2 relative z-10">
                        <h4 className="text-2xl font-black text-white uppercase tracking-tight">Start Your Career Journey</h4>
                        <p className="text-zinc-500 text-sm font-medium">This roadmap is personalized for your goal. Take the first step today.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 relative z-10">
                        <Button asChild size="lg" className="h-14 px-10 gradient rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-transform w-full sm:w-auto">
                            <Link href="/courses">
                                <Rocket className="w-4 h-4 mr-2" /> Start Learning
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
