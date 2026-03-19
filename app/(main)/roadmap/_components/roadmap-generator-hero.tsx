"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Map, Loader2, Play } from 'lucide-react';
import { generateCareerRoadmap } from '@/actions/roadmap';
import RoadmapView from './roadmap-view';

export default function RoadmapGeneratorHero() {
    const [targetRole, setTargetRole] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [roadmapData, setRoadmapData] = useState<any>(null);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!targetRole) return;
        setIsGenerating(true);
        setError('');
        setRoadmapData(null);

        try {
            const result = await generateCareerRoadmap(targetRole);
            if (result && result.success) {
                setRoadmapData(result.data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to generate roadmap');
        } finally {
            setIsGenerating(false);
        }
    };

    if (roadmapData) {
        return (
            <div className="w-full max-w-5xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <Button 
                    variant="outline" 
                    onClick={() => setRoadmapData(null)}
                    className="mb-8 border-white/10 hover:bg-white/5"
                >
                    &larr; Generate Another Roadmap
                </Button>
                <RoadmapView data={roadmapData} />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto pt-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md shadow-[0_0_15px_-3px_var(--color-primary)] text-primary uppercase tracking-[0.2em] text-[10px] font-black">
                <Map className="w-3 h-3" /> Career Architect
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-tight">
                Instantly map out your <br className="hidden md:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/40 drop-shadow-sm">
                    Path to Success
                </span>
            </h1>

            <p className="text-white/50 text-base md:text-lg max-w-2xl font-medium">
                Enter your dream role and K.AI will generate a highly detailed, phase-by-phase learning roadmap with tailored milestones.
            </p>

            <div className="w-full max-w-xl space-y-4 mt-4 relative group">
                <div className="relative flex items-center bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
                    <Input
                        placeholder="e.g. Full Stack Web Developer..."
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="flex-1 bg-transparent border-none text-white placeholder:text-white/30 text-lg px-4 h-14 focus-visible:ring-0 focus-visible:ring-offset-0"
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                    <Button
                        size="lg"
                        onClick={handleGenerate}
                        disabled={!targetRole || isGenerating}
                        className="h-14 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-[0_0_20px_-5px_var(--color-primary)] transition-all min-w-[140px]"
                    >
                        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Generate <Play className="ml-2 w-4 h-4 fill-current" /></>}
                    </Button>
                </div>
                {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            </div>
        </div>
    );
}
