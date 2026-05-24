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
  Smartphone, 
  Sliders, 
  Award, 
  RotateCcw, 
  HelpCircle,
  TrendingDown,
  Volume2,
  VolumeX,
  FileText,
  User,
  Check,
  ShieldAlert
} from "lucide-react";

// Types
type ConditionKey = "normal" | "tachycardia" | "bradycardia" | "arrhythmia";

interface ConditionInfo {
  name: string;
  emoji: string;
  color: string; // Tailwind text color
  borderColor: string;
  glowColor: string; // Tailwind shadow/glow
  bpm: number | string;
  soundFrequency: number;
  description: string;
  symptoms: string[];
  dangers: string[];
  treatments: string[];
  devices: string;
  heartRateValue: number; // numerical bpm representation
}

const CONDITIONS: Record<ConditionKey, ConditionInfo> = {
  normal: {
    name: "Normal Sinus Rhythm",
    emoji: "💚",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/55",
    glowColor: "shadow-emerald-550/20",
    bpm: 72,
    soundFrequency: 72,
    description: "A normal sinus rhythm represents healthy cardiac electrical activity. The electrical impulses originate in the Sinoatrial (SA) Node, traveling smoothly through the atria and ventricles, displaying perfect coordination between heart chambers.",
    symptoms: [
      "Optimal blood flow and systemic perfusion",
      "No subjective chest discomfort or shortness of breath",
      "Stable blood pressure (typically around 120/80 mmHg)"
    ],
    dangers: [
      "Low risk: Indicates efficient cardiovascular function under rest",
      "Maintained cardiac output prevents localized organ ischemia"
    ],
    treatments: [
      "Routine cardiovascular lifestyle maintenance (healthy diet, aerobic exercise)",
      "Periodic monitoring through consumer wearables or annual clinically graded ECG screens"
    ],
    devices: "Hospital ICU Monitors (GE HealthCare, Philips Mindray Solutions), Apple Watch Series 4+, Samsung Galaxy Watch Active 2+, Withings ScanWatch.",
    heartRateValue: 72
  },
  tachycardia: {
    name: "Sinus Tachycardia",
    emoji: "🔴",
    color: "text-rose-500",
    borderColor: "border-rose-500/55",
    glowColor: "shadow-rose-550/20",
    bpm: 142,
    soundFrequency: 142,
    description: "Tachycardia is defined as an elevated heart rate exceeding 100 beats per minute at rest. This reduces the diastole resting phase, meaning ventricular chambers have less time to fill before each subsequent contraction.",
    symptoms: [
      "Palpitations (sensation of rapid, pounding heartbeat in chest)",
      "Mild lightheadedness or dizziness under exertion",
      "Decreased stamina and prompt onset of fatigue"
    ],
    dangers: [
      "Increased myocardial oxygen demand, creating potential stress on coronary arteries",
      "Chronically untreated high rates can weaken the heart muscle, leading to cardiomyopathy"
    ],
    treatments: [
      "Vagal maneuvers to stimulate the parasympathetic nervous system (valsalva, cold water facial immersion)",
      "Pharmacological agents (Beta-blockers, Calcium channel blockers), and resting stress therapy"
    ],
    devices: "Clinical Telemetry units, Continuous Holter monitors, Smartwatch active high-heart-rate notifications (Apple, Samsung, Fitbit Premium alerts).",
    heartRateValue: 142
  },
  bradycardia: {
    name: "Sinus Bradycardia",
    emoji: "🟡",
    color: "text-amber-400",
    borderColor: "border-amber-500/55",
    glowColor: "shadow-amber-550/20",
    bpm: 38,
    soundFrequency: 38,
    description: "Bradycardia represents a slow heart rate resting below 60 beats per minute. While common and healthy in highly conditioned endurance athletes, it can decrease systemic cardiac output in non-athletes, causing cerebral hypoxia.",
    symptoms: [
      "Syncope (temporary loss of consciousness, fainting) or extreme lethargy",
      "Chronic confusion or memory impairment due to diminished cerebral perfusion",
      "Shortness of breath (dyspnea) during simple physical movements"
    ],
    dangers: [
      "Inability to generate sufficient mean arterial pressure (MAP) to perfuse vital organs",
      "Potential underlying Sick Sinus Syndrome (SA node dysfunction) or heart blockages"
    ],
    treatments: [
      "Severe clinical cases require surgical implantation of a permanent artificial pacemaker",
      "Review and adjustment of current blocking prescription medications (e.g., beta-blockers)"
    ],
    devices: "Standard 12-lead Electrocardiograms, Implantable loop recorders (ILRs), Smartwatch low heart rate warnings (alerting for prolonged readings under 40-45 BPM).",
    heartRateValue: 38
  },
  arrhythmia: {
    name: "Irregular Arrhythmia (AFib)",
    emoji: "🟠",
    color: "text-orange-500",
    borderColor: "border-orange-500/55",
    glowColor: "shadow-orange-550/20",
    bpm: "IRREGULAR ⚠",
    soundFrequency: 85, // variable average
    description: "Cardiac Arrhythmia represents any deviation from normal electrical sequence timing. In Atrial Fibrillation (AFib), chaotic electrical signals fire rapidly through the atria, causing them to quiver erratically rather than contract properly.",
    symptoms: [
      "Fluttering chest distress with irregular, jumping pulsatile rhythm",
      "Exercise intolerance coupled with episodes of heavy sweating and anxiety",
      "Sudden, unexplained drops in localized systemic blood pressure"
    ],
    dangers: [
      "Incomplete atrial emptying causes blood pooling, greatly increasing blood clot formation and embolic stroke risk",
      "Inability of ventricles to synchronize diminishes cardiac volume efficiency"
    ],
    treatments: [
      "Anticoagulation therapies (blood thinners) to severely reduce regional embolus and stroke risks",
      "Electrical cardioversion procedures or catheter ablation to destroy short-circuited pathways"
    ],
    devices: "AliveCor KardiaMobile (FDA-cleared pocket ECG), hospital ambulatory telemetry beds, smartwatch AFib irregular rhythm notification engines.",
    heartRateValue: 85
  }
};

const DIAGNOSTIC_CHALLENGES = [
  {
    waveformCondition: "tachycardia",
    hints: [
      "The frequency of waveforms is extremely high, with almost no flat baseline resting interval between cycles.",
      "The measured beats-per-minute exceeds 130."
    ],
    question: "A 24-year-old student presents to the university clinic with sudden high-rate heart palpitations, sweating, and anxiety after consuming 4 energy drinks. What is the represented rhythm on the screen?",
    options: [
      "Sinus Bradycardia",
      "Sinus Tachycardia",
      "Normal Sinus Rhythm",
      "Irregular Arrhythmia (AFib)"
    ],
    correctIdx: 1,
    rationale: "Extreme physical exertion, caffeine overdoses, or emotional stressors trigger the SA node to fire accelerated electrical impulses, producing compressed Sinus Tachycardia."
  },
  {
    waveformCondition: "arrhythmia",
    hints: [
      "Look closely at the horizontal space (time) between the sharp spikes: it changes constantly.",
      "There are occasional skipped or double-spaced beats. Baselines show tiny chaotic shakes."
    ],
    question: "An elderly patient with hypertension reports a frequent quivering feeling inside their chest. An ECG check reveals highly irregular, fluctuating intervals between QRS spikes. What diagnostic finding is this?",
    options: [
      "Irregular Arrhythmia (Atrial Fibrillation)",
      "Normal Sinus Rhythm",
      "Bradycardia",
      "Coronary Blockage"
    ],
    correctIdx: 0,
    rationale: "Atrial Fibrillation triggers erratic, chaotic impulses where waves exit in uneven intervals. The disorganized timing of ventricular contractions results in a highly unpredictable, irregular pulse."
  },
  {
    waveformCondition: "bradycardia",
    hints: [
      "There are vast, flat horizontal baselines between each active pulse wave.",
      "The pulse frequency is roughly 35-40 beats per minute."
    ],
    question: "A non-athlete patient is admitted to emergency care with severe lethargy, shortness of breath, and visual blackouts. The monitor captures very isolated, slow PQRST peaks. Which rhythm does this demonstrate?",
    options: [
      "Sinus Tachycardia",
      "Healthy Normal Sinus",
      "Sinus Bradycardia",
      "Ventricular Flutter"
    ],
    correctIdx: 2,
    rationale: "A slow rhythm below 60 BPM (often below 40 in clinical emergencies) is Sinus Bradycardia. Without adequate cardiac rate, vital blood volumes fail to supply the brain cells, triggering syncope."
  }
];

export default function EcgPatternSim() {
  const [selectedCondition, setSelectedCondition] = useState<ConditionKey>("normal");
  const [themeMode, setThemeMode] = useState<"clinical" | "classic">("clinical");
  
  // Custom machine adjustment dials & leads
  const [lead, setLead] = useState<"I" | "II" | "III" | "aVR">("II");
  const [gain, setGain] = useState<number>(1.0); // amplification
  const [sweepSpeed, setSweepSpeed] = useState<number>(1.2); // horizontal scroll rate
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isAudioFeedback, setIsAudioFeedback] = useState<boolean>(false);
  const [showCRTFilters, setShowCRTFilters] = useState<boolean>(true);

  // Challenge Exam State managers
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Lab Report Generator States
  const [patientName, setPatientName] = useState<string>("John Doe (Student-01)");
  const [patientAge, setPatientAge] = useState<number>(25);
  const [physicianNotes, setPhysicianNotes] = useState<string>("Simulated lab testing of artificial signal leads.");
  const [generatedReport, setGeneratedReport] = useState<any | null>(null);

  // References and Canvas logic
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Canvas drawing properties tracking
  const scrollOffsetRef = useRef<number>(0);
  const conditionRef = useRef<ConditionKey>("normal");
  const gainRef = useRef<number>(1.0);
  const speedRef = useRef<number>(1.2);
  const leadRef = useRef<string>("II");

  // Keep references synced with current states to avoid stale closures in frame loops
  useEffect(() => {
    conditionRef.current = selectedCondition;
    gainRef.current = gain;
    speedRef.current = sweepSpeed;
    leadRef.current = lead;
  }, [selectedCondition, gain, sweepSpeed, lead]);

  // Audio synthe-click trigger synchronized to heart rate beats
  const playHeartSound = (isHighOxygen: boolean = true) => {
    if (!isAudioFeedback) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      // Normal/Tachycardia higher frequency bip, irregular/Bradycardia double low sound
      const freq = selectedCondition === "tachycardia" ? 520 : selectedCondition === "bradycardia" ? 380 : 440;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.log("Audio permissions deferred:", e);
    }
  };

  // Automated heart pulse frequency based on the current setting
  useEffect(() => {
    let heartTimer: NodeJS.Timeout;

    const scheduleHeartbeat = () => {
      let intervalMs = 833; // ~72 BPM default

      if (selectedCondition === "tachycardia") {
        intervalMs = 422; // ~142 BPM
      } else if (selectedCondition === "bradycardia") {
        intervalMs = 1578; // ~38 BPM
      } else if (selectedCondition === "arrhythmia") {
        // Randomly fluctuate between 180ms and 1100ms
        intervalMs = 380 + Math.random() * 650;
      }

      heartTimer = setTimeout(() => {
        if (isPlaying) {
          playHeartSound();
        }
        scheduleHeartbeat();
      }, intervalMs);
    };

    scheduleHeartbeat();

    return () => clearTimeout(heartTimer);
  }, [selectedCondition, isPlaying, isAudioFeedback]);

  // HTML5 Canvas ECG Drawing Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use exact offset dimensions
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Responsive sizing
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = 240;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Grid details
    const drawGrid = (width: number, height: number) => {
      ctx.strokeStyle = "rgba(16, 185, 129, 0.04)"; // Neon green trace grids
      ctx.lineWidth = 0.5;

      // Small grid lines (every 10px)
      for (let x = 0; x < width; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 10) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Large clinical grid block lines (every 50px)
      ctx.strokeStyle = "rgba(16, 185, 129, 0.12)";
      ctx.lineWidth = 1.0;
      for (let x = 0; x < width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    // Calculate electrical PQRST potential voltage at point X relative to cycle start
    const getPQRSTValue = (x: number, cycleLen: number, heartGain: number, leadType: string) => {
      // Basic coordinates mapped to typical clinical ECG durations
      // P wave (Atrial contraction)
      // PR segment (delay)
      // QRS complex (Ventricular contraction, rapid de-polarization)
      // ST segment
      // T wave (Ventricular recovery)
      
      const normalizedX = x % cycleLen;

      // Scaling factor representing Lead orientations
      let leadScale = 1.0;
      if (leadType === "III") leadScale = 0.75;
      else if (leadType === "aVR") leadScale = -0.92; // aVR is inverted in traditional 12-lead setups
      else if (leadType === "I") leadScale = 0.85;

      const scale = heartGain * leadScale;
      let val = 0;

      // Adjust timings to cycle limits
      const pStart = 5;
      const pWidth = 12;
      const qStart = 24;
      const rStart = 28;
      const sStart = 32;
      const tStart = 45;
      const tWidth = 16;

      if (normalizedX >= pStart && normalizedX < pStart + pWidth) {
        // P Wave - soft sine bump
        const progress = (normalizedX - pStart) / pWidth;
        val = Math.sin(progress * Math.PI) * 12 * scale;
      } else if (normalizedX >= qStart && normalizedX < rStart) {
        // Q Wave dip
        const progress = (normalizedX - qStart) / (rStart - qStart);
        val = -progress * 15 * scale;
      } else if (normalizedX >= rStart && normalizedX < sStart) {
        // R Wave main peak!
        const rLen = sStart - rStart;
        const progress = (normalizedX - rStart) / rLen;
        if (progress < 0.4) {
          val = -15 * scale + (progress / 0.4) * 110 * scale; // rising edge
        } else {
          val = 95 * scale - ((progress - 0.4) / 0.6) * 125 * scale; // drop to S
        }
      } else if (normalizedX >= sStart && normalizedX < sStart + 6) {
        // S Wave recovery
        const progress = (normalizedX - sStart) / 6;
        val = -30 * scale + progress * 30 * scale;
      } else if (normalizedX >= tStart && normalizedX < tStart + tWidth) {
        // T Wave - medium secondary wave
        const progress = (normalizedX - tStart) / tWidth;
        val = Math.sin(progress * Math.PI) * 22 * scale;
      }

      // Add a slight baseline chaotic noise for all cycles (0.8px drift)
      val += (Math.sin(x * 0.15) * 0.8 + (Math.random() - 0.5) * 1.2);

      return val;
    };

    let animationFrameId: number;

    // We keep track of a sequence of historical X gaps for Arrhythmia rhythm irregularity
    const arrhythmiaGaps: number[] = [];
    for (let i = 0; i < 15; i++) {
      // Push irregular gaps matching active AFib parameters
      arrhythmiaGaps.push(65 + Math.floor(Math.random() * 155));
    }

    const render = () => {
      if (!ctx || !canvas) return;

      // Clear layout
      ctx.fillStyle = themeMode === "clinical" ? "#020617" : "#fafafa";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawGrid(canvas.width, canvas.height);

      // Start line tracer drawing bounds
      ctx.beginPath();
      ctx.strokeStyle = themeMode === "clinical" ? "#10b981" : "#10b981"; // Neon green trace style
      ctx.lineWidth = 2.4;
      ctx.shadowBlur = themeMode === "clinical" ? 8 : 1;
      ctx.shadowColor = "rgba(16, 185, 129, 0.8)";
      ctx.lineJoin = "round";

      // Increment visual offset relative to speed configuration
      if (isPlaying) {
        scrollOffsetRef.current += speedRef.current;
      }

      const activeCondition = conditionRef.current;
      const currentGain = gainRef.current;
      const currentLead = leadRef.current;

      // Define static values per condition rhythm
      let cycleLength = 120; // default for 72 BPM

      if (activeCondition === "tachycardia") {
        cycleLength = 60; // elevated and compressed frequency
      } else if (activeCondition === "bradycardia") {
        cycleLength = 230; // low slow frequency
      }

      const startDrawingX = 0;
      const baselineY = canvas.height / 2 + 15; // center vertical alignment offset

      // Iterate width pixel-by-pixel to render continuous static scroll line
      for (let screenX = 0; screenX < canvas.width; screenX++) {
        // Map screen space position to historical time sequence
        const timeIndex = screenX + scrollOffsetRef.current;
        let yOffset = 0;

        if (activeCondition === "arrhythmia") {
          // Arrhythmia has irregular dynamically computed cycles
          // We map timeIndex over sequence of irregular arrhythmia periods
          let accumulatedSum = 0;
          let currentPeriodIdx = 0;
          let currentSegmentOffset = 0;

          // Deterministic mapping to make the wave smooth along screen pixels
          let indexCounter = Math.floor(timeIndex / 160) % arrhythmiaGaps.length;
          let testCycleLen = arrhythmiaGaps[indexCounter];
          let normalizedInCycle = timeIndex % testCycleLen;

          // Calculate vertical potential
          yOffset = getPQRSTValue(normalizedInCycle, testCycleLen, currentGain, currentLead);
          
          // Randomly attenuate or strengthen height of irregular contractions (simulating pulse deficits)
          if (indexCounter % 3 === 0) {
            yOffset *= 0.65;
          } else if (indexCounter % 5 === 0) {
            yOffset *= 1.25; 
          }
        } else {
          // Standard uniform rhythm cycles (Normal, Tachycardia, Bradycardia)
          yOffset = getPQRSTValue(timeIndex, cycleLength, currentGain, currentLead);
        }

        const screenY = baselineY - yOffset;

        if (screenX === 0) {
          ctx.moveTo(screenX, screenY);
        } else {
          ctx.lineTo(screenX, screenY);
        }
      }

      ctx.stroke();

      // Draw active monitor terminal scanning indicator beam at the right boundary
      ctx.shadowBlur = 0;
      
      // Request next frame
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [selectedCondition, gain, sweepSpeed, lead, themeMode, isPlaying]);

  // Handle assessment quiz selection logic
  const handleQuizAnswer = (optionIdx: number) => {
    if (quizSubmitted) return;
    setQuizSelectedAnswer(optionIdx);
  };

  const submitQuizSelection = () => {
    if (quizSelectedAnswer === null || quizSubmitted) return;
    setQuizSubmitted(true);
    
    const correctIdx = DIAGNOSTIC_CHALLENGES[currentQuizIdx].correctIdx;
    if (quizSelectedAnswer === correctIdx) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const advanceQuiz = () => {
    setQuizSelectedAnswer(null);
    setQuizSubmitted(false);
    setShowHint(false);

    if (currentQuizIdx < DIAGNOSTIC_CHALLENGES.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
      // Auto switch the simulator waveform preview to match the next question challenge background waveform to let them study!
      setSelectedCondition(DIAGNOSTIC_CHALLENGES[currentQuizIdx + 1].waveformCondition as ConditionKey);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuizProcess = () => {
    setCurrentQuizIdx(0);
    setQuizSelectedAnswer(null);
    setQuizSubmitted(false);
    setQuizCompleted(false);
    setQuizScore(0);
    setShowHint(false);
    setSelectedCondition(DIAGNOSTIC_CHALLENGES[0].waveformCondition as ConditionKey);
  };

  // Launch standalone lab patient checkup generation reports
  const triggerReportGeneration = (e: React.FormEvent) => {
    e.preventDefault();
    const condInfo = CONDITIONS[selectedCondition];
    setGeneratedReport({
      id: "REP-" + Math.floor(100000 + Math.random() * 900000),
      name: patientName,
      age: patientAge,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + " UTC",
      diagnosedRhythm: condInfo.name,
      observedBpm: typeof condInfo.bpm === "number" ? condInfo.bpm : "92 (Variable Fibrillation)",
      notes: physicianNotes,
      status: selectedCondition === "normal" ? "STABLE // UNRESTRICTED" : selectedCondition === "bradycardia" ? "OBSERVATION // PACE_MONITOR" : "CRITICAL ALERT // MEDS_REPAIR"
    });
  };

  // Heartbeat micro pulse rate class helper definitions
  const getHeartPulseSpeedClass = () => {
    if (!isPlaying) return "";
    if (selectedCondition === "tachycardia") return "animate-heart-pulse duration-[0.4s]";
    if (selectedCondition === "bradycardia") return "animate-heart-pulse duration-[1.8s]";
    if (selectedCondition === "arrhythmia") return "animate-heart-pulse duration-[0.7s] opacity-90";
    return "animate-heart-pulse duration-[0.85s]"; // normal sinus steady
  };

  return (
    <div className={`p-4 md:p-6 flex-1 flex flex-col gap-6 animate-fade-in ${
      themeMode === "clinical" ? "bg-slate-950 text-slate-100" : "bg-neutral-50 text-slate-800"
    }`} id="ecg-feature-view">
      
      {/* SECTION BANNER HEADS-UP OVERVIEW */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
        themeMode === "clinical" 
          ? "bg-slate-900/45 border-slate-800/80 shadow-inner" 
          : "bg-white border-slate-200 shadow-sm"
      }`} id="syllabus-intro">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
            <Activity className="w-6 h-6 shrink-0" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-cyan-400 bg-cyan-950/45 px-2 py-0.5 rounded border border-cyan-800/15">
                SYLLABUS MODULE 02 OF 06
              </span>
              <span className="text-xs text-slate-500">University Assessment</span>
            </div>
            <h2 className="text-lg font-bold font-display mt-0.5">Smart ECG Pattern Detection</h2>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-500 space-y-1">
          <div>TOPIC: <span className="text-slate-300">Electro-Cardiology & Arrhythmia</span></div>
          <div>EST. LAB TIME: <span className="text-slate-300">12 mins // Interactive Exam</span></div>
        </div>
      </div>

      {/* CORE WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE MONITORS AND TUNERS (SPAN 8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* RHYTHM SELECTOR - CONDITIONAL ACTION TABS */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-mono text-slate-500 tracking-wider">CHOOSE CARDIAC RHYTHM TO SIMULATE:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(Object.keys(CONDITIONS) as Array<ConditionKey>).map((key) => {
                const item = CONDITIONS[key];
                const isSelected = selectedCondition === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedCondition(key);
                      // Auto override/fill up report generator patient context for better speed
                      if (key === "arrhythmia") {
                        setPhysicianNotes("Quivering sensation in anterior chest wall. AFib diagnostic warning flagged.");
                      } else if (key === "tachycardia") {
                        setPhysicianNotes("Sinus tachycardia with rate of 142. Myocardial load elevated.");
                      } else if (key === "bradycardia") {
                        setPhysicianNotes("Sinus bradycardia, highly isolated cycles. Monitor for syncope risk.");
                      } else {
                        setPhysicianNotes("Regular cardiac profile. General physical clear.");
                      }
                    }}
                    className={`p-3 rounded-xl border text-xs font-semibold tracking-tight transition-all text-left flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? themeMode === "clinical"
                          ? "bg-cyan-950/30 border-cyan-400 text-cyan-350 shadow-lg shadow-cyan-950/50 scale-[1.02]"
                          : "bg-cyan-50 border-cyan-500 text-cyan-800 scale-[1.02] shadow-sm"
                        : themeMode === "clinical"
                          ? "bg-slate-900/40 border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-800"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                    id={`btn-select-rhythm-${key}`}
                  >
                    <span className="text-lg mb-1">{item.emoji}</span>
                    <div>
                      <div className="text-[9px] font-mono text-slate-500 font-normal">DIAGNOSTIC RHYTHM</div>
                      <div className="font-bold truncate mt-0.5">{item.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAIN VISUAL: SCAN FEED CANVAS MODULE */}
          <div className={`relative border rounded-2xl overflow-hidden transition-all ${
            themeMode === "clinical" 
              ? "border-slate-850 bg-slate-900/60 shadow-xl" 
              : "border-slate-250 bg-white shadow-md shadow-slate-200/40"
          }`}>
            
            {/* CANVAS BEZEL TOP HEADER STRIP */}
            <div className={`px-4 py-3 flex items-center justify-between text-xs border-b ${
              themeMode === "clinical" 
                ? "bg-slate-950/70 border-slate-850/80 text-slate-450" 
                : "bg-slate-50 border-slate-150 text-slate-500"
            }`}>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-emerald-400 animate-pulse" : "bg-red-500"}`} />
                <span className="font-mono font-bold tracking-tight">
                  {lead === "aVR" ? "LEAD_aVR // UNBALANCED" : `LEAD_${lead} // STABILIZED_FEED`}
                </span>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono">
                <span>SWEEP: <span className="text-cyan-400 font-bold">{sweepSpeed.toFixed(1)}x</span></span>
                <span>GAIN: <span className="text-cyan-400 font-bold">{gain.toFixed(1)}x</span></span>
                <span className="hidden md:inline">SYSTEM: 1000_Hz_SAMP</span>
              </div>
            </div>

            {/* THE WAVE-SCREEN CONTAINER WITH GLASS CRT SCANLINE EFFECT */}
            <div className="relative">
              {/* Actual Canvas */}
              <canvas 
                ref={canvasRef} 
                className="w-full h-[240px] block" 
                id="live-ecg-oscilloscope"
              />

              {/* CRT GRID AND SCANLINE SHADOWS FILTER (Toggleable) */}
              {showCRTFilters && themeMode === "clinical" && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-950/[0.03] to-transparent bg-[size:100%_4px]" />
              )}

              {/* LIVE WATERMARK CORNER STAMP */}
              <div className="absolute top-3 right-3 pointer-events-none flex items-center gap-1.5 px-2 py-1 rounded bg-slate-950/80 border border-slate-850 text-[10px] font-mono font-bold tracking-wider text-rose-500">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                <span>LIVE FEED</span>
              </div>

              {/* SIGNAL STATUS ALERTS OVERLAYS */}
              {selectedCondition === "arrhythmia" && (
                <div className="absolute bottom-3 left-3 pointer-events-none px-3 py-1.5 rounded-lg bg-orange-950/80 border border-orange-800/40 text-[10px] font-mono flex items-center gap-2 text-orange-400">
                  <AlertTriangle className="w-3.5 h-3.5 wave-icon shrink-0" />
                  <span>ALERT: COMPLEX_POLARITY_AFib // PULSE DEFICIT REGISTERED</span>
                </div>
              )}
            </div>

            {/* INTERACTIVE CONTROLS BAR (TUNERS) */}
            <div className={`p-4 border-t grid grid-cols-1 sm:grid-cols-12 gap-4 items-center ${
              themeMode === "clinical" 
                ? "bg-slate-950/60 border-slate-850" 
                : "bg-slate-50 border-slate-200"
            }`}>
              {/* Play Pause Sweep */}
              <div className="sm:col-span-3 flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all text-slate-100 cursor-pointer ${
                    isPlaying 
                      ? "bg-neutral-800 border-neutral-700 hover:bg-neutral-700" 
                      : "bg-emerald-600 border-emerald-700 hover:bg-emerald-500"
                  }`}
                  id="btn-play-pause-ecg"
                >
                  <Activity className="w-3.5 h-3.5" />
                  {isPlaying ? "FREEZE SCAN" : "START SCAN"}
                </button>
              </div>

              {/* Tuning sliders */}
              <div className="sm:col-span-4 flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-500 font-bold shrink-0">GAIN (AMP):</span>
                <input 
                  type="range" 
                  min="0.4" 
                  max="1.8" 
                  step="0.1" 
                  value={gain} 
                  onChange={(e) => setGain(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="sm:col-span-3 flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-500 font-bold shrink-0">SWEEP (TIME):</span>
                <input 
                  type="range" 
                  min="0.6" 
                  max="2.5" 
                  step="0.2" 
                  value={sweepSpeed} 
                  onChange={(e) => setSweepSpeed(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Calibration resets */}
              <div className="sm:col-span-2 flex justify-end">
                <button 
                  onClick={() => {
                    setGain(1.0);
                    setSweepSpeed(1.2);
                    setLead("II");
                  }}
                  className={`p-1.5 rounded-lg border text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                    themeMode === "clinical" 
                      ? "bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-400" 
                      : "bg-white border-slate-250 hover:bg-slate-100 text-slate-600"
                  }`}
                  title="Reset Dials to default 1x lead II"
                >
                  <RotateCcw className="w-3 h-3" />
                  CALIBRATE
                </button>
              </div>
            </div>
            
          </div>

          {/* SECTION: DETAILED CONDITION CLINICAL EDUCATION CARD (BOTTOM) */}
          <div className={`transition-all ${
            themeMode === "clinical" ? "animate-fade-in" : ""
          }`}>
            <div className={`border rounded-2xl p-5 md:p-6 transition-all ${
              themeMode === "clinical" 
                ? "bg-slate-900/60 border-slate-850 shadow-inner" 
                : "bg-white border-slate-200 shadow-sm"
            }`} id="condition-education-card">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/40 pb-4 mb-4">
                <div className="flex items-center gap-3.5">
                  <span className="text-3xl filter drop-shadow">
                    {CONDITIONS[selectedCondition].emoji}
                  </span>
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 tracking-widest font-bold">PHYSIOLOGY INTERPRETATION STUDY</span>
                    <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-100 text-emerald-450">
                      {CONDITIONS[selectedCondition].name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">Live Beats Rate:</span>
                  <span className={`text-sm font-bold font-mono px-2.5 py-1 rounded-md bg-slate-950 border border-slate-850 ${CONDITIONS[selectedCondition].color}`}>
                    {CONDITIONS[selectedCondition].bpm} {typeof CONDITIONS[selectedCondition].bpm === "number" ? "BPM" : ""}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                {CONDITIONS[selectedCondition].description}
              </p>

              {/* THREE COLUMN MEDICAL METADATA GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                
                {/* Symptoms column */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-350 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    Key Symptoms
                  </div>
                  <ul className="space-y-2">
                    {CONDITIONS[selectedCondition].symptoms.map((sym, idx) => (
                      <li key={idx} className="text-[11px] text-slate-400 flex items-start gap-1.5 leading-snug">
                        <span className="text-emerald-500 font-bold shrink-0">✓</span>
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dangers column */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-450 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    Clinical Risks / Dangers
                  </div>
                  <ul className="space-y-2">
                    {CONDITIONS[selectedCondition].dangers.map((dang, idx) => (
                      <li key={idx} className="text-[11px] text-slate-400 flex items-start gap-1.5 leading-snug">
                        <span className="text-red-500 font-bold shrink-0">⚠</span>
                        <span>{dang}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Treatment column */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Intervention / Treatment
                  </div>
                  <ul className="space-y-2">
                    {CONDITIONS[selectedCondition].treatments.map((treat, idx) => (
                      <li key={idx} className="text-[11px] text-slate-400 flex items-start gap-1.5 leading-snug">
                        <span className="text-cyan-400 font-bold shrink-0">•</span>
                        <span>{treat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* WEARABLE SENSOR SUPPORT STRIP */}
              <div className="mt-6 pt-4 border-t border-slate-800/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] font-mono text-slate-500">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>DEVICE_COMPATIBILITY_NOTE:</span>
                </div>
                <div className="text-slate-400 text-right max-w-xl truncate" title={CONDITIONS[selectedCondition].devices}>
                  {CONDITIONS[selectedCondition].devices}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: REVIEWS, LIVE DATA MONITORS & CHALLENGE ACCORDIONS (SPAN 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* VITAL STATISTICS PANEL */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
            themeMode === "clinical" 
              ? "bg-slate-900/60 border-slate-850 shadow-lg" 
              : "bg-white border-slate-200 shadow-sm"
          }`} id="vital-stats-panel">
            
            <div className="flex items-center justify-between border-b border-slate-800/40 pb-3 mb-4">
              <h3 className="text-xs font-mono font-bold text-slate-450 uppercase flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                Live Telemetry Monitors
              </h3>
              <span className="text-[9px] font-mono bg-slate-950 px-1.5 py-0.5 rounded text-emerald-400 border border-slate-850">
                SWEEP_ON
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              
              {/* Vital Stat: BPM Heart Rate */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-900 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>PULSER_RATE</span>
                  <Heart className={`w-3.5 h-3.5 text-rose-500 ${getHeartPulseSpeedClass()}`} />
                </div>
                <div className="mt-2.5 flex items-baseline gap-1">
                  <span className={`text-3xl font-bold font-mono tracking-tight ${CONDITIONS[selectedCondition].color}`}>
                    {selectedCondition === "arrhythmia" ? "---" : CONDITIONS[selectedCondition].bpm}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">BPM</span>
                </div>
                <div className="text-[8px] font-mono text-slate-500 mt-1">
                  {selectedCondition === "arrhythmia" ? "AFib Variant State" : "SA node baseline pulse"}
                </div>
              </div>

              {/* Vital Stat: SpO2 Oxygenation */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-900 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>OX_SAT_SpO2</span>
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="mt-2.5 flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono text-cyan-400 tracking-tight">
                    {selectedCondition === "normal" ? "99" : selectedCondition === "tachycardia" ? "97" : selectedCondition === "bradycardia" ? "93" : "90"}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">%</span>
                </div>
                <div className="text-[8px] font-mono text-slate-500 mt-1">
                  {selectedCondition === "normal" ? "Normal arterial sat" : selectedCondition === "arrhythmia" ? "Variable organ risk" : "Marginal blood delay"}
                </div>
              </div>

              {/* Vital Stat: Heart Sound wave type selector */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-900 flex flex-col justify-between col-span-2">
                <div className="text-[10px] font-mono text-slate-500 flex justify-between items-center">
                  <span>SELECT SIGNAL LEADS</span>
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                </div>
                
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  {(["I", "II", "III", "aVR"] as const).map((leadOption) => (
                    <button
                      key={leadOption}
                      onClick={() => setLead(leadOption)}
                      className={`py-1 rounded font-mono text-xs font-bold transition-all ${
                        lead === leadOption
                          ? "bg-cyan-950 border border-cyan-500 text-cyan-400"
                          : "bg-slate-900 hover:bg-slate-850 hover:text-slate-350 border border-transparent text-slate-500"
                      }`}
                    >
                      {leadOption}
                    </button>
                  ))}
                </div>

                <div className="mt-2 text-[8px] font-mono text-slate-500 leading-snug">
                  *Changes vertical wave deflection vector. AVR showcases inverted polarity typical of normal anatomy.
                </div>
              </div>

            </div>

            {/* AUDIO FEEDBACK MUTING ACCORDION */}
            <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Sliders className="w-3 h-3 text-slate-500" />
                Beeper Volume
              </span>
              <button
                onClick={() => setIsAudioFeedback(!isAudioFeedback)}
                className={`py-1 px-3.5 rounded-lg border text-[10px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer ${
                  isAudioFeedback 
                    ? "bg-emerald-950 border-emerald-500 text-emerald-400" 
                    : "bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-400"
                }`}
              >
                {isAudioFeedback ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                {isAudioFeedback ? "MONITOR CHIRP: ON" : "MONITOR CHIRP: OFF"}
              </button>
            </div>

          </div>

          {/* ASSESSMENT SYSTEM TAB */}
          <div className={`p-5 rounded-2xl border transition-all ${
            themeMode === "clinical" 
              ? "bg-slate-900/60 border-slate-850 shadow-lg" 
              : "bg-white border-slate-200 shadow-sm"
          }`} id="assessment-blockWidget">
            
            <div className="flex items-center justify-between border-b border-slate-800/40 pb-3 mb-4">
              <h3 className="text-xs font-mono font-bold text-slate-450 uppercase flex items-center gap-1.5">
                <Award className="w-4 h-4 text-cyan-400" />
                Interactive Diagnostic Quiz
              </h3>
              
              <button 
                onClick={() => setIsQuizMode(!isQuizMode)}
                className="text-[10px] font-mono underline text-cyan-450 hover:text-cyan-350 cursor-pointer"
              >
                {isQuizMode ? "Minimize Quiz" : "Study Mode Offline"}
              </button>
            </div>

            {!isQuizMode ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-900 text-xs">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5 mb-1.5">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    How to trace wave segments?
                  </div>
                  <p className="text-[11px] text-slate-450 leading-relaxed mb-3">
                    Medical waveforms mapped in this simulator display traditional physiological boundaries. Use the simulator selectors above to cycle, then test your pacing detection precision.
                  </p>
                  <button
                    onClick={() => {
                      setIsQuizMode(true);
                      restartQuizProcess();
                    }}
                    className="w-full py-2 bg-cyan-950 hover:bg-cyan-900/80 border border-cyan-800 text-cyan-350 font-bold rounded-lg text-xs font-mono transition-all uppercase cursor-pointer"
                  >
                    Launch Calibration Quiz
                  </button>
                </div>
              </div>
            ) : (
              // ACTIVE QUIZ INTERACTION SHELL
              <div className="space-y-3.5 animate-fade-in" id="quiz-question-box">
                {quizCompleted ? (
                  /* Score results */
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 text-center space-y-3 text-xs">
                    <div className="text-3xl">🎓</div>
                    <h4 className="font-bold text-slate-100 font-display text-sm">Assessment Completed</h4>
                    <div className="text-xl font-mono font-bold text-emerald-450">
                      Score: {quizScore} / {DIAGNOSTIC_CHALLENGES.length}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      We recommend reading the physiological summaries below for deep academic revision.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={restartQuizProcess}
                        className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] text-slate-350 font-mono cursor-pointer"
                      >
                        RETRY EXAM
                      </button>
                      <button
                        onClick={() => setIsQuizMode(false)}
                        className="flex-1 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 rounded-lg text-[10px] text-cyan-350 font-mono cursor-pointer"
                      >
                        EXIT SYSTEM
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Active Question */
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>CHALLENGE: {currentQuizIdx + 1} OF {DIAGNOSTIC_CHALLENGES.length}</span>
                      <span className="text-emerald-400 font-bold">SCORE: {quizScore}</span>
                    </div>

                    <p className="text-slate-300 leading-relaxed font-semibold">
                      {DIAGNOSTIC_CHALLENGES[currentQuizIdx].question}
                    </p>

                    {/* Hint Accordion */}
                    <div>
                      {!showHint ? (
                        <button 
                          onClick={() => setShowHint(true)}
                          className="text-[10px] font-mono text-slate-500 underline hover:text-slate-400"
                        >
                          Show wave hint...
                        </button>
                      ) : (
                        <div className="p-2.5 rounded bg-slate-950 border border-slate-900 text-[10px] text-slate-400 leading-relaxed space-y-1">
                          <span className="font-bold text-slate-300">ECG Segment Clue:</span>
                          {DIAGNOSTIC_CHALLENGES[currentQuizIdx].hints.map((hint, hi) => (
                            <p key={hi}>• {hint}</p>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Radio Options List */}
                    <div className="space-y-1.5">
                      {DIAGNOSTIC_CHALLENGES[currentQuizIdx].options.map((option, opIdx) => {
                        const isChosen = quizSelectedAnswer === opIdx;
                        const isCorrect = DIAGNOSTIC_CHALLENGES[currentQuizIdx].correctIdx === opIdx;
                        
                        let optionStyle = "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700";
                        if (isChosen) {
                          optionStyle = "border-cyan-500 bg-cyan-950/20 text-cyan-300";
                        }
                        if (quizSubmitted) {
                          if (isCorrect) {
                            optionStyle = "border-emerald-500 bg-emerald-950/30 text-emerald-400";
                          } else if (isChosen) {
                            optionStyle = "border-rose-950 bg-rose-950/20 text-rose-400";
                          } else {
                            optionStyle = "border-slate-900 bg-slate-950/40 text-slate-600 opacity-50";
                          }
                        }

                        return (
                          <button
                            key={opIdx}
                            disabled={quizSubmitted}
                            onClick={() => handleQuizAnswer(opIdx)}
                            className={`w-full p-2.5 rounded-lg border text-left text-[11px] transition-all flex items-center justify-between ${optionStyle} ${!quizSubmitted ? "cursor-pointer" : ""}`}
                          >
                            <span>{option}</span>
                            {quizSubmitted && isCorrect && (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Action button */}
                    {!quizSubmitted ? (
                      <button
                        onClick={submitQuizSelection}
                        disabled={quizSelectedAnswer === null}
                        className={`w-full py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                          quizSelectedAnswer !== null
                            ? "bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-350 cursor-pointer"
                            : "bg-slate-950 border border-slate-900 text-slate-600 cursor-not-allowed"
                        }`}
                      >
                        SUBMIT DIAGNOSIS
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="p-2 bg-slate-950 border border-slate-900 text-[10px] text-slate-400 leading-snug">
                          <span className="font-bold text-slate-300">Medical Rationale: </span>
                          {DIAGNOSTIC_CHALLENGES[currentQuizIdx].rationale}
                        </div>
                        <button
                          onClick={advanceQuiz}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold rounded-lg text-xs transition-all cursor-pointer"
                        >
                          {currentQuizIdx < DIAGNOSTIC_CHALLENGES.length - 1 ? "NEXT CHALLENGE" : "COMPLETE ASSESSMENT"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* PATIENT CLINICAL TELEMETRY EXPORT FORM REPORT GENERATOR */}
          <div className={`p-5 rounded-2xl border transition-all ${
            themeMode === "clinical" 
              ? "bg-slate-900/60 border-slate-850 shadow-lg" 
              : "bg-white border-slate-200 shadow-sm"
          }`} id="patient-report-panel">
            
            <div className="flex items-center justify-between border-b border-slate-800/40 pb-3 mb-4">
              <h3 className="text-xs font-mono font-bold text-slate-450 uppercase flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                ECG Lab Report Generator
              </h3>
            </div>

            <form onSubmit={triggerReportGeneration} className="space-y-3.5 text-xs">
              
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[10px] font-mono text-slate-500 mb-1">PATIENT NAME:</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 rounded px-2.5 py-1.5 text-slate-300 font-mono focus:outline-none focus:border-cyan-850"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 mb-1">AGE:</label>
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(parseInt(e.target.value) || 25)}
                    className="w-full bg-slate-950 border border-slate-900 rounded px-2.5 py-1.5 text-slate-300 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 mb-1">CLINICAL OBSERVATION NOTES:</label>
                <textarea
                  value={physicianNotes}
                  onChange={(e) => setPhysicianNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-900 rounded px-2.5 py-1.5 text-slate-300 font-mono focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-950 hover:bg-emerald-900/80 border border-emerald-900/50 text-emerald-350 font-bold font-mono rounded-lg transition-all cursor-pointer"
              >
                PRODUCE CALIBRATED LAB SHEET
              </button>

            </form>

            {/* GENERATED LAB REPORT ACCORDION MODAL */}
            {generatedReport && (
              <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-900 space-y-2.5 text-[11px] font-mono animate-fade-in line-clamp-none overflow-hidden" id="report-sheet-result">
                
                <div className="flex justify-between items-center border-b border-slate-900 pb-2 text-slate-400">
                  <span className="text-emerald-400 font-bold">{generatedReport.id}</span>
                  <button 
                    onClick={() => setGeneratedReport(null)}
                    className="text-[10px] text-slate-500 hover:text-slate-300 hover:underline"
                  >
                    DISMISS
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-y-1.5 text-slate-450">
                  <div>PATIENT_NAME:</div>
                  <div className="font-bold text-slate-200">{generatedReport.name}</div>
                  
                  <div>AGE:</div>
                  <div className="font-bold text-slate-200">{generatedReport.age} Yrs</div>

                  <div>SCAN TIME:</div>
                  <div className="text-slate-350 truncate">{generatedReport.timestamp}</div>

                  <div>RHYTHM TYPE:</div>
                  <div className="font-bold text-cyan-400 text-xs">{generatedReport.diagnosedRhythm}</div>

                  <div>PROVEN BPM:</div>
                  <div className="font-bold text-rose-450">{generatedReport.observedBpm}</div>

                  <div>VITAL STATUS:</div>
                  <div className="text-[10px] font-bold text-orange-400">{generatedReport.status}</div>
                </div>

                <div className="pt-2 border-t border-slate-900">
                  <div className="text-[9px] text-slate-500 uppercase mb-1">OBSERVATION STATEMENT:</div>
                  <div className="bg-slate-900/40 p-2 border border-slate-900/60 rounded text-slate-300 leading-snug">
                    {generatedReport.notes}
                  </div>
                </div>

                <div className="text-[8px] text-slate-500 text-center uppercase pt-1 border-t border-slate-900/50">
                  * university MVP simulation copy only. No real liability holds.
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* FOOTER METADATA STAMP BAR */}
      <footer className={`px-6 py-4 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono transition-colors ${
        themeMode === "clinical" 
          ? "border-slate-900 bg-slate-950/80 text-slate-450" 
          : "border-slate-200 bg-slate-100 text-slate-500"
      }`} id="primary-footer">
        <div>
          <span>BILP Biomedical v1.2 // Module_02 of_06 // University MVP Draft Demo</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-cyan-500 animate-spin-slow" />
            ENGINE_ONLINE
          </span>
          <span>CALIBRATED FOR MULTIPLE RESOLUTIONS</span>
        </div>
      </footer>
      
    </div>
  );
}
