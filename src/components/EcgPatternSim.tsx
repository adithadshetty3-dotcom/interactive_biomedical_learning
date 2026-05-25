import React, { useState, useEffect, useRef } from "react";
import { 
  Activity, 
  Heart, 
  TrendingUp, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  Sliders, 
  Award, 
  RotateCcw, 
  HelpCircle,
  Volume2,
  VolumeX,
  FileText,
  Check,
  ChevronRight,
  ShieldAlert,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Types
type ConditionKey = "normal" | "tachycardia" | "bradycardia" | "arrhythmia";

interface ConditionInfo {
  name: string;
  emoji: string;
  color: string; // Tailwind text color
  borderColor: string;
  glowColor: string;
  bpm: number | string;
  description: string;
  symptoms: string[];
  dangers: string[];
  treatments: string[];
  devices: string;
  heartRateValue: number;
}

const CONDITIONS: Record<ConditionKey, ConditionInfo> = {
  normal: {
    name: "Normal Sinus Rhythm",
    emoji: "💚",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    glowColor: "shadow-emerald-950/40",
    bpm: 72,
    description: "Healthy cardiac electrical activity. Impulses originate inside the Sinoatrial (SA) Node, traveling smoothly through the atria and ventricles, displaying perfect coordination between heart chambers.",
    symptoms: [
      "Optimal systemic oxygen perfusion",
      "Regular steady pulse (60-100 BPM)",
      "Stable, healthy resting blood pressure"
    ],
    dangers: [
      "None (healthy cardiac index baseline)",
      "Maintains excellent, reliable blood volume"
    ],
    treatments: [
      "Daily active movement & aerobic exercise",
      "Monitoring through modern wearable sensors (Apple, Fitbit, etc.)"
    ],
    devices: "Hospital telemetry bed systems (GE HealthCare, Philips Mindray Solutions), commercial Apple or Galaxy smart watches.",
    heartRateValue: 72
  },
  tachycardia: {
    name: "Sinus Tachycardia",
    emoji: "🔴",
    color: "text-rose-500",
    borderColor: "border-rose-500/30",
    glowColor: "shadow-rose-950/40",
    bpm: 142,
    description: "An elevated heart rate exceeding 100 beats per minute at rest. This shortens the Diastolic (resting/filling) phase, leaving the chamber less time to collect blood before the next squeeze.",
    symptoms: [
      "Subjective chest flutter or rapid pounding sensation",
      "Shortness of breath under mild physical activity",
      "Fatigue or sudden decreased endurance"
    ],
    dangers: [
      "Elevated myocardial oxygen demand (heart muscle works over-time)",
      "Prolonged hyper-rate can weaken the heart muscle walls"
    ],
    treatments: [
      "Vagal stimulation techniques (valsalva maneuver, cold facial immersion)",
      "Managing root causes (caffeine, extreme stress, or high fever)",
      "In clinical cases, blocking medications (e.g., Beta-blockers)"
    ],
    devices: "Continuous 24-hr Holter Monitors, Smartwatch active tachycardia notifications.",
    heartRateValue: 142
  },
  bradycardia: {
    name: "Sinus Bradycardia",
    emoji: "🟡",
    color: "text-amber-450",
    borderColor: "border-amber-500/30",
    glowColor: "shadow-amber-950/40",
    bpm: 38,
    description: "A slow heart rate resting below 60 beats per minute. Common and healthy in endurance athletes, but can decrease cardiac output in non-athletes, causing a drop in blood flow to the brain.",
    symptoms: [
      "Lethargy, constant sleepiness, or lack of physical energy",
      "Syncope (passing out / fainting spelled) or lightheadedness",
      "Mild confusion or memory fog from reduced brain perfusion"
    ],
    dangers: [
      "Inability of low rate to sustain healthy mean arterial pressure",
      "Potential underlying dysfunction of the Sinoatrial Node pacemaker"
    ],
    treatments: [
      "Reviewing and halting rate-blocking drugs (Beta-blockers)",
      "In severe cases, surgical implantation of a permanent pacemaker device"
    ],
    devices: "Standard 12-lead ECG, Implantable Loop Recorders, Smartwatch low-rate alarms (notifying if BPM sits below 45 while awake).",
    heartRateValue: 38
  },
  arrhythmia: {
    name: "Atrial Fibrillation (AFib)",
    emoji: "🟠",
    color: "text-orange-500",
    borderColor: "border-orange-500/30",
    glowColor: "shadow-orange-950/40",
    bpm: "IRREGULAR ⚠",
    description: "Atrial Fibrillation represents chaotic, uncoordinated electrical impulses firing rapidly inside the heart's upper atria, causing them to quiver erratically rather than contract cleanly.",
    symptoms: [
      "Skipped beats, fluctuating pulse, or jumping rhythm sensation",
      "Sudden fatigue, dizziness, or chest tightness",
      "Anxiety coupled with an unpredictable heartbeat"
    ],
    dangers: [
      "Incomplete emptying of the atria can cause blood to pool, greatly increasing blood clot and stroke risks",
      "Chaotic timing reduces long-term ventricle efficiency"
    ],
    treatments: [
      "Anticoagulant blood thinners to minimize stroke risk",
      "Electrical Cardioversion shock to reset sinus timing",
      "Catheter ablation to cauterize bad electrical pathways"
    ],
    devices: "FDA-cleared AliveCor KardiaMobile sensors, Smartwatch irregular rhythm notification engines.",
    heartRateValue: 85
  }
};

const DIAGNOSTIC_CHALLENGES = [
  {
    waveformCondition: "tachycardia",
    hints: [
      "The waves are extremely close to each other, with almost no resting baseline space in-between.",
      "The simulated pulse exceeds 130 beats per minute."
    ],
    question: "A 24-year-old student comes to the campus clinic complaining of a hammering heartbeat and severe anxiety after drinking 4 energy drinks to study. What waveform rhythm is on the monitor?",
    options: [
      "Normal Sinus Rhythm",
      "Sinus Tachycardia",
      "Sinus Bradycardia",
      "Atrial Fibrillation (AFib)"
    ],
    correctIdx: 1,
    rationale: "Excessive caffeine stimulates the cardiac pacemaker (SA node) to fire rapid signals, causing compressed, rapid waves of Sinus Tachycardia."
  },
  {
    waveformCondition: "arrhythmia",
    hints: [
      "Look at the horizontal spacing (time) between the sharp spikes: it is unpredictable and changes constantly.",
      "The baseline between contractions is not flat; it has rapid, tiny quivering bumps."
    ],
    question: "An elderly patient with high blood pressure reports a fluttering chest sensation. The ECG screen reveals highly irregular periods between the tall ventricular QRS spikes. What condition does this represent?",
    options: [
      "Normal Sinus Rhythm",
      "Bradycardia",
      "Atrial Fibrillation (AFib)",
      "Myocardial Blockage"
    ],
    correctIdx: 2,
    rationale: "Atrial Fibrillation coordinates erratic, chaotic pulses where signals escape in highly uneven intervals, creating an unpredictable, irregular rhythm."
  },
  {
    waveformCondition: "bradycardia",
    hints: [
      "There are wide, empty, flat lines between each active heart trace pulse.",
      "The rate registers at a very low beats-per-minute (~38 BPM)."
    ],
    question: "A non-athlete patient is admitted to emergency with cold sweating, dizziness, and fainting episodes. The monitor captures very isolated, slow ventricular peaks. What rhythm is this?",
    options: [
      "Sinus Tachycardia",
      "Normal Sinus Rhythm",
      "Sinus Bradycardia",
      "Ventricular Flutter"
    ],
    correctIdx: 2,
    rationale: "An extremely slowed down rhythm (below 60 BPM) is Sinus Bradycardia. Without adequate pace, the brain is deprived of fresh blood, triggering dizziness or syncope."
  }
];

export default function EcgPatternSim() {
  const [selectedCondition, setSelectedCondition] = useState<ConditionKey>("normal");
  const [sidebarTab, setSidebarTab] = useState<"quiz" | "report">("quiz");
  
  // Advanced toggles (closed by default to maintain extreme simplicity)
  const [showAdvancedDials, setShowAdvancedDials] = useState<boolean>(false);
  const [lead, setLead] = useState<"I" | "II" | "III" | "aVR">("II");
  const [gain, setGain] = useState<number>(1.0);
  const [sweepSpeed, setSweepSpeed] = useState<number>(1.2);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isAudioFeedback, setIsAudioFeedback] = useState<boolean>(false);

  // Quiz States
  const [quizIdx, setQuizIdx] = useState<number>(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [showQuizHint, setShowQuizHint] = useState<boolean>(false);
  const [quizComplete, setQuizComplete] = useState<boolean>(false);

  // Lab Report Creator States
  const [patientName, setPatientName] = useState<string>("Alex Mercer (Student-01)");
  const [patientAge, setPatientAge] = useState<number>(22);
  const [clinicalNotes, setClinicalNotes] = useState<string>("Normal sinus profile simulated inside the learning lab.");
  const [generatedReport, setGeneratedReport] = useState<any | null>(null);

  // Refs for drawing loop
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollOffsetRef = useRef<number>(0);
  const conditionRef = useRef<ConditionKey>("normal");
  const gainRef = useRef<number>(1.0);
  const speedRef = useRef<number>(1.2);
  const leadRef = useRef<string>("II");

  // Keep refs in sync for the high-frequency tick loop (bypass stale closures)
  useEffect(() => {
    conditionRef.current = selectedCondition;
    gainRef.current = gain;
    speedRef.current = sweepSpeed;
    leadRef.current = lead;
  }, [selectedCondition, gain, sweepSpeed, lead]);

  // Sync clinical placeholder notes when user switches waves
  useEffect(() => {
    if (selectedCondition === "arrhythmia") {
      setClinicalNotes("Irregular cardiac pulse intervals. Quivering atria wave trace confirms classic AFib features.");
    } else if (selectedCondition === "tachycardia") {
      setClinicalNotes("Sinus tachycardia with highly compressed intervals at 142 BPM. Elevated muscle demand.");
    } else if (selectedCondition === "bradycardia") {
      setClinicalNotes("Sinus bradycardia wave profile. Long diastolic rest baselines mapped at 38 BPM.");
    } else {
      setClinicalNotes("Normal sinus cardiac timing. P, QRS, and T complexes are healthy and fully aligned.");
    }
  }, [selectedCondition]);

  // Audio chirp synthetic feedback
  const triggerAudioChirp = () => {
    if (!isAudioFeedback) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = "sine";
      const freq = selectedCondition === "tachycardia" ? 560 : selectedCondition === "bradycardia" ? 340 : 440;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      // Deferred audio
    }
  };

  // Heartbeat scheduler loop
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const tick = () => {
      let delay = 833; // default ~72 BPM
      if (selectedCondition === "tachycardia") delay = 422;
      else if (selectedCondition === "bradycardia") delay = 1578;
      else if (selectedCondition === "arrhythmia") {
        delay = 350 + Math.random() * 650; // Quiver AFib timing
      }

      timer = setTimeout(() => {
        if (isPlaying) {
          triggerAudioChirp();
        }
        tick();
      }, delay);
    };

    tick();
    return () => clearTimeout(timer);
  }, [selectedCondition, isPlaying, isAudioFeedback]);

  // Oscilloscope drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 700;
      canvas.height = 200;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const getPQRSTValue = (x: number, cycle: number, gVal: number, lVal: string) => {
      const normX = x % cycle;
      let scale = gVal;
      if (lVal === "aVR") scale *= -0.9;
      else if (lVal === "III") scale *= 0.75;

      let val = 0;
      // boundary timings
      const pStart = 4;
      const pW = 10;
      const qStart = 18;
      const rStart = 22;
      const sStart = 26;
      const tStart = 38;
      const tW = 14;

      if (normX >= pStart && normX < pStart + pW) {
        val = Math.sin(((normX - pStart) / pW) * Math.PI) * 10 * scale;
      } else if (normX >= qStart && normX < rStart) {
        val = -((normX - qStart) / (rStart - qStart)) * 12 * scale;
      } else if (normX >= rStart && normX < sStart) {
        const progress = (normX - rStart) / (sStart - rStart);
        if (progress < 0.4) {
          val = -12 * scale + (progress / 0.4) * 95 * scale;
        } else {
          val = 83 * scale - ((progress - 0.4) / 0.6) * 108 * scale;
        }
      } else if (normX >= sStart && normX < sStart + 5) {
        val = -25 * scale + ((normX - sStart) / 5) * 25 * scale;
      } else if (normX >= tStart && normX < tStart + tW) {
        val = Math.sin(((normX - tStart) / tW) * Math.PI) * 18 * scale;
      }

      // Add small active static baseline noise details (realistic look)
      val += (Math.sin(x * 0.15) * 0.7 + (Math.random() - 0.5) * 0.9);
      return val;
    };

    let frameId: number;
    const scrollGaps = [75, 120, 190, 80, 140, 210, 95];

    const render = () => {
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Clinical hospital graph lines backing
      ctx.strokeStyle = "rgba(16, 185, 129, 0.04)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < canvas.width; x += 10) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 10) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      ctx.strokeStyle = "rgba(16, 185, 129, 0.12)";
      ctx.lineWidth = 1.0;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Draw the scrolling ECG neon green wave traces
      ctx.beginPath();
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2.2;
      ctx.shadowBlur = 4;
      ctx.shadowColor = "rgba(16, 185, 129, 0.6)";
      ctx.lineJoin = "round";

      if (isPlaying) {
        scrollOffsetRef.current += speedRef.current;
      }

      const activeCond = conditionRef.current;
      const actGain = gainRef.current;
      const actLead = leadRef.current;

      let cycle = 120; // Normal index
      if (activeCond === "tachycardia") cycle = 55;
      else if (activeCond === "bradycardia") cycle = 240;

      const baselineY = canvas.height / 2 + 10;

      for (let sx = 0; sx < canvas.width; sx++) {
        const tIndex = sx + scrollOffsetRef.current;
        let yOff = 0;

        if (activeCond === "arrhythmia") {
          // Irregular gaps matching standard Atrial Fibrillation anomalies
          const idx = Math.floor(tIndex / 150) % scrollGaps.length;
          const randomCycle = scrollGaps[idx];
          const innerCycleX = tIndex % randomCycle;
          
          yOff = getPQRSTValue(innerCycleX, randomCycle, actGain, actLead);
          if (idx % 3 === 0) yOff *= 0.55; // alter amplitude randomly
        } else {
          yOff = getPQRSTValue(tIndex, cycle, actGain, actLead);
        }

        const sy = baselineY - yOff;
        if (sx === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }

      ctx.stroke();

      // Clean shadow boundaries
      ctx.shadowBlur = 0;
      frameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedCondition, gain, sweepSpeed, lead, isPlaying]);

  // Quiz progression logic
  const handleQuizAnswerSubmit = () => {
    if (quizSelected === null || quizSubmitted) return;
    setQuizSubmitted(true);
    if (quizSelected === DIAGNOSTIC_CHALLENGES[quizIdx].correctIdx) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    setQuizSelected(null);
    setQuizSubmitted(false);
    setShowQuizHint(false);

    if (quizIdx < DIAGNOSTIC_CHALLENGES.length - 1) {
      setQuizIdx((prev) => prev + 1);
      // Synchronize back waves so user can study as they progress!
      setSelectedCondition(DIAGNOSTIC_CHALLENGES[quizIdx + 1].waveformCondition as ConditionKey);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuizIdx(0);
    setQuizSelected(null);
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizComplete(false);
    setShowQuizHint(false);
    setSelectedCondition(DIAGNOSTIC_CHALLENGES[0].waveformCondition as ConditionKey);
  };

  // Lab sheet report emitter
  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const condition = CONDITIONS[selectedCondition];
    
    // Create random document serial number
    const documentSerial = "ECG-LAB-" + Math.floor(100000 + Math.random() * 900000);
    
    setGeneratedReport({
      serial: documentSerial,
      name: patientName || "Alex Mercer",
      age: patientAge || 22,
      rhythm: condition.name,
      observedBpm: typeof condition.bpm === "number" ? `${condition.bpm} BPM` : "Fluctuating / Erratic",
      status: selectedCondition === "normal" ? "STABILIZED" : "WARNING ALERTS FLAGGED",
      notes: clinicalNotes,
      emittedAt: new Date().toLocaleTimeString()
    });
  };

  return (
    <div className="flex-grow flex flex-col gap-6 bg-slate-950 text-slate-100 p-4 md:p-6" id="ecg-pattern-sim-container">
      
      {/* 1. FUTURISTIC HEADER BANNER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-emerald-950 border border-emerald-500/25 text-emerald-450 font-mono font-bold px-2 py-0.5 rounded">
              DIAGNOSTIC MODULE
            </span>
            <span className="text-xs text-slate-400 font-mono">// Smartwatch Wave Oscilloscope</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight font-sans mt-1">
            Smart ECG Waveform Pattern Simulator
          </h2>
          <p className="text-xs text-slate-450 mt-1 max-w-xl">
            Analyze clinical heart currents. Select different cardiac conditions below to see how standard P, QRS, and T pulses transform during abnormalities.
          </p>
        </div>

        {/* Audio monitor click feedback */}
        <div>
          <button
            onClick={() => setIsAudioFeedback(!isAudioFeedback)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
              isAudioFeedback 
                ? "bg-emerald-950 border-emerald-500 text-emerald-400" 
                : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
            }`}
            title="Listen to hospital signal sounds"
          >
            {isAudioFeedback ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="font-mono text-[10px]">{isAudioFeedback ? "BEEPER ON" : "BEEPER MUTED"}</span>
          </button>
        </div>
      </div>

      {/* 2. CHOOSE RHYTHM BOXES (LARGE and self-explanatory cards) */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[10px] font-mono text-slate-400 tracking-wider">CHOOSE CARDIAC RHYTHM PROFILE:</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {(Object.keys(CONDITIONS) as Array<ConditionKey>).map((key) => {
            const item = CONDITIONS[key];
            const active = selectedCondition === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedCondition(key)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  active 
                    ? "bg-cyan-950/30 border-cyan-400 text-cyan-300 scale-[1.02] shadow-lg shadow-cyan-950/50" 
                    : "bg-slate-900/35 border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
                id={`rhythm-selector-card-${key}`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className={`text-[9px] font-mono font-bold uppercase ${active ? "text-cyan-400" : "text-slate-500"}`}>
                    {key === "arrhythmia" ? "AFib Trigger" : `${item.bpm} bpm`}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="text-[8px] font-mono text-slate-500 uppercase leading-none">Diagnostic Condition</div>
                  <strong className="block text-xs font-sans mt-1 text-slate-100">{item.name}</strong>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SIMULATOR GRID WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: LIVE WAVE AND EDUCATION CARD (SPAN 7) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* THE ECG LIVE GRAPH SCREEN */}
          <div className="bg-slate-900/40 border border-slate-850 rounded-2xl overflow-hidden shadow-xl">
            
            {/* OSCILLOSCOPE HEADER */}
            <div className="bg-slate-950/70 py-2.5 px-4 border-b border-slate-850/80 flex justify-between items-center text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? "bg-emerald-400 animate-pulse" : "bg-red-500"}`} />
                <span className="font-bold">LEAD_II // STABILIZED VIRTUAL PATIENT LEAD</span>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-slate-500">
                <span>SPEED: <b className="text-cyan-400">{sweepSpeed.toFixed(1)}x</b></span>
                <span>GAIN: <b className="text-cyan-400">{gain.toFixed(1)}x</b></span>
                <span className="hidden sm:inline">// OSC_FREQ_1000Hz</span>
              </div>
            </div>

            {/* WAVE DRAW CONDUIT */}
            <div className="relative">
              <canvas 
                ref={canvasRef}
                className="w-full h-[200px] block"
                id="oscilloscope-canvas"
              />

              {/* Glowing monitor indicators */}
              <div className="absolute top-3 right-3 pointer-events-none flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-850 text-[9px] font-mono font-bold text-rose-500">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                <span>MONITOR SWEEP</span>
              </div>

              {/* Dynamic state notification banner */}
              <div className="absolute bottom-3 left-3 pointer-events-none p-2 rounded bg-slate-950/80 border border-slate-850/60 max-w-xs text-[9px] font-mono text-slate-400 flex items-center gap-1.5">
                <Heart className={`w-3.5 h-3.5 text-rose-500 ${isPlaying && selectedCondition !== "arrhythmia" ? "animate-pulse" : ""}`} />
                <span>Timing status: <b className={CONDITIONS[selectedCondition].color}>{CONDITIONS[selectedCondition].bpm}</b></span>
              </div>
            </div>

            {/* BASIC PLAYBACK BAR AND COLLAPSE ACCORDION FOR CALIBRATION */}
            <div className="p-3 bg-slate-950/60 border-t border-slate-850/75 flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs">
                
                {/* Flow freezing button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`py-1.5 px-4 font-mono font-bold text-[11px] rounded-lg border transition-all cursor-pointer ${
                    isPlaying 
                      ? "bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-350" 
                      : "bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white"
                  }`}
                >
                  {isPlaying ? "⏺ FREEZE OSCILLOSCOPE" : "▶ START OSCILLOSCOPE"}
                </button>

                {/* Advanced dials accordion header */}
                <button
                  onClick={() => setShowAdvancedDials(!showAdvancedDials)}
                  className="text-cyan-400 hover:text-cyan-300 font-mono text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{showAdvancedDials ? "Hide advanced calibrations" : "Show advanced calibrations"}</span>
                  {showAdvancedDials ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

              </div>

              {/* ADVANCED DIALS COLLAPSIBLE ACCORDION CONTAINER */}
              {showAdvancedDials && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 bg-slate-950 border border-slate-900 rounded-xl animate-fade-in text-[10px] font-mono">
                  
                  {/* Gain controller slider */}
                  <div className="md:col-span-4 flex items-center gap-2">
                    <span className="text-slate-500 uppercase shrink-0">GAIN (AMPLITUDE):</span>
                    <input 
                      type="range"
                      min="0.5"
                      max="1.7"
                      step="0.1"
                      value={gain}
                      onChange={(e) => setGain(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 h-1 bg-slate-900 rounded"
                    />
                  </div>

                  {/* Sweep rate slider */}
                  <div className="md:col-span-4 flex items-center gap-2">
                    <span className="text-slate-500 uppercase shrink-0">TIME SWEEP RATE:</span>
                    <input 
                      type="range"
                      min="0.6"
                      max="2.2"
                      step="0.1"
                      value={sweepSpeed}
                      onChange={(e) => setSweepSpeed(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 h-1 bg-slate-900 rounded"
                    />
                  </div>

                  {/* Vectors leads list options */}
                  <div className="md:col-span-4 flex items-center gap-1.5 justify-end">
                    <span className="text-slate-500 uppercase">LEADS VECTORS:</span>
                    <div className="flex gap-1 bg-slate-900 p-0.5 rounded border border-slate-850">
                      {(["I", "II", "III", "aVR"] as const).map((lOp) => (
                        <button
                          key={lOp}
                          onClick={() => setLead(lOp)}
                          className={`px-2 py-0.5 text-[9px] font-mono rounded font-bold transition-all cursor-pointer ${
                            lead === lOp 
                              ? "bg-cyan-950 text-cyan-300 border border-cyan-800/40" 
                              : "text-slate-500 hover:text-slate-350"
                          }`}
                        >
                          {lOp}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>

          {/* DENSE EDUCATION CARD DETAILS */}
          <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl shadow-xl space-y-4" id="rhythm-education-sheet">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-850">
              <span className="text-3xl">{CONDITIONS[selectedCondition].emoji}</span>
              <div>
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold leading-none">Diagnostic interpretation sheet</span>
                <h3 className="text-base font-extrabold text-cyan-400 mt-1 uppercase leading-none">{CONDITIONS[selectedCondition].name}</h3>
              </div>
            </div>

            <p className="text-xs text-slate-350 leading-relaxed">
              {CONDITIONS[selectedCondition].description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
              
              {/* Column 1 Symptoms */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-450 uppercase tracking-wider block font-bold">✓ Symptoms</span>
                <ul className="space-y-1 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900/60 min-h-[90px]">
                  {CONDITIONS[selectedCondition].symptoms.map((s, idx) => (
                    <li key={idx} className="text-[11px] text-slate-400 list-inside list-disc leading-tight">{s}</li>
                  ))}
                </ul>
              </div>

              {/* Column 2 Dangers */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-rose-450 uppercase tracking-wider block font-bold">⚠ Clinical Risks</span>
                <ul className="space-y-1 bg-slate-950/40 p-2.5 rounded-xl border border-rose-950/10 min-h-[90px]">
                  {CONDITIONS[selectedCondition].dangers.map((d, idx) => (
                    <li key={idx} className="text-[11px] text-slate-405 list-inside list-disc leading-tight">{d}</li>
                  ))}
                </ul>
              </div>

              {/* Column 3 Interventions */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-cyan-450 uppercase tracking-wider block font-bold">✙ Medical Treatments</span>
                <ul className="space-y-1 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900/60 min-h-[90px]">
                  {CONDITIONS[selectedCondition].treatments.map((t, idx) => (
                    <li key={idx} className="text-[11px] text-slate-400 list-inside list-disc leading-tight">{t}</li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Smartwatch statement */}
            <div className="pt-3 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-cyan-400" /> Watch sensor integration notes:</span>
              <span className="text-slate-400 leading-none text-right">{CONDITIONS[selectedCondition].devices}</span>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: TABULATED ACCESSMENTS & REPORT LOGICS (SPAN 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="bg-slate-900/40 border border-slate-850 rounded-2xl shadow-xl overflow-hidden" id="workspace-sidebar">
            
            {/* TAB SELECTORS */}
            <div className="grid grid-cols-2 bg-slate-950 border-b border-slate-850/80 text-xs font-mono">
              <button
                onClick={() => setSidebarTab("quiz")}
                className={`py-3.5 border-r border-slate-850/45 transition-all font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                  sidebarTab === "quiz" 
                    ? "bg-slate-900/40 text-cyan-400 border-b-2 border-b-cyan-500" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Award className="w-4 h-4" />
                <span>ECG Quiz TEST</span>
              </button>

              <button
                onClick={() => setSidebarTab("report")}
                className={`py-3.5 transition-all font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                  sidebarTab === "report" 
                    ? "bg-slate-900/40 text-cyan-400 border-b-2 border-b-cyan-500" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Lab Sheet Maker</span>
              </button>
            </div>

            {/* TAB CONTENTS CONTAINER */}
            <div className="p-5" id="workspace-sidebar-body">
              
              {/* TAB 1: QUIZ ASSESSMENTS */}
              {sidebarTab === "quiz" && (
                <div className="animate-fade-in text-xs space-y-4">
                  
                  {quizComplete ? (
                    <div className="p-4 rounded-xl bg-slate-950 text-center space-y-3.5">
                      <span className="text-3xl block">🎓</span>
                      <h4 className="font-bold text-slate-100 font-sans text-sm">ECG Assessment Finished</h4>
                      
                      <div className="py-2.5 rounded bg-slate-900/45 border border-slate-800">
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">Correct accuracy</span>
                        <strong className="text-3xl font-mono text-cyan-400 block">{Math.round((quizScore / DIAGNOSTIC_CHALLENGES.length) * 100)}%</strong>
                        <span className="text-slate-400">{quizScore} Correct of {DIAGNOSTIC_CHALLENGES.length} challenges</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleRestartQuiz}
                          className="flex-1 py-2 bg-rose-500 hover:bg-rose-450 text-white font-bold font-mono rounded-lg transition-all cursor-pointer"
                        >
                          Retry Test
                        </button>
                        <button
                          onClick={() => setSidebarTab("report")}
                          className="flex-1 py-2 bg-slate-905 border border-slate-800 hover:bg-slate-850 text-slate-300 font-mono rounded-lg transition-all cursor-pointer"
                        >
                          Go to Lab report
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase">
                        <span>Pattern Quiz {quizIdx + 1}/{DIAGNOSTIC_CHALLENGES.length}</span>
                        <span className="text-emerald-400">Score: {quizScore}</span>
                      </div>

                      <p className="text-slate-300 font-sans leading-relaxed text-xs">
                        {DIAGNOSTIC_CHALLENGES[quizIdx].question}
                      </p>

                      {/* Display helpful hints trigger */}
                      {!showQuizHint ? (
                        <button
                          onClick={() => setShowQuizHint(true)}
                          className="text-[10px] text-slate-500 hover:text-slate-305 underline font-mono cursor-pointer"
                        >
                          💡 Wave diagnostic clue...
                        </button>
                      ) : (
                        <div className="p-2.5 rounded bg-slate-950 border border-slate-900 text-[10px] text-slate-400 leading-relaxed font-mono">
                          <strong className="text-slate-350">ECG Clue:</strong>
                          {DIAGNOSTIC_CHALLENGES[quizIdx].hints.map((h, hIdx) => (
                            <p key={hIdx} className="mt-0.5">• {h}</p>
                          ))}
                        </div>
                      )}

                      {/* Quiz Options */}
                      <div className="space-y-1.5 pt-1">
                        {DIAGNOSTIC_CHALLENGES[quizIdx].options.map((opt, oIdx) => {
                          const chosen = quizSelected === oIdx;
                          const correct = DIAGNOSTIC_CHALLENGES[quizIdx].correctIdx === oIdx;

                          let btnStyle = "bg-slate-950 border-slate-900 hover:border-slate-850 text-slate-350 hover:bg-slate-900";
                          if (chosen) btnStyle = "bg-cyan-955/20 border-cyan-500 text-cyan-300 font-semibold";
                          if (quizSubmitted) {
                            if (correct) {
                              btnStyle = "bg-emerald-955/35 border-emerald-500 text-emerald-400 font-bold";
                            } else if (chosen) {
                              btnStyle = "bg-rose-955/30 border-rose-500 text-rose-450";
                            } else {
                              btnStyle = "bg-slate-950 border-slate-900 text-slate-650 opacity-40 cursor-not-allowed";
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={quizSubmitted}
                              onClick={() => setQuizSelected(oIdx)}
                              className={`w-full p-2.5 rounded-xl border text-left text-[11px] transition-all flex items-center justify-between ${btnStyle} ${!quizSubmitted ? "cursor-pointer" : ""}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && correct && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Actions emit submit */}
                      {!quizSubmitted ? (
                        <button
                          onClick={handleQuizAnswerSubmit}
                          disabled={quizSelected === null}
                          className={`w-full py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold rounded-lg font-mono tracking-tight text-center transition-all ${
                            quizSelected !== null ? "cursor-pointer" : "opacity-40 cursor-not-allowed"
                          }`}
                        >
                          DIAGNOSE PATIENT PULSE
                        </button>
                      ) : (
                        <div className="space-y-2.5">
                          <div className="p-3 rounded bg-slate-950 border border-slate-900 text-[10px] text-slate-400 leading-relaxed">
                            <strong className="text-amber-500 block font-mono mb-0.5">LEARNING RATIONALE:</strong>
                            {DIAGNOSTIC_CHALLENGES[quizIdx].rationale}
                          </div>
                          <button
                            onClick={handleNextQuizQuestion}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold font-mono rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <span>CONTINUE STUDY</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              )}

              {/* TAB 2: REGISTER LAB REPORTS FORM */}
              {sidebarTab === "report" && (
                <div className="animate-fade-in text-xs space-y-4">
                  
                  <span className="text-[10px] font-mono text-slate-500 tracking-wider block uppercase">ECG Medical Emitter Profile</span>
                  
                  <form onSubmit={handleGenerateReport} className="space-y-3">
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="text-[9px] font-mono text-slate-500 uppercase block mb-1">ALEX MERCER (NAME):</label>
                        <input
                          type="text"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          className="w-full text-xs font-mono bg-slate-950 border border-slate-900 rounded p-1.5 focus:outline-none focus:border-cyan-500 text-slate-350"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-mono text-slate-500 uppercase block mb-1">AGE:</label>
                        <input
                          type="number"
                          value={patientAge}
                          onChange={(e) => setPatientAge(parseInt(e.target.value) || 22)}
                          className="w-full text-xs font-mono bg-slate-950 border border-slate-900 rounded p-1.5 focus:outline-none text-slate-350"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-mono text-slate-500 uppercase block mb-1">LAB PRACTIFIER NOTES (OBSERVATIONS):</label>
                      <textarea
                        value={clinicalNotes}
                        onChange={(e) => setClinicalNotes(e.target.value)}
                        rows={3}
                        className="w-full text-xs font-mono bg-slate-950 border border-slate-900 rounded p-1.5 focus:outline-none text-slate-350 resize-none leading-tight"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 font-bold font-mono rounded-lg transition-all cursor-pointer"
                    >
                      EMIT CALIBRATED LAB SHEET
                    </button>

                  </form>

                  {/* Generated result showcase */}
                  {generatedReport && (
                    <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl space-y-2.5 text-[10px] font-mono animate-fade-in relative z-10" id="generated-report-result">
                      <div className="flex justify-between items-center border-b border-slate-900 pb-1.5 text-slate-500 text-[9px]">
                        <span className="text-emerald-400 font-bold">{generatedReport.serial}</span>
                        <button 
                          onClick={() => setGeneratedReport(null)}
                          className="text-slate-500 hover:text-slate-300 underline"
                        >
                          DISMISS
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-y-1 text-slate-450 leading-snug">
                        <span>Patient:</span>
                        <strong className="text-slate-200">{generatedReport.name}</strong>
                        
                        <span>Age:</span>
                        <strong className="text-slate-200">{generatedReport.age} Years</strong>

                        <span>Diagnosed Wave:</span>
                        <strong className="text-cyan-400">{generatedReport.rhythm}</strong>

                        <span>Observed Pace:</span>
                        <strong className="text-rose-450">{generatedReport.observedBpm}</strong>

                        <span>Signal Index:</span>
                        <strong className="text-orange-400">{generatedReport.status}</strong>
                      </div>

                      <div className="pt-2 border-t border-slate-900">
                        <span className="text-[8px] text-slate-500 block mb-0.5 uppercase">Clinical observations notes:</span>
                        <div className="p-2 bg-slate-900 rounded border border-slate-850 text-slate-350">
                          {generatedReport.notes}
                        </div>
                      </div>

                      <div className="text-[7.5px] text-slate-600 text-center uppercase pt-1 border-t border-slate-900/60 leading-none">
                        * university MV learning copy only. No diagnostic liability applies.
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
