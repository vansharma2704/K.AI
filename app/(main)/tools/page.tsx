"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  PenBox,
  GraduationCap,
  BrainCircuit,
  Video,
  Map,
  ArrowRight,
  Sparkles,
  Target
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ToolsBackground from "@/components/3d/tools-background";

const tools = [
  {
    title: "Resume Builder",
    description: "Craft a professional, ATS-optimized resume with AI guidance.",
    href: "/resume",
    icon: FileText,
    color: "from-purple-500/20 to-violet-500/20",
    iconColor: "text-purple-400"
  },
  {
    title: "Cover Letter Generator",
    description: "Generate tailored cover letters for any job description in seconds.",
    href: "/ai-cover-letter",
    icon: PenBox,
    color: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400"
  },
  {
    title: "Mock Interview",
    description: "Practice with our AI recruiter to ace your real-world interviews.",
    href: "/interview",
    icon: GraduationCap,
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400"
  },
  {
    title: "Interview Prep Quiz",
    description: "Test your technical knowledge with industry-specific mock exams.",
    href: "/prep-quiz",
    icon: BrainCircuit,
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400"
  },
  {
    title: "Course Generator",
    description: "Generate comprehensive learning paths tailored to your career goals.",
    href: "/courses",
    icon: Video,
    color: "from-red-500/20 to-rose-500/20",
    iconColor: "text-red-400"
  },
  {
    title: "Career Roadmap",
    description: "AI that understands your skills and builds your career roadmap.",
    href: "/roadmap",
    icon: Map,
    color: "from-primary/20 to-purple-500/20",
    iconColor: "text-primary"
  },
  {
    title: "ATS Resume Analyzer",
    description: "Deep-dive scan of your resume PDF for ATS compatibility and gaps.",
    href: "/resume/analyzer",
    icon: Sparkles,
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400"
  },
  {
    title: "AI Job Matcher",
    description: "Compare your resume against any job description for role alignment.",
    href: "/resume/job-matcher",
    icon: Target,
    color: "from-red-500/20 to-rose-500/20",
    iconColor: "text-red-400"
  }
];

export default function ToolsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden w-full">
      {/* 3D Background */}
      <ToolsBackground />
      
      <div className="container mx-auto space-y-12 pb-20 relative z-10 w-full">
      <div className="text-center space-y-4 pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase tracking-[0.2em] text-[10px] font-black">
          <Sparkles className="w-3 h-3" />
          Platform Suite
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
          Professional <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-purple-400 to-violet-600">Tools</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
          Select a specialized AI assistant to accelerate your career growth and master your professional journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool, index) => (
          <Link key={index} href={tool.href} className="group">
            <Card className="relative h-full bg-[#0c0b11]/60 backdrop-blur-xl border-white/5 group-hover:border-primary/70 group-hover:-translate-y-4 group-hover:shadow-[0_30px_60px_-20px_rgba(124,58,237,0.5)] transition-all duration-500 rounded-[2.5rem] overflow-hidden flex flex-col p-2">
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <CardHeader className="relative z-10 p-8">
                <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                  <tool.icon className={`w-8 h-8 ${tool.iconColor} group-hover:text-white transition-colors`} />
                </div>
                <CardTitle className="text-2xl font-black text-white group-hover:translate-x-1 transition-transform">{tool.title}</CardTitle>
                <CardDescription className="text-muted-foreground font-medium leading-relaxed mt-4 group-hover:text-white/60 transition-colors">
                  {tool.description}
                </CardDescription>
              </CardHeader>

              <div className="mt-auto p-8 pt-0 relative z-10">
                <div className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-500">
                  Launch Assistant <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  </div>
  );
}
