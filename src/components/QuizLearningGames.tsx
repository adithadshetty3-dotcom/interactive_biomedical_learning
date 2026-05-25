import React, { useState, useEffect, useRef } from "react";
import { 
  Award, 
  HelpCircle, 
  Activity, 
  Cpu, 
  Clock, 
  Zap, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Brain,
  Pause, 
  RotateCcw, 
  Trophy, 
  Stethoscope, 
  AlertOctagon, 
  ShieldCheck, 
  UserPlus, 
  RefreshCw,
  ZapOff,
  Dna,
  Check,
  ChevronRight,
  Info,
  Sliders,
  Volume2,
  VolumeX,
  Target,
  Sparkles,
  Heart
} from "lucide-react";

// Types
type ActiveTabType = "anatomy" | "ecg" | "match" | "scenario" | "rapid";

export interface QuizLearningGamesProps {
  xp: number;
  setXp: React.Dispatch<React.SetStateAction<number>>;
  streak: number;
  setStreak: React.Dispatch<React.SetStateAction<number>>;
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Badge {
  id: string;
  name: string;
  desc: string;
  emoji: string;
  unlockedAtXP: number;
  condition: string;
}

const BADGES: Badge[] = [
  { id: "explorer", name: "Biomedical Explorer", desc: "Embark on cardiology medical technology training.", emoji: "🧭", unlockedAtXP: 100, condition: "Accumulate 100 XP" },
  { id: "expert", name: "ECG Wave Specialist", desc: "Successfully match abnormal heart waves under clinical speed tests.", emoji: "⚡", unlockedAtXP: 300, condition: "Accumulate 300 XP" },
  { id: "match", name: "Anatomical Weaver", desc: "Perfect match score in neural-anatomical signal mapping.", emoji: "🧬", unlockedAtXP: 600, condition: "Accumulate 600 XP" },
  { id: "triage", name: "ER Triage Commander", desc: "Achieve rapid life-saving diagnostics in emergency operations.", emoji: "🚨", unlockedAtXP: 1000, condition: "Accumulate 1000 XP" },
  { id: "master", name: "Master Cardiologist", desc: "Acquire the complete master medical certificate.", emoji: "👑", unlockedAtXP: 1500, condition: "Accumulate 1500 XP" }
];

// --- 1. Heart Anatomy Quiz Data ---
interface AnatomyQuestion {
  question: string;
  options: string[];
  correctIdx: number;
  rationale: string;
}

const ANATOMY_QUESTIONS: AnatomyQuestion[] = [
  {
    question: "Which specific heart chamber receives oxygen-poor (deoxygenated) blood first as it returns from systemic circulation?",
    options: ["Left Ventricle (LV)", "Left Atrium (LA)", "Right Atrium (RA)", "Right Ventricle (RV)"],
    correctIdx: 2,
    rationale: "Deoxygenated blood returns from the upper and lower body via the superior and inferior vena cava veins and empties directly into the Right Atrium."
  },
  {
    question: "The bicuspid (mitral) valve is positioned between which two sections of the cardiac vascular system?",
    options: [
      "The Right Atrium and Right Ventricle",
      "The Left Atrium and Left Ventricle",
      "The Left Ventricle and the Aorta Arch",
      "The Right Ventricle and the Pulmonary Artery"
    ],
    correctIdx: 1,
    rationale: "The bicuspid input valve sits strictly between the Left Atrium and high-pressure Left Ventricle, sealing tightly during systole contraction."
  },
  {
    question: "Why is the myocardial muscle wall of the Left Ventricle dramatically thicker than the Right Ventricle?",
    options: [
      "It coordinates pulmonary blood flow to nearby lung lobes.",
      "It is built to endure systemic vascular resistance and pump blood continuously to the entire body.",
      "It holds twice the volume of venous blood than the right atrium.",
      "It protects the coronary artery from back-ventilation leaks."
    ],
    correctIdx: 1,
    rationale: "The Right Ventricle only pumps to nearby lungs with low resistance. The Left Ventricle must squeeze with immense muscular force to feed organs, muscles, and the brain."
  },
  {
    question: "Which of the following vessels is unique because it is an artery that transports oxygen-depleted (blue) blood?",
    options: ["Aorta", "Pulmonary Artery", "Jugular Vein", "Pulmonary Vein"],
    correctIdx: 1,
    rationale: "The Pulmonary Artery leaves the RV carrying deoxygenated blood to the lungs. Although it's an artery (carries blood away from the heart), its blood is carbon dioxide-heavy."
  },
  {
    question: "What micro-structure is directly responsible for preventing deoxygenated blood from backing up into the Right Atrium?",
    options: ["Mitral Valve", "Tricuspid Valve", "Sinoatrial Pacemaker Node", "Aortic Valve"],
    correctIdx: 1,
    rationale: "The Tricuspid Valve acts as a one-way checkpoint between the Right Atrium and Ventricle, closing with a snapshot sound to block backward blood regurgitation."
  }
];

// --- 2. ECG waves data ---
const ECG_WAVE_TYPES = [
  { id: "normal", name: "Normal Sinus Rhythm", bpm: "72 BPM", desc: "Rhythm is perfectly regular, spaced evenly, representing coordinated nodal propagation.", soundFreq: 440 },
  { id: "tachycardia", name: "Sinus Tachycardia", bpm: "145 BPM", desc: "Extremely fast contractions. Squeeze loops compress wave distances making intervals narrow.", soundFreq: 580 },
  { id: "bradycardia", name: "Sinus Bradycardia", bpm: "38 BPM", desc: "Extremely slow pulse. Massive resting gap stretches flatline baselines.", soundFreq: 320 },
  { id: "arrhythmia", name: "Atrial Fibrillation (AFib)", bpm: "Uneven (70-130 BPM)", desc: "Chaotic random electrical quivers inside the heart's upper atria. Peaks are random.", soundFreq: 480 }
];

// --- 3. Match the Function Data ---
interface MatchItem {
  id: string;
  sourceText: string;
  targetId: string;
  targetText: string;
}

const MATCHING_DATA: MatchItem[] = [
  { id: "sa_node", sourceText: "SA Node", targetId: "target_sa", targetText: "Natural cardiac pacemaker initiating sinus impulses" },
  { id: "left_vent", sourceText: "Left Ventricle", targetId: "target_lv", targetText: "Thick muscle champion pumping fresh blood to systemic organs" },
  { id: "pacemaker", sourceText: "Electronic Pacemaker", targetId: "target_pm", targetText: "Surgical implant emitting tiny pulses to reverse slow pulse" },
  { id: "defibrillator", sourceText: "Biphasic Defibrillator (AED)", targetId: "target_defib", targetText: "Delivers energetic electric shock to interrupt chaotic V-Fib" }
];

// --- 4. Simulation Quiz Scenarios ---
interface Scenario {
  id: string;
  title: string;
  problem: string;
  initialWave: string; // normal, slow, fast, chaotic
  options: string[];
  correctIdx: number;
  resultWave: string; // normal, fast
  explanation: string;
  clinicalOutcome: string;
}

const CLINI_SCENARIOS: Scenario[] = [
  {
    id: "sc_brady",
    title: "Scenario: Sinus Bradycardia Collapse",
    problem: "A 74-year-old grandfather falls unconscious due to sudden cerebral perfusion deprivation. The cardiac monitor reports sinus intervals stretched to 30 BPM.",
    initialWave: "bradycardia",
    options: [
      "Place an emergency coronary stent",
      "Administer insulin and apply cooling packs",
      "Implant an electronic pacemaker to pulse the rate up",
      "Deliver a high-voltage biphasic defibrillation shock"
    ],
    correctIdx: 2,
    resultWave: "normal",
    explanation: "Electronic pacemakers detect when the natural SA Node rates fall beneath a customized threshold, introducing micro-shocks to pace ventricles dynamically back to a steady 70 BPM.",
    clinicalOutcome: "Electrically paced pulse immediately restores sound pressure, and the patient reawakens."
  },
  {
    id: "sc_stent",
    title: "Scenario: Coronary Vessel Blockage",
    problem: "A clinical patient experiences tight squeezing chest pain radiating down their left arm. ECG records massive ST-elevation indicating acute myocardial infarction (Heart Attack).",
    initialWave: "arrhythmia",
    options: [
      "Deploy localized coronary angioplasty & stent",
      "Perform a rapid carotid sinus vagal massage",
      "Attach a temporary mechanical rate-pacemaker",
      "Inject local anesthetic blocks to alleviate pain"
    ],
    correctIdx: 0,
    resultWave: "normal",
    explanation: "Angioplasty expands a miniature balloon inside the plaque-clogged coronary artery, leaving a metal stent to restore blood supply directly to the dying heart muscle.",
    clinicalOutcome: "Ischemia resolves. ECG normalizes, and heart muscle death is averted."
  },
  {
    id: "sc_vfib",
    title: "Scenario: Sudden Chaotic V-Fib Arrest",
    problem: "In the intensive care unit, a patient's arterial line drops to zero. Monitor shows Ventricular Fibrillation (V-Fib) - a wild, erratic, trembling static with no distinct complexes.",
    initialWave: "chaotic",
    options: [
      "Give high-dose intravenous beta-blocker drug",
      "Execute immediate DC defibrillator shock therapy",
      "Perform emergency heart valve replacement",
      "Insert an intra-aortic balloon catheter pump"
    ],
    correctIdx: 1,
    resultWave: "normal",
    explanation: "Ventricular fibrillation is fatal within minutes. An immediate electric shock from a defibrillator stops all chaotic, conflicting electric circles simultaneously, allowing the SA Pacemaker to take charge again.",
    clinicalOutcome: "Synchronized normal cardiac timing is restored. A vital pulse returns!"
  }
];

// --- 5. Rapid Emergency Challenges ---
interface EmergencyCase {
  id: string;
  situation: string;
  monitorWave: string; // fast, slow, chaotic, normal
  alarmMessage: string;
  buttons: { text: string; correct: boolean }[];
  soundType: "warning" | "fast_warning" | "flatline";
}

const EMERGENCY_CHALLENGES: EmergencyCase[] = [
  {
    id: "er_1",
    situation: "V-Fib cardiac arrest detected! Patient is unresponsive with chaotic twitching currents and no blood pressure!",
    monitorWave: "chaotic",
    alarmMessage: "RED ALERT: VENTRICULAR FIBRILLATION",
    buttons: [
      { text: "Inject Sedatives", correct: false },
      { text: "Charge & Deliver AED Shock", correct: true },
      { text: "Implant Stent Tube", correct: false },
      { text: "Massage Carotid Artery", correct: false }
    ],
    soundType: "flatline"
  },
  {
    id: "er_2",
    situation: "Patient's heart rate spiked suddenly to 180 BPM at rest. Chest is pounding, feeling extremely dizzy and short of breath!",
    monitorWave: "tachycardia",
    alarmMessage: "YELLOW ALERT: SEVERE TACHYCARDIA",
    buttons: [
      { text: "Deliver Extreme DC AED Shock", correct: false },
      { text: "Apply Vagal Maneuver & Beta-Blockers", correct: true },
      { text: "Administer Glucose Squeeze", correct: false },
      { text: "Attach Pacemaker Wires", correct: false }
    ],
    soundType: "fast_warning"
  },
  {
    id: "er_3",
    situation: "Sinoatrial output failed! Rhythm has flattened to 22 BPM. The brain and vital tissues are suffering severe hypoxia!",
    monitorWave: "bradycardia",
    alarmMessage: "RED ALERT: PROFOUND BRADYCARDIA / ARREST",
    buttons: [
      { text: "Give Sleeping Sedatives", correct: false },
      { text: "Inject Epinephrine & Pace Electrically", correct: true },
      { text: "Deliver Anti-Arrythmic Blood Thinner", correct: false },
      { text: "Perform Cardiopulmonary Angioplasty", correct: false }
    ],
    soundType: "warning"
  }
];

export default function QuizLearningGames({ xp, setXp, streak, setStreak, soundEnabled, setSoundEnabled }: QuizLearningGamesProps) {
  const [activeTab, setActiveTab] = useState<ActiveTabType>("anatomy");
  
  // High-score metrics loaded from memory or simulation state
  const [highStreak, setHighStreak] = useState<number>(0);

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

  // Add Dynamic reward alert state
  const [awardAlert, setAwardAlert] = useState<{ badge: Badge } | null>(null);

  const gainXP = (amount: number) => {
    setXp((prev) => {
      const nextXP = prev + amount;
      // Evaluate if badges are unlocked
      BADGES.forEach((badge) => {
        if (prev < badge.unlockedAtXP && nextXP >= badge.unlockedAtXP) {
          playPulseSound("correct");
          setAwardAlert({ badge });
        }
      });
      return nextXP;
    });
  };

  const currentLevel = Math.floor(xp / 500) + 1;
  const xpInCurrentLevel = xp % 500;
  const progressToNextLevel = (xpInCurrentLevel / 500) * 100;

  // --------------------------------------------------
  // GAME MODULE 1: Anatomy Quiz State Block
  // --------------------------------------------------
  const [anatomyIdx, setAnatomyIdx] = useState<number>(0);
  const [anatomyAnswer, setAnatomyAnswer] = useState<number | null>(null);
  const [anatomySubmitted, setAnatomySubmitted] = useState<boolean>(false);
  const [anatomyScore, setAnatomyScore] = useState<number>(0);
  const [anatomyComplete, setAnatomyComplete] = useState<boolean>(false);

  const handleAnatomyAnswerSubmit = () => {
    if (anatomyAnswer === null || anatomySubmitted) return;
    setAnatomySubmitted(true);
    const correct = ANATOMY_QUESTIONS[anatomyIdx].correctIdx;
    if (anatomyAnswer === correct) {
      playPulseSound("correct");
      setAnatomyScore((prev) => prev + 1);
      gainXP(80);
    } else {
      playPulseSound("wrong");
    }
  };

  const handleNextAnatomyQuestion = () => {
    setAnatomyAnswer(null);
    setAnatomySubmitted(false);
    if (anatomyIdx < ANATOMY_QUESTIONS.length - 1) {
      setAnatomyIdx((prev) => prev + 1);
    } else {
      setAnatomyComplete(true);
    }
  };

  const resetAnatomyQuiz = () => {
    setAnatomyIdx(0);
    setAnatomyAnswer(null);
    setAnatomySubmitted(false);
    setAnatomyScore(0);
    setAnatomyComplete(false);
  };

  // --------------------------------------------------
  // GAME MODULE 2: ECG Identification Game State
  // --------------------------------------------------
  const [ecgDifficulty, setEcgDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [ecgCurrentWave, setEcgCurrentWave] = useState<string>("normal");
  const [ecgSelectedAnswer, setEcgSelectedAnswer] = useState<string | null>(null);
  const [ecgSubmitted, setEcgSubmitted] = useState<boolean>(false);
  const [ecgStreak, setEcgStreak] = useState<number>(0);
  // Timer challenge (15s Easy, 10s Medium, 6s Hard)
  const [ecgTimeLeft, setEcgTimeLeft] = useState<number>(15);
  const [ecgIsRunning, setEcgIsRunning] = useState<boolean>(false);
  const ecgTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerNewEcgWave = () => {
    const waves = ["normal", "tachycardia", "bradycardia", "arrhythmia"];
    // Choose one that is different if possible, or random
    const idx = Math.floor(Math.random() * waves.length);
    setEcgCurrentWave(waves[idx]);
    setEcgSelectedAnswer(null);
    setEcgSubmitted(false);
    
    // Reset individual timer
    const timeLimit = ecgDifficulty === "easy" ? 15 : ecgDifficulty === "medium" ? 10 : 6;
    setEcgTimeLeft(timeLimit);
    setEcgIsRunning(true);
  };

  // Sync Timer countdown
  useEffect(() => {
    if (!ecgIsRunning || ecgSubmitted || activeTab !== "ecg") {
      if (ecgTimerRef.current) clearInterval(ecgTimerRef.current);
      return;
    }

    ecgTimerRef.current = setInterval(() => {
      setEcgTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(ecgTimerRef.current!);
          handleEcgTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (ecgTimerRef.current) clearInterval(ecgTimerRef.current);
    };
  }, [ecgIsRunning, ecgSubmitted, ecgDifficulty, ecgCurrentWave, activeTab]);

  const handleEcgTimeout = () => {
    setEcgSubmitted(true);
    playPulseSound("wrong");
    setEcgStreak(0);
  };

  const handleEcgAnswerSubmit = (value: string) => {
    if (ecgSubmitted) return;
    setEcgSelectedAnswer(value);
    setEcgSubmitted(true);
    setEcgIsRunning(false);

    if (value === ecgCurrentWave) {
      playPulseSound("correct");
      const multiplier = ecgDifficulty === "easy" ? 60 : ecgDifficulty === "medium" ? 90 : 130;
      const streakBonus = Math.min(ecgStreak * 10, 50);
      gainXP(multiplier + streakBonus);
      
      const newStreak = ecgStreak + 1;
      setEcgStreak(newStreak);
      if (newStreak > highStreak) {
        setHighStreak(newStreak);
      }
    } else {
      playPulseSound("wrong");
      setEcgStreak(0);
    }
  };

  // Oscilloscope graph loop for visual ECG
  const ecgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ecgScrollOffsetRef = useRef<number>(0);
  
  useEffect(() => {
    const canvas = ecgCanvasRef.current;
    if (!canvas || activeTab !== "ecg") return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let localOffset = 0;

    const getPQRSTValue = (x: number, cycle: number) => {
      const normX = x % cycle;
      let val = 0;

      const pStart = 4;
      const pW = 10;
      const qStart = 18;
      const rStart = 22;
      const sStart = 26;
      const tStart = 38;
      const tW = 14;

      if (normX >= pStart && normX < pStart + pW) {
        val = Math.sin(((normX - pStart) / pW) * Math.PI) * 11;
      } else if (normX >= qStart && normX < rStart) {
        val = -((normX - qStart) / (rStart - qStart)) * 14;
      } else if (normX >= rStart && normX < sStart) {
        const progress = (normX - rStart) / (sStart - rStart);
        if (progress < 0.4) {
          val = -14 + (progress / 4) * 980;
        } else {
          val = 84 - ((progress - 0.4) / 0.6) * 110;
        }
      } else if (normX >= sStart && normX < sStart + 5) {
        val = -26 + ((normX - sStart) / 5) * 26;
      } else if (normX >= tStart && normX < tStart + tW) {
        val = Math.sin(((normX - tStart) / tW) * Math.PI) * 19;
      }

      // Add micro static noise
      val += (Math.sin(x * 0.2) * 0.8 + (Math.random() - 0.5) * 0.9);
      
      // Add background hard noise if hard mode is enabled
      if (ecgDifficulty === "hard") {
        val += (Math.random() - 0.5) * 4.5;
      }
      
      return val;
    };

    const render = () => {
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Medical diagnostics red block lines grids
      ctx.strokeStyle = "rgba(239, 68, 68, 0.05)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < canvas.width; x += 10) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 10) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      ctx.strokeStyle = "rgba(239, 68, 68, 0.16)";
      ctx.lineWidth = 1.0;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      ctx.beginPath();
      ctx.strokeStyle = "#f43f5e"; // Glowing red wave theme
      ctx.lineWidth = 2.4;
      ctx.shadowBlur = 6;
      ctx.shadowColor = "rgba(244, 63, 94, 0.65)";
      ctx.lineJoin = "round";

      localOffset += 1.35; // pacing rate speed

      let cycle = 120;
      if (ecgCurrentWave === "tachycardia") cycle = 50;
      else if (ecgCurrentWave === "bradycardia") cycle = 240;

      const baselineY = canvas.height / 2 + 10;
      const gaps = [70, 130, 200, 80, 140, 220, 95];

      for (let sx = 0; sx < canvas.width; sx++) {
        const tIndex = sx + localOffset;
        let yOff = 0;

        if (ecgCurrentWave === "arrhythmia") {
          const idx = Math.floor(tIndex / 150) % gaps.length;
          const randomCycle = gaps[idx];
          const innerCycle = tIndex % randomCycle;
          yOff = getPQRSTValue(innerCycle, randomCycle);
          if (idx % 3 === 0) yOff *= 0.55;
        } else {
          yOff = getPQRSTValue(tIndex, cycle);
        }

        const sy = baselineY - yOff;
        if (sx === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
      frameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [ecgCurrentWave, ecgDifficulty, activeTab]);

  // Audio heartbeat sounds loop synchronized with difficulty waves
  useEffect(() => {
    if (activeTab !== "ecg" || ecgSubmitted) return;

    let timeDelay = 830;
    if (ecgCurrentWave === "tachycardia") timeDelay = 415;
    else if (ecgCurrentWave === "bradycardia") timeDelay = 1580;
    else if (ecgCurrentWave === "arrhythmia") timeDelay = 450 + Math.random() * 600;

    const interval = setTimeout(() => {
      playPulseSound("lub-dub");
    }, timeDelay);

    return () => clearTimeout(interval);
  }, [ecgCurrentWave, activeTab, ecgSubmitted]);

  // Start initial trigger on loading Tab
  useEffect(() => {
    if (activeTab === "ecg") {
      triggerNewEcgWave();
    }
  }, [activeTab, ecgDifficulty]);

  // --------------------------------------------------
  // GAME MODULE 3: Match the Function (Connection Game)
  // --------------------------------------------------
  const [matchSelectedLeft, setMatchSelectedLeft] = useState<string | null>(null);
  const [matchSelectedRight, setMatchSelectedRight] = useState<string | null>(null);
  const [matchLinks, setMatchLinks] = useState<Record<string, string>>({}); // maps leftId -> rightTargetId
  const [matchSubmitted, setMatchSubmitted] = useState<boolean>(false);
  const [matchGrade, setMatchGrade] = useState<{ score: number; perfect: boolean } | null>(null);

  // Random columns sorting state to make connection interesting
  const [leftKeys, setLeftKeys] = useState<string[]>([]);
  const [rightTargets, setRightTargets] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    if (activeTab === "match") {
      // Shuffle lists on entry to provide a fresh quiz feeling
      const shuffledLeft = [...MATCHING_DATA].map(i => i.id).sort(() => Math.random() - 0.5);
      const shuffledRight = [...MATCHING_DATA].map(i => ({ id: i.targetId, text: i.targetText })).sort(() => Math.random() - 0.5);
      setLeftKeys(shuffledLeft);
      setRightTargets(shuffledRight);
      setMatchSelectedLeft(null);
      setMatchSelectedRight(null);
      setMatchLinks({});
      setMatchSubmitted(false);
      setMatchGrade(null);
    }
  }, [activeTab]);

  const handleLeftSelect = (leftId: string) => {
    if (matchSubmitted) return;
    setMatchSelectedLeft(leftId);
    
    // If we already selected a right target, let's link them!
    if (matchSelectedRight) {
      applyMatchLink(leftId, matchSelectedRight);
    }
  };

  const handleRightSelect = (targetId: string) => {
    if (matchSubmitted) return;
    setMatchSelectedRight(targetId);

    // If we already selected a left source, let's link them!
    if (matchSelectedLeft) {
      applyMatchLink(matchSelectedLeft, targetId);
    }
  };

  const applyMatchLink = (leftId: string, rightTargetId: string) => {
    playPulseSound("alarm");
    setMatchLinks((prev) => {
      const copy = { ...prev };
      // Clear previous links mapping to the same target if they existed
      Object.keys(copy).forEach((key) => {
        if (copy[key] === rightTargetId) {
          delete copy[key];
        }
      });
      copy[leftId] = rightTargetId;
      return copy;
    });
    setMatchSelectedLeft(null);
    setMatchSelectedRight(null);
  };

  const clearLeftSelection = (leftId: string) => {
    if (matchSubmitted) return;
    setMatchLinks((prev) => {
      const copy = { ...prev };
      delete copy[leftId];
      return copy;
    });
  };

  const verifyMatchingConnections = () => {
    if (matchSubmitted) return;
    setMatchSubmitted(true);
    let correctCount = 0;

    MATCHING_DATA.forEach((item) => {
      const linkedTarget = matchLinks[item.id];
      if (linkedTarget === item.targetId) {
        correctCount++;
      }
    });

    const isPerfect = correctCount === MATCHING_DATA.length;
    if (isPerfect) {
      playPulseSound("correct");
      gainXP(200);
    } else {
      playPulseSound("wrong");
      gainXP(correctCount * 30);
    }
    setMatchGrade({ score: correctCount, perfect: isPerfect });
  };

  // --------------------------------------------------
  // GAME MODULE 4: Scenario Simulation Quiz ("What Happens If...")
  // --------------------------------------------------
  const [scenIdx, setScenIdx] = useState<number>(0);
  const [scenSelected, setScenSelected] = useState<number | null>(null);
  const [scenSubmitted, setScenSubmitted] = useState<boolean>(false);
  const [scenResolved, setScenResolved] = useState<boolean>(false);
  
  // Scen dynamic canvas ref
  const scenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = scenCanvasRef.current;
    if (!canvas || activeTab !== "scenario") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let localOffset = 0;

    const getPQRSTValue = (x: number, cycle: number) => {
      const normX = x % cycle;
      let val = 0;
      const pStart = 4;
      const pW = 10;
      const qStart = 18;
      const rStart = 22;
      const sStart = 26;
      const tStart = 38;
      const tW = 14;

      if (normX >= pStart && normX < pStart + pW) {
        val = Math.sin(((normX - pStart) / pW) * Math.PI) * 11;
      } else if (normX >= qStart && normX < rStart) {
        val = -((normX - qStart) / (rStart - qStart)) * 14;
      } else if (normX >= rStart && normX < sStart) {
        const progress = (normX - rStart) / (sStart - rStart);
        if (progress < 0.4) {
          val = -14 + (progress / 4) * 980;
        } else {
          val = 84 - ((progress - 0.4) / 0.6) * 110;
        }
      } else if (normX >= sStart && normX < sStart + 5) {
        val = -26 + ((normX - sStart) / 5) * 26;
      } else if (normX >= tStart && normX < tStart + tW) {
        val = Math.sin(((normX - tStart) / tW) * Math.PI) * 19;
      }
      return val + (Math.sin(x * 0.15) * 0.8 + (Math.random() - 0.5) * 0.8);
    };

    const render = () => {
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Hospital matrix line trace
      ctx.strokeStyle = "rgba(6, 182, 212, 0.05)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < canvas.width; x += 10) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 10) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
      ctx.strokeStyle = "rgba(6, 182, 212, 0.12)";
      ctx.lineWidth = 1.0;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      ctx.beginPath();
      // Green cyan neon gradient wave look
      ctx.strokeStyle = scenResolved ? "#10b981" : "#f43f5e";
      ctx.lineWidth = 2.4;
      ctx.shadowBlur = 6;
      ctx.shadowColor = scenResolved ? "rgba(16, 185, 129, 0.6)" : "rgba(244, 63, 94, 0.6)";

      localOffset += 1.35;

      const activeScenario = CLINI_SCENARIOS[scenIdx];
      let cycle = 120; // Default

      if (!scenResolved) {
        if (activeScenario.initialWave === "bradycardia") cycle = 260;
        else if (activeScenario.initialWave === "arrhythmia") cycle = 85;
        else if (activeScenario.initialWave === "chaotic") cycle = 40; // V-Fib fast static
      } else {
        // Recovered wave normal Sinux timing
        cycle = 110;
        // Paced heartbeat spike indicator (small vertical line if pacemaker was deployed!)
        if (activeScenario.id === "sc_brady") {
          ctx.font = "8px monospace";
          ctx.fillStyle = "#38bdf8";
          ctx.fillText("⚡ PACEMAKER STIM", 20, 30);
        }
      }

      const baselineY = canvas.height / 2 + 10;

      for (let sx = 0; sx < canvas.width; sx++) {
        const tIndex = sx + localOffset;
        let yOff = 0;

        if (!scenResolved && activeScenario.initialWave === "chaotic") {
          // Chaotic twitching V-Fib static wave (zero distinct peaks)
          yOff = (Math.sin(tIndex * 0.45) * 8) + (Math.sin(tIndex * 1.25) * 12) + ((Math.random() - 0.5) * 22);
        } else if (!scenResolved && activeScenario.initialWave === "arrhythmia") {
          // AFib irregular interval
          const innerCycle = tIndex % cycle;
          yOff = getPQRSTValue(innerCycle, cycle);
          if (sx % 120 > 80) yOff *= 0.35;
        } else {
          // Regular steady sinus wave
          const innerCycle = tIndex % cycle;
          yOff = getPQRSTValue(innerCycle, cycle);
        }

        // Apply artificial paced spike on paced wave
        if (scenResolved && activeScenario.id === "sc_brady" && tIndex % cycle < 5) {
          yOff += 45; // pace spike spark!
        }

        const sy = baselineY - yOff;
        if (sx === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
      frameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [scenIdx, scenResolved, activeTab]);

  const handleScenarioSubmit = () => {
    if (scenSelected === null || scenSubmitted) return;
    setScenSubmitted(true);
    const correct = CLINI_SCENARIOS[scenIdx].correctIdx;

    if (scenSelected === correct) {
      playPulseSound("correct");
      setScenResolved(true);
      gainXP(150);
    } else {
      playPulseSound("wrong");
    }
  };

  const handleNextScenario = () => {
    setScenSelected(null);
    setScenSubmitted(false);
    setScenResolved(false);
    setScenIdx((prev) => (prev + 1) % CLINI_SCENARIOS.length);
  };

  // Synchronized clinical scenario audio beeper
  useEffect(() => {
    if (activeTab !== "scenario" || scenSubmitted) return;
    
    const activeScenario = CLINI_SCENARIOS[scenIdx];
    let timing = 800;
    if (activeScenario.initialWave === "bradycardia") timing = 1800;
    else if (activeScenario.initialWave === "chaotic") timing = 380; // V-fib beep warnings

    const interval = setTimeout(() => {
      if (activeScenario.initialWave === "chaotic") {
        playPulseSound("flatline");
      } else {
        playPulseSound("lub-dub");
      }
    }, timing);

    return () => clearTimeout(interval);
  }, [scenIdx, activeTab, scenSubmitted]);

  // --------------------------------------------------
  // GAME MODULE 5: Rapid Emergency Mode (Timed Triage)
  // --------------------------------------------------
  const [rapidState, setRapidState] = useState<"idle" | "intro" | "active" | "win" | "fail">("idle");
  const [rapidCaseIdx, setRapidCaseIdx] = useState<number>(0);
  const [rapidTimeLeft, setRapidTimeLeft] = useState<number>(10);
  const [rapidScore, setRapidScore] = useState<number>(0);
  const rapidCdownRef = useRef<NodeJS.Timeout | null>(null);

  const startRapidTriage = () => {
    playPulseSound("correct");
    setRapidScore(0);
    setRapidCaseIdx(0);
    setRapidState("active");
    triggerNewRapidCase(0);
  };

  const triggerNewRapidCase = (index: number) => {
    setRapidCaseIdx(index);
    setRapidTimeLeft(10); // 10 seconds total to handle triage case!
  };

  // Rapid countdown effect
  useEffect(() => {
    if (activeTab !== "rapid" || rapidState !== "active") {
      if (rapidCdownRef.current) clearInterval(rapidCdownRef.current);
      return;
    }

    rapidCdownRef.current = setInterval(() => {
      setRapidTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(rapidCdownRef.current!);
          handleRapidFailure();
          return 0;
        }
        playPulseSound("alarm"); // Warning beat click sound
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (rapidCdownRef.current) clearInterval(rapidCdownRef.current);
    };
  }, [rapidState, rapidCaseIdx, activeTab]);

  const handleRapidFailure = () => {
    playPulseSound("wrong");
    setRapidState("fail");
  };

  const handleRapidChoiceClick = (correct: boolean) => {
    if (rapidState !== "active") return;

    if (correct) {
      playPulseSound("correct");
      const savedScore = rapidScore + 1;
      setRapidScore(savedScore);
      gainXP(120);

      if (rapidCaseIdx < EMERGENCY_CHALLENGES.length - 1) {
        triggerNewRapidCase(rapidCaseIdx + 1);
      } else {
        // Win! Complete triage life saving
        setRapidState("win");
        gainXP(250); // Grand success bonus
      }
    } else {
      // Wrong clinical move drops flatline instantly!
      playPulseSound("wrong");
      setRapidState("fail");
    }
  };

  // Live Canvas Oscilloscope looping custom wave inside Rapid Emergency Card
  const rapidCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = rapidCanvasRef.current;
    if (!canvas || activeTab !== "rapid" || rapidState !== "active") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let offset = 0;

    const getPQRSTValue = (x: number, cycle: number) => {
      const normX = x % cycle;
      let val = 0;
      const pStart = 4;
      const pW = 10;
      const qStart = 18;
      const rStart = 22;
      const sStart = 26;
      const tStart = 38;
      const tW = 14;

      if (normX >= pStart && normX < pStart + pW) {
        val = Math.sin(((normX - pStart) / pW) * Math.PI) * 11;
      } else if (normX >= qStart && normX < rStart) {
        val = -((normX - qStart) / (rStart - qStart)) * 14;
      } else if (normX >= rStart && normX < sStart) {
        const progress = (normX - rStart) / (sStart - rStart);
        if (progress < 0.4) {
          val = -14 + (progress / 4) * 980;
        } else {
          val = 84 - ((progress - 0.4) / 0.6) * 110;
        }
      } else if (normX >= sStart && normX < sStart + 5) {
        val = -26 + ((normX - sStart) / 5) * 26;
      } else if (normX >= tStart && normX < tStart + tW) {
        val = Math.sin(((normX - tStart) / tW) * Math.PI) * 19;
      }
      return val + (Math.sin(x * 0.15) * 0.8 + (Math.random() - 0.5) * 0.8);
    };

    const render = () => {
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Flash neon red grids matching emergency
      ctx.strokeStyle = "rgba(239, 68, 68, 0.08)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < canvas.width; x += 10) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 10) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      ctx.strokeStyle = "rgba(239, 68, 68, 0.22)";
      ctx.lineWidth = 1.0;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      ctx.beginPath();
      ctx.strokeStyle = "#ef4444"; // Aggressive flashing red
      ctx.lineWidth = 2.6;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(239, 68, 68, 0.85)";

      offset += 1.85; // Faster sweep rate

      const currentCase = EMERGENCY_CHALLENGES[rapidCaseIdx];
      let cycle = 120;
      if (currentCase.monitorWave === "tachycardia") cycle = 45;
      else if (currentCase.monitorWave === "bradycardia") cycle = 260;

      const baselineY = canvas.height / 2 + 10;

      for (let sx = 0; sx < canvas.width; sx++) {
        const tIndex = sx + offset;
        let yOff = 0;

        if (currentCase.monitorWave === "chaotic") {
          yOff = (Math.sin(tIndex * 0.45) * 7) + (Math.sin(tIndex * 1.3) * 13) + ((Math.random() - 0.5) * 20);
        } else {
          yOff = getPQRSTValue(tIndex % cycle, cycle);
        }

        const sy = baselineY - yOff;
        if (sx === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
      frameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [rapidCaseIdx, rapidState, activeTab]);

  return (
    <div className="flex-grow flex flex-col gap-6 bg-slate-950 text-slate-100 p-4 md:p-6" id="quiz-learning-games-outer">
      
      {/* 1. BRANDED FUTURISTIC HEALTHCARE CONSOLE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-red-950/20 via-slate-900/40 to-cyan-950/20 p-5 rounded-2xl border border-slate-900 shadow-xl relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute -left-16 -top-16 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-16 -bottom-16 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-mono font-bold px-2.5 py-0.5 rounded tracking-wide uppercase">
              MODULE 4 ACTIVATED
            </span>
            <span className="text-xs text-slate-400 font-mono tracking-tight">// Interactive Cardiology Labs</span>
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans mt-1.5 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400 animate-pulse" />
            Curriculum Quiz & Learning Games
          </h2>
          
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Test your expertise. Master clinical wave assessments, matching, scenario-based pacing devices, and survive the rapid emergency triage test to earn badges!
          </p>
        </div>

        {/* SOUND FX SWITCHER AND RESET */}
        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              soundEnabled 
                ? "bg-cyan-950/40 border-cyan-500/60 text-cyan-400 font-mono shadow-md shadow-cyan-950/20" 
                : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-350"
            }`}
            title="Toggle heart beep synthesizers"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-cyan-405 animate-pulse" />
                <span className="text-[10px] font-mono leading-none">AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-650" />
                <span className="text-[10px] font-mono leading-none">MUTED</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => {
              setXp(0);
              setStreak(0);
              setHighStreak(0);
              playPulseSound("correct");
            }}
            className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-850 flex items-center justify-center gap-1 cursor-pointer transition-all text-xs font-mono"
            title="Reset overall progress XP"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[9px]">Reset XP</span>
          </button>
        </div>
      </div>

      {/* 2. DUAL-COLUMN WORKSPACE: DASHBOARD AND TABS METRICS */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* LEFT COLUMN: ACTIVE GAMEPLAY HUB (SPAN 3) */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          
          {/* THE FUTURISTIC NAVIGATOR SWITCHES */}
          <div className="bg-slate-900/60 p-1.5 rounded-2xl border border-slate-900 md:flex flex-wrap items-center justify-between gap-1 grid grid-cols-2 lg:grid-cols-5" id="futuristic-navigator-switches">
            
            <button
              onClick={() => setActiveTab("anatomy")}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all font-sans flex items-center gap-2.5 cursor-pointer ${
                activeTab === "anatomy"
                  ? "bg-gradient-to-r from-cyan-950/50 to-cyan-900/30 text-cyan-305 border border-cyan-500/40 shadow-md"
                  : "text-slate-450 hover:text-slate-250 border border-transparent"
              }`}
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>1. Anatomy Quiz</span>
            </button>

            <button
              onClick={() => setActiveTab("ecg")}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all font-sans flex items-center gap-2.5 cursor-pointer ${
                activeTab === "ecg"
                  ? "bg-gradient-to-r from-red-950/50 to-rose-900/30 text-rose-355 border border-rose-500/40 shadow-md"
                  : "text-slate-450 hover:text-slate-250 border border-transparent"
              }`}
            >
              <Activity className="w-4 h-4 shrink-0" />
              <span>2. ECG ID Wave</span>
            </button>

            <button
              onClick={() => setActiveTab("match")}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all font-sans flex items-center gap-2.5 cursor-pointer ${
                activeTab === "match"
                  ? "bg-gradient-to-r from-amber-950/50 to-amber-900/30 text-amber-355 border border-amber-500/40 shadow-md"
                  : "text-slate-450 hover:text-slate-250 border border-transparent"
              }`}
            >
              <Zap className="w-4 h-4 shrink-0" />
              <span>3. Match Functions</span>
            </button>

            <button
              onClick={() => setActiveTab("scenario")}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all font-sans flex items-center gap-2.5 cursor-pointer ${
                activeTab === "scenario"
                  ? "bg-gradient-to-r from-emerald-950/50 to-emerald-900/30 text-emerald-355 border border-emerald-500/40 shadow-md"
                  : "text-slate-450 hover:text-slate-250 border border-transparent"
              }`}
            >
              <Cpu className="w-4 h-4 shrink-0" />
              <span>4. Simulation Quiz</span>
            </button>

            <button
              onClick={() => setActiveTab("rapid")}
              className={`py-3 px-4 rounded-xl col-span-2 md:col-span-1 text-xs font-bold transition-all font-sans flex items-center justify-center md:justify-start gap-2.5 cursor-pointer ${
                activeTab === "rapid"
                  ? "bg-gradient-to-r from-red-950 to-rose-950 text-red-400 border border-red-500 animate-pulse shadow-md"
                  : "text-rose-455 bg-rose-950/10 border border-rose-950/40 hover:text-rose-200"
              }`}
            >
              <Flame className="w-4 h-4 shrink-0 text-red-500" />
              <span>5. Timed Emergency</span>
            </button>

          </div>

          {/* ACTIVE CONTENT CARD SECTION */}
          <div className="bg-slate-900/30 border border-slate-900/80 rounded-2xl p-4 md:p-6 shadow-2xl relative overflow-hidden h-full min-h-[460px]" id="active-game-viewport-wrapper">

            {/* TAB 1: HEART ANATOMY QUIZ PANEL */}
            {activeTab === "anatomy" && (
              <div className="animate-fade-in space-y-5" id="anatomy-quiz-box">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest block">CHALLENGE SECTION 1 OF 5</span>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2 mt-0.5 font-sans">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      Anatomy, Valves & Circulation Loops
                    </h3>
                  </div>
                  <div className="font-mono text-xs text-slate-400">
                    Question <b className="text-cyan-400">{anatomyIdx + 1}</b> corresponding to {ANATOMY_QUESTIONS.length} Total
                  </div>
                </div>

                {!anatomyComplete ? (
                  <div className="space-y-5">
                    
                    {/* Linear dynamic progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                        <span>MODULE CALIBRATION COMPLIANCE</span>
                        <span>{Math.round(((anatomyIdx) / ANATOMY_QUESTIONS.length) * 100)}% Complete</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-900">
                        <div 
                          className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${((anatomyIdx) / ANATOMY_QUESTIONS.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-slate-950/40 p-4.5 rounded-xl border border-slate-900 shadow-inner">
                      <h4 className="text-sm md:text-base font-bold text-slate-100 font-sans leading-relaxed">
                        {ANATOMY_QUESTIONS[anatomyIdx].question}
                      </h4>
                    </div>

                    {/* MC Options GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {ANATOMY_QUESTIONS[anatomyIdx].options.map((option, idx) => {
                        const isChosen = anatomyAnswer === idx;
                        const revealCorrect = anatomySubmitted && idx === ANATOMY_QUESTIONS[anatomyIdx].correctIdx;
                        const revealIncorrect = anatomySubmitted && isChosen && idx !== ANATOMY_QUESTIONS[anatomyIdx].correctIdx;

                        let style = "bg-slate-950/60 border-slate-900 text-slate-350 hover:border-slate-800 hover:bg-slate-900";
                        if (isChosen) style = "bg-cyan-955/20 border-cyan-500 text-cyan-300 font-semibold shadow-md shadow-cyan-950/20";
                        if (revealCorrect) style = "bg-emerald-950/40 border-emerald-500 text-emerald-400 font-semibold shadow-lg shadow-emerald-950/20";
                        if (revealIncorrect) style = "bg-rose-955/30 border-rose-500 text-rose-450";

                        return (
                          <button
                            key={idx}
                            disabled={anatomySubmitted}
                            onClick={() => setAnatomyAnswer(idx)}
                            className={`w-full p-3.5 text-left rounded-xl border transition-all text-xs flex items-center justify-between ${style} ${!anatomySubmitted ? "cursor-pointer" : ""}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-5 h-5 rounded bg-slate-900/60 border border-slate-800/80 text-[10px] font-mono font-bold text-slate-400 flex items-center justify-center">
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span>{option}</span>
                            </div>
                            
                            {revealCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                            {revealIncorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanatory rationale panel */}
                    {anatomySubmitted && (
                      <div className="p-3.5 bg-slate-950/80 rounded-xl border border-rose-950/20 text-xs text-slate-400 leading-relaxed animate-fade-in">
                        <strong className="text-amber-500 font-mono text-[9px] block uppercase tracking-wider mb-1">⚕ TUTORIAL RATIONALE EXPLAINED:</strong>
                        {ANATOMY_QUESTIONS[anatomyIdx].rationale}
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      {!anatomySubmitted ? (
                        <button
                          onClick={handleAnatomyAnswerSubmit}
                          disabled={anatomyAnswer === null}
                          className={`px-6 py-2.5 text-xs font-bold font-mono rounded-xl border transition-all ${
                            anatomyAnswer === null
                              ? "bg-slate-950 border-slate-900 text-slate-650 cursor-not-allowed"
                              : "bg-cyan-400 border-cyan-500 text-slate-950 hover:bg-cyan-300 cursor-pointer shadow-lg shadow-cyan-950/30 font-extrabold"
                          }`}
                        >
                          SUBMIT SELECTED ANSWER
                        </button>
                      ) : (
                        <button
                          onClick={handleNextAnatomyQuestion}
                          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs font-mono rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{anatomyIdx === ANATOMY_QUESTIONS.length - 1 ? "CALLED EXAM OVERVIEW" : "NEXT QUESTION CHECK"}</span>
                          <ChevronRight className="w-4.5 h-4.5" />
                        </button>
                      )}
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-10 space-y-5 animate-fade-in">
                    <div className="w-16 h-16 bg-gradient-to-b from-cyan-950 to-emerald-950 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-xl">
                      <Trophy className="w-8 h-8 text-yellow-400" />
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-white font-sans">Anatomy Lab Evaluation Completed</h4>
                      <p className="text-xs text-slate-450 max-w-sm mx-auto">
                        Excellent index compliance! You parsed the cardiac anatomical structures and circulation loop variables in general testing.
                      </p>
                    </div>

                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900 max-w-xs mx-auto space-y-1.5 text-center shadow-inner">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Calibration Score</span>
                      <strong className="text-3xl font-mono text-cyan-400 block">{Math.round((anatomyScore / ANATOMY_QUESTIONS.length) * 100)}%</strong>
                      <span className="text-xs text-slate-350">{anatomyScore} Correct of {ANATOMY_QUESTIONS.length} Questions</span>
                    </div>

                    <button
                      onClick={resetAnatomyQuiz}
                      className="px-6 py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-bold font-mono text-xs rounded-xl cursor-pointer transition-all shadow-md shadow-rose-950/40"
                    >
                      RETRIAL LABORATORY TEST
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: ECG IDENTIFICATION GAME WITH INTERACTIVE OSCILLOSCOPE */}
            {activeTab === "ecg" && (
              <div className="animate-fade-in space-y-4" id="ecg-id-game-module">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[9px] font-mono text-rose-450 font-bold uppercase tracking-widest block">CHALLENGE SECTION 2 OF 5</span>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2 mt-0.5">
                      <Activity className="w-5 h-5 text-rose-500 animate-pulse" />
                      Dynamic ECG Graph Identification Exam
                    </h3>
                  </div>

                  {/* DIFFICULTY METRICS SLIDERS */}
                  <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 border border-slate-900 rounded-xl font-mono text-[9px] text-slate-500">
                    <span className="pl-1.5">LEVEL:</span>
                    {(["easy", "medium", "hard"] as const).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => {
                          setEcgDifficulty(diff);
                          setEcgStreak(0);
                        }}
                        className={`px-2 py-0.5 rounded uppercase font-bold transition-all cursor-pointer ${
                          ecgDifficulty === diff 
                            ? "bg-rose-950 text-rose-400 border border-rose-800/30" 
                            : "text-slate-550 hover:text-slate-350"
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* GAME CONTROL GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  
                  {/* CANVAS LIVE VIEWER CONTAINER (SPAN 7) */}
                  <div className="lg:col-span-7 bg-slate-950 border border-slate-900 p-2.5 rounded-xl shadow-xl flex flex-col justify-between relative overflow-hidden">
                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mb-1">
                      <span>CHALLENGE OSCILLOSCOPE SCREEN</span>
                      <span className="text-rose-500 animate-pulse">// ACTIVE SIGNAL TRANSMISSION</span>
                    </div>

                    <div className="relative">
                      {/* Active ECG Live Canvas */}
                      <canvas 
                        ref={ecgCanvasRef}
                        width={420}
                        height={120}
                        className="w-full h-[120px] bg-slate-950 block rounded-lg text-rose-500"
                        id="ecg-game-canvas"
                      />

                      {/* Display numerical BPM only in easy difficulty */}
                      {ecgDifficulty === "easy" && !ecgSubmitted && (
                        <div className="absolute top-2 right-2 bg-slate-900/90 border border-slate-800 text-[9px] font-mono text-slate-350 p-1 rounded">
                          Digital Rate: <b className="text-cyan-400 font-bold">{ECG_WAVE_TYPES.find(w => w.id === ecgCurrentWave)?.bpm}</b>
                        </div>
                      )}
                    </div>

                    {/* Stats summary banner */}
                    <div className="mt-2.5 flex items-center justify-between font-mono text-[10px] text-slate-450 border-t border-slate-900/60 pt-2 bg-slate-950">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-rose-450 shrink-0" />
                        <span>TIME SENSOR REMAINING: </span>
                        <span className={`text-base font-bold font-mono leading-none ${ecgTimeLeft <= 3 ? "text-red-500 animate-ping font-extrabold" : "text-amber-500"}`}>
                          {ecgTimeLeft}s
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span>Streak:</span>
                        <strong className="text-cyan-400 font-bold">{ecgStreak}</strong>
                        <span className="text-slate-600">// Best:</span>
                        <strong className="text-slate-400">{highStreak}</strong>
                      </div>
                    </div>
                  </div>

                  {/* CHOOSE SYSTEM SCHEMATIC (SPAN 5) */}
                  <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                    
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-slate-500 tracking-wider font-bold">IDENTIFY THE CARDIAC CURRENT:</span>
                      
                      <div className="grid grid-cols-1 gap-2.5">
                        {ECG_WAVE_TYPES.map((wave) => {
                          const isCorrect = wave.id === ecgCurrentWave;
                          const selected = ecgSelectedAnswer === wave.id;

                          let btnStyle = "bg-slate-950 border-slate-900 hover:border-slate-800 text-slate-350 hover:bg-slate-900";
                          if (selected) btnStyle = "bg-rose-955/20 border-rose-500 text-rose-400 font-semibold";
                          
                          if (ecgSubmitted) {
                            if (isCorrect) {
                              btnStyle = "bg-emerald-955/35 border-emerald-500 text-emerald-400 font-bold";
                            } else if (selected) {
                              btnStyle = "bg-rose-955/30 border-rose-500 text-rose-450";
                            } else {
                              btnStyle = "bg-slate-950 border-slate-950 text-slate-600 opacity-40 cursor-not-allowed";
                            }
                          }

                          return (
                            <button
                              key={wave.id}
                              disabled={ecgSubmitted}
                              onClick={() => handleEcgAnswerSubmit(wave.id)}
                              className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle} ${!ecgSubmitted ? "cursor-pointer" : ""}`}
                            >
                              <div>
                                <strong className="font-sans block text-[11px] text-slate-250 leading-tight">{wave.name}</strong>
                                {ecgDifficulty === "easy" && (
                                  <span className="text-[9px] font-mono text-slate-550 block mt-0.5">{wave.desc}</span>
                                )}
                              </div>
                              {ecgSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Next step controls */}
                    <div>
                      {ecgSubmitted ? (
                        <div className="space-y-2 animate-fade-in">
                          <div className="p-2.5 rounded bg-slate-950 border border-slate-900 text-[10px] leading-relaxed text-slate-400">
                            <strong>Observed timing:</strong> {ECG_WAVE_TYPES.find(w => w.id === ecgCurrentWave)?.desc}
                          </div>
                          
                          <button
                            onClick={triggerNewEcgWave}
                            className="w-full py-2 bg-rose-500 hover:bg-rose-400 text-white font-extrabold font-mono text-xs rounded-xl cursor-pointer transition-all select-none shadow-md"
                          >
                            TRIGGER NEXT ECG GRAPH WAVE
                          </button>
                        </div>
                      ) : (
                        <div className="text-[9.5px] text-slate-500 font-mono text-center">
                          * Guess prior to timer expiration. Higher difficulties have harder waveforms with noise interference.
                        </div>
                      )}
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* TAB 3: MATCH THE FUNCTION CONNECTIONS */}
            {activeTab === "match" && (
              <div className="animate-fade-in space-y-4 font-sans" id="match-functions-module">
                
                <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[9px] font-mono text-amber-450 font-bold uppercase tracking-widest block">CHALLENGE SECTION 3 OF 5</span>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2 mt-0.5">
                      <Zap className="w-4 h-4 text-amber-400" />
                      Biomedical Machinery Matching Game
                    </h3>
                  </div>
                  <span className="text-[10px] bg-slate-950 border border-slate-900 text-slate-450 px-2 py-1 rounded font-mono">
                    STATUS: {matchSubmitted ? "SUBMITTED" : "CALIBRATING LINES"}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-normal max-w-xl">
                  Connect left items to their respective functional explanations. Click a name, then click a explanation to map a vital electronic link vector!
                </p>

                {/* GAME SPLIT LAYOUT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 items-stretch" id="matching-cols-mesh">
                  
                  {/* LEFT CHANNELS column */}
                  <div className="space-y-3 flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">SYSTEM ARTIFACTSNAMES:</span>
                    
                    <div className="space-y-2.5">
                      {leftKeys.map((id) => {
                        const item = MATCHING_DATA.find((i) => i.id === id)!;
                        const isSelected = matchSelectedLeft === id;
                        const targetKeyLinked = matchLinks[id];
                        const isLinked = !!targetKeyLinked;

                        let style = "bg-slate-950/60 border-slate-900 text-slate-350 hover:border-slate-800";
                        if (isSelected) style = "bg-amber-955/20 border-amber-500 text-amber-300 font-semibold shadow-md shadow-amber-950/20";
                        if (isLinked) style = "bg-slate-900 border-yellow-500/40 text-yellow-400 font-semibold shadow-sm";
                        if (matchSubmitted) {
                          const linkedItem = MATCHING_DATA.find((i) => i.id === id)!;
                          const isCorrect = targetKeyLinked === linkedItem.targetId;
                          style = isCorrect 
                            ? "bg-emerald-950/30 border-emerald-500/80 text-emerald-400" 
                            : "bg-rose-950/20 border-rose-500/60 text-rose-450";
                        }

                        return (
                          <div 
                            key={id}
                            className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all relative ${style}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 border border-slate-950 shadow shadow-cyan-400 shrink-0" />
                              <span className="font-bold font-sans tracking-tight">{item.sourceText}</span>
                            </div>
                            
                            <div className="flex gap-1">
                              {!matchSubmitted && (
                                <button
                                  onClick={() => handleLeftSelect(id)}
                                  className={`px-2 py-1 text-[9px] font-mono font-bold rounded transition-all cursor-pointer ${
                                    isSelected 
                                      ? "bg-amber-500 text-slate-950 font-extrabold" 
                                      : "bg-slate-900 hover:bg-slate-800 text-amber-400"
                                  }`}
                                >
                                  {isLinked ? "CHANGE" : "SELECT"}
                                </button>
                              )}

                              {isLinked && !matchSubmitted && (
                                <button
                                  onClick={() => clearLeftSelection(id)}
                                  className="p-1 text-rose-400 hover:text-rose-300 text-[9px] font-mono bg-slate-900/40 hover:bg-slate-850 rounded"
                                  title="Unlink"
                                >
                                  ✕
                                </button>
                              )}

                              {matchSubmitted && (
                                <span className="text-[10px] font-mono font-bold leading-none">
                                  {targetKeyLinked === item.targetId ? "✓ CORRECT" : "✕ FAILED"}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* RIGHT TARGETS COLUMN */}
                  <div className="space-y-3 flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">CORRESPONDING EXPLANATIONS:</span>
                    
                    <div className="space-y-2.5">
                      {rightTargets.map((item) => {
                        const isSelected = matchSelectedRight === item.id;
                        // Find if any left item points to this target id
                        const pointingLeftKey = Object.keys(matchLinks).find((key) => matchLinks[key] === item.id);
                        const isLinked = !!pointingLeftKey;

                        let style = "bg-slate-950/60 border-slate-900 text-slate-350 hover:border-slate-850";
                        if (isSelected) style = "bg-amber-955/20 border-amber-500 text-amber-350";
                        if (isLinked) style = "bg-slate-900 border-yellow-500/40 text-slate-205";
                        if (matchSubmitted) {
                          const linkedSource = MATCHING_DATA.find((i) => i.targetId === item.id)!;
                          const isCorrect = pointingLeftKey === linkedSource.id;
                          style = isCorrect 
                            ? "bg-emerald-950/30 border-emerald-500/80 text-slate-300 opacity-90" 
                            : "bg-rose-950/10 border-rose-500/40 text-slate-400 opacity-60";
                        }

                        return (
                          <div
                            key={item.id}
                            className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${style}`}
                          >
                            <div className="flex gap-2">
                              {isLinked && (
                                <span className="text-[9px] bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded font-mono self-start uppercase">
                                  {MATCHING_DATA.find((i) => i.id === pointingLeftKey)?.sourceText} Link
                                </span>
                              )}
                              <p className="text-[11px] leading-tight text-slate-350">{item.text}</p>
                            </div>

                            {!matchSubmitted && (
                              <button
                                onClick={() => handleRightSelect(item.id)}
                                className={`px-2 py-1 text-[9px] font-mono font-bold rounded transition-all shrink-0 ml-1.5 cursor-pointer ${
                                  isSelected 
                                    ? "bg-amber-500 text-slate-950" 
                                    : "bg-slate-900 hover:bg-slate-800 text-slate-400"
                                }`}
                              >
                                MAP TARGET
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Submissions results report card */}
                {matchGrade && (
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-900 text-center text-xs animate-fade-in relative">
                    <span className="text-[9px] font-mono text-slate-550 block uppercase mb-1">CALCULATED RESULT INDEX</span>
                    <strong className="text-sm font-sans block text-slate-100">
                      Score accuracy: <span className="text-cyan-405 font-mono">{matchGrade.score} of {MATCHING_DATA.length} Correct Links</span>
                    </strong>
                    {matchGrade.perfect ? (
                      <p className="text-[11px] text-emerald-450 mt-1 font-mono">🌟 Perfect alignment completed! Unlocked 200 XP credit lines.</p>
                    ) : (
                      <p className="text-[11px] text-slate-450 mt-1 font-mono">Some connections failed to sync. Review clinical descriptions to try again.</p>
                    )}
                  </div>
                )}

                {/* Confirm match links */}
                <div className="flex justify-between items-center text-xs border-t border-slate-900 pt-3">
                  <span className="text-[10px] font-mono text-slate-500">
                    Map: {Object.keys(matchLinks).length} of {MATCHING_DATA.length} Connections calibrated
                  </span>

                  {!matchSubmitted ? (
                    <button
                      onClick={verifyMatchingConnections}
                      disabled={Object.keys(matchLinks).length === 0}
                      className={`px-5 py-2 rounded-xl text-xs font-bold font-mono transition-all border ${
                        Object.keys(matchLinks).length === 0
                          ? "bg-slate-950 border-slate-900 text-slate-655"
                          : "bg-amber-400 hover:bg-amber-300 border-amber-500 text-slate-950 cursor-pointer shadow-lg shadow-amber-950/30"
                      }`}
                    >
                      VERIFY VITAL MESH LINKS
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setLeftKeys([...MATCHING_DATA].map(i => i.id).sort(() => Math.random() - 0.5));
                        setRightTargets([...MATCHING_DATA].map(i => ({ id: i.targetId, text: i.targetText })).sort(() => Math.random() - 0.5));
                        setMatchSelectedLeft(null);
                        setMatchSelectedRight(null);
                        setMatchLinks({});
                        setMatchSubmitted(false);
                        setMatchGrade(null);
                        playPulseSound("correct");
                      }}
                      className="px-5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-205 text-xs font-bold font-mono rounded-xl transition-all cursor-pointer"
                    >
                      RESET MATCH LAB SHEET
                    </button>
                  )}
                </div>

              </div>
            )}

            {/* TAB 4: CLINICAL CASES SCENARIO QUIZ */}
            {activeTab === "scenario" && (
              <div className="animate-fade-in space-y-4" id="clinical-simulator-quiz">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[9px] font-mono text-emerald-455 font-bold uppercase tracking-widest block">CHALLENGE SECTION 4 OF 5</span>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2 mt-0.5">
                      <Cpu className="w-5 h-5 text-emerald-400" />
                      "What Happens If..." Clinical Case Simulator
                    </h3>
                  </div>
                  <span className="text-xs text-emerald-405 font-mono">
                    Case file: <b className="text-emerald-400 font-bold">{scenIdx + 1}/{CLINI_SCENARIOS.length}</b>
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  
                  {/* LEFT SIMULATOR BOX (SPAN 7) */}
                  <div className="lg:col-span-7 bg-slate-950 border border-slate-900 p-3 rounded-xl flex flex-col justify-between shadow-xl relative min-h-[300px]">
                    
                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mb-1">
                      <span>PATIENT VITALS SIMULATOR SCREEN</span>
                      <span className={`px-2 py-0.5 rounded font-mono font-bold ${scenResolved ? "text-emerald-400 border border-emerald-500/20 bg-emerald-950/20" : "text-rose-450 border border-rose-500/25 bg-rose-955/20"}`}>
                        {scenResolved ? "✓ RECOVERED STATUS" : "⚠ CRITICAL ABNORMAL RHYTHM"}
                      </span>
                    </div>

                    {/* Scenario dynamic timeline description */}
                    <div className="p-3 bg-slate-900/50 border border-slate-850/60 rounded-xl text-xs space-y-1 my-2">
                      <strong className="text-slate-105 font-medium block leading-snug">{CLINI_SCENARIOS[scenIdx].title}</strong>
                      <p className="text-[11px] leading-relaxed text-slate-400">{CLINI_SCENARIOS[scenIdx].problem}</p>
                    </div>

                    {/* Vitals trace canvas */}
                    <div className="relative mt-1">
                      <canvas 
                        ref={scenCanvasRef}
                        width={420}
                        height={100}
                        className="w-full h-[100px] bg-slate-950 block rounded-lg text-cyan-400"
                        id="scenario-vitals-canvas"
                      />
                    </div>

                    {/* Recovery diagnosis card */}
                    {scenResolved && (
                      <div className="p-3 bg-emerald-950/20 border border-emerald-500/10 rounded-xl space-y-1 text-[11px] text-slate-400 mt-2 animate-fade-in text-left">
                        <span className="text-emerald-400 font-mono font-bold block mb-0.5">⚕ THERAPEUTIC OUTCOME:</span>
                        {CLINI_SCENARIOS[scenIdx].clinicalOutcome}
                      </div>
                    )}

                  </div>

                  {/* RIGHT ANSWER SWITCH CARD (SPAN 5) */}
                  <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                    
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">CHOOSE TREATMENT DEVICE PROTOTYPE:</span>
                      
                      <div className="grid grid-cols-1 gap-2.5">
                        {CLINI_SCENARIOS[scenIdx].options.map((option, idx) => {
                          const selected = scenSelected === idx;
                          const showCorrect = scenSubmitted && idx === CLINI_SCENARIOS[scenIdx].correctIdx;
                          const showIncorrect = scenSubmitted && selected && idx !== CLINI_SCENARIOS[scenIdx].correctIdx;

                          let bStyle = "bg-slate-950 border-slate-900 hover:border-slate-800 text-slate-350 hover:bg-slate-900";
                          if (selected) bStyle = "bg-emerald-955/20 border-emerald-500 text-emerald-400 font-semibold";
                          if (showCorrect) bStyle = "bg-emerald-950 border-emerald-500 text-emerald-400 font-bold";
                          if (showIncorrect) bStyle = "bg-rose-955/30 border-rose-500 text-rose-455";

                          return (
                            <button
                              key={idx}
                              disabled={scenSubmitted}
                              onClick={() => setScenSelected(idx)}
                              className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${bStyle} ${!scenSubmitted ? "cursor-pointer" : ""}`}
                            >
                              <span>{option}</span>
                              {showCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Feedback and transitions */}
                    <div className="mt-2 text-right">
                      {!scenSubmitted ? (
                        <button
                          onClick={handleScenarioSubmit}
                          disabled={scenSelected === null}
                          className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold transition-all border ${
                            scenSelected === null
                              ? "bg-slate-950 border-slate-900 text-slate-650 cursor-not-allowed"
                              : "bg-emerald-500 border-emerald-600 text-slate-950 cursor-pointer shadow-lg shadow-emerald-950/20"
                          }`}
                        >
                          APPLY CLINICAL DEVICE RESOLVER
                        </button>
                      ) : (
                        <div className="space-y-2.5">
                          <div className="text-left p-3 rounded bg-slate-950 border border-slate-900 text-[10px] text-slate-400 leading-relaxed font-mono">
                            <strong className="text-amber-500 block font-bold mb-0.5">LEARNING ANALYSIS:</strong>
                            {CLINI_SCENARIOS[scenIdx].explanation}
                          </div>
                          
                          <button
                            onClick={handleNextScenario}
                            className="w-full py-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-205 text-xs font-bold font-mono rounded-xl transition-all cursor-pointer"
                          >
                            LOAD NEXT PATIENT FILE SCENARIO
                          </button>
                        </div>
                      )}
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* TAB 5: RAPID EMERGENCY TRIAGE MINI TIME ATTACK */}
            {activeTab === "rapid" && (
              <div className="animate-fade-in space-y-4" id="rapid-triage-module">
                
                <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[9px] font-mono text-red-500 font-bold uppercase tracking-widest block">CHALLENGE SECTION 5 OF 5 // TIMED GAME</span>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2 mt-0.5">
                      <Flame className="w-5 h-5 text-red-500 animate-pulse" />
                      Emergency Room Rapid Triage Mode
                    </h3>
                  </div>
                  <span className="text-[9px] bg-red-950 border border-red-500/20 text-red-400 px-2 py-0.5 rounded font-mono font-bold">
                    ER SIMULATION ACTIVE
                  </span>
                </div>

                {/* GAME CONTROL STATE BOXES */}
                {rapidState === "idle" && (
                  <div className="text-center py-10 space-y-5 animate-fade-in max-w-md mx-auto">
                    <div className="text-4xl animate-bounce">🚨</div>
                    
                    <div className="space-y-1.5">
                      <h4 className="text-base font-bold text-slate-100 font-sans uppercase tracking-tight">ER Crisis Team Simulator</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Assess critical patient signals under extreme pressure. You have exactly <b>10 seconds</b> to diagnose the abnormality and apply the correct therapy. Any wrong step leads to a catastrophic cardiac flatline! 
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl text-left text-[11px] text-slate-500 font-mono space-y-1">
                      <strong className="text-cyan-400 font-bold block uppercase mb-1">• CRITICAL PROCEDURES RULES:</strong>
                      <p>1. Each correct diagnosis credits you with <b>+120 XP points</b>.</p>
                      <p>2. Complete all Emergency Cases in series to receive the <b>ER Triage Badge</b>.</p>
                    </div>

                    <button
                      onClick={startRapidTriage}
                      className="px-8 py-3 bg-red-500 hover:bg-red-400 text-white font-extrabold font-mono text-xs rounded-xl cursor-pointer transition-all shadow-lg shadow-red-950"
                    >
                      ENTER TIMED ER WARD OPERATION NOW
                    </button>
                  </div>
                )}

                {rapidState === "active" && (
                  <div className="space-y-4 animate-fade-in">
                    
                    {/* Urgency Alert Screen Board */}
                    <div className="bg-red-950/20 border-l-4 border-l-red-500 p-3.5 rounded-r-xl flex items-center justify-between gap-4 animate-pulse">
                      <div className="flex items-center gap-3">
                        <AlertOctagon className="w-6 h-6 text-red-500 shrink-0" />
                        <div>
                          <strong className="text-xs uppercase font-mono font-extrabold text-red-400 block tracking-wider">
                            {EMERGENCY_CHALLENGES[rapidCaseIdx].alarmMessage}
                          </strong>
                          <p className="text-[11px] text-slate-350 leading-snug mt-0.5">
                            {EMERGENCY_CHALLENGES[rapidCaseIdx].situation}
                          </p>
                        </div>
                      </div>

                      {/* Giant emergency countdown lock */}
                      <div className="bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-center shrink-0">
                        <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold tracking-tight">VITAL RECOVERY COUNT</span>
                        <span className="text-2xl font-mono font-bold text-red-500 leading-none block mt-1 animate-ping">
                          {rapidTimeLeft}s
                        </span>
                      </div>
                    </div>

                    {/* Split monitor scope for live crisis pulse */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                      
                      <div className="lg:col-span-7 bg-slate-950 border border-red-950/40 p-2 rounded-xl h-full flex flex-col justify-between">
                        <div className="flex justify-between items-center text-[8.5px] font-mono text-slate-500 px-1 mb-1">
                          <span>LIVE CRITICAL PATIENT SIGNAL DIAGNOSTICS</span>
                          <span className="text-red-500 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" /> ALERT ALARMS EMITTED
                          </span>
                        </div>
                        
                        <canvas 
                          ref={rapidCanvasRef}
                          width={400}
                          height={110}
                          className="w-full h-[110px] bg-slate-950 rounded-lg"
                        />
                      </div>

                      {/* Rapid choice actions buttons (Vulnerable therapeutic clicks) */}
                      <div className="lg:col-span-5 flex flex-col justify-center space-y-3">
                        <span className="text-[9px] font-mono text-slate-500 block font-bold uppercase tracking-wider">APPLY INSTANT ER INTERVENTION:</span>
                        
                        <div className="grid grid-cols-1 gap-2">
                          {EMERGENCY_CHALLENGES[rapidCaseIdx].buttons.map((btn, bIdx) => (
                            <button
                              key={bIdx}
                              onClick={() => handleRapidChoiceClick(btn.correct)}
                              className="w-full p-3 font-sans text-left text-xs bg-slate-950/80 border border-slate-900 hover:border-red-500/40 hover:bg-slate-900/40 text-slate-205 rounded-xl cursor-pointer transition-all flex items-center justify-between"
                            >
                              <span>{btn.text}</span>
                              <span className="text-[9px] text-slate-650 font-mono">// Action {bIdx + 1}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Vitals footer index */}
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-slate-900 pt-3">
                      <span>PATIENT VITAL RECORD: CASE FILE {rapidCaseIdx + 1} OF {EMERGENCY_CHALLENGES.length}</span>
                      <span className="text-red-400">Recovery Status Track Rank Score: {rapidScore}</span>
                    </div>

                  </div>
                )}

                {/* Emergency failure flatline overlay screen */}
                {rapidState === "fail" && (
                  <div className="text-center py-10 space-y-5 animate-fade-in max-w-sm mx-auto">
                    <div className="w-14 h-14 bg-red-950 border border-red-500 text-red-500 rounded-full flex items-center justify-center mx-auto text-xl font-bold animate-ping font-mono">
                      🚨
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-extrabold text-red-500 font-sans uppercase tracking-tight">CRITICAL FLATLINE RECORDED</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Therapy failed inside appropriate physiological bounds! Vitals flatlined due to lack of timely, appropriate cardiac intervention.
                      </p>
                    </div>

                    <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl font-mono text-[10.5px] text-slate-450 text-left leading-normal">
                      <strong className="text-red-400 font-bold block mb-0.5">• DIAGNOSTIC EVALUATION:</strong>
                      You failed to resolve the emergency in time or made a wrong clinical decision. Review normal vs abnormal waves from Section 2 to build proper diagnostic reflexes.
                    </div>

                    <button
                      onClick={startRapidTriage}
                      className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold font-mono text-xs rounded-xl cursor-pointer transition-all shadow-lg"
                    >
                      CLEAR RESTART CLINICAL ACTION
                    </button>
                  </div>
                )}

                {/* Emergency Grand success win screen */}
                {rapidState === "win" && (
                  <div className="text-center py-8 space-y-4 animate-fade-in max-w-sm mx-auto">
                    <div className="w-16 h-16 bg-gradient-to-b from-cyan-950 to-emerald-950 border border-emerald-400 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-xl select-none text-2xl animate-bounce">
                      ✨
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-slate-100 font-sans uppercase">Profound ER Vitals Stabilized!</h4>
                      <p className="text-xs text-slate-450 max-w-sm mx-auto">
                        Sensational performance! You resolved the three clinical crises consecutively within rapid timing, successfully stabilizing all lives.
                      </p>
                    </div>

                    <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-900 max-w-xs mx-auto space-y-1 font-mono text-[10.5px] text-slate-400">
                      <div>RECOVERY REWARD POINTS: <b className="text-cyan-400 font-extrabold font-mono">+610 XP Unlocked</b></div>
                    </div>

                    <div className="flex justify-center gap-3 pt-1">
                      <button
                        onClick={startRapidTriage}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-xs rounded-xl cursor-pointer transition-all shadow-md"
                      >
                        RESTART ER CHALLENGE
                      </button>
                      
                      <button
                        onClick={() => setRapidState("idle")}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-350 font-bold font-mono text-xs rounded-xl cursor-pointer transition-all"
                      >
                        RETURN TO LABORATORY
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN: REWARDS, XP, badgeS & EXPLAINER CARD (SPAN 1) */}
        <div className="flex flex-col gap-6" id="learning-rewards-anchor shadow-2xl">
          
          {/* THE GLOWING REWARDS CONTROL BOARD */}
          <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-5 shadow-2xl relative overflow-hidden" id="rewards-dashboard-panel">
            {/* Ambient background spark */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-505/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <span className="p-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-xl">
                <Trophy className="w-5 h-5 animate-pulse" />
              </span>
              <div>
                <span className="text-[8.5px] font-mono text-slate-500 uppercase tracking-widest font-bold block leading-none">BIOMED REWARDS SYSTEM</span>
                <h3 className="text-sm font-bold text-slate-102 mt-0.5 font-sans">Active Syllabus Progress</h3>
              </div>
            </div>

            {/* LEVEL AND XP CONTAINER */}
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-900/70 shadow-inner">
                <div>
                  <span className="text-[8px] font-mono text-slate-500 block uppercase leading-none font-bold">CARDIOLOGY RANK LEVEL</span>
                  <strong className="text-lg font-mono text-yellow-500 font-extrabold tracking-tight mt-0.5 block">Lvl {currentLevel} // EXPERT</strong>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-mono text-slate-500 block uppercase leading-none">TOTAL XP EARNED</span>
                  <strong className="text-lg font-mono text-cyan-405 font-bold tracking-tight mt-0.5 block">{xp} XP</strong>
                </div>
              </div>

              {/* Slider representation progress to next level */}
              <div className="space-y-1 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900/60">
                <div className="flex justify-between items-center text-[8.5px] font-mono text-slate-450">
                  <span>EXP TO LEVEL {currentLevel + 1}</span>
                  <strong>{xpInCurrentLevel}/500 XP ({Math.round(progressToNextLevel)}%)</strong>
                </div>
                
                <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressToNextLevel}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Badges unlocked section list */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-slate-500 tracking-wider block uppercase font-bold">EARNED CURRICULUM BADGES:</span>
              
              <div className="space-y-2">
                {BADGES.map((badge) => {
                  const unlocked = xp >= badge.unlockedAtXP;

                  return (
                    <div 
                      key={badge.id}
                      className={`p-2.5 rounded-xl border flex items-center gap-3 transition-all relative ${
                        unlocked 
                          ? "bg-slate-900 border-cyan-505/20 shadow shadow-cyan-950" 
                          : "bg-slate-955/20 border-slate-950 text-slate-550 opacity-40 select-none"
                      }`}
                    >
                      <span className="text-2xl select-none">{unlocked ? badge.emoji : "🔒"}</span>
                      <div>
                        <strong className="block text-[11px] font-sans text-slate-205 leading-none font-bold">{badge.name}</strong>
                        <span className="text-[8.5px] font-mono text-slate-505 block mt-1 leading-tight">{badge.desc}</span>
                        {unlocked && (
                          <span className="text-[8px] border border-cyan-800 bg-cyan-950/30 text-cyan-400 px-1 py-0.2 rounded font-mono mt-1 inline-block uppercase font-bold leading-none">
                            SAVED CREDIT
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* DEDUCTIVE MEDICAL EDUCATION SIDE CARD */}
          <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl shadow-xl flex-grow h-full" id="rewards-syllabus-info">
            <div className="flex items-center gap-1.5 border-b border-slate-850 pb-2.5 mb-3 text-[10px] font-mono text-slate-500">
              <Info className="w-3.5 h-3.5 text-cyan-455 shrink-0" />
              <span>Diagnostic Study Guide</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal mb-3">
              To earn badges quickly, read cardiac layouts carefully. Electrocardiology traces electric pathways that are heavily changed by heart attacks and blocks.
            </p>

            <div className="p-2.5 bg-slate-950 border border-slate-950/80 rounded-xl space-y-1.5 text-[9.5px] font-mono text-slate-500 leading-tight shadow-inner">
              <span className="text-yellow-501 block font-bold mb-0.5">• CLINICAL EXAM TIPS:</span>
              <p>• <b>SA Node Dysfunction</b>: Requires an electronic pacemaker to override slow pacing.</p>
              <p>• <b>Coronary Plaque Obstruction</b>: Demands a stent bypass balloon angioplasty directly.</p>
              <p>• <b>V-Fib OscillStatic</b>: Demands biphasic DC shocks instantly to reset cardiac loops.</p>
            </div>
          </div>

        </div>

      </div>

      {/* REWARDS UNLOCKED PORTAL MODAL OVERLAY */}
      {awardAlert && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fade-in" id="badge-unlocked-modal">
          <div className="bg-slate-900 border border-cyan-500/30 p-6 rounded-2xl max-w-sm w-full text-center space-y-5 shadow-2xl relative overflow-hidden">
            {/* Sparkle neon lights */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 to-transparent pointer-events-none" />
            <div className="text-5xl animate-bounce">{awardAlert.badge.emoji}</div>
            
            <div className="space-y-1 bg-slate-950/50 p-2 border border-slate-900 rounded-xl">
              <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">CURRICULUM BADGE UNLOCKED!</span>
              <h4 className="text-base font-extrabold text-white font-sans mt-0.5">{awardAlert.badge.name}</h4>
              <p className="text-xs text-slate-400 mt-1">{awardAlert.badge.desc}</p>
            </div>

            <p className="text-[10px] text-slate-500 font-mono tracking-tight uppercase leading-none">
              Unlocks corresponding to: {awardAlert.badge.condition}
            </p>

            <button
              onClick={() => setAwardAlert(null)}
              className="w-full py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold font-mono text-xs rounded-xl cursor-pointer transition-all shadow-md shadow-cyan-950"
            >
              RECORD TO PORTFOLIO
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
