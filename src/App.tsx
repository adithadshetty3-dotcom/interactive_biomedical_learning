import React, { useState } from "react";
import HeartCirculationSim from "./components/HeartCirculationSim";
import EcgPatternSim from "./components/EcgPatternSim";
import HeartDiseasesSim from "./components/HeartDiseasesSim";
import QuizLearningGames from "./components/QuizLearningGames";
import FlashcardsStudyLab from "./components/FlashcardsStudyLab";
import PulseAiTutorChatbot from "./components/PulseAiTutorChatbot";
import { 
  Dna, 
  Layers, 
  Activity, 
  MonitorPlay, 
  Brain, 
  Thermometer, 
  ShieldAlert, 
  Database,
  ChevronRight,
  Sparkles,
  Search,
  Settings,
  BellRing,
  Heart,
  Award
} from "lucide-react";

// The six modules in the BILP platform syllabus
interface ModuleCard {
  id: number;
  label: string;
  codename: string;
  title: string;
  icon: React.ComponentType<any>;
  status: "active" | "development" | "locked";
  shortDesc: string;
}

const SYLLABUS_MODULES: ModuleCard[] = [
  {
    id: 1,
    label: "FEATURE 1 of 6",
    codename: "CARDIO_M_2D",
    title: "Working of the Heart",
    icon: Heart,
    status: "active",
    shortDesc: "Interactive 2D educational cardiac loop mapping systemic and pulmonary circulation chambers & valves."
  },
  {
    id: 2,
    label: "FEATURE 2 of 6",
    codename: "ECG_P_DET",
    title: "Smart ECG Pattern Detection",
    icon: Activity,
    status: "active",
    shortDesc: "Real-time HTML5 oscilloscope rendering normal rhythm, tachycardia, bradycardia, and irregular AFib with dynamic tuning and physical assessment."
  },
  {
    id: 3,
    label: "FEATURE 3 of 6",
    codename: "HEART_DIS_SIM",
    title: "Types of Heart Diseases",
    icon: ShieldAlert,
    status: "active",
    shortDesc: "Interactive 3D/2D cardiac pathology visualizer charting blockages, congenital leaks & therapeutic procedures."
  },
  {
    id: 4,
    label: "FEATURE 4 of 6",
    codename: "CARDIAC_QUIZ",
    title: "Quiz & Learning Games",
    icon: Award,
    status: "active",
    shortDesc: "Interactive anatomical trivia, dynamic ECG ID game, drag function mapping, clinical case scenarios, and rapid ER triage."
  },
  {
    id: 5,
    label: "FEATURE 5 of 6",
    codename: "FLASH_CARDS",
    title: "Flashcard Study Lab",
    icon: Brain,
    status: "active",
    shortDesc: "Interactive learning card system with spaced repetition, image-based anatomy labels, custom AI revision voice assistant, and diagnostic glossary."
  },
  {
    id: 6,
    label: "FEATURE 6 of 6",
    codename: "PULSE_AI_CHAT",
    title: "PulseAI Tutor Chat",
    icon: Brain,
    status: "active",
    shortDesc: "AI-Powered biology tutor chatbot to reinforce heart physiology, explain circulation routes, and clarify ECG rhythms."
  }
];

export default function App() {
  const [activeModule, setActiveModule] = useState<number>(1);
  const [panelSearch, setPanelSearch] = useState<string>("");

  // Centralized interrelated gamification states
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem("bilp_xp");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem("bilp_streak_val");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("bilp_sound");
    return saved !== "false";
  });

  // Sound Synthesizers with Web Audio
  const playPulseSound = (type: "correct" | "wrong" | "lub-dub" | "alarm" | "flatline") => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (type === "correct") {
        // High dual melody chime
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.08); // E5
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);
        osc1.start();
        osc2.start();
        osc1.stop(audioCtx.currentTime + 0.3);
        osc2.stop(audioCtx.currentTime + 0.3);
      } else if (type === "wrong") {
        // Low discordant buzz sound
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(130, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, audioCtx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } else if (type === "lub-dub") {
        // lub-dub cardiac pulses
        const oscLub = audioCtx.createOscillator();
        const oscDub = audioCtx.createOscillator();
        const gainLub = audioCtx.createGain();
        const gainDub = audioCtx.createGain();

        // Lub frequency (low)
        oscLub.frequency.setValueAtTime(65, audioCtx.currentTime);
        gainLub.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainLub.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
        oscLub.connect(gainLub);
        gainLub.connect(audioCtx.destination);
        oscLub.start();
        oscLub.stop(audioCtx.currentTime + 0.12);

        // Dub frequency (higher, briefly delayed)
        setTimeout(() => {
          try {
            oscDub.frequency.setValueAtTime(80, audioCtx.currentTime);
            gainDub.gain.setValueAtTime(0.07, audioCtx.currentTime);
            gainDub.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
            oscDub.connect(gainDub);
            gainDub.connect(audioCtx.destination);
            oscDub.start();
            oscDub.stop(audioCtx.currentTime + 0.15);
          } catch (e) {}
        }, 130);
      } else if (type === "alarm") {
        // Urgent warning beep
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.12);
      } else if (type === "flatline") {
        // Discordant persistent alert chirp
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(380, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      }
    } catch (e) {
      console.log("Audio synthesized blocked by browser context.");
    }
  };

  const gainXP = (amount: number) => {
    setXp((prev) => {
      const nextXP = prev + amount;
      localStorage.setItem("bilp_xp", nextXP.toString());
      return nextXP;
    });
  };

  // Sync state variables with local storage
  React.useEffect(() => {
    localStorage.setItem("bilp_xp", xp.toString());
  }, [xp]);

  React.useEffect(() => {
    localStorage.setItem("bilp_streak_val", streak.toString());
  }, [streak]);

  React.useEffect(() => {
    localStorage.setItem("bilp_sound", soundEnabled ? "true" : "false");
  }, [soundEnabled]);

  const filteredModules = SYLLABUS_MODULES.filter((mod) => 
    mod.title.toLowerCase().includes(panelSearch.toLowerCase()) ||
    mod.shortDesc.toLowerCase().includes(panelSearch.toLowerCase()) || 
    mod.codename.toLowerCase().includes(panelSearch.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR NAVIGATION PORTAL PANEL */}
      <aside className="w-full md:w-80 shrink-0 border-b md:border-b-0 md:border-r border-slate-900 bg-slate-950/90 flex flex-col justify-between" id="portal-sidebar">
        
        <div>
          {/* PLATFORM TITLE CORE LOGO */}
          <div className="p-6 border-b border-slate-900 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
              <Dna className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-emerald-400 tracking-wider">
                BIOMED_PLATFORM // LAB
              </div>
              <h1 className="text-lg font-bold font-display tracking-tight text-slate-100 flex items-center gap-1.5">
                BILP Console
              </h1>
            </div>
          </div>

          {/* QUICK BIOMEDICAL SEARCH BAR */}
          <div className="p-4 border-b border-slate-900/60">
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search modules..."
                value={panelSearch}
                onChange={(e) => setPanelSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg text-xs py-2 pl-9 pr-4 text-slate-300 placeholder-slate-500 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
              />
            </div>
          </div>

          {/* ACTIVE SYLLABUS LIST */}
          <div className="p-4">
            <div className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest px-2 mb-3">
              BIOMED_ENGINEERING_SYLLABUS
            </div>
            
            <div className="space-y-2" id="modules-list-group">
              {filteredModules.map((item) => {
                const isSelected = item.id === activeModule;
                const IconComp = item.icon;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.status === "active") {
                        setActiveModule(item.id);
                      }
                    }}
                    disabled={item.status !== "active"}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all duration-300 relative overflow-hidden flex items-center justify-between group ${
                      isSelected
                        ? "bg-cyan-950/30 border-cyan-500 text-cyan-300"
                        : item.status === "active"
                          ? "bg-slate-900/40 border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 cursor-pointer"
                          : "bg-slate-950/20 border-slate-950/50 text-slate-600 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex gap-3 items-center">
                      <div className={`p-1.5 rounded-lg border ${
                        isSelected 
                          ? "bg-cyan-950/85 border-cyan-800 text-cyan-400" 
                          : "bg-slate-950 border-slate-900 text-slate-500"
                      }`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      
                      <div>
                        <div className="font-mono text-[9px] text-slate-550 group-hover:text-slate-400">
                          {item.label} // {item.codename}
                        </div>
                        <div className="font-bold tracking-tight mt-0.5">{item.title}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.status === "active" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      )}
                      {item.status === "development" && (
                        <span className="text-[8px] border border-amber-900/30 bg-amber-950/20 text-amber-500 px-1 py-0.5 rounded font-mono">DEV</span>
                      )}
                      {item.status === "locked" && (
                        <span className="text-[8px] border border-slate-800 bg-slate-900/20 text-slate-500 px-1 py-0.5 rounded font-mono">LOCK</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* SIDEBAR FOOTER METADATA STAMP */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/50" id="sidebar-footer">
          <div className="rounded-lg p-3 bg-slate-900/40 border border-slate-900 text-[10px] font-mono text-slate-500 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span>SERVICE_ID:</span>
              <span className="text-emerald-400 font-bold">NODE_03_LIVE</span>
            </div>
            <div>
              <span>AUTH CODE:</span>
              <span className="text-cyan-500 ml-1">MVP_DEMO_2026</span>
            </div>
            <div className="text-[9px] pt-1 border-t border-slate-950/80 text-slate-500/80">
              *Designed for Biomedical engineering faculties & students.
            </div>
          </div>
        </div>

      </aside>

      {/* CORE WORKSPACE INNER CONTENT */}
      <div className="flex-1 flex flex-col overflow-y-auto" id="main-content-canvas">
        {activeModule === 1 ? (
          <HeartCirculationSim />
        ) : activeModule === 2 ? (
          <EcgPatternSim />
        ) : activeModule === 3 ? (
          <HeartDiseasesSim />
        ) : activeModule === 4 ? (
          <QuizLearningGames 
            xp={xp}
            setXp={setXp}
            streak={streak}
            setStreak={setStreak}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
          />
        ) : activeModule === 5 ? (
          <FlashcardsStudyLab 
            xp={xp}
            gainXP={gainXP}
            streak={streak}
            setStreak={setStreak}
            soundEnabled={soundEnabled}
            playPulseSound={playPulseSound}
          />
        ) : activeModule === 6 ? (
          <PulseAiTutorChatbot 
            soundEnabled={soundEnabled}
            playPulseSound={playPulseSound}
          />
        ) : (
          /* Locked feature fallbacks (just in case they somehow press a development module) */
          <div className="flex-1 flex flex-col items-center justify-center py-24 text-center p-6 bg-slate-950">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mb-4 animate-pulse">
              <Layers className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold font-display text-slate-400">Module Under Construction</h2>
            <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">
              BILP Educational engineering curriculum feature and assets are currently locked. Complete the prior sequence assessments first.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
