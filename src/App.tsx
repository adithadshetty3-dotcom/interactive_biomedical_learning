import React, { useState } from "react";
import HeartCirculationSim from "./components/HeartCirculationSim";
import EcgPatternSim from "./components/EcgPatternSim";
import HeartDiseasesSim from "./components/HeartDiseasesSim";
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
  Heart
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
    codename: "THERMO_R_BIO",
    title: "Endocrine Homeostasis",
    icon: Thermometer,
    status: "locked",
    shortDesc: "Negative feedback simulator representing blood glucose regulation and endocrine pancreas signaling."
  },
  {
    id: 5,
    label: "FEATURE 5 of 6",
    codename: "NEPHRO_D_FILT",
    title: "Renal Nephron Filtration",
    icon: Layers,
    status: "locked",
    shortDesc: "Under construction. Simulates glomerular filtration rates & countercurrent multiplication columns."
  },
  {
    id: 6,
    label: "FEATURE 6 of 6",
    codename: "IMMUNO_A_DEF",
    title: "Leukocyte Chemotaxis",
    icon: ShieldAlert,
    status: "locked",
    shortDesc: "Under construction. Interactive dynamic cellular receptor binding during pathogenic infection."
  }
];

export default function App() {
  const [activeModule, setActiveModule] = useState<number>(1);
  const [panelSearch, setPanelSearch] = useState<string>("");

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
