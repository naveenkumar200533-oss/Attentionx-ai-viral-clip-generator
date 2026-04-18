import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/attention/Header";
import { Hero } from "@/components/attention/Hero";
import { Dashboard } from "@/components/attention/Dashboard";
import { HowItWorks } from "@/components/attention/HowItWorks";
import { UploadZone, STAGES } from "@/components/attention/UploadZone";
import { TranscriptPanel } from "@/components/attention/TranscriptPanel";
import { ClipCard } from "@/components/attention/ClipCard";
import { ViralityScoreSection } from "@/components/attention/ViralityScoreSection";
import { DemoFlow } from "@/components/attention/DemoFlow";
import { SocialProof } from "@/components/attention/SocialProof";
import { FinalCta } from "@/components/attention/FinalCta";
import { sampleClips, sampleTranscript } from "@/data/sampleData";
import { Scissors, Layers } from "lucide-react";

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [stage, setStage] = useState(STAGES[0]);
  const [progress, setProgress] = useState(0);
  const [hasResults, setHasResults] = useState(false);
  const [stats, setStats] = useState({
    videosProcessed: 12,
    clipsGenerated: 47,
  });

  const handleProcess = () => {
    setIsProcessing(true);
    setHasResults(false);
    setProgress(0);
    setStage(STAGES[0]);
  };

  useEffect(() => {
    if (!isProcessing) return;
    const totalDuration = 7000;
    const interval = 60;
    const increment = (100 / totalDuration) * interval;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      const next = Math.min(100, Math.round(current));
      setProgress(next);
      const stageIdx = Math.min(STAGES.length - 1, Math.floor((next / 100) * STAGES.length));
      setStage(STAGES[stageIdx]);

      if (next >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setIsProcessing(false);
          setHasResults(true);
          setStats((s) => ({
            videosProcessed: s.videosProcessed + 1,
            clipsGenerated: s.clipsGenerated + sampleClips.length,
          }));
          document.getElementById("clips")?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isProcessing]);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container px-4 py-6 md:py-10 space-y-12 md:space-y-20 max-w-7xl">
        <Hero />

        <Dashboard
          videosProcessed={stats.videosProcessed}
          clipsGenerated={stats.clipsGenerated}
        />

        <HowItWorks />

        <DemoFlow />

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <UploadZone
              onProcess={handleProcess}
              isProcessing={isProcessing}
              stage={stage}
              progress={progress}
            />
          </div>
          <div className="lg:col-span-2">
            {(isProcessing || hasResults) ? (
              <TranscriptPanel segments={sampleTranscript} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl glass p-6 h-full min-h-[300px] flex flex-col items-center justify-center text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 grid-pattern opacity-30" />
                <div className="relative">
                  <div className="relative mb-4 mx-auto w-fit">
                    <div className="absolute inset-0 bg-gradient-primary blur-2xl opacity-40 animate-pulse-glow" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl glass-strong">
                      <Layers className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">
                    AI Pipeline Ready
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Upload a video to see live transcript generation, peak detection, and viral scoring.
                  </p>
                  <div className="mt-5 flex flex-col gap-2 w-full max-w-[240px] mx-auto font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {["Whisper-3 Transcription", "GPT Peak Analysis", "Face Tracking v2", "Karaoke Captions"].map((t) => (
                      <div key={t} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30">
                        <div className="h-1 w-1 rounded-full bg-secondary animate-pulse" />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {hasResults && (
          <motion.section
            id="clips"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div className="flex items-end justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-secondary">
                    Output · Ready
                  </span>
                  <div className="h-px w-16 bg-gradient-to-r from-secondary/50 to-transparent" />
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold flex items-center gap-2">
                  <Scissors className="h-6 w-6 text-primary" />
                  Generated Viral Clips
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {sampleClips.length} clips · 9:16 vertical · ready for download
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Sorted by
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-secondary font-bold">
                  Virality Score
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sampleClips
                .sort((a, b) => b.virality - a.virality)
                .map((clip, i) => (
                  <ClipCard key={clip.id} clip={clip} index={i} />
                ))}
            </div>
          </motion.section>
        )}

        <ViralityScoreSection />

        <SocialProof />

        <FinalCta />

        <footer className="pt-8 pb-6 border-t border-border">
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>© 2026 AttentionX · Built for Creators</span>
            <span>v2.4.1 · All systems operational</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
