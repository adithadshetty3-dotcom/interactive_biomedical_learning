import React, { useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  Award,
  HelpCircle,
  Heart,
  BookOpen,
  ArrowRight,
  Info,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

// Structure definition for anatomical parts of the heart
interface AnatomicalStructure {
  name: string;
  fullName: string;
  role: string;
  bloodType: "Oxygenated" | "Deoxygenated" | "Mixed" | "N/A";
  pressureLevel: string;
  oxygenSaturation: string;
  clinicalExplanationCount: string;
}

const structureData: Record<string, AnatomicalStructure> = {
  ra: {
    name: "Right Atrium",
    fullName: "Right Atrium (RA)",
    role: "The receiving chamber for deoxygenated blood returning from the upper and lower body via the vena cava.",
    bloodType: "Deoxygenated",
    pressureLevel: "Low (2-6 mmHg)",
    oxygenSaturation: "75% (low oxygen)",
    clinicalExplanationCount: "A hole in the wall between the atria (Atrial Septal Defect) allows oxygen-rich blood to leak back from the left side, overloading the right heart."
  },
  rv: {
    name: "Right Ventricle",
    fullName: "Right Ventricle (RV)",
    role: "Receives deoxygenated blood from the Right Atrium and pumps it forward to the lungs for fresh oxygenation.",
    bloodType: "Deoxygenated",
    pressureLevel: "Moderate (15-25 mmHg)",
    oxygenSaturation: "75% (low oxygen)",
    clinicalExplanationCount: "If pulmonary pressure in the lungs is too high, this chamber has to work extra hard, causing the muscle wall to thicken and fail over time."
  },
  la: {
    name: "Left Atrium",
    fullName: "Left Atrium (LA)",
    role: "Receives highly oxygenated, bright red blood that has just returned from the lungs via the pulmonary veins.",
    bloodType: "Oxygenated",
    pressureLevel: "Low to Moderate (6-12 mmHg)",
    oxygenSaturation: "98% (fully loaded)",
    clinicalExplanationCount: "An irregular heart rhythm like Atrial Fibrillation (AFib) causes this chamber to quiver, which can allow blood to pool and potentially form dangerous clots."
  },
  lv: {
    name: "Left Ventricle",
    fullName: "Left Ventricle (LV)",
    role: "The strongest heart chamber. Pumps oxygen-rich blood through the aorta to sustain all vital organs in your body.",
    bloodType: "Oxygenated",
    pressureLevel: "High (100-140 mmHg)",
    oxygenSaturation: "98% (fully loaded)",
    clinicalExplanationCount: "This is the thickest muscle chamber in the heart. Chronic high blood pressure forces the LV to pump against stiff vessels, leading to heart failure."
  },
  lungs: {
    name: "Lugs (Pulmonary Exchange)",
    fullName: "Microscopic Lung Capillaries",
    role: "Where gas exchange happens: carbon dioxide waste is released from the blood, and inhaled oxygen is picked up.",
    bloodType: "Mixed",
    pressureLevel: "Low (10-20 mmHg)",
    oxygenSaturation: "Changes from 75% to 98%",
    clinicalExplanationCount: "A blood clot in the lungs (pulmonary embolism) blocks blood flow, stopping oxygen pickup and causing sudden severe shortness of breath."
  },
  body: {
    name: "Systemic Body Organs",
    fullName: "Body Muscles, Organs & Tissues",
    role: "Oxygen and nutrients are delivered to tissues to keep them alive, and deoxygenated waste is collected for return.",
    bloodType: "Mixed",
    pressureLevel: "High (80-120 mmHg)",
    oxygenSaturation: "Drops from 98% down to 75%",
    clinicalExplanationCount: "Narrowed arteries throughout the body (from things like high cholesterol) increase systemic vascular resistance, making the heart pump harder."
  },
  tricuspid: {
    name: "Tricuspid Valve",
    fullName: "Tricuspid Valve",
    role: "A one-way valve that lets blood flow from the Right Atrium down into the Right Ventricle, and shuts tight to prevent blood from leaking backward.",
    bloodType: "Deoxygenated",
    pressureLevel: "Closes under ventricle contraction",
    oxygenSaturation: "75%",
    clinicalExplanationCount: "If this valve stretches or tears, deoxygenated blood leaks back into the right atrium, which can cause swelling in the legs."
  },
  bicuspid: {
    name: "Bicuspid (Mitral) Valve",
    fullName: "Mitral / Bicuspid Valve",
    role: "A thick, dual-flap valve that opens to let oxygenated blood drain from the Left Atrium into the Left Ventricle, sealing completely during heart squeeze.",
    bloodType: "Oxygenated",
    pressureLevel: "Closes under heavy LV squeeze",
    oxygenSaturation: "98%",
    clinicalExplanationCount: "Mitral Valve Prolapse is a common issue where the flaps bulge backward, sometimes triggering symptoms of fatigue or chest fluttering."
  },
  venaCava: {
    name: "Vena Cava Vessels",
    fullName: "Superior & Inferior Vena Cava",
    role: "The largest venous channels in your body. They collect all deoxygenated blood from resources and return it to the heart.",
    bloodType: "Deoxygenated",
    pressureLevel: "Very Low (2-6 mmHg)",
    oxygenSaturation: "75%",
    clinicalExplanationCount: "Pressure inside these vessels rises if the right ventricles fail, causing venous blood to back up into the liver and stomach."
  },
  pulmonaryArtery: {
    name: "Pulmonary Artery",
    fullName: "Pulmonary Arteries",
    role: "The only artery in the body that carries oxygen-poor (blue) blood. It routes flow from the Right Ventricle up to the lungs.",
    bloodType: "Deoxygenated",
    pressureLevel: "Moderate (15-25 mmHg)",
    oxygenSaturation: "75%",
    clinicalExplanationCount: "Pulmonary Arterial Hypertension is a narrowing of these lungs vessels, creating extreme resistance that strains the heart."
  },
  pulmonaryVein: {
    name: "Pulmonary Vein",
    fullName: "Pulmonary Veins",
    role: "The only veins in the human body that carry highly oxygenated (bright red) blood. They carry blood from the lungs back to the Left Atrium.",
    bloodType: "Oxygenated",
    pressureLevel: "Low (6-12 mmHg)",
    oxygenSaturation: "98%",
    clinicalExplanationCount: "These veins act as critical conduits. If they are structurally obstructed, blood overflows the lungs, causing pulmonary edema."
  },
  aorta: {
    name: "Aorta Vessel",
    fullName: "Ascending and Descending Aorta",
    role: "The largest artery in the human body. Directs the full immense force of oxygenated blood pumped of the Left Ventricle to the rest of the body.",
    bloodType: "Oxygenated",
    pressureLevel: "High (100-140 mmHg)",
    oxygenSaturation: "98%",
    clinicalExplanationCount: "A high-stress environment or untreated high pressure can weaken the aorta wall, causing a tear (aortic dissection) which is an emergency."
  }
};

const STEPS = [
  {
    title: "1. Return from body tissues",
    simpleTitle: "Vena Cava Intake",
    description: "Oxygen-depleted blood returns from the body organs through the Vena Cava, empty directly into the Right Atrium.",
    pathway: "BODY → Vena Cava → Right Atrium",
    activeElements: ["body", "venaCava", "ra"],
    visualInstruction: "Look at the left side of the screen. Deoxygenated (blue) blood returns to the Right Atrium."
  },
  {
    title: "2. Through the Tricuspid Valve",
    simpleTitle: "Tricuspid Gate",
    description: "The Right Atrium contracts, pushing the blue blood down through the Tricuspid Valve into the Right Ventricle.",
    pathway: "Right Atrium → Tricuspid Valve → Right Ventricle",
    activeElements: ["ra", "tricuspid", "rv"],
    visualInstruction: "The Tricuspid Valve flaps open downwards, allowing blood to cascade into the receiving Right Ventricle."
  },
  {
    title: "3. Propulsion toward the lungs",
    simpleTitle: "Pulmonary Delivery",
    description: "The Right Ventricle contracts. The Tricuspid Valve shuts to prevent backflow, forcing blood up through the Pulmonary Artery.",
    pathway: "Right Ventricle → Pulmonary Valve/Artery → Lungs",
    activeElements: ["rv", "pulmonaryArtery", "lungs"],
    visualInstruction: "The closing Tricuspid Valve produces the 'LUB' sound as blood is pumped up towards the lung system."
  },
  {
    title: "4. Gas exchange in the lungs",
    simpleTitle: "Alveolar Oxygenation",
    description: "Inside the lungs, deoxygenated blood releases waste carbon dioxide (exhaled) and is saturated with fresh inhaled oxygen.",
    pathway: "Lungs Gas Exchange",
    activeElements: ["lungs"],
    visualInstruction: "Notice the blood shifting from oxygen-poor blue to oxygen-rich red inside the lung capillary block."
  },
  {
    title: "5. Return of oxygenated blood",
    simpleTitle: "Pulmonary Vein Return",
    description: "The fresh, bright-red blood leaves the lungs and flows back into the Left Atrium of the heart through the Pulmonary Veins.",
    pathway: "Lungs → Pulmonary Vein → Left Atrium",
    activeElements: ["lungs", "pulmonaryVein", "la"],
    visualInstruction: "Oxygenated (red) blood returns from the lungs, filling the Left Atrium on the right-hand side."
  },
  {
    title: "6. Into the Left Ventricle",
    simpleTitle: "Bicuspid Gate Transition",
    description: "The Left Atrium contracts, opening the Bicuspid (Mitral) Valve and pouring the oxygenated red blood down into the Left Ventricle.",
    pathway: "Left Atrium → Bicuspid Valve → Left Ventricle",
    activeElements: ["la", "bicuspid", "lv"],
    visualInstruction: "The Bicuspid Valve slides open, pouring rich blood down into the massive, thick Left Ventricle wall."
  },
  {
    title: "7. Out to the entire body",
    simpleTitle: "Aortic Delivery",
    description: "The Left Ventricle contracts with massive force. The Bicuspid Valve snaps shut, driving oxygen-rich red blood into the main Aorta.",
    pathway: "Left Ventricle → Aorta Arch → BODY",
    activeElements: ["lv", "aorta", "body"],
    visualInstruction: "The closing Bicuspid Valve generates the second 'DUB' heart sound as blood is propelled to satisfy tissue demands."
  },
  {
    title: "8. Continuous double loop",
    simpleTitle: "The Master Cycle",
    description: "Both sides of the heart work simultaneously in a coordinated beat to pump blood in continuous series loops.",
    pathway: "BODY → RIGHT HEART → LUNGS → LEFT HEART → BODY",
    activeElements: ["body", "venaCava", "ra", "tricuspid", "rv", "pulmonaryArtery", "lungs", "pulmonaryVein", "la", "bicuspid", "lv", "aorta"],
    visualInstruction: "Click 'PLAY' to observe the entire dual-circulation pathway working automatically in real-time."
  }
];

const QUIZ_QUESTIONS = [
  {
    question: "Which vessels return oxygen-depleted (blue) blood back from the body to the heart?",
    options: ["Aorta Arch", "Pulmonary Veins", "Vena Cava Vessels", "Pulmonary Artery"],
    correct: 2,
    rationale: "The Vena Cava vessels collect deoxygenated blood returning from muscles and organs and deposit it directly into the Right Atrium."
  },
  {
    question: "What is the primary role of the Tricuspid Valve?",
    options: [
      "To prevent blood from backing up from the Right Ventricle into the Right Atrium",
      "To pump oxygen-rich blood out to the brain",
      "To connect the left and right ventricles directly",
      "To deliver waste carbon dioxide to the lungs"
    ],
    correct: 0,
    rationale: "The Tricuspid Valve sits between the right atrium and right ventricle. It closes during contractions to keep blood traveling forward toward the lungs, not backward."
  },
  {
    question: "Identify the unique artery in the human body that carries oxygen-poor (blue) blood:",
    options: ["Aorta", "Pulmonary Artery", "Carotid Artery", "Pulmonary Vein"],
    correct: 1,
    rationale: "The Pulmonary Artery gets its name because it carries blood AWAY from the heart, but it is unique because that blood is deoxygenated, on its way to the lungs for a fresh supply."
  },
  {
    question: "Why is the muscle wall of the Left Ventricle (LV) so much thicker than the Right Ventricle (RV)?",
    options: [
      "It coordinates blood temperature.",
      "It must generate enough pressure to push blood across the entire body, while the RV only pumps to the nearby lungs.",
      "It contracts twice as fast.",
      "It has to prevent muscular friction against the spinal cord."
    ],
    correct: 1,
    rationale: "The Right Ventricle pumps against low pulmonary resistance to the nearby lungs. The Left Ventricle must pump blood up against gravity and resistance to feed everything from your toes to your brain."
  }
];

export default function HeartCirculationSim() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [selectedKey, setSelectedKey] = useState<string>("ra");
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [audioFeedback, setAudioFeedback] = useState<boolean>(false);
  
  // Quiz states
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [chosenAnswer, setChosenAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Sync auto-playback cycle
  useEffect(() => {
    if (!isPlaying) return;
    
    const intervalTime = (currentStep === 7 ? 4500 : 2500) / playbackSpeed;
    const timer = setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % STEPS.length);
      if (audioFeedback) {
        playBeep();
      }
    }, intervalTime);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, playbackSpeed, audioFeedback]);

  // Synchronize selecting the active element under step highlights as default clicked info
  useEffect(() => {
    const activeList = STEPS[currentStep].activeElements;
    if (activeList.length > 0 && !activeList.includes(selectedKey)) {
      setSelectedKey(activeList[0]);
    }
  }, [currentStep]);

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(280, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      console.log("Audio not allowed by policy yet");
    }
  };

  const handleElementHover = (key: string) => {
    if (structureData[key]) {
      setSelectedKey(key);
    }
  };

  const isElementActive = (key: string): boolean => {
    if (currentStep === 7) return true; // Master loop highlights everything
    return STEPS[currentStep].activeElements.includes(key);
  };

  const selectedStrData = structureData[selectedKey] || structureData.ra;

  // Render direct progress ticks
  const handleProgressDotClick = (index: number) => {
    setCurrentStep(index);
    setIsPlaying(false);
  };

  // Retake quiz
  const handleResetQuiz = () => {
    setCurrentQuestion(0);
    setChosenAnswer(null);
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const handleSubmitQuiz = () => {
    if (chosenAnswer === null || quizSubmitted) return;
    setQuizSubmitted(true);
    if (chosenAnswer === QUIZ_QUESTIONS[currentQuestion].correct) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    setChosenAnswer(null);
    setQuizSubmitted(false);
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="flex-grow flex flex-col gap-6 bg-slate-950 text-slate-100 p-4 md:p-6" id="heart-circ-sim-container">
      
      {/* 1. CLEAN EXPLAINER HEAD */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-red-950 border border-red-500/20 text-red-400 font-mono font-bold px-2 py-0.5 rounded">
              INTERACTIVE TUTORIAL
            </span>
            <span className="text-xs text-slate-400 font-mono">// Blood Circulation & Valve Mechanics</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight font-sans mt-1">
            How Blood Circulates Through the Heart
          </h2>
          <p className="text-xs text-slate-450 mt-1 max-w-xl">
            Understand the complete path blood takes to receive oxygen from the lungs and supply tissues. 
            Click any labeled chamber or vessel below to study its function.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={() => setAudioFeedback(!audioFeedback)}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              audioFeedback 
                ? "bg-emerald-950/40 border-emerald-500/60 text-emerald-400" 
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
            title="Toggle heart signal chirp"
            id="audio-sound-toggle"
          >
            {audioFeedback ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            <span className="font-mono text-[10px]">CHIRP beep</span>
          </button>

          {/* Quick Quiz Activator */}
          <button
            onClick={() => setIsQuizOpen(!isQuizOpen)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              isQuizOpen 
                ? "bg-rose-950 border-rose-500 text-rose-350" 
                : "bg-slate-900 hover:bg-slate-850 text-cyan-400 border-cyan-500/30 font-mono"
            }`}
            id="quick-quiz-button"
          >
            <Award className="w-4 h-4" />
            {isQuizOpen ? "Return to Simulation" : "Launch Rapid Test"}
          </button>
        </div>
      </div>

      {/* 2. MAIN SPLIT GRID CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT CARD: DIRECT PIPELINE FLOW VISUALIZER (SVG MAP) */}
        <div className="lg:col-span-7 bg-slate-900/40 rounded-2xl border border-slate-850 p-4 md:p-6 flex flex-col justify-between shadow-xl min-h-[460px]" id="sim-flow-viewport-card">
          
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 border-b border-slate-850 pb-3 mb-4">
            <span className="flex items-center gap-1.5 font-bold uppercase text-red-500">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              Interactive schematic flow
            </span>
            <span className="text-slate-500 text-[10px]">CLICK ON LABELS</span>
          </div>

          {/* SIMPLIFIED SCHEMATIC DIAGRAM DRAWN IN SVG */}
          <div className="flex-grow flex items-center justify-center p-2 relative">
            
            {isQuizOpen ? (
              /* QUICK KNOWLEDGE ASSESSMENT MODE SCREEN overlay */
              <div className="w-full max-w-lg p-3 flex flex-col justify-between animate-fade-in text-xs min-h-[340px]" id="rapid-assessment-box">
                {!quizFinished ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span className="bg-slate-900 px-2.5 py-1 rounded text-rose-450 border border-slate-800">
                        QUESTION {currentQuestion + 1} OF {QUIZ_QUESTIONS.length}
                      </span>
                      <span>Score: <b className="text-emerald-450">{quizScore}</b></span>
                    </div>

                    <h3 className="text-base font-bold text-slate-100 font-sans leading-relaxed">
                      {QUIZ_QUESTIONS[currentQuestion].question}
                    </h3>

                    <div className="grid grid-cols-1 gap-2.5 pt-2">
                      {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => {
                        const isChosen = chosenAnswer === idx;
                        const revealCorrect = quizSubmitted && idx === QUIZ_QUESTIONS[currentQuestion].correct;
                        const revealIncorrect = quizSubmitted && isChosen && idx !== QUIZ_QUESTIONS[currentQuestion].correct;

                        let style = "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900";
                        if (isChosen) style = "bg-cyan-955/20 border-cyan-500 text-cyan-300";
                        if (revealCorrect) style = "bg-emerald-950/40 border-emerald-500 text-emerald-400 font-bold";
                        if (revealIncorrect) style = "bg-rose-950/40 border-rose-500 text-rose-400";

                        return (
                          <button
                            key={idx}
                            onClick={() => !quizSubmitted && setChosenAnswer(idx)}
                            disabled={quizSubmitted}
                            className={`w-full p-2.5 text-left border rounded-xl transition-all flex items-center justify-between text-xs ${style} ${!quizSubmitted ? "cursor-pointer" : ""}`}
                          >
                            <span>{option}</span>
                            {revealCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                            {revealIncorrect && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-900 text-[11px] leading-relaxed text-slate-400">
                        <strong className="text-amber-500 font-mono block mb-0.5">LEARNING RATIONALE:</strong>
                        {QUIZ_QUESTIONS[currentQuestion].rationale}
                      </div>
                    )}

                    <div className="flex justify-end pt-3">
                      {!quizSubmitted ? (
                        <button
                          onClick={handleSubmitQuiz}
                          disabled={chosenAnswer === null}
                          className={`px-5 py-2 font-bold font-mono text-xs rounded-xl border transition-all ${
                            chosenAnswer === null
                              ? "bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed"
                              : "bg-cyan-400 border-cyan-500 text-slate-950 hover:bg-cyan-300 cursor-pointer"
                          }`}
                        >
                          SUBMIT CHOICE
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuiz}
                          className="bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 text-white font-bold font-mono px-5 py-2 text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <span>{currentQuestion === QUIZ_QUESTIONS.length - 1 ? "FINISH MODULE" : "NEXT QUESTION"}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-14 h-14 bg-emerald-950/40 text-emerald-400 border border-emerald-500/25 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
                      <Award className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-100 font-sans">Module Assessment Completed</h4>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                        Excellent calibration! You finished the blood circulation quiz successfully.
                      </p>
                    </div>

                    <div className="bg-slate-950 border border-slate-900 p-4 rounded-2xl max-w-xs mx-auto text-center space-y-1">
                      <div className="text-[10px] uppercase font-mono text-slate-500">Your Accuracy Score</div>
                      <div className="text-4xl font-mono font-bold text-cyan-400">{(quizScore / QUIZ_QUESTIONS.length) * 100}%</div>
                      <div className="text-xs text-slate-450">{quizScore} Correct of {QUIZ_QUESTIONS.length} Questions</div>
                    </div>

                    <div className="flex justify-center gap-2 pt-2.5">
                      <button
                        onClick={handleResetQuiz}
                        className="bg-rose-500 hover:bg-rose-400 text-white font-mono text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                      >
                        Retake Test
                      </button>
                      <button
                        onClick={() => setIsQuizOpen(false)}
                        className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-350 font-mono text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                      >
                        Return to Lab
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* THE BEAUTIFUL SIMPLIFIED BLOCK FLOW DIAGRAM */
              <svg 
                viewBox="0 0 740 500" 
                className="w-full h-auto max-h-[380px] overflow-visible"
              >
                <defs>
                  <linearGradient id="blueGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.0" />
                  </linearGradient>
                  
                  {/* Marker arrows */}
                  <marker id="arrowDeox" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#60a5fa" />
                  </marker>
                  <marker id="arrowOx" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#fca5a5" />
                  </marker>
                </defs>

                {/* 1. LUNGS BOX (TOP exchange) */}
                <g 
                  onClick={() => handleElementHover("lungs")}
                  className="cursor-pointer group"
                >
                  <rect 
                    x="240" y="20" width="260" height="50" rx="25"
                    fill={isElementActive("lungs") ? "#172554" : "#1e293b"}
                    stroke={isElementActive("lungs") ? "#3b82f6" : "#475569"}
                    strokeWidth={isElementActive("lungs") ? "3" : "1.5"}
                    className="transition-all duration-300"
                  />
                  <text x="370" y="50" textAnchor="middle" fontSize="13" fontWeight="bold" fill={isElementActive("lungs") ? "#60a5fa" : "#94a3b8"} className="font-mono uppercase tracking-widest">
                    ☁ Lungs (Gas Exchange)
                  </text>
                </g>

                {/* 2. BODY ORGANS SYSTEMIC PANEL (BOTTOM exchange) */}
                <g 
                  onClick={() => handleElementHover("body")}
                  className="cursor-pointer group"
                >
                  <rect 
                    x="240" y="420" width="260" height="50" rx="25"
                    fill={isElementActive("body") ? "#450a0a" : "#1e293b"}
                    stroke={isElementActive("body") ? "#f43f5e" : "#475569"}
                    strokeWidth={isElementActive("body") ? "3" : "1.5"}
                    className="transition-all duration-300"
                  />
                  <text x="370" y="450" textAnchor="middle" fontSize="13" fontWeight="bold" fill={isElementActive("body") ? "#fca5a5" : "#94a3b8"} className="font-mono uppercase tracking-widest">
                    ⚡ Body Organs & Muscles
                  </text>
                </g>

                {/* 3. CLOSED LOOP BLOOD VESSEL PATHWAYS */}
                <g id="conduit-vessels" strokeLinecap="round" strokeDasharray="none">
                  
                  {/* Vena Cava: Body (Left exit area) curving up to Right Atrium */}
                  <path 
                    d="M 280 420 C 130 380 130 220 220 200" 
                    fill="none" 
                    stroke={isElementActive("venaCava") ? "#3b82f6" : "#334155"} 
                    strokeWidth={isElementActive("venaCava") ? "6" : "3"}
                    className="transition-all duration-300 pointer-events-none"
                    markerEnd="url(#arrowDeox)"
                  />
                  {isElementActive("venaCava") && (
                    <circle r="4" fill="#93c5fd" className="animate-flow-path">
                      <animateMotion path="M 280 420 C 130 380 130 220 220 200" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Pulmonary Artery: Right Ventricle up to Lungs */}
                  <path 
                    d="M 310 280 Q 310 110 330 70" 
                    fill="none" 
                    stroke={isElementActive("pulmonaryArtery") ? "#1d4ed8" : "#334155"} 
                    strokeWidth={isElementActive("pulmonaryArtery") ? "6" : "3"}
                    className="transition-all duration-300 pointer-events-none"
                    markerEnd="url(#arrowDeox)"
                  />
                  {isElementActive("pulmonaryArtery") && (
                    <circle r="4" fill="#60a5fa" className="animate-flow-path">
                      <animateMotion path="M 310 280 Q 310 110 330 70" dur="2.2s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Pulmonary Veins: Lungs down to Left Atrium */}
                  <path 
                    d="M 400 70 Q 430 110 430 200" 
                    fill="none" 
                    stroke={isElementActive("pulmonaryVein") ? "#dc2626" : "#334155"} 
                    strokeWidth={isElementActive("pulmonaryVein") ? "6" : "3"}
                    className="transition-all duration-300 pointer-events-none"
                    markerEnd="url(#arrowOx)"
                  />
                  {isElementActive("pulmonaryVein") && (
                    <circle r="4" fill="#fca5a5" className="animate-flow-path">
                      <animateMotion path="M 400 70 Q 430 110 430 200" dur="2.2s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Aorta: Left Ventricle looping up, then plunging down to Body */}
                  <path 
                    d="M 520 280 C 650 250 630 370 460 420" 
                    fill="none" 
                    stroke={isElementActive("aorta") ? "#ef4444" : "#334155"} 
                    strokeWidth={isElementActive("aorta") ? "6" : "3"}
                    className="transition-all duration-300 pointer-events-none"
                    markerEnd="url(#arrowOx)"
                  />
                  {isElementActive("aorta") && (
                    <circle r="4" fill="#fecaca" className="animate-flow-path">
                      <animateMotion path="M 520 280 C 650 250 630 370 460 420" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                </g>

                {/* HEART CHAMBER BOX FRAME LAYOUT */}
                <g id="heart-frame-outer">
                  <rect 
                    x="200" y="130" width="340" height="230" rx="16" 
                    fill="#0f172a" stroke="#0891b2" strokeWidth="2.0" strokeDasharray="4 4" opacity="0.45"
                  />
                  
                  {/* SEPTAL WALL DIVIDER */}
                  <line x1="370" y1="130" x2="370" y2="360" stroke="#334155" strokeWidth="5" />
                  
                  {/* Left-side titles */}
                  <text x="285" y="120" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#3b82f6" className="font-mono">
                    🟦 RIGHT HEART (Oxygen-Poor)
                  </text>
                  {/* Right-side titles */}
                  <text x="455" y="120" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ef4444" className="font-mono">
                    🟥 LEFT HEART (Oxygen-Rich)
                  </text>

                  {/* RIGHT ATRIUM (RA) */}
                  <g 
                    onClick={() => handleElementHover("ra")}
                    className="cursor-pointer"
                  >
                    <rect 
                      x="220" y="150" width="130" height="70" rx="6" 
                      fill={isElementActive("ra") ? "rgba(37, 99, 235, 0.4)" : "#111827"} 
                      stroke={isElementActive("ra") ? "#3b82f6" : "#1e293b"} 
                      strokeWidth={isElementActive("ra") ? "2.5" : "1.2"}
                      className="transition-all duration-300 font-display"
                    />
                    <text x="285" y="185" textAnchor="middle" fontSize="13" fontWeight="bold" fill={isElementActive("ra") ? "#60a5fa" : "#64748b"}>Right Atrium (RA)</text>
                    <text x="285" y="202" textAnchor="middle" fontSize="8" className="font-mono" fill="#475569">DEOXYGENATED</text>
                  </g>

                  {/* LEFT ATRIUM (LA) */}
                  <g 
                    onClick={() => handleElementHover("la")}
                    className="cursor-pointer"
                  >
                    <rect 
                      x="390" y="150" width="130" height="70" rx="6" 
                      fill={isElementActive("la") ? "rgba(220, 38, 38, 0.35)" : "#111827"} 
                      stroke={isElementActive("la") ? "#ef4444" : "#1e293b"} 
                      strokeWidth={isElementActive("la") ? "2.5" : "1.2"}
                      className="transition-all duration-300 font-display"
                    />
                    <text x="455" y="185" textAnchor="middle" fontSize="13" fontWeight="bold" fill={isElementActive("la") ? "#fca5a5" : "#64748b"}>Left Atrium (LA)</text>
                    <text x="455" y="202" textAnchor="middle" fontSize="8" className="font-mono" fill="#475569">OXYGENATED</text>
                  </g>

                  {/* VALVE LINES & CLICK GATES */}
                  {/* Tricuspid Valve */}
                  <g 
                    onClick={() => handleElementHover("tricuspid")}
                    className="cursor-pointer"
                  >
                    <rect x="235" y="233" width="100" height="14" rx="4" fill="#0f172a" stroke="#eab308" strokeWidth="1" />
                    <text x="285" y="243" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#eab308" className="font-mono">
                      {currentStep === 1 ? "🔓 TRICUSPID OPEN" : "🔒 TRICUSPID CLOSED"}
                    </text>
                  </g>

                  {/* Bicuspid / Mitral Valve */}
                  <g 
                    onClick={() => handleElementHover("bicuspid")}
                    className="cursor-pointer"
                  >
                    <rect x="405" y="233" width="100" height="14" rx="4" fill="#0f172a" stroke="#eab308" strokeWidth="1" />
                    <text x="455" y="243" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#eab308" className="font-mono">
                      {currentStep === 5 ? "🔓 MITRAL OPEN" : "🔒 MITRAL CLOSED"}
                    </text>
                  </g>

                  {/* RIGHT VENTRICLE (RV) */}
                  <g 
                    onClick={() => handleElementHover("rv")}
                    className="cursor-pointer"
                  >
                    <rect 
                      x="220" y="260" width="130" height="70" rx="6" 
                      fill={isElementActive("rv") ? "rgba(37, 99, 235, 0.4)" : "#111827"} 
                      stroke={isElementActive("rv") ? "#3b82f6" : "#1e293b"} 
                      strokeWidth={isElementActive("rv") ? "2.5" : "1.2"}
                      className="transition-all duration-300 font-display"
                    />
                    <text x="285" y="295" textAnchor="middle" fontSize="13" fontWeight="bold" fill={isElementActive("rv") ? "#60a5fa" : "#64748b"}>Right Ventricle (RV)</text>
                    <text x="285" y="312" textAnchor="middle" fontSize="8" className="font-mono" fill="#475569">DEOXYGENATED</text>
                  </g>

                  {/* LEFT VENTRICLE (LV) */}
                  <g 
                    onClick={() => handleElementHover("lv")}
                    className="cursor-pointer"
                  >
                    <rect 
                      x="390" y="260" width="130" height="70" rx="6" 
                      fill={isElementActive("lv") ? "rgba(220, 38, 38, 0.35)" : "#111827"} 
                      stroke={isElementActive("lv") ? "#ef4444" : "#1e293b"} 
                      strokeWidth={isElementActive("lv") ? "2.5" : "1.2"}
                      className="transition-all duration-300 font-display"
                    />
                    <text x="455" y="295" textAnchor="middle" fontSize="13" fontWeight="bold" fill={isElementActive("lv") ? "#fca5a5" : "#64748b"}>Left Ventricle (LV)</text>
                    <text x="455" y="312" textAnchor="middle" fontSize="8" className="font-mono" fill="#475569">OXYGENATED</text>
                  </g>
                </g>

                {/* ANATOMICAL LABEL TAGS TO MAKE CLICK TARGETING OBVIOUS */}
                <g opacity="0.8" fontSize="8" fontWeight="bold" className="font-mono">
                  {/* Vena cava tag */}
                  <text x="125" y="330" fill="#a1a1aa" textAnchor="middle">VENA CAVA 🟦</text>
                  {/* Pulmonary artery tag */}
                  <text x="260" y="110" fill="#a1a1aa" textAnchor="middle">PULM. ARTERY 🟦</text>
                  {/* Pulmonary vein tag */}
                  <text x="495" y="110" fill="#fca5a5" textAnchor="middle">🟥 PULM. VEINS</text>
                  {/* Aorta arch tag */}
                  <text x="610" y="350" fill="#fca5a5" textAnchor="middle">🟥 AORTA ARCH</text>
                </g>
              </svg>
            )}

          </div>

          {/* LOWER CONTROLS PANEL */}
          <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl mt-4" id="sim-flow-controls">
            
            {/* Steps linear pipeline overview dot dots */}
            <div className="mb-3">
              <div className="flex justify-between items-center text-[10px] font-mono mb-1.5 text-slate-400">
                <span>CIRCULATORY SEQUENTIAL PHASE:</span>
                <span>STEP {currentStep + 1} OF {STEPS.length}</span>
              </div>
              
              <div className="flex gap-1.5 h-1">
                {STEPS.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleProgressDotClick(idx)}
                    className={`flex-1 rounded-sm transition-all h-full cursor-pointer ${
                      idx === currentStep 
                        ? "bg-cyan-400" 
                        : idx < currentStep 
                          ? "bg-slate-500" 
                          : "bg-slate-800 hover:bg-slate-700"
                    }`}
                    title={step.simpleTitle}
                  />
                ))}
              </div>
            </div>

            {/* Media controllers */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              
              {/* Backward/Play/Forward buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStep((prev) => (prev - 1 + STEPS.length) % STEPS.length);
                  }}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition-all cursor-pointer"
                  title="Previous circulatory phase"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold px-4 py-1.5 rounded-lg flex items-center gap-1 transition-all text-[11px] cursor-pointer"
                  id="autoplay-switch"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-slate-950" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
                  <span>{isPlaying ? "PAUSE ACTION" : "AUTO ADVANCE"}</span>
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStep((prev) => (prev + 1) % STEPS.length);
                  }}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition-all cursor-pointer"
                  title="Next circulatory phase"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStep(0);
                  }}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-450 hover:text-slate-200 rounded-lg transition-all cursor-pointer"
                  title="Reset cycle to Vena Cava Step 1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Speed modifiers */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase">AUTO SPEED:</span>
                <div className="p-0.5 bg-slate-900 border border-slate-800 rounded-lg flex gap-1">
                  {[0.5, 1.0, 1.5].map((sp) => (
                    <button
                      key={sp}
                      onClick={() => setPlaybackSpeed(sp)}
                      className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded transition-all cursor-pointer ${
                        playbackSpeed === sp 
                          ? "bg-cyan-950 text-cyan-300 border border-cyan-800/30" 
                          : "text-slate-400 hover:text-slate-250"
                      }`}
                    >
                      {sp}x
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT CARD: DOCK OF SYMPTOMS AND ACTIVE INFORMATION (SPAN 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6" id="dashboard-details-anchor">
          
          {/* STEP EXPLANATION PANEL */}
          <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl shadow-xl space-y-4" id="stage-explainer-panel">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-[10px] font-mono font-bold">
                {currentStep + 1}
              </span>
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold leading-none">ACTIVE STEP IN CYCLE</span>
                <h3 className="text-sm font-bold text-slate-100 mt-0.5 leading-tight">{STEPS[currentStep].title}</h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-900 leading-relaxed text-xs text-slate-300">
                <p>{STEPS[currentStep].description}</p>
              </div>

              <div className="text-xs font-mono text-slate-450 space-y-2">
                <div className="flex items-start gap-1">
                  <span className="text-cyan-400 shrink-0">➜ Pathway:</span>
                  <span className="text-slate-200 break-words">{STEPS[currentStep].pathway}</span>
                </div>
                <div className="flex items-start gap-1 pt-1.5 border-t border-slate-900/60">
                  <span className="text-amber-400 shrink-0">☝ Dynamic Guide:</span>
                  <span className="text-slate-350">{STEPS[currentStep].visualInstruction}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CHAMELEON CLICK ANATOMICAL DETAIL BOX */}
          <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl shadow-xl flex-grow flex flex-col justify-between" id="chameleon-structure-breakout">
            <div>
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-b border-slate-850 pb-2.5 mb-3.5">
                <span>INTERACTIVE STUDY SHEET</span>
                <span className="flex items-center gap-1">
                  <Info className="w-3 h-3 text-cyan-400" /> Click diagram labels
                </span>
              </div>

              <div className="flex items-start justify-between gap-2.5">
                <h3 className="text-base font-extrabold text-cyan-400 uppercase tracking-tight font-sans">
                  {selectedStrData.fullName}
                </h3>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded shrink-0 border ${
                  selectedStrData.bloodType === "Oxygenated" 
                    ? "bg-rose-955/20 border-rose-500/20 text-rose-450" 
                    : selectedStrData.bloodType === "Deoxygenated"
                      ? "bg-blue-955/20 border-blue-500/20 text-blue-450"
                      : "bg-purple-955/20 border-purple-500/20 text-purple-450"
                }`}>
                  {selectedStrData.bloodType} blood
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                {selectedStrData.role}
              </p>

              {/* STATS TABS */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-slate-950 border border-slate-900 p-2.5 rounded-xl">
                  <span className="text-[8px] font-mono uppercase text-slate-500 block leading-none">Wall Pressure</span>
                  <strong className="text-xs text-slate-350 tracking-tight font-mono leading-tight block mt-1">{selectedStrData.pressureLevel}</strong>
                </div>
                <div className="bg-slate-950 border border-slate-900 p-2.5 rounded-xl">
                  <span className="text-[8px] font-mono uppercase text-slate-500 block leading-none">O₂ Saturation</span>
                  <strong className="text-xs text-emerald-450 tracking-tight font-mono leading-tight block mt-1">{selectedStrData.oxygenSaturation}</strong>
                </div>
              </div>

              {/* Clinical note */}
              <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-rose-950/20 text-[11px] text-slate-400 leading-relaxed">
                <span className="text-cyan-400 font-mono font-bold block mb-1">⚕ CLINICAL SIGNIFICANCE:</span>
                {selectedStrData.clinicalExplanationCount}
              </div>
            </div>

            <div className="text-[9px] text-slate-600 font-mono text-center mt-4">
              * Click any element or wait for loops to sync active parameters dynamically.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
