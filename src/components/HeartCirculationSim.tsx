import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  Activity, 
  Lightbulb, 
  Layers, 
  Volume2, 
  VolumeX, 
  Award,
  HelpCircle,
  Clock,
  Heart,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

// Structure of information for interactive click overlays
interface AnatomicalStructure {
  name: string;
  fullName: string;
  role: string;
  bloodType: "Oxygenated" | "Deoxygenated" | "Mixed" | "N/A";
  pressureRange: string;
  o2Saturation: string;
  clinicalNote: string;
}

const structureData: Record<string, AnatomicalStructure> = {
  ra: {
    name: "Right Atrium",
    fullName: "Right Atrium (RA)",
    role: "Receives low-oxygen blood returning from the upper and lower body via the superior and inferior vena cava.",
    bloodType: "Deoxygenated",
    pressureRange: "2 - 6 mmHg",
    o2Saturation: "approx. 75%",
    clinicalNote: "Atrial Septal Defect (ASD) is a congenital opening between the RA and LA, causing blood shunting."
  },
  rv: {
    name: "Right Ventricle",
    fullName: "Right Ventricle (RV)",
    role: "Receives deoxygenated blood from the RA and pumps it into the low-pressure pulmonary circulation towards the lungs.",
    bloodType: "Deoxygenated",
    pressureRange: "15 - 25 mmHg (Systolic)",
    o2Saturation: "approx. 75%",
    clinicalNote: "Right ventricular hypertrophy occurs when the RV has to pump against high pulmonary artery pressures."
  },
  la: {
    name: "Left Atrium",
    fullName: "Left Atrium (LA)",
    role: "Receives highly oxygenated blood freshly returned from the lungs via the four pulmonary veins.",
    bloodType: "Oxygenated",
    pressureRange: "6 - 12 mmHg",
    o2Saturation: "approx. 95% - 100%",
    clinicalNote: "Mitral stenosis increases Left Atrium pressure, potentially leading to pulmonary congestion and atrial fibrillation."
  },
  lv: {
    name: "Left Ventricle",
    fullName: "Left Ventricle (LV)",
    role: "Pumps oxygen-rich blood into the high-resistance systemic circulation through the aorta to sustain all body organs.",
    bloodType: "Oxygenated",
    pressureRange: "100 - 140 mmHg (Systolic)",
    o2Saturation: "approx. 95% - 100%",
    clinicalNote: "The thickest chamber. LV failure leads to congestive heart failure and fluid accumulation in the lungs."
  },
  lungs: {
    name: "Lungs",
    fullName: "Pulmonary Capillaries (Lungs)",
    role: "Site of gas exchange. Carbon dioxide is exhaled, and high concentrations of inhaled oxygen bind to hemoglobin.",
    bloodType: "Mixed",
    pressureRange: "10 - 20 mmHg",
    o2Saturation: "Starts at 75%, exits at 98%",
    clinicalNote: "Pulmonary embolism is a blockage in pulmonary arteries that stops purification, causing sudden hypoxia."
  },
  body: {
    name: "Systemic Circulation",
    fullName: "Body Organs & Tissue",
    role: "Oxygen and nutrients are delivered to tissues for cellular respiration, while CO2 is picked up to return to the heart.",
    bloodType: "Mixed",
    pressureRange: "80 - 120 mmHg (Systemic)",
    o2Saturation: "Drops from 98% down to 75%",
    clinicalNote: "Systemic hypertension forces the heart to work harder, eventually leading to left ventricular failure."
  },
  tricuspid: {
    name: "Tricuspid Valve",
    fullName: "Tricuspid Valve",
    role: "A three-cusp valve preventing systemic backflow from the RV into the RA during ventricular contraction (systole).",
    bloodType: "Deoxygenated",
    pressureRange: "Closes at RV systolic pressure",
    o2Saturation: "approx. 75%",
    clinicalNote: "Tricuspid regurgitation allows blood to leak backwards into the Right Atrium, causing venous congestion."
  },
  bicuspid: {
    name: "Bicuspid Valve",
    fullName: "Bicuspid (Mitral) Valve",
    role: "A dual-cusp valve preventing blood from leaking backwards from the heavy-pumping LV into the LA during systole.",
    bloodType: "Oxygenated",
    pressureRange: "Closes at LV systolic pressure",
    o2Saturation: "98% - 100%",
    clinicalNote: "Mitral Valve Prolapse (MVP) is the most common heart valve abnormality where leaflets bulge into the atrium."
  },
  venaCava: {
    name: "Vena Cava",
    fullName: "Superior & Inferior Vena Cava",
    role: "The largest venous channels in the body. Return deoxygenated system blood back to the right inlet of the heart.",
    bloodType: "Deoxygenated",
    pressureRange: "2 - 6 mmHg",
    o2Saturation: "approx. 75%",
    clinicalNote: "Central venous pressure measured here reflects fluid volume status and right heart function."
  },
  pulmonaryArtery: {
    name: "Pulmonary Artery",
    fullName: "Main Pulmonary Artery & Branches",
    role: "The unique artery that carries oxygen-poor, blue blood from the RV to the lungs for purification.",
    bloodType: "Deoxygenated",
    pressureRange: "15 - 25 mmHg (Systolic)",
    o2Saturation: "approx. 75%",
    clinicalNote: "Pulmonary Hypertension is abnormally high blood pressure in this artery, straining the right ventricle."
  },
  pulmonaryVein: {
    name: "Pulmonary Vein",
    fullName: "Pulmonary Veins (4)",
    role: "The unique veins that deliver oxygen-saturated, bright red blood directly from the lungs to the Left Atrium.",
    bloodType: "Oxygenated",
    pressureRange: "6 - 12 mmHg",
    o2Saturation: "approx. 95% - 100%",
    clinicalNote: "Anomalous pulmonary venous connection is a critical birth defect where these veins drain elsewhere."
  },
  aorta: {
    name: "Aorta",
    fullName: "Aortic Arch & Systemic Arteries",
    role: "The main high-pressure trunk receiving systemic blood from the LV and distributing it through expanding arterial branches.",
    bloodType: "Oxygenated",
    pressureRange: "100 - 140 mmHg (Systolic)",
    o2Saturation: "approx. 98%",
    clinicalNote: "Aortic dissection is a life-threatening tear in the inner layer of the aorta, requiring emergency bypass."
  }
};

const STEPS = [
  {
    id: 0,
    title: "1. Vena Cava Intake",
    description: "Oxygen-depleted (deoxygenated) blue blood returns from the body organs through the superior and inferior Vena Cava, channeling directly into the Right Atrium.",
    pathway: "BODY → Vena Cava → Right Atrium",
    subText: "The Right Atrium acts as a low-pressure systemic receiver. Valves are relaxed, preparing the heart's right-side chambers.",
    activeElements: ["body", "venaCava", "ra"]
  },
  {
    id: 1,
    title: "2. Tricuspid Valve Gate",
    description: "As the Right Atrium fills and contracts, pressure overcomes the chamber, forcing the Tricuspid Valve to slide open like a clinical gate, pouring deoxygenated blood into the Right Ventricle.",
    pathway: "Right Atrium → Tricuspid Valve → Right Ventricle",
    subText: "Tricuspid valve opens. Blood floods downwards due to gravity and atrial pressure. Right Ventricle relaxes (diastole) to receive the load.",
    activeElements: ["ra", "tricuspid", "rv"]
  },
  {
    id: 2,
    title: "3. Pulmonary Propulsion",
    description: "The Right Ventricle contracts forcefully (systole). The Tricuspid Valve snaps shut to prevent backflow, forcing deoxygenated blood up through the Pulmonary Artery towards the lungs.",
    pathway: "Right Ventricle → Pulmonary Valve/Artery → Lungs",
    subText: "The shut Tricuspid Valve produces the first major heart sound ('LUB'). High pressure propels blood through the pulmonary valve.",
    activeElements: ["rv", "pulmonaryArtery", "lungs"]
  },
  {
    id: 3,
    title: "4. Alveolar Gas Exchange",
    description: "Inside the microscopic networks of the lungs, deoxygenated blood releases waste carbon dioxide (exhaled) and absorbs fresh, inhaled oxygen molecules.",
    pathway: "Pulmonary Capillaries (Gas Exchange)",
    subText: "Watch the blood transition from deep blue (deoxygenated) to bright crimson red (highly oxygenated) inside the capillaries.",
    activeElements: ["lungs"]
  },
  {
    id: 4,
    title: "5. Pulmonary Vein Return",
    description: "Restored, oxygen-saturated red blood leaves the lung capillaries and pools through the Pulmonary Veins, flowing straight back into the Left Atrium of the heart.",
    pathway: "Lungs → Pulmonary Vein → Left Atrium",
    subText: "These are the only veins in the human body that carry high-concentration oxygenated blood.",
    activeElements: ["lungs", "pulmonaryVein", "la"]
  },
  {
    id: 5,
    title: "6. Bicuspid (Mitral) Transition",
    description: "The Left Atrium contracts, and the Bicuspid (also known as Mitral) Valve opens. Oxygenated blood cascades down from the Left Atrium into the heavy Left Ventricle chamber.",
    pathway: "Left Atrium → Bicuspid Valve → Left Ventricle",
    subText: "The Bicuspid Valve contains two thick leaflets that separate the high-pressure left atrium and left ventricle.",
    activeElements: ["la", "bicuspid", "lv"]
  },
  {
    id: 6,
    title: "7. Systemic Aortic Ejection",
    description: "The thick Left Ventricle contracts powerfully. The Bicuspid Valve snaps shut, driving oxygenated red blood through the Aorta to meet metabolic demands across the entire body.",
    pathway: "Left Ventricle → Aortic Valve/Aorta → BODY",
    subText: "Mitral valve closure creates the 'LUB' sound. Ejections are highly pressurized to reach distant capillaries in skeletal muscle, brain, and kidneys.",
    activeElements: ["lv", "aorta", "body"]
  },
  {
    id: 7,
    title: "8. Continuous Master Loop",
    description: "The complete cardiac cycle operates continuously! Follow the synchronous beating. Watch the coordinated opening and closing of valves as blue and red streams maintain life.",
    pathway: "BODY → Vena Cava → Right Heart → Lungs → Left Heart → Aorta → BODY",
    subText: "During healthy rest, the heart sustains this loop 60 to 80 times per minute, pumping about 5 liters of blood sequentially every single minute.",
    activeElements: ["body", "venaCava", "ra", "tricuspid", "rv", "pulmonaryArtery", "lungs", "pulmonaryVein", "la", "bicuspid", "lv", "aorta"]
  }
];

// Quiz Questions for the interactive study test
const QUIZ_QUESTIONS = [
  {
    question: "Which blood vessel returns deoxygenated blood from body tissues back to the Right Atrium?",
    options: ["Aorta", "Pulmonary Vein", "Vena Cava", "Pulmonary Artery"],
    correct: 2,
    rationale: "The Vena Cava (Superior from upper body, Inferior from lower body) gathers deoxygenated venous blood and empties it into the Right Atrium."
  },
  {
    question: "What is the function of the Tricuspid Valve?",
    options: [
      "To prevent backflow from the RV to the RA",
      "To pump blood from Left Ventricle to Aorta",
      "To filter waste components from circulating plasma",
      "To connect the Left and Right ventricles directly"
    ],
    correct: 0,
    rationale: "The Tricuspid Valve resides between the Right Atrium and Right Ventricle. It closes during contraction (systole) to prevent blood backflowing into the atrium."
  },
  {
    question: "Identify the unique artery in the body that carries deoxygenated (oxygen-poor) blood:",
    options: ["Aortic Arch", "Pulmonary Artery", "Carotid Artery", "Pulmonary Vein"],
    correct: 1,
    rationale: "The Pulmonary Artery is unique because, unlike other systemic arteries, it carries low-oxygen blood pumped from the Right Ventricle up to the lungs."
  },
  {
    question: "Why is the myocardial wall of the Left Ventricle (LV) significantly thicker than the Right Ventricle (RV)?",
    options: [
      "It stores blood reserves for respiratory emergencies.",
      "It must withstand and generate much higher systolic pressures to pump blood to the entire body.",
      "The Left Ventricle contracts at double the frequency of the right.",
      "It prevents heat loss to adjacent lung tissues."
    ],
    correct: 1,
    rationale: "The RV only pumps to the nearby lungs (low resistance), whereas the LV must generate high pressure (typically 120 mmHg) to push blood far into systemic perfusion."
  }
];

export default function HeartCirculationSim() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<"clinical" | "academic">("clinical");
  const [selectedStructure, setSelectedStructure] = useState<AnatomicalStructure | null>(null);
  const [speed, setSpeed] = useState<number>(1); // Speed multiplier: 0.5, 1, 1.5
  
  // Audio state
  const [isMuted, setIsMuted] = useState<boolean>(true);
  
  // Quiz Module State
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Simulated ECG & Live Telemetry States
  const [ecgData, setEcgData] = useState<number[]>([]);
  const [heartRate, setHeartRate] = useState<number>(72);
  const [sysPressure, setSysPressure] = useState<number>(120);
  const [diaPressure, setDiaPressure] = useState<number>(80);
  const [oxygenSaturation, setOxygenSaturation] = useState<number>(98);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const ecgXRef = useRef<number>(0);

  // Generate continuous real-time simulated ECG data points
  useEffect(() => {
    const interval = setInterval(() => {
      setEcgData((prev) => {
        // We maintain an array of 50 ECG data points for the canvas render
        const draft = [...prev];
        if (draft.length > 60) {
          draft.shift();
        }

        // Standard QRS complex wave form generation based on a looping timeline
        const cycleIndex = ecgXRef.current % 20;
        let pValue = 0;
        
        if (cycleIndex === 0) pValue = 0;          // Isoelectric line
        else if (cycleIndex === 3) pValue = 0.15;   // P Wave (Atrial depolarization)
        else if (cycleIndex === 4) pValue = 0.2;
        else if (cycleIndex === 5) pValue = 0;
        else if (cycleIndex === 7) pValue = -0.15;  // Q Wave
        else if (cycleIndex === 8) pValue = 1.2;    // R Wave peak (Ventricular depolarization)
        else if (cycleIndex === 9) pValue = -0.35;  // S Wave
        else if (cycleIndex === 11) pValue = 0;
        else if (cycleIndex === 14) pValue = 0.3;   // T Wave (Ventricular repolarization)
        else if (cycleIndex === 15) pValue = 0.2;
        else {
          // Add micro resting noise to feel like a real sensor feed
          pValue = (Math.random() - 0.5) * 0.04;
        }

        ecgXRef.current++;
        return [...draft, pValue];
      });
    }, 70);

    return () => clearInterval(interval);
  }, []);

  // Sync blood pressure and oxygen saturation indicators to current active simulation sequence steps
  useEffect(() => {
    if (quizActive) return;

    if (currentStep === 7) {
      // Step 8: Master loop
      setHeartRate(74);
      setSysPressure(118);
      setDiaPressure(78);
      setOxygenSaturation(98);
    } else if (currentStep === 0 || currentStep === 1) {
      // Vena Cava / Atrium intake
      setHeartRate(68);
      setSysPressure(85);
      setDiaPressure(60);
      setOxygenSaturation(75); // Deoxygenated blood flow active
    } else if (currentStep === 2) {
      // Tricuspid open
      setHeartRate(70);
      setSysPressure(90);
      setDiaPressure(62);
      setOxygenSaturation(75);
    } else if (currentStep === 3) {
      // RV contract
      setHeartRate(78);
      setSysPressure(25); // Pulmonary systolic
      setDiaPressure(15);
      setOxygenSaturation(75);
    } else if (currentStep === 4) {
      // Lung exchange
      setHeartRate(72);
      setSysPressure(20);
      setDiaPressure(12);
      setOxygenSaturation(88); // Shifting saturation
    } else if (currentStep === 5) {
      // Red vein return
      setHeartRate(70);
      setSysPressure(85);
      setDiaPressure(60);
      setOxygenSaturation(98); // High oxygen density
    } else if (currentStep === 6) {
      // Bicuspid valve open
      setHeartRate(71);
      setSysPressure(95);
      setDiaPressure(65);
      setOxygenSaturation(99);
    } else if (currentStep === 7) {
      // LV Ejection
      setHeartRate(85);
      setSysPressure(125); // Heavy systemic push
      setDiaPressure(82);
      setOxygenSaturation(99);
    }
  }, [currentStep, quizActive]);

  // Handle Autoplay timer
  useEffect(() => {
    if (isPlaying) {
      const stepDuration = 5200 / speed; // time scaled by speed
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % STEPS.length);
        // Play subtle synthesizer simulation click if unmuted
        triggerBeep();
      }, stepDuration);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed]);

  // Web Audio synthetic pulse generator to simulate a real monitor heart sound
  const triggerBeep = () => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = "sine";
      // First beat 'Lub' or 'Dub'
      osc.frequency.setValueAtTime(currentStep % 2 === 0 ? 82 : 64, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      console.log("Audio contexts pending permissions:", e);
    }
  };

  const nextStep = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => (prev + 1) % STEPS.length);
    triggerBeep();
  };

  const prevStep = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => (prev - 1 + STEPS.length) % STEPS.length);
    triggerBeep();
  };

  const handleStructureClick = (key: string) => {
    const data = structureData[key];
    if (data) {
      setSelectedStructure(data);
    }
  };

  // Quiz helper functions
  const startQuiz = () => {
    setQuizActive(true);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setQuizSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  const selectQuizOption = (idx: number) => {
    if (quizSubmitted) return;
    setSelectedOption(idx);
  };

  const submitQuizAnswer = () => {
    if (selectedOption === null || quizSubmitted) return;
    setQuizSubmitted(true);
    
    const correct = QUIZ_QUESTIONS[currentQuestionIdx].correct;
    if (selectedOption === correct) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuizQuestion = () => {
    setSelectedOption(null);
    setQuizSubmitted(false);
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  // Helper check to see if an element is currently highlighted/active
  const isElementActive = (elemName: string): boolean => {
    // Stage 7 (index 7) is the Master Loop where everything is illuminated!
    if (currentStep === 7) return true;
    return STEPS[currentStep].activeElements.includes(elemName);
  };

  // Valve state getters
  const isTricuspidOpen = () => {
    if (currentStep === 7) {
      // Coordinated cycle: beating effect based on live ECG coordinate
      return (ecgXRef.current % 20 < 10);
    }
    return currentStep === 1; // Stage 2 is RA to RV via open Tricuspid valve
  };

  const isBicuspidOpen = () => {
    if (currentStep === 7) {
      return (ecgXRef.current % 20 < 10);
    }
    return currentStep === 5; // Stage 6 is LA to LV via open Bicuspid valve
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-500 flex flex-col font-sans ${
      themeMode === "clinical" ? "bg-slate-950 text-slate-100" : "bg-neutral-50 text-slate-800"
    }`}>
      
      {/* INTERNAL MONITOR HEADER SHELL */}
      <header className={`px-6 py-4 border-b flex flex-col sm:flex-row items-center justify-between gap-4 justify-items-stretch transition-colors ${
        themeMode === "clinical" 
          ? "border-cyan-950/40 bg-slate-950/80 backdrop-blur-md" 
          : "border-slate-200 bg-white shadow-sm"
      }`} id="monitor-header">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/10 rounded-lg animate-pulse border border-rose-500/20">
            <Heart className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                themeMode === "clinical" ? "bg-cyan-950/80 text-cyan-400 border border-cyan-800/30" : "bg-slate-100 text-slate-700"
              }`}>
                STAGE_01 // EDUCATIONAL_DRV
              </span>
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
            </div>
            <h1 className={`text-xl font-bold tracking-tight font-display ${
              themeMode === "clinical" ? "text-cyan-100" : "text-slate-950"
            }`}>BIYLI <span className="font-light text-slate-400">| Complete Heart Circulation 2D</span></h1>
          </div>
        </div>

        {/* CONTROLLER HEADS-UP SETTINGS */}
        <div className="flex flex-wrap items-center gap-3 justify-end">
          {/* MUTE / AUDIO FEED */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-lg border transition-all ${
              isMuted 
                ? themeMode === "clinical" 
                  ? "bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300"
                  : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700"
                : themeMode === "clinical"
                  ? "bg-emerald-950/60 border-emerald-900/40 text-emerald-400 hover:text-emerald-300 shadow-sm shadow-emerald-900/25"
                  : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:text-emerald-700"
            }`}
            title={isMuted ? "Unmute Clinical Monitor Heart Beeps" : "Mute Sound"}
            id="audio-mute-toggle"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* THEME SWITCHER */}
          <div className={`p-1 rounded-lg border flex gap-1 ${
            themeMode === "clinical" ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
          }`} id="theme-switch-wrapper">
            <button
              onClick={() => setThemeMode("clinical")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                themeMode === "clinical" 
                  ? "bg-cyan-950/80 text-cyan-300 border border-cyan-800/20 shadow-sm" 
                  : "text-slate-500 hover:text-slate-900"
              }`}
              id="theme-btn-clinical"
            >
              <Activity className="w-3.5 h-3.5" />
              Clinical HUD
            </button>
            <button
              onClick={() => setThemeMode("academic")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                themeMode === "academic" 
                  ? "bg-white text-slate-800 shadow-sm border border-slate-200" 
                  : "text-slate-400 hover:text-cyan-300"
              }`}
              id="theme-btn-academic"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Academic Light
            </button>
          </div>

          {/* MODAL / FEATURE STATS */}
          <button
            onClick={() => setQuizActive(!quizActive)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              quizActive
                ? "bg-rose-500 text-white border-rose-600"
                : themeMode === "clinical"
                  ? "bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-400 border-cyan-900/50"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
            id="quiz-module-btn"
          >
            <Award className="w-4 h-4" />
            {quizActive ? "Exit Anatomy Quiz" : "Start Quiz Mode"}
          </button>
        </div>
      </header>

      {/* CORE WORKSPACE GRID */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6" id="primary-workspace">
        
        {/* LEFT COLUMN: INTERACTIVE SIMULATION SCREEN & GRAPH (Col span 8) */}
        <section className="lg:col-span-8 flex flex-col gap-6" id="simulator-section">
          
          {/* THE SVG SIMULATOR PANEL */}
          <div className={`relative border rounded-2xl overflow-hidden transition-all flex flex-col justify-between ${
            themeMode === "clinical" 
              ? "border-slate-800 bg-slate-900 shadow-xl shadow-slate-950/80" 
              : "border-slate-200 bg-white shadow-md shadow-slate-200/50"
          }`}>
            
            {/* SCREEN TOP BEZEL STRIP */}
            <div className={`px-4 py-2 flex items-center justify-between text-[11px] font-mono border-b ${
              themeMode === "clinical" 
                ? "bg-slate-950/50 border-slate-850 text-cyan-500" 
                : "bg-slate-50 border-slate-100 text-slate-500"
            }`} id="interactive-bezel">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>MONITOR_CHannel_01 // LIVE_PERFUSION_SIM</span>
              </div>
              <div className="flex items-center gap-4">
                <span>ZOOM: optimal_100%</span>
                <span className="hidden sm:inline">REF_IMAGE_LAYOUT: 2D_BLOCK_LEVEL</span>
              </div>
            </div>

            {/* INTERACTIVE WORKSPACE (SVG ENGINE OR QUIZ WRAPPER) */}
            <div className={`flex-1 flex items-center justify-center relative p-2 ${
              themeMode === "clinical" ? "bg-slate-950" : "bg-neutral-100"
            }`} style={{ minHeight: "440px" }} id="svg-stage-container">
              
              {!quizActive ? (
                /* INLINE SVG BLOOD CIRCULATION 2D STAGE */
                <svg 
                  viewBox="0 0 800 600" 
                  className="w-full h-auto max-h-[500px]"
                  id="cardiac-circulation-svg"
                >
                  {/* DEFINITIONS FOR GRADIENTS AND SHADOWS */}
                  <defs>
                    {/* Glowing Filters */}
                    <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    
                    {/* Lungs gradient inside exchange step */}
                    <linearGradient id="lungGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={isElementActive("lungs") ? "#3b82f6" : "#cbd5e1"} />
                      <stop offset="50%" stopColor={isElementActive("lungs") ? "#ca8a04" : "#94a3b8"} />
                      <stop offset="100%" stopColor={isElementActive("lungs") ? "#ef4444" : "#cbd5e1"} />
                    </linearGradient>
                  </defs>

                  {/* ========================================================= */}
                  {/* LAYER 1: BASE DEACTIVATED CHANNELS (VESSELS WALLS & TUBES) */}
                  {/* ========================================================= */}
                  <g id="vessel-walls" strokeLinecap="round">
                    {/* Vena Cava Wall */}
                    <path 
                      id="wall-vena-cava" 
                      d="M 285 520 C 285 450, 160 420, 160 320 L 160 220 C 160 180, 200 180, 222 180" 
                      fill="none" 
                      stroke={themeMode === "clinical" ? "#0f172a" : "#cbd5e1"} 
                      strokeWidth="24" 
                    />
                    
                    {/* Pulmonary Artery Wall */}
                    <path 
                      id="wall-pulmonary-artery" 
                      d="M 345 320 C 345 280, 395 270, 395 240 L 395 130 C 395 110, 350 110, 320 100" 
                      fill="none" 
                      stroke={themeMode === "clinical" ? "#0f172a" : "#cbd5e1"} 
                      strokeWidth="24" 
                    />

                    {/* Pulmonary Vein Wall */}
                    <path 
                      id="wall-pulmonary-vein" 
                      d="M 470 100 C 470 120, 640 140, 640 220 L 640 240 C 640 270, 610 230, 578 230" 
                      fill="none" 
                      stroke={themeMode === "clinical" ? "#0f172a" : "#cbd5e1"} 
                      strokeWidth="24" 
                    />

                    {/* Aorta Wall */}
                    <path 
                      id="wall-aorta" 
                      d="M 455 320 C 455 130, 580 90, 680 180 L 680 340 C 680 430, 480 440, 480 470 L 480 520" 
                      fill="none" 
                      stroke={themeMode === "clinical" ? "#0f172a" : "#cbd5e1"} 
                      strokeWidth="24" 
                    />
                  </g>

                  {/* ========================================================= */}
                  {/* LAYER 2: ACTIVE FLOW LIQUIDS WITH PULSATING GLOW EFFECTS */}
                  {/* ========================================================= */}
                  <g id="vessel-fluids" strokeLinecap="round">
                    {/* Vena Cava Fluid Flow (Deoxygenated) */}
                    <path 
                      id="fluid-vena-cava" 
                      d="M 285 520 C 285 450, 160 420, 160 320 L 160 220 C 160 180, 200 180, 222 180" 
                      fill="none" 
                      stroke={isElementActive("venaCava") ? "#3b82f6" : "#64748b"} 
                      strokeWidth="12" 
                      className="transition-all duration-700"
                      filter={isElementActive("venaCava") && themeMode === "clinical" ? "url(#glow-blue)" : ""}
                    />
                    {isElementActive("venaCava") && (
                      <path 
                        d="M 285 520 C 285 450, 160 420, 160 320 L 160 220 C 160 180, 200 180, 222 180" 
                        fill="none" 
                        stroke="#93c5fd" 
                        strokeWidth="12" 
                        strokeDasharray="15 35"
                        className="animate-flow-reverse" 
                      />
                    )}

                    {/* Pulmonary Artery Fluid Flow (Deoxygenated) */}
                    <path 
                      id="fluid-pulmonary-artery" 
                      d="M 345 320 C 345 280, 395 270, 395 240 L 395 130 C 395 110, 350 110, 320 100" 
                      fill="none" 
                      stroke={isElementActive("pulmonaryArtery") ? "#2563eb" : "#64748b"} 
                      strokeWidth="12" 
                      className="transition-all duration-700"
                      filter={isElementActive("pulmonaryArtery") && themeMode === "clinical" ? "url(#glow-blue)" : ""}
                    />
                    {isElementActive("pulmonaryArtery") && (
                      <path 
                        d="M 345 320 C 345 280, 395 270, 395 240 L 395 130 C 395 110, 350 110, 320 100" 
                        fill="none" 
                        stroke="#bfdbfe" 
                        strokeWidth="12" 
                        strokeDasharray="15 35"
                        className="animate-flow" 
                      />
                    )}

                    {/* Pulmonary Vein Fluid Flow (Oxygenated) */}
                    <path 
                      id="fluid-pulmonary-vein" 
                      d="M 470 100 C 470 120, 640 140, 640 220 L 640 240 C 640 270, 610 230, 578 230" 
                      fill="none" 
                      stroke={isElementActive("pulmonaryVein") ? "#ef4444" : "#64748b"} 
                      strokeWidth="12" 
                      className="transition-all duration-700"
                      filter={isElementActive("pulmonaryVein") && themeMode === "clinical" ? "url(#glow-red)" : ""}
                    />
                    {isElementActive("pulmonaryVein") && (
                      <path 
                        d="M 470 100 C 470 120, 640 140, 640 220 L 640 240 C 640 270, 610 230, 578 230" 
                        fill="none" 
                        stroke="#fca5a5" 
                        strokeWidth="12" 
                        strokeDasharray="15 35"
                        className="animate-flow" 
                      />
                    )}

                    {/* Aorta Fluid Flow (Oxygenated) */}
                    <path 
                      id="fluid-aorta" 
                      d="M 455 320 C 455 130, 580 90, 680 180 L 680 340 C 680 430, 480 440, 480 470 L 480 520" 
                      fill="none" 
                      stroke={isElementActive("aorta") ? "#dc2626" : "#64748b"} 
                      strokeWidth="12" 
                      className="transition-all duration-700"
                      filter={isElementActive("aorta") && themeMode === "clinical" ? "url(#glow-red)" : ""}
                    />
                    {isElementActive("aorta") && (
                      <path 
                        d="M 455 320 C 455 130, 580 90, 680 180 L 680 340 C 680 430, 480 440, 480 470 L 480 520" 
                        fill="none" 
                        stroke="#fecaca" 
                        strokeWidth="12" 
                        strokeDasharray="15 35"
                        className="animate-flow" 
                      />
                    )}
                  </g>

                  {/* FLOW DIRECTION ARROW CHEVRONS */}
                  <g id="flow-arrows" className="opacity-80">
                    {/* Vena Cava Flow Arrow */}
                    {isElementActive("venaCava") && (
                      <g fill={themeMode === "clinical" ? "#93c5fd" : "#1d4ed8"} className="animate-pulse">
                        <polygon points="160,280 154,295 166,295" />
                        <polygon points="160,240 154,255 166,255" />
                      </g>
                    )}
                    {/* Pulmonary Artery Flow Arrow */}
                    {isElementActive("pulmonaryArtery") && (
                      <g fill={themeMode === "clinical" ? "#bfdbfe" : "#1d4ed8"} className="animate-pulse">
                        <polygon points="395,200 389,190 401,190" />
                        <polygon points="395,160 389,155 401,155" />
                      </g>
                    )}
                    {/* Pulmonary Vein Flow Arrow */}
                    {isElementActive("pulmonaryVein") && (
                      <g fill={themeMode === "clinical" ? "#fca5a5" : "#b91c1c"} className="animate-pulse">
                        <polygon points="640,240 634,250 646,250" />
                        <polygon points="640,200 634,210 646,210" />
                      </g>
                    )}
                    {/* Aorta Flow Arrow */}
                    {isElementActive("aorta") && (
                      <g fill={themeMode === "clinical" ? "#fecaca" : "#b91c1c"} className="animate-pulse">
                        <polygon points="680,260 674,270 686,270" />
                        <polygon points="680,310 674,320 686,320" />
                      </g>
                    )}
                  </g>

                  {/* ========================================================= */}
                  {/* LAYER 3: STATIC BLOCKS (LUNGS, BODY, HEART STRUCTURE SHELL) */}
                  {/* ========================================================= */}
                  
                  {/* Lungs Block (Top) */}
                  <g 
                    id="block-lungs" 
                    className="cursor-pointer group"
                    onClick={() => handleStructureClick("lungs")}
                  >
                    <rect 
                      x="260" 
                      y="40" 
                      width="280" 
                      height="60" 
                      rx="30" 
                      fill={isElementActive("lungs") ? "url(#lungGradient)" : themeMode === "clinical" ? "#1e293b" : "#e2e8f0"} 
                      stroke={isElementActive("lungs") ? "#facc15" : themeMode === "clinical" ? "#475569" : "#cbd5e1"} 
                      strokeWidth={isElementActive("lungs") ? "3" : "1.5"}
                      className="transition-all duration-300"
                    />
                    <text 
                      x="400" 
                      y="77" 
                      fontFamily="inherit" 
                      fontSize="15" 
                      fontWeight="bold" 
                      fill={isElementActive("lungs") ? "#ffffff" : themeMode === "clinical" ? "#94a3b8" : "#475569"} 
                      textAnchor="middle"
                      className="font-display tracking-widest"
                    >
                      LUNGS (Gas Exchange)
                    </text>
                  </g>

                  {/* Body Block (Bottom) */}
                  <g 
                    id="block-body" 
                    className="cursor-pointer group"
                    onClick={() => handleStructureClick("body")}
                  >
                    <rect 
                      x="260" 
                      y="500" 
                      width="280" 
                      height="60" 
                      rx="30" 
                      fill={isElementActive("body") ? "#1e1b4b" : themeMode === "clinical" ? "#1e293b" : "#e2e8f0"} 
                      stroke={isElementActive("body") ? "#818cf8" : themeMode === "clinical" ? "#475569" : "#cbd5e1"} 
                      strokeWidth={isElementActive("body") ? "3" : "1.5"}
                      className="transition-all duration-300"
                    />
                    <text 
                      x="400" 
                      y="537" 
                      fontFamily="inherit" 
                      fontSize="15" 
                      fontWeight="bold" 
                      fill={isElementActive("body") ? "#cbd5e1" : themeMode === "clinical" ? "#94a3b8" : "#475569"} 
                      textAnchor="middle"
                      className="font-display tracking-widest"
                    >
                      BODY (Systemic Organs)
                    </text>
                  </g>

                  {/* Heart Outer Container Bezel */}
                  <rect 
                    x="210" 
                    y="150" 
                    width="380" 
                    height="300" 
                    rx="16" 
                    fill="none"
                    stroke={themeMode === "clinical" ? "rgba(6, 182, 212, 0.2)" : "#94a3b8"}
                    strokeWidth="2.5"
                    strokeDasharray="6 6"
                    id="heart-bezel-border"
                  />

                  {/* Septum vertical line */}
                  <line 
                    x1="400" 
                    y1="150" 
                    x2="400" 
                    y2="450" 
                    stroke={themeMode === "clinical" ? "rgba(71, 85, 105, 0.6)" : "#cbd5e1"}
                    strokeWidth="5"
                  />

                  {/* Chambers Blocks */}
                  {/* ====== RIGHT ATRIUM (RA) ====== */}
                  <g 
                    id="block-ra" 
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => handleStructureClick("ra")}
                  >
                    <rect 
                      x="230" 
                      y="170" 
                      width="155" 
                      height="110" 
                      rx="8" 
                      fill={isElementActive("ra") ? "rgba(29, 78, 216, 0.45)" : themeMode === "clinical" ? "rgba(30, 41, 59, 0.3)" : "rgba(226, 232, 240, 0.5)"} 
                      stroke={isElementActive("ra") ? "#60a5fa" : themeMode === "clinical" ? "#334155" : "#cbd5e1"} 
                      strokeWidth={isElementActive("ra") ? "3" : "1.5"}
                    />
                    <text x="307" y="210" textAnchor="middle" fontSize="16" fontWeight="bold" fill={isElementActive("ra") ? "#93c5fd" : themeMode === "clinical" ? "#64748b" : "#475569"}>RA</text>
                    <text x="307" y="235" textAnchor="middle" fontSize="10" fontWeight="normal" fill={isElementActive("ra") ? "#93c5fd" : themeMode === "clinical" ? "#64748b" : "#475569"}>Right Atrium</text>
                    <text x="307" y="255" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={isElementActive("ra") ? "#3b82f6" : "#64748b"}>DEOXYGENATED</text>
                    
                    {/* Pulsing indicator anchor */}
                    {isElementActive("ra") && (
                      <circle cx="307" cy="185" r="4" fill="#3b82f6" className="animate-ping" />
                    )}
                  </g>

                  {/* ====== LEFT ATRIUM (LA) ====== */}
                  <g 
                    id="block-la" 
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => handleStructureClick("la")}
                  >
                    <rect 
                      x="415" 
                      y="170" 
                      width="155" 
                      height="110" 
                      rx="8" 
                      fill={isElementActive("la") ? "rgba(185, 28, 28, 0.35)" : themeMode === "clinical" ? "rgba(30, 41, 59, 0.3)" : "rgba(226, 232, 240, 0.5)"} 
                      stroke={isElementActive("la") ? "#fca5a5" : themeMode === "clinical" ? "#334155" : "#cbd5e1"} 
                      strokeWidth={isElementActive("la") ? "3" : "1.5"}
                    />
                    <text x="492" y="210" textAnchor="middle" fontSize="16" fontWeight="bold" fill={isElementActive("la") ? "#fca5a5" : themeMode === "clinical" ? "#64748b" : "#475569"}>LA</text>
                    <text x="492" y="235" textAnchor="middle" fontSize="10" fontWeight="normal" fill={isElementActive("la") ? "#fca5a5" : themeMode === "clinical" ? "#64748b" : "#475569"}>Left Atrium</text>
                    <text x="492" y="255" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={isElementActive("la") ? "#ef4444" : "#64748b"}>OXYGENATED</text>
                    
                    {/* Pulsing indicator anchor */}
                    {isElementActive("la") && (
                      <circle cx="492" cy="185" r="4" fill="#ef4444" className="animate-ping" />
                    )}
                  </g>

                  {/* ====== RIGHT VENTRICLE (RV) ====== */}
                  <g 
                    id="block-rv" 
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => handleStructureClick("rv")}
                  >
                    <rect 
                      x="230" 
                      y="310" 
                      width="155" 
                      height="110" 
                      rx="8" 
                      fill={isElementActive("rv") ? "rgba(29, 78, 216, 0.35)" : themeMode === "clinical" ? "rgba(30, 41, 59, 0.3)" : "rgba(226, 232, 240, 0.5)"} 
                      stroke={isElementActive("rv") ? "#60a5fa" : themeMode === "clinical" ? "#334155" : "#cbd5e1"} 
                      strokeWidth={isElementActive("rv") ? "3" : "1.5"}
                      className={(currentStep === 2 && isPlaying) ? "animate-heart-pulse" : ""}
                    />
                    <text x="307" y="350" textAnchor="middle" fontSize="16" fontWeight="bold" fill={isElementActive("rv") ? "#93c5fd" : themeMode === "clinical" ? "#64748b" : "#475569"}>RV</text>
                    <text x="307" y="375" textAnchor="middle" fontSize="10" fontWeight="normal" fill={isElementActive("rv") ? "#93c5fd" : themeMode === "clinical" ? "#64748b" : "#475569"}>Right Ventricle</text>
                    <text x="307" y="395" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={isElementActive("rv") ? "#2563eb" : "#64748b"}>DEOXYGENATED</text>
                    
                    {isElementActive("rv") && (
                      <circle cx="307" cy="425" r="4" fill="#3b82f6" className="animate-ping" />
                    )}
                  </g>

                  {/* ====== LEFT VENTRICLE (LV) ====== */}
                  <g 
                    id="block-lv" 
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => handleStructureClick("lv")}
                  >
                    <rect 
                      x="415" 
                      y="310" 
                      width="155" 
                      height="110" 
                      rx="8" 
                      fill={isElementActive("lv") ? "rgba(185, 28, 28, 0.35)" : themeMode === "clinical" ? "rgba(30, 41, 59, 0.3)" : "rgba(226, 232, 240, 0.5)"} 
                      stroke={isElementActive("lv") ? "#fca5a5" : themeMode === "clinical" ? "#334155" : "#cbd5e1"} 
                      strokeWidth={isElementActive("lv") ? "3" : "1.5"}
                      className={(currentStep === 6 && isPlaying) ? "animate-heart-pulse" : ""}
                    />
                    <text x="492" y="350" textAnchor="middle" fontSize="16" fontWeight="bold" fill={isElementActive("lv") ? "#fca5a5" : themeMode === "clinical" ? "#64748b" : "#475569"}>LV</text>
                    <text x="492" y="375" textAnchor="middle" fontSize="10" fontWeight="normal" fill={isElementActive("lv") ? "#fca5a5" : themeMode === "clinical" ? "#64748b" : "#475569"}>Left Ventricle</text>
                    <text x="492" y="395" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={isElementActive("lv") ? "#ef4444" : "#64748b"}>OXYGENATED</text>
                    
                    {isElementActive("lv") && (
                      <circle cx="492" cy="425" r="4" fill="#ef4444" className="animate-ping" />
                    )}
                  </g>

                  {/* VALVES GRAPHICS (DYNAMICALLY SWING OPEN / CLOSE) */}
                  {/* ====== TRICUSPID VALVE GATE ====== */}
                  <g 
                    id="valve-tricuspid" 
                    className="cursor-pointer"
                    onClick={() => handleStructureClick("tricuspid")}
                  >
                    {isTricuspidOpen() ? (
                      /* VALVE OPEN - gates rotated downward into RV */
                      <g stroke="#ffffff" strokeWidth="4" strokeLinecap="round" className="transition-all duration-500">
                        <line x1="260" y1="285" x2="270" y2="305" />
                        <line x1="355" y1="285" x2="345" y2="305" />
                      </g>
                    ) : (
                      /* VALVE CLOSED - horizontal gate block */
                      <g stroke="#facc15" strokeWidth="4" strokeLinecap="round" className="transition-all duration-500">
                        <line x1="260" y1="295" x2="300" y2="295" />
                        <line x1="355" y1="295" x2="315" y2="295" />
                      </g>
                    )}
                    <rect x="250" y="285" width="115" height="20" fill="transparent" />
                    <text x="307" y="291" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#f59e0b">TRICUSPID VALVE</text>
                  </g>

                  {/* ====== BICUSPID VALVE GATE ====== */}
                  <g 
                    id="valve-bicuspid" 
                    className="cursor-pointer"
                    onClick={() => handleStructureClick("bicuspid")}
                  >
                    {isBicuspidOpen() ? (
                      /* VALVE OPEN */
                      <g stroke="#ffffff" strokeWidth="4" strokeLinecap="round" className="transition-all duration-500">
                        <line x1="445" y1="285" x2="455" y2="305" />
                        <line x1="540" y1="285" x2="530" y2="305" />
                      </g>
                    ) : (
                      /* VALVE CLOSED */
                      <g stroke="#facc15" strokeWidth="4" strokeLinecap="round" className="transition-all duration-500">
                        <line x1="445" y1="295" x2="485" y2="295" />
                        <line x1="540" y1="295" x2="500" y2="295" />
                      </g>
                    )}
                    <rect x="435" y="285" width="115" height="20" fill="transparent" />
                    <text x="492" y="291" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#f59e0b">BICUSPID VALVE</text>
                  </g>

                  {/* LABEL LABELS Overlay */}
                  <g id="anatomical-vessel-labels" fontSize="9" fontWeight="bold" className="transition-opacity duration-300 shadow-sm opacity-90">
                    <rect x="110" y="210" width="75" height="15" rx="3" fill={isElementActive("venaCava") ? "#1e3a8a" : "#334155"} />
                    <text x="147" y="221" textAnchor="middle" fill="#ffffff">VENA CAVA</text>

                    <rect x="360" y="115" width="80" height="15" rx="3" fill={isElementActive("pulmonaryArtery") ? "#1e3a8a" : "#334155"} />
                    <text x="400" y="126" textAnchor="middle" fill="#ffffff">PULM. ARTERY</text>

                    <rect x="445" y="145" width="70" height="15" rx="3" fill={isElementActive("aorta") ? "#991b1b" : "#334155"} />
                    <text x="480" y="156" textAnchor="middle" fill="#ffffff">AORTA ARCH</text>

                    <rect x="600" y="180" width="80" height="15" rx="3" fill={isElementActive("pulmonaryVein") ? "#991b1b" : "#334155"} />
                    <text x="640" y="191" textAnchor="middle" fill="#ffffff">PULM. VEINS</text>
                  </g>
                </svg>
              ) : (
                /* QUIZ ACTIVE OVERLAY WINDOW */
                <div className="w-full max-w-xl p-6 rounded-xl flex flex-col justify-between" id="quiz-workspace" style={{ minHeight: "360px" }}>
                  {!quizFinished ? (
                    <div>
                      {/* QUIZ HEADER */}
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-xs font-mono px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
                          QUESTION {currentQuestionIdx + 1} OF {QUIZ_QUESTIONS.length}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Current Score: {score}/{currentQuestionIdx}</span>
                      </div>

                      {/* QUESTION FIELD */}
                      <h3 className={`text-lg font-bold mb-6 font-display ${themeMode === "clinical" ? "text-slate-100" : "text-slate-900"}`}>
                        {QUIZ_QUESTIONS[currentQuestionIdx].question}
                      </h3>

                      {/* OPTIONS SELECTOR */}
                      <div className="grid grid-cols-1 gap-3 mb-6">
                        {QUIZ_QUESTIONS[currentQuestionIdx].options.map((option, idx) => {
                          const isSelected = selectedOption === idx;
                          const showCorrect = quizSubmitted && idx === QUIZ_QUESTIONS[currentQuestionIdx].correct;
                          const showIncorrect = quizSubmitted && isSelected && idx !== QUIZ_QUESTIONS[currentQuestionIdx].correct;
                          
                          return (
                            <button
                              key={idx}
                              onClick={() => selectQuizOption(idx)}
                              disabled={quizSubmitted}
                              className={`w-full p-3 text-left text-sm rounded-xl border transition-all flex items-center justify-between ${
                                showCorrect
                                  ? "bg-emerald-950/20 border-emerald-500 text-emerald-400 font-semibold"
                                  : showIncorrect
                                    ? "bg-rose-950/20 border-rose-500 text-rose-400"
                                    : isSelected
                                      ? "bg-cyan-950/30 border-cyan-400 text-cyan-300"
                                      : themeMode === "clinical"
                                        ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850"
                                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              <span>{option}</span>
                              {showCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                              {showIncorrect && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* RATIONALE EXPLANATORY DRAWER */}
                      {quizSubmitted && (
                        <div className={`p-4 rounded-xl text-xs mb-6 border animate-fade-in ${
                          themeMode === "clinical"
                            ? "bg-slate-900/40 border-slate-800 text-slate-300"
                            : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}>
                          <strong className="text-amber-500 font-mono block mb-1">EDUCATIONAL RATIONALE //</strong>
                          {QUIZ_QUESTIONS[currentQuestionIdx].rationale}
                        </div>
                      )}

                      {/* ACTIONS SUBMIT / ADVANCE */}
                      <div className="flex justify-end gap-3">
                        {!quizSubmitted ? (
                          <button
                            onClick={submitQuizAnswer}
                            disabled={selectedOption === null}
                            className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                              selectedOption === null
                                ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                                : "bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950"
                            }`}
                          >
                            Submit Answer
                          </button>
                        ) : (
                          <button
                            onClick={nextQuizQuestion}
                            className="bg-rose-500 hover:bg-rose-400 text-white px-5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all"
                          >
                            <span>{currentQuestionIdx === QUIZ_QUESTIONS.length - 1 ? "Finish Module" : "Next Question"}</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* QUIZ COMPLETED SUMMARY VIEW */
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20 shadow-md">
                        <Award className="w-8 h-8" />
                      </div>
                      <h3 className={`text-xl font-bold font-display mb-2 ${themeMode === "clinical" ? "text-emerald-400" : "text-emerald-600"}`}>
                        Biomedical Assessment Finalized
                      </h3>
                      <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
                        Excellent work! You have finished the circulatory mechanics quiz with high proficiency.
                      </p>
                      
                      <div className={`p-4 rounded-xl max-w-xs mx-auto border mb-8 ${
                        themeMode === "clinical" ? "bg-slate-900/40 border-slate-800" : "bg-slate-100 border-slate-200"
                      }`}>
                        <div className="text-xs text-slate-400 font-mono uppercase">Your Precision Score</div>
                        <div className="text-4xl font-extrabold text-cyan-400 tracking-tight font-display my-2">
                          {score * 25}%
                        </div>
                        <div className="text-xs text-slate-500">{score} Correct of {QUIZ_QUESTIONS.length} Questions</div>
                      </div>

                      <div className="flex justify-center gap-3">
                        <button
                          onClick={startQuiz}
                          className="bg-rose-500 hover:bg-rose-400 text-white px-5 py-2.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Retake Assessment
                        </button>
                        <button
                          onClick={() => setQuizActive(false)}
                          className={`px-5 py-2.5 text-xs font-semibold rounded-lg border transition-all ${
                            themeMode === "clinical"
                              ? "bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800"
                              : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          Back to Lab Simulator
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* LOWER CONTROLS & TIMELINE ROW */}
            <div className={`px-4 py-4 border-t ${
              themeMode === "clinical" 
                ? "bg-slate-950/60 border-slate-850" 
                : "bg-slate-50 border-slate-250"
            }`} id="simulator-footer-controls">
              
              {/* PROGRESS TRAIL (STEP SEQUENCE) */}
              <div className="mb-4">
                <div className="flex justify-between items-center text-[10px] font-mono mb-2 text-slate-400">
                  <span className="uppercase tracking-wider">CircCirculation Progress Sequence</span>
                  <span>Step {currentStep + 1} of {STEPS.length}</span>
                </div>
                <div className="flex gap-1.5 h-1.5" id="timeline-bar">
                  {STEPS.map((_step_def, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuizActive(false);
                        setCurrentStep(index);
                      }}
                      className={`flex-1 rounded-sm transition-all h-full ${
                        index === currentStep
                          ? "bg-cyan-400"
                          : index < currentStep
                            ? "bg-slate-600 hover:bg-slate-500"
                            : themeMode === "clinical" ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-200 hover:bg-slate-300"
                      }`}
                      title={_step_def.title}
                    />
                  ))}
                </div>
              </div>

              {/* ACTION PLAYBACK BAR */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-1.5" id="direction-buttons">
                  <button
                    onClick={prevStep}
                    className={`p-2 rounded-lg border transition-all ${
                      themeMode === "clinical"
                        ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                    title="Previous Step"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-cyan-400 text-slate-950 hover:bg-cyan-300 font-bold p-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all text-xs"
                    title={isPlaying ? "Pause Automatic Loop" : "Play Continuous Sequence"}
                    id="autoplay-playback-btn"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
                    <span>{isPlaying ? "PAUSE" : "PLAY AUTO"}</span>
                  </button>

                  <button
                    onClick={nextStep}
                    className={`p-2 rounded-lg border transition-all ${
                      themeMode === "clinical"
                        ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                    title="Next Step"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStep(0);
                    }}
                    className={`p-2 rounded-lg border transition-all ${
                      themeMode === "clinical"
                        ? "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        : "bg-white border-slate-200 text-slate-505 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                    title="Reset to Step 1"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* ANIMATION SPEED SETTINGS */}
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold font-mono uppercase tracking-wider ${
                    themeMode === "clinical" ? "text-slate-400" : "text-slate-500"
                  }`}>
                    Speed //
                  </span>
                  <div className={`p-0.5 rounded-lg border flex gap-1 ${
                    themeMode === "clinical" ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
                  }`}>
                    {[0.5, 1, 1.5].map((val) => (
                      <button
                        key={val}
                        onClick={() => setSpeed(val)}
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-md transition-all ${
                          speed === val
                            ? themeMode === "clinical"
                              ? "bg-cyan-950 text-cyan-300 border border-cyan-800/40 font-bold"
                              : "bg-white text-slate-800 font-bold border border-slate-200"
                            : "text-slate-400"
                        }`}
                      >
                        {val}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* REAL-TIME TELEMETRY SENSORS FEED (ECG, PRESSURES) */}
          <div className={`border rounded-2xl p-4 transition-all ${
            themeMode === "clinical" 
              ? "border-slate-800 bg-slate-900/75 shadow-md" 
              : "border-slate-200 bg-white shadow-sm"
          }`} id="telemetry-bar-component">
            <div className="flex items-center justify-between mb-3 border-b pb-2 border-dashed border-slate-800/50">
              <span className={`text-xs font-semibold font-mono tracking-wider flex items-center gap-1.5 uppercase ${
                themeMode === "clinical" ? "text-cyan-400" : "text-slate-500"
              }`}>
                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                Live Telemetry Monitors // CARDIAC_WAVEFORM
              </span>
              <span className="text-[10px] font-mono text-slate-500 text-right">SAMPLING_RATE: 250_Hz</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* ECG OSCILLOSCOPE WAVEFORM CANVAS */}
              <div className={`md:col-span-8 p-3 rounded-xl border h-24 relative overflow-hidden flex items-end ${
                themeMode === "clinical" ? "bg-slate-950 border-slate-850/60" : "bg-neutral-50 border-slate-100"
              }`}>
                {/* SVG path mapping Simulated ECG wave */}
                <svg className="w-full h-full absolute inset-0 text-cyan-400" preserveAspectRatio="none">
                  {/* Grid lines inside ECG */}
                  <g stroke={themeMode === "clinical" ? "rgba(6, 182, 212, 0.05)" : "rgba(30, 41, 59, 0.03)"} strokeWidth="1">
                    {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((percent) => (
                      <line key={percent} x1={`${percent}%`} y1="0" x2={`${percent}%`} y2="100%" />
                    ))}
                    {[20, 40, 60, 80].map((percent) => (
                      <line key={percent} x1="0" y1={`${percent}%`} x2="100%" y2={`${percent}%`} />
                    ))}
                  </g>
                  {/* The ECG waveform path */}
                  <path
                    d={ecgData
                      .map((val, idx) => {
                        const segmentWidth = 100 / 60; // 60 data points max
                        const x = idx * segmentWidth;
                        // Map -0.5..1.5 to 80% to 10% height
                        const y = 80 - (val + 0.35) * 45;
                        return `${idx === 0 ? "M" : "L"} ${x}% ${y}%`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke={themeMode === "clinical" ? "#06b6d4" : "#2563eb"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="absolute top-2 left-3 text-[9px] font-mono text-slate-500 bg-slate-950/40 px-1 py-0.5 rounded">
                  Lead_II PERF_ECG
                </div>
              </div>

              {/* TELEMETRY DIGITAL DIGITAL METERS */}
              <div className="md:col-span-4 grid grid-cols-3 gap-2 text-center" id="vital-meters">
                
                {/* HEART RATE METERS */}
                <div className={`p-2 rounded-xl border text-center ${
                  themeMode === "clinical" ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"
                }`}>
                  <div className="text-[9px] font-semibold text-slate-400 uppercase font-mono tracking-wider flex items-center justify-center gap-1">
                    <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500 animate-pulse" />
                    Pulse
                  </div>
                  <div className="text-xl font-bold font-display text-rose-500 mt-1">
                    {heartRate} <span className="text-[9px] font-mono font-medium text-slate-400">BPM</span>
                  </div>
                </div>

                {/* SYS / DIA PRESSURE METERS */}
                <div className={`p-2 rounded-xl border text-center ${
                  themeMode === "clinical" ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"
                }`}>
                  <div className="text-[9px] text-slate-400 uppercase font-mono tracking-wider">Pressure</div>
                  <div className="text-xl font-bold font-display text-amber-500 mt-1">
                    {sysPressure}/{diaPressure}
                    <span className="text-[9px] font-mono text-slate-400 block sm:inline sm:ml-1 text-[8px]">mmHg</span>
                  </div>
                </div>

                {/* SATO2 METERS */}
                <div className={`p-2 rounded-xl border text-center ${
                  themeMode === "clinical" ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"
                }`}>
                  <div className="text-[9px] text-slate-400 uppercase font-mono tracking-wider">SpO2 Sat</div>
                  <div className="text-xl font-bold font-display text-emerald-400 mt-1">
                    {oxygenSaturation}%
                  </div>
                </div>

              </div>

            </div>
          </div>

        </section>

        {/* RIGHT COLUMN: DETAILED LESSON STEPS & CLINICAL OVERLAYS (Col span 4) */}
        <section className="lg:col-span-4 flex flex-col gap-6" id="educational-lesson-panel">
          
          {/* STEP EXPLANATORY WRAPPER */}
          <div className={`border rounded-2xl p-5 flex-1 flex flex-col justify-between relative overflow-hidden transition-all ${
            themeMode === "clinical" 
              ? "border-slate-800 bg-slate-900/60" 
              : "border-slate-200 bg-white shadow-sm"
          }`} id="lesson-card">
            
            {/* Ambient Background decoration for steps */}
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex justify-between items-start gap-4 mb-4" id="lesson-header">
                <div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/10 text-cyan-400 uppercase">
                    MAPPING_CIRCULATION
                  </span>
                  <h2 className={`text-lg font-bold mt-2 font-display ${
                    themeMode === "clinical" ? "text-cyan-100" : "text-slate-900"
                  }`}>
                    {STEPS[currentStep].title}
                  </h2>
                </div>
                <div className="p-2 bg-slate-850 border border-slate-700/50 rounded-xl text-slate-400 font-mono text-center min-w-10 text-xs">
                  {currentStep + 1}/{STEPS.length}
                </div>
              </div>

              {/* ACTIVE PATHWAY VISUAL CARRIER */}
              <div className={`p-3 rounded-xl border mb-5 font-mono text-xs flex flex-col gap-1.5 ${
                themeMode === "clinical" 
                  ? "bg-slate-950/60 border-slate-800/80" 
                  : "bg-neutral-50 border-slate-200"
              }`} id="current-step-path-pill">
                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Pathway Stream //</span>
                <span className={`font-semibold tracking-wide ${
                  currentStep === 7 
                    ? "text-emerald-400 animate-pulse" 
                    : STEPS[currentStep].activeElements.includes("la") || STEPS[currentStep].activeElements.includes("lv") 
                      ? "text-rose-400" 
                      : "text-sky-400"
                }`}>
                  {STEPS[currentStep].pathway}
                </span>
              </div>

              {/* COMPREHENSIVE TEXT */}
              <div className="space-y-4 mb-6">
                <p className={`text-sm leading-relaxed ${
                  themeMode === "clinical" ? "text-slate-300" : "text-slate-600"
                }`}>
                  {STEPS[currentStep].description}
                </p>
                
                <div className={`p-3 border-l-2 text-xs flex gap-2 ${
                  themeMode === "clinical" 
                    ? "bg-slate-950/30 border-cyan-800/40 text-slate-450" 
                    : "bg-yellow-50 border-yellow-300 text-yellow-800"
                }`}>
                  <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-0.5">Clinical Insights</span>
                    {STEPS[currentStep].subText}
                  </div>
                </div>
              </div>
            </div>

            {/* TIP NOTICE STRIP */}
            <div className={`mt-auto p-3.5 rounded-xl border text-xs flex gap-2.5 items-center align-middle ${
              themeMode === "clinical" ? "bg-cyan-950/15 border-cyan-950/50 text-slate-500" : "bg-blue-50 border-blue-100 text-blue-700"
            }`}>
              <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0" />
              <span>
                <strong>Academic Tip:</strong> Click directly on RA, RV, LA, LV blocks, lungs, or valves inside the diagram above for cellular specifications & clinical diseases!
              </span>
            </div>

          </div>

          {/* INTERACTIVE COMPONENT DETAILS OVERLAY POPUP */}
          {selectedStructure && (
            <div className={`border rounded-2xl p-5 relative animate-fade-in transition-all ${
              themeMode === "clinical" 
                ? "border-slate-800 bg-slate-900 shadow-lg" 
                : "border-slate-200 bg-white shadow-md shadow-slate-200/50"
            }`} id="anatomical-popup-inspector">
              <button 
                onClick={() => setSelectedStructure(null)}
                className="absolute top-3 right-3 text-xs font-mono p-1 px-2.5 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 pointer-events-auto"
                title="Dismiss overlay"
              >
                ✕ Close
              </button>

              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-bold font-mono text-cyan-400 uppercase tracking-widest">Selected Specimen // Lab Report</span>
              </div>

              <h3 className={`text-base font-bold font-display leading-tight mb-2 ${
                themeMode === "clinical" ? "text-slate-100" : "text-slate-900"
              }`}>
                {selectedStructure.fullName}
              </h3>

              <p className={`text-xs mb-4 leading-relaxed ${
                themeMode === "clinical" ? "text-slate-400" : "text-slate-600"
              }`}>
                {selectedStructure.role}
              </p>

              {/* GRID VITAL REVIEWS FOR THE DETAILED COMPONENT */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-950/80 border border-slate-850/60 font-mono text-[10px] mb-3">
                <div>
                  <span className="text-slate-500 block uppercase">Oxygen saturation</span>
                  <span className={`font-bold ${
                    selectedStructure.bloodType === "Oxygenated" 
                      ? "text-rose-400" 
                      : selectedStructure.bloodType === "Deoxygenated" 
                        ? "text-sky-400" 
                        : "text-emerald-400"
                  }`}>
                    {selectedStructure.o2Saturation}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase">Physiological Pressure</span>
                  <span className="font-bold text-amber-500">{selectedStructure.pressureRange}</span>
                </div>
              </div>

              <div className={`p-3 border-l-2 text-[11px] leading-relaxed ${
                themeMode === "clinical" 
                  ? "bg-slate-950/40 border-rose-500/40 text-slate-300" 
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}>
                <strong className="text-rose-400 block mb-0.5 font-bold">Related Clinical Anomalies:</strong>
                {selectedStructure.clinicalNote}
              </div>
            </div>
          )}

        </section>

      </main>

      {/* FOOTER STRIP */}
      <footer className={`px-6 py-4 mt-auto border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono transition-colors ${
        themeMode === "clinical" 
          ? "border-slate-900 bg-slate-950/50 text-slate-550" 
          : "border-slate-200 bg-slate-100 text-slate-500"
      }`} id="primary-footer">
        <div>
          <span>BIYLI Biomedical v1.2 // Module_01 of_06 // University MVP Draft Demo</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            UTC_STAMP // 2026-05-24
          </span>
          <span className="text-emerald-400">• SECURE CONNECTION LIVE</span>
        </div>
      </footer>

    </div>
  );
}
