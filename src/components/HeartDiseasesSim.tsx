import React, { useState, useEffect, useRef } from "react";
import { 
  Heart, 
  Activity, 
  ShieldAlert, 
  Info, 
  Settings, 
  Sliders, 
  Zap, 
  TrendingUp, 
  HeartHandshake, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  RotateCcw, 
  Apple, 
  Brain, 
  Plus, 
  Check, 
  UserSquare,
  Award
} from "lucide-react";

// Types
type DiseaseKey = "cad" | "mi" | "arrhythmia" | "heart_failure" | "congenital" | "valve_disease";
type TreatmentKey = "stent" | "bypass" | "pacemaker" | "valve_replace" | "lifestyle" | "meds";

interface DiseaseData {
  name: string;
  codename: string;
  accentColor: string; // Tailwind hex or color classes
  glowColor: string;
  badgeBg: string;
  criticality: "Moderate" | "Severe" | "Critical";
  physiologicalTarget: string;
  description: string;
  heartBehavior: {
    speedMs: number;
    strokeColor: string;
    ventricleThickness: number;
    isErratic: boolean;
    isSeptalDefectLeak: boolean;
    hasValveRegurgitating: boolean;
    coronaryBlockagePct: number;
    ejectionFraction: number; // percentage
  };
  symptoms: string[];
  scientificMechanism: string;
  treatments: TreatmentKey[];
  realWorldImpact: string;
}

const DISEASES: Record<DiseaseKey, DiseaseData> = {
  cad: {
    name: "Coronary Artery Disease (CAD)",
    codename: "PATH_ISCH_CAD",
    accentColor: "text-amber-400",
    glowColor: "shadow-amber-500/30",
    badgeBg: "bg-amber-955/20 border-amber-500/30 text-amber-400",
    criticality: "Moderate",
    physiologicalTarget: "Coronary Arteries (LAD/RCA)",
    description: "Build-up of atherosclerotic plaque inside the lumen of the coronary arteries. This drastically narrows cross-sectional surface area, impeding nutrient-rich blood flow to the downstream myocardium.",
    scientificMechanism: "Endothelial injury leads to LDL cholesterol accumulation, triggering macrophage infiltration and lipid-laden foam cell accumulation, forming calcified fibrous plaques.",
    heartBehavior: {
      speedMs: 800,
      strokeColor: "#f59e0b", // Amber
      ventricleThickness: 4,
      isErratic: false,
      isSeptalDefectLeak: false,
      hasValveRegurgitating: false,
      coronaryBlockagePct: 80,
      ejectionFraction: 50
    },
    symptoms: [
      "Angina pectoris (strangling chest compression under workload)",
      "Shortness of breath due to localized perfusion deficiencies",
      "Ischemic fatigue during climbing or elevated metabolic output"
    ],
    treatments: ["stent", "bypass", "lifestyle", "meds"],
    realWorldImpact: "CAD is the single leading cause of death worldwide, affecting over 126 million individuals globally."
  },
  mi: {
    name: "Myocardial Infarction (Heart Attack)",
    codename: "PATH_ACUTE_MI",
    accentColor: "text-rose-500",
    glowColor: "shadow-rose-500/40",
    badgeBg: "bg-rose-955/20 border-rose-500/30 text-rose-400",
    criticality: "Critical",
    physiologicalTarget: "Left Ventricle Myocardium",
    description: "Acute rupture of a coronary plaque triggering rapid thrombus formation that completely occludes arterial blood supply. This causes sudden irreversible ischemia and muscle death (necrosis) in the distal myocardial segments.",
    scientificMechanism: "Coronary artery oxygen starvation blocks ATP synthesis, causing mitochondrial swell and cardiocyte rupture, releasing cardiac troponins into systemic blood circulation.",
    heartBehavior: {
      speedMs: 1200, // extremely slow struggling beat
      strokeColor: "#ef4444", // Deep Red
      ventricleThickness: 5,
      isErratic: true,
      isSeptalDefectLeak: false,
      hasValveRegurgitating: false,
      coronaryBlockagePct: 100,
      ejectionFraction: 28
    },
    symptoms: [
      "Substernal crushing pain radiating down left arm or to the jaw",
      "Profuse diaphoresis (cold sweats) with near-syncope",
      "Acute dyspnea and crushing sensation of impending doom"
    ],
    treatments: ["stent", "bypass", "meds"],
    realWorldImpact: "Requires immediate door-to-balloon reperfusion therapy within 90 minutes safely in specialized cardiac cath labs."
  },
  arrhythmia: {
    name: "Atrial Fibrillation / Arrhythmia",
    codename: "PATH_ELEC_ARR",
    accentColor: "text-yellow-400",
    glowColor: "shadow-yellow-500/30",
    badgeBg: "bg-yellow-955/20 border-yellow-500/30 text-yellow-400",
    criticality: "Severe",
    physiologicalTarget: "SA/AV Nodes & Pulmonic Vein Ostia",
    description: "Disorganized, highly chaotic electrical micro-reentry circuits firing in the upper atria. This overrides the natural pacemaker (Sinoatrial Node), forcing erratic, fast, and uncoordinated mechanical pumping of ventricular chambers.",
    scientificMechanism: "Pathological electrical ectopic foci override SA node depolarization wave pathways, quivering the atria at 300+ cycles, creating turbulent pooled blood stagnation.",
    heartBehavior: {
      speedMs: 500, // fast uneven
      strokeColor: "#eab308", // Yellow
      ventricleThickness: 3,
      isErratic: true,
      isSeptalDefectLeak: false,
      hasValveRegurgitating: false,
      coronaryBlockagePct: 0,
      ejectionFraction: 45
    },
    symptoms: [
      "Rapid, chaotic tachycardia (jumping chest sensation)",
      "Sudden postural hypotension and visual dimming",
      "Profound exercise intolerance and fatigue"
    ],
    treatments: ["pacemaker", "meds", "lifestyle"],
    realWorldImpact: "Erratic atrial quivering allows blood to pool and form thrombi in the left atrial appendage, multiplying stroke risk by fivefold."
  },
  heart_failure: {
    name: "Congestive Heart Failure (CHF)",
    codename: "PATH_MYO_CHF",
    accentColor: "text-purple-400",
    glowColor: "shadow-purple-500/30",
    badgeBg: "bg-purple-955/20 border-purple-500/30 text-purple-400",
    criticality: "Critical",
    physiologicalTarget: "Myocardial Ventricular Walls",
    description: "The inability of ventricles to pump blood efficiently. In Dilated Heart Failure, heart chambers stretch and thinned muscle walls fail to empty. In Hypertrophic Failure, stiff thickened walls fail to adequately fill during diastole.",
    scientificMechanism: "Chronic blood pressure overload stresses walls, yielding neurohormonal renin-angiotensin (RAAS) overactivation, raising systemic volumes to dangerous congestive limits.",
    heartBehavior: {
      speedMs: 1400, // bloated, slug-like mechanical sweep
      strokeColor: "#c084fc", // Purple
      ventricleThickness: 8, // Stiffened hypertrophic stretch
      isErratic: false,
      isSeptalDefectLeak: false,
      hasValveRegurgitating: true,
      coronaryBlockagePct: 30,
      ejectionFraction: 32
    },
    symptoms: [
      "Orthopnea (inability to breathe while lying flat in bed)",
      "Pitting edema (severe fluid swelling in bilateral legs & ankles)",
      "Chronic productive coughing producing pink, frothy sputum"
    ],
    treatments: ["pacemaker", "meds", "lifestyle"],
    realWorldImpact: "Directly leads to fluid backup within pulmonary capillaries, starving the blood of gas exchange capabilities."
  },
  congenital: {
    name: "Congenital Septal Defect",
    codename: "PATH_STRUCT_CSD",
    accentColor: "text-blue-400",
    glowColor: "shadow-blue-500/30",
    badgeBg: "bg-blue-955/20 border-blue-500/30 text-blue-400",
    criticality: "Severe",
    physiologicalTarget: "Interventricular/Interatrial Septum",
    description: "An anatomical opening, or 'hole', present from birth in the dividing wall (septum) separating left and right cardiac chambers. This allows high-pressure oxygenated blood to leak backward into low-pressure deoxygenated chambers.",
    scientificMechanism: "Failure of embryonic tissue fusion during cardiogenesis creates a left-to-right blood shunt, raising localized right ventricular volume loads.",
    heartBehavior: {
      speedMs: 700,
      strokeColor: "#3b82f6", // Blue
      ventricleThickness: 3,
      isErratic: false,
      isSeptalDefectLeak: true,
      hasValveRegurgitating: false,
      coronaryBlockagePct: 0,
      ejectionFraction: 52
    },
    symptoms: [
      "Frequent respiratory infections and pulmonary hypertension",
      "Persistent cyanosis (bluish tint on skin, lips, or fingernails)",
      "Failure to thrive in pediatric developmental stages"
    ],
    treatments: ["bypass", "lifestyle"],
    realWorldImpact: "Often detected early in childhood via the presence of a loud, turbulent holosystolic regurgitant heart murmur on auscultation."
  },
  valve_disease: {
    name: "Valvular Disease (Mitral Regurgitation)",
    codename: "PATH_VALVE_VVD",
    accentColor: "text-cyan-400",
    glowColor: "shadow-cyan-500/30",
    badgeBg: "bg-cyan-955/20 border-cyan-500/30 text-cyan-400",
    criticality: "Severe",
    physiologicalTarget: "Mitral / Aortic Heart Valve Leaflets",
    description: "Calcification, physical tear, or stretching of the fibrous heart valve leaflets. Instead of snaps shutting securely, valves allow blood to flood backward (regurgitate) under high pressure ventrical contractions.",
    scientificMechanism: "Mitral annulus stretching or chordae tendineae rupture leads to systolic backward leakage of blood from the left ventricle back into the left atrium.",
    heartBehavior: {
      speedMs: 900,
      strokeColor: "#22d3ee", // Cyan
      ventricleThickness: 4,
      isErratic: false,
      isSeptalDefectLeak: false,
      hasValveRegurgitating: true,
      coronaryBlockagePct: 0,
      ejectionFraction: 42
    },
    symptoms: [
      "Loud blowing systolic heart murmur radiating to left axilla",
      "Paroxysmal Nocturnal Dyspnea (waking in terror gasping for oxygen)",
      "Atrial dilatation triggering secondary arrhythmic micro-reentry episodes"
    ],
    treatments: ["valve_replace", "meds", "lifestyle"],
    realWorldImpact: "Mitral regurgitation forces the left ventricle to double its work load to maintain forward blood volume, eventually precipitating failure."
  }
};

const MEDICAL_TREATMENTS: Record<TreatmentKey, {
  name: string;
  icon: any;
  difficulty: "Interventional" | "Surgical" | "Pharmacological" | "Lifestyle";
  mechanics: string;
  visualImpact: string;
  healingTarget: string;
}> = {
  stent: {
    name: "Angioplasty & Stent Placement",
    icon: Zap,
    difficulty: "Interventional",
    mechanics: "A flexible wire is threaded from the femoral or radial artery. A tiny balloon is inflated to compress cholesterol plaque against the artery wall, followed by expansion of a wire-mesh metal stent which locks the lumen patent and wide open.",
    visualImpact: "Reduces Coronary Blockage from 80-100% down to less than 10%, immediately elevating downward perfusion and restoring tissue survival.",
    healingTarget: "Coronary Arteries (LAD/RCA)"
  },
  bypass: {
    name: "Coronary Bypass Grafting (CABG)",
    icon: Plus,
    difficulty: "Surgical",
    mechanics: "Harvests a healthy chest wall artery (LIMA) or leg vein (Saphenous) and grafts it directly from the ascending aorta to the coronary artery behind the blocked occlusion. This creates a physical bridge routing oxygen around the bottleneck.",
    visualImpact: "Creates a glowing bypass bridge routing fresh blood. Immediately boosts Left Ventricle ejection fraction output and eliminates cellular occlusion.",
    healingTarget: "Myocardial Ventricular Tissue"
  },
  pacemaker: {
    name: "Permanent Pacemaker Implantation",
    icon: Sliders,
    difficulty: "Surgical",
    mechanics: "Implants a small battery-powered metal pulse generator beneath the clavicle bone. Runs physical wires directly down through the subclavian vein to secure leads inside the right atrium and ventricular walls, pacing at stable rhythms.",
    visualImpact: "Overrides arrhythmic ectopic fire patterns. Normalizes chaotic pumping speed to an active, perfectly synchronized physiological 70 BPM.",
    healingTarget: "SA/AV Pacemaker Nodes"
  },
  valve_replace: {
    name: "Surgical Valve Reconstruction",
    icon: HeartHandshake,
    difficulty: "Surgical",
    mechanics: "Uses a cardiopulmonary heart-lung bypass machine. Resects calcified native mitral/aortic leaflets and sutures a gleaming mechanical carbon-alloy replacement valve or biological tissue valve (pig/cow pericardium).",
    visualImpact: "Stops backward blood regurgitation leaks entirely. Stabilizes arterial pressures and reduces systemic chamber back-pressures.",
    healingTarget: "Mitral/Aortic Leaflet Membranes"
  },
  lifestyle: {
    name: "Therapeutic Lifestyle Changes",
    icon: Apple,
    difficulty: "Lifestyle",
    mechanics: "Prescribes high-density cardiovascular exercise daily alongside diets poor in simple fats and rich in plant stereols. Reverses underlying systemic arterial stiffness and improves nitric-oxide vascular dilation.",
    visualImpact: "Gradually reduces arterial plaque growth rate over several years. Stabilizes ventricular elasticity and lowers systemic vascular resistance.",
    healingTarget: "Vascular Endothelial System"
  },
  meds: {
    name: "Inotropic & RAAS Pharmacotherapy",
    icon: Settings,
    difficulty: "Pharmacological",
    mechanics: "Uses therapeutic drug classes like ACE-inhibitors to block Angiotensin-II vasoconstriction, Beta-blockers to shield myocardial cells from adrenaline toxic stress, and loop diuretics to pump excess salt/water volumes from blood vessels.",
    visualImpact: "Lowers systemic blood pressure resistance. Eases ventricle pump burden, preventing dangerous hypertrophy remodeling.",
    healingTarget: "Systemic Blood Volume Cells"
  }
};

const CLINICAL_CASES = [
  {
    id: "CASE-402",
    title: "The Collapsed Architect",
    summary: "A 58-year-old male structural engineer collapse at an active job site. He was experiencing intense, crushing chest pressure that radiated down his neck, accompanied by cold sweat and nausea.",
    ecgSnapshot: "ST-Segment Elevation (Hyperacute T waves in leads V1-V4)",
    physicalFindings: "Blood Pressure 95/60, Pulse 110, Respiratory rate 24/min. Heart sounds show standard rhythm but S4 gallop.",
    choices: [
      { key: "cad", label: "Stable CAD due to Plaque", response: "Incorrect. The acute, relentless onset of pain at rest with ECG changes suggests complete thrombus rupture rather than chronic stable plaque." },
      { key: "mi", label: "Acute Anterior Wall MI", response: "Correct! Plaque rupture with complete arterial thrombus blockage is a life-threatening Myocardial Infarction. Immediate cardiac stent angioplasty is critical.", isCorrect: true },
      { key: "heart_failure", label: "Congestive Heart Failure", response: "Incorrect. While unchecked infarctions can trigger chronic CHF later, this acute event represents an active Myocardial Infarction." }
    ],
    rationalText: "Rupture of an unstable coronary plaque followed by rapid occlusion is the hallmark of a Heart Attack (STEMI). It requires primary percutaneous coronary intervention (PCI) immediately."
  },
  {
    id: "CASE-409",
    title: "The Dyspneic Runner",
    summary: "A 69-year-old active woman notices she gets short of breath rapidly during her morning run. When lying flat in bed at night, she feels like she is drowning (orthopnea), and has to prop herself up on three pillows.",
    ecgSnapshot: "Left Ventricular Hypertrophy spikes, normal rhythm",
    physicalFindings: "Bilateral 2+ pitting ankle edema. Chest auscultation reveals moist inspiratory crackles (fluid rales) in both lower lung bases.",
    choices: [
      { key: "arrhythmia", label: "Atrial Fibrillation (AFib)", response: "Incorrect. Arrhythmia presents with erratic pulse intervals, not pulmonary rales or massive dependent edema while breathing stably." },
      { key: "congenital", label: "Adult Septal Defect", response: "Incorrect. Septal defects usually display visual left-to-right shunts rather than chronic bilateral congestive limb edema." },
      { key: "heart_failure", label: "Congestive Heart Failure (CHF)", response: "Correct! Pulmonary crackles and leg edema from fluid backup points directly to Congestive Heart Failure with high capillary back-pressures.", isCorrect: true }
    ],
    rationalText: "Fluid congestion in the lungs (causing orthopnea) and lower extremities (ankles) is the defining clinical presentation of heart failure, triggered by low forward ejection fractions."
  },
  {
    id: "CASE-415",
    title: "The Quivering Executive",
    summary: "A 44-year-old CFO reports sudden episodic attacks of 'fluttering butterflies' in his chest during board meetings. He feels lightheaded and weak. His wrist-wearable flags an 'Inconclusive High Pulse' warning.",
    ecgSnapshot: "Irregularly irregular rhythm. Absence of P-waves, replaced by fine f-waves.",
    physicalFindings: "Heart rate fluctuates wildly from 85 to 140 BPM within seconds. Blood pressure is erratic but otherwise stable.",
    choices: [
      { key: "arrhythmia", label: "Atrial Fibrillation (AFib)", response: "Correct! Erratic pacemaking with missing P waves and quivering electrical vectors is the hallmark of AFib.", isCorrect: true },
      { key: "valve_disease", label: "Mitral Valve Stenosis", response: "Incorrect. Mitral Stenosis produces an opening snap and diastolic murmur, unlike sudden fluttering tachycardia." },
      { key: "cad", label: "Incipient Coronary Plaque", response: "Incorrect. Though blockages cause load strain, sudden erratic pulsatile flutter is due to arrhythmia electrical foci." }
    ],
    rationalText: "Chaos in atrial depolarization pathways prevents the coordinated contraction of upper chambers, sending highly erratic signals down the AV node to cause Atrial Fibrillation."
  }
];

export default function HeartDiseasesSim() {
  const [selectedDisease, setSelectedDisease] = useState<DiseaseKey>("cad");
  const [activeTreatments, setActiveTreatments] = useState<Record<TreatmentKey, boolean>>({
    stent: false,
    bypass: false,
    pacemaker: false,
    valve_replace: false,
    lifestyle: false,
    meds: false
  });

  // Simulator telemetry overrides
  const [exerciseFactor, setExerciseFactor] = useState<number>(1); // slider multiplier
  const [isCrossSectionView, setIsCrossSectionView] = useState<boolean>(false);
  const [stentCatheterGuided, setStentCatheterGuided] = useState<boolean>(false);

  // Doctor Quiz States
  const [activeCaseIdx, setActiveCaseIdx] = useState<number>(0);
  const [chosenAnswerKey, setChosenAnswerKey] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [showCaseRationale, setShowCaseRationale] = useState<boolean>(false);

  // Heart animation timing
  const [heartAnimationFrame, setHeartAnimationFrame] = useState<number>(0);

  // Sync heart beating loops smoothly across states
  useEffect(() => {
    let heartTimer: NodeJS.Timeout;
    
    // Adjusted beating speed based on current disease and exercises/meds active
    const getBeatSpeed = () => {
      let baseSpeed = DISEASES[selectedDisease].heartBehavior.speedMs;
      
      // If pacemaker is active and disease is Arrhythmia, pace is perfectly normalized (700ms)
      if (activeTreatments.pacemaker && selectedDisease === "arrhythmia") {
        return 750;
      }
      
      // Bypass graft / Stent restores Infarction cellular rhythm matching normal cardiac sweep speed
      if ((activeTreatments.stent || activeTreatments.bypass) && selectedDisease === "mi") {
        return 800; // normalized
      }

      // Exercise speeds up heart
      if (exerciseFactor > 1.2) {
        baseSpeed = baseSpeed / (exerciseFactor * 0.9);
      }

      return baseSpeed;
    };

    const runBeat = () => {
      setHeartAnimationFrame((prev) => (prev + 1) % 100);
      heartTimer = setTimeout(runBeat, getBeatSpeed());
    };

    runBeat();
    return () => clearTimeout(heartTimer);
  }, [selectedDisease, activeTreatments, exerciseFactor]);

  // Toggle surgical / pharmacology treatment overlays
  const toggleTreatment = (key: TreatmentKey) => {
    const isMatched = DISEASES[selectedDisease].treatments.includes(key);
    
    setActiveTreatments((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      // Automated effects
      if (key === "stent" && updated.stent) {
        setStentCatheterGuided(true);
      }
      return updated;
    });
  };

  const resetAllTreatments = () => {
    setActiveTreatments({
      stent: false,
      bypass: false,
      pacemaker: false,
      valve_replace: false,
      lifestyle: false,
      meds: false
    });
    setStentCatheterGuided(false);
  };

  // Reset treatment toggles when changing active disease selector to prevent invalid state leakage
  useEffect(() => {
    resetAllTreatments();
  }, [selectedDisease]);

  const activeDiseaseData = DISEASES[selectedDisease];

  // Calculated dynamic clinical symptoms indicator score HUD
  const getDynamicBlockagePct = () => {
    let base = activeDiseaseData.heartBehavior.coronaryBlockagePct;
    if (activeTreatments.stent) base = Math.max(0, base - 75);
    if (activeTreatments.bypass) base = Math.max(0, base - 65);
    if (activeTreatments.lifestyle) base = Math.max(0, base - 15);
    return base;
  };

  const getDynamicEjectionFraction = () => {
    let base = activeDiseaseData.heartBehavior.ejectionFraction;
    if (selectedDisease === "arrhythmia" && activeTreatments.pacemaker) {
      base = 56; // normalized sinus output
    }
    if (selectedDisease === "mi") {
      if (activeTreatments.stent) base += 15;
      if (activeTreatments.bypass) base += 20;
      if (activeTreatments.meds) base += 8;
    }
    if (selectedDisease === "heart_failure") {
      if (activeTreatments.meds) base += 10;
      if (activeTreatments.lifestyle) base += 6;
    }
    if (selectedDisease === "valve_disease" && activeTreatments.valve_replace) {
      base = 55; // restored
    }
    return Math.min(65, base);
  };

  const getDynamicOxygenation = () => {
    let blockage = getDynamicBlockagePct();
    let ef = getDynamicEjectionFraction();
    let baseSpO2 = 91;

    if (selectedDisease === "cad" || selectedDisease === "mi") {
      baseSpO2 = 98 - (blockage * 0.12);
    } else if (selectedDisease === "heart_failure") {
      baseSpO2 = 82 + (ef * 0.3);
    } else if (selectedDisease === "congenital") {
      // Shuting reduces systemic oxygenation
      baseSpO2 = activeTreatments.bypass ? 98 : 88;
    } else if (selectedDisease === "valve_disease") {
      baseSpO2 = activeTreatments.valve_replace ? 99 : 92;
    } else {
      baseSpO2 = 99;
    }

    // Lifestyle / Medications improve blood flows
    if (activeTreatments.lifestyle) baseSpO2 = Math.min(100, baseSpO2 + 1);
    if (activeTreatments.meds) baseSpO2 = Math.min(100, baseSpO2 + 1);

    return Math.round(baseSpO2);
  };

  // Diagnostic Choice Answer Click
  const handleCaseAnswerChoice = (key: string) => {
    setChosenAnswerKey(key);
    setShowCaseRationale(true);
    
    const correctCaseKey = CLINICAL_CASES[activeCaseIdx].choices.find(c => c.isCorrect)?.key;
    if (key === correctCaseKey) {
      setQuizScore(prev => prev + 1);
    }
  };

  const nextCaseFile = () => {
    setChosenAnswerKey(null);
    setShowCaseRationale(false);
    setActiveCaseIdx((prev) => (prev + 1) % CLINICAL_CASES.length);
  };

  // Helper values for continuous pulsing size calculations
  const beatScale = 1 + Math.sin(heartAnimationFrame * 0.25) * 0.05;

  return (
    <div className="p-4 md:p-6 flex-grow flex flex-col gap-6 animate-fade-in bg-slate-950 text-slate-100" id="heart-diseases-feature-root">
      
      {/* 1. FUTURISTIC ACADEMIC HEADER & RECON-STRIP */}
      <div className="p-4 rounded-2xl border bg-slate-900/40 border-slate-800/80 shadow-inner flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" id="intro-header-block">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
            <Heart className="w-6 h-6 shrink-0 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/45 px-2 py-0.5 rounded border border-cyan-800/15">
                SYLLABUS MODULE 03 OF 06
              </span>
              <span className="text-xs text-slate-500">// CLINICAL ANATOMICAL LAB</span>
            </div>
            <h2 className="text-lg font-bold font-display mt-0.5">Types of Heart Diseases & Interventions</h2>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-550 space-y-1 text-right">
          <div>VISUALIZER: <span className="text-cyan-400 font-bold">HOLOGRAPHIC 2.5D SHADER</span></div>
          <div>MED_PROCEDURES: <span className="text-slate-350">ACTIVE OVERLAYS READY</span></div>
        </div>
      </div>

      {/* 2. LIVE CLINICAL SIMULATOR SHELL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COMP: ACTIVE DISEASE CONTROLS & DESCRIPTION PANELS */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          
          {/* DISEASE SELECTION SWITCHLIST */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono text-slate-500 tracking-wider">SELECT DISEASE MODEL:</span>
            <div className="flex flex-col gap-2" id="disease-tab-container">
              {(Object.keys(DISEASES) as Array<DiseaseKey>).map((key) => {
                const disease = DISEASES[key];
                const isSelected = selectedDisease === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDisease(key)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all duration-300 relative overflow-hidden flex items-center justify-between cursor-pointer group ${
                      isSelected
                        ? "bg-cyan-950/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-950"
                        : "bg-slate-900/40 border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                    id={`disease-tab-${key}`}
                  >
                    <div className="flex gap-3 items-center">
                      {/* Glow indicator bulb */}
                      <span className={`w-2.5 h-2.5 rounded-full ${disease.accentColor} ${
                        isSelected ? "animate-pulse" : "opacity-40"
                      } shrink-0`}>●</span>
                      
                      <div>
                        <div className="font-mono text-[9px] text-slate-500 group-hover:text-cyan-400">
                          {disease.codename}
                        </div>
                        <div className="font-bold tracking-tight mt-0.5">{disease.name}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                        disease.criticality === "Critical" 
                          ? "bg-rose-950/40 text-rose-450 border border-rose-900/30" 
                          : disease.criticality === "Severe"
                            ? "bg-amber-950/40 text-amber-400 border border-amber-900/30"
                            : "bg-blue-950/40 text-blue-450 border border-blue-900/30"
                      }`}>
                        {disease.criticality}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE DISEASE SCIENTIFIC FACTSHEET */}
          <div className="p-5 rounded-2xl border bg-slate-900/50 border-slate-900 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-3 pb-2 border-b border-slate-800/50">
                <span>PHYSIOLOGY BRIEF</span>
                <span>TARGET: {activeDiseaseData.physiologicalTarget}</span>
              </div>
              
              <h3 className={`text-base font-bold font-display uppercase tracking-tight ${activeDiseaseData.accentColor}`}>
                {activeDiseaseData.name}
              </h3>
              
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {activeDiseaseData.description}
              </p>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 text-[11px] text-slate-400 font-mono mt-4 leading-relaxed">
                <span className="text-cyan-400 font-bold block mb-1">✓ PATHOLOGICAL MECHANISM:</span>
                {activeDiseaseData.scientificMechanism}
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-500 mt-4 pt-3 border-t border-slate-900 leading-relaxed italic">
              🌍 {activeDiseaseData.realWorldImpact}
            </div>
          </div>

        </div>

        {/* CENTER COMP: HOLOGRAPHIC 2.5D SIMULATOR VIEW (SPAN 5) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* VISUAL MONITOR VIEWBOX */}
          <div className="relative border rounded-2xl p-4 bg-slate-900/70 border-slate-850 shadow-xl overflow-hidden flex-grow min-h-[300px] flex flex-col" id="heart-hologram-stage">
            
            {/* STAGE HEADER STRIP */}
            <div className="flex justify-between items-center text-xs font-mono text-slate-400 border-b border-slate-800/40 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                <span>HEART_HOLO_VIEW_2.5D</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCrossSectionView(false)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                    !isCrossSectionView 
                      ? "bg-cyan-950 border border-cyan-500 text-cyan-400" 
                      : "bg-slate-950 text-slate-550 border border-transparent hover:text-slate-400"
                  }`}
                >
                  EXTERIOR
                </button>
                <button
                  onClick={() => setIsCrossSectionView(true)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                    isCrossSectionView 
                      ? "bg-cyan-950 border border-cyan-500 text-cyan-400" 
                      : "bg-slate-950 text-slate-550 border border-transparent hover:text-slate-400"
                  }`}
                >
                  CROSS SECTION
                </button>
              </div>
            </div>

            {/* THE CENTRAL SHADED Heart ANIMATION SCHEMATIC (SVG) */}
            <div className="flex-grow flex items-center justify-center py-6 relative" id="holographic-heart-viewport">
              
              {/* Backglow rays */}
              <div className={`absolute w-44 h-44 rounded-full blur-[65px] transition-all duration-[1s] opacity-20 pointer-events-none ${
                selectedDisease === "cad" ? "bg-amber-500" :
                selectedDisease === "mi" ? "bg-red-500" :
                selectedDisease === "arrhythmia" ? "bg-yellow-400" :
                selectedDisease === "heart_failure" ? "bg-purple-500" :
                selectedDisease === "congenital" ? "bg-blue-500" : "bg-cyan-400"
              }`} />

              <svg 
                viewBox="0 0 300 300" 
                className="w-full max-w-[270px] h-full object-contain drop-shadow-[0_0_12px_rgba(34,211,238,0.15)] overflow-visible"
                style={{ transform: `scale(${beatScale})`, transition: "transform 0.08s ease-out-in" }}
              >
                {/* SVG Definitions for clinical gradients */}
                <defs>
                  <radialGradient id="holoGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0891b2" stopOpacity="0.0" />
                  </radialGradient>
                  <linearGradient id="coronaryArtery" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#9f1239" />
                  </linearGradient>
                  <linearGradient id="calcifiedPlaque" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* BACKGROUND SCIENTIFIC TARGET CIRCS */}
                <circle cx="150" cy="150" r="135" fill="none" stroke="rgba(34, 211, 238, 0.05)" strokeWidth="1" strokeDasharray="3,15" />
                <circle cx="150" cy="150" r="105" fill="none" stroke="rgba(34, 211, 238, 0.03)" strokeWidth="1" />
                <circle cx="150" cy="150" r="4" fill="rgba(34, 211, 238, 0.2)" />

                {/* MAIN HEART SHAPE SCHEMATIC */}
                {/* Visual change depending on exterior vs interior cross section */}
                {!isCrossSectionView ? (
                  // EXTERIOR HEART VIEW (Detailed Muscle with Coronary Artery tree)
                  <g id="exterior-heart-group">
                    {/* Shadow Backing */}
                    <path 
                      d="M 150 70 C 100 0, 40 40, 70 120 C 90 170, 150 240, 150 240 C 150 240, 210 170, 230 120 C 260 40, 200 0, 150 70 Z" 
                      fill="#020617" 
                      stroke="rgba(34, 211, 238, 0.15)" 
                      strokeWidth="2.5" 
                    />

                    {/* Left Muscle Atrium Shade */}
                    <path 
                      d="M 150 70 C 120 20, 60 50, 80 120 C 90 145, 115 175, 150 215" 
                      fill="none" 
                      stroke="rgba(239, 68, 68, 0.15)" 
                      strokeWidth="14" 
                      strokeLinecap="round"
                    />

                    {/* Main superior vena cava schematic tube */}
                    <path d="M 100 30 L 100 80" fill="none" stroke="#2563eb" strokeWidth="14" strokeLinecap="round" opacity="0.65" />
                    <path d="M 100 24 Q 110 30 115 45" fill="none" stroke="#3b82f6" strokeWidth="4" opacity="0.7" />

                    {/* Aorta arch tube */}
                    <path d="M 140 25 C 140 10, 175 10, 175 60" fill="none" stroke="#dc2626" strokeWidth="18" strokeLinecap="round" opacity="0.75" />
                    {/* Brachiocephalic branch stubs */}
                    <path d="M 150 15 L 150 5" fill="none" stroke="#b91c1c" strokeWidth="5" />
                    <path d="M 162 12 L 162 2" fill="none" stroke="#b91c1c" strokeWidth="5" />

                    {/* Pulmonary Artery Branching */}
                    <path d="M 160 52 Q 130 55 120 75" fill="none" stroke="#1d4ed8" strokeWidth="11" opacity="0.8" />
                    <path d="M 160 52 Q 180 55 190 75" fill="none" stroke="#1d4ed8" strokeWidth="11" opacity="0.8" />

                    {/* Glowing tissue warning area - MI ischemia cellular death */}
                    {selectedDisease === "mi" && !activeTreatments.stent && !activeTreatments.bypass && (
                      <path 
                        d="M 125 155 Q 150 195 160 225 Q 120 190 125 155" 
                        fill="rgba(239, 68, 68, 0.45)" 
                        className="animate-pulse"
                        stroke="#ef4444" 
                        strokeWidth="1.5" 
                        strokeDasharray="2,5"
                      />
                    )}

                    {/* Glowing Tissue warning hypertrophy - Heart Failure thickened */}
                    {selectedDisease === "heart_failure" && (
                      <path 
                        d="M 150 240 C 150 240, 200 180, 215 135 C 220 120, 225 110, 225 100" 
                        fill="none" 
                        stroke="#a855f7" 
                        strokeWidth={activeTreatments.meds ? "6" : "15"} 
                        opacity="0.38" 
                        strokeLinecap="round"
                        className="animate-pulse"
                      />
                    )}

                    {/* CORONARY ARTERY SCHEMATIC (Main LAD Artery Tree branching down) */}
                    <path 
                      d="M 146 80 Q 135 110 142 145 Q 138 185 150 225" 
                      fill="none" 
                      stroke="url(#coronaryArtery)" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                    />
                    {/* Secondary lateral diagonals (LAD collateral) */}
                    <path d="M 139 122 Q 115 140 100 160" fill="none" stroke="url(#coronaryArtery)" strokeWidth="2.2" />
                    <path d="M 141 160 Q 165 180 178 205" fill="none" stroke="url(#coronaryArtery)" strokeWidth="1.8" />

                    {/* CORONARY PLAQ BLOCKAGE MARKER - CAD & MI */}
                    {(selectedDisease === "cad" || selectedDisease === "mi") && (
                      <g>
                        {/* Circle locator target wrapper */}
                        <circle cx="138" cy="120" r="12" fill="none" stroke="#ef4444" strokeWidth="1.2" className="animate-pulse" />
                        <line x1="138" y1="108" x2="138" y2="132" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="0.8" />
                        
                        {/* The yellow physical plaque blockage bump inside artery path */}
                        {!activeTreatments.stent && (
                          <circle cx="138" cy="120" r="3.2" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
                        )}

                        {/* ANGIOPLASTY STENT OVERLAY ACTIVE */}
                        {activeTreatments.stent && (
                          <g>
                            {/* Gleaming mesh stent symbol */}
                            <path d="M 135 114 L 141 126" stroke="#22d3ee" strokeWidth="2.5" className="animate-pulse" />
                            <circle cx="138" cy="120" r="2.5" fill="none" stroke="#22d3ee" strokeWidth="0.8" />
                            {/* Stent label anchor */}
                            <line x1="138" y1="120" x2="210" y2="120" stroke="#22d3ee" strokeDasharray="2,2" strokeWidth="1" />
                            <text x="214" y="123" fill="#22d3ee" fontSize="7.5" fontFamily="monospace" fontWeight="bold">STENT_EXPANDED</text>
                          </g>
                        )}
                      </g>
                    )}

                    {/* CORONARY BYPASS BRIDGE GRAFT (CABG) */}
                    {activeTreatments.bypass && (selectedDisease === "cad" || selectedDisease === "mi") && (
                      <g>
                        {/* Dynamic surgical neon blue grafted artery vessel bypassing plaque */}
                        <path 
                          d="M 148 24 Q 185 80 141 155" 
                          fill="none" 
                          stroke="#38bdf8" 
                          strokeWidth="3.0" 
                          strokeDasharray="2,1" 
                          strokeLinecap="round"
                        />
                        <circle cx="148" cy="24" r="3.2" fill="#0284c7" />
                        <circle cx="141" cy="155" r="3.2" fill="#0284c7" />
                        {/* Graft tag text */}
                        <text x="180" y="90" fill="#38bdf8" fontSize="7.5" fontFamily="monospace" fontWeight="bold">VEIN_GRAFT_BRIDGE</text>
                      </g>
                    )}

                  </g>
                ) : (
                  // CROSS-SECTION SCHEMATIC VIEW (Intra-chamber flows, valve leaflets & septum)
                  <g id="interior-cross-section-group">
                    {/* Outline of both ventricles in hollow scale */}
                    <path 
                      d="M 152 70 C 102 0, 42 40, 72 120 C 92 170, 152 240, 152 240 C 152 240, 212 170, 232 120 C 262 40, 202 0, 152 70 Z" 
                      fill="none" 
                      stroke="rgba(34, 211, 238, 0.1)" 
                      strokeWidth="2" 
                    />

                    {/* Right Ventricle Cavity (Blue Deox Blood) Fill Area */}
                    <path 
                      d="M 145 95 C 115 105, 95 140, 105 180 C 115 195, 140 215, 142 220 L 140 100" 
                      fill="rgba(37, 99, 235, 0.2)" 
                      stroke="rgba(37, 99, 235, 0.4)" 
                      strokeWidth="1.2" 
                    />

                    {/* Left Ventricle Cavity (Red Oxygenated Blood) Fill Area */}
                    <path 
                      d="M 158 95 C 185 105, 205 140, 195 180 C 185 195, 160 215, 158 220 L 160 100" 
                      fill="rgba(220, 38, 38, 0.2)" 
                      stroke="rgba(220, 38, 38, 0.4)" 
                      strokeWidth="1.2" 
                    />

                    {/* Interventricular Septal wall divider */}
                    {selectedDisease === "congenital" && !activeTreatments.bypass ? (
                      // SEPTAL HOLE (L-TO-R SHUNT DEFECT)
                      <g>
                        {/* Upper Wall segment */}
                        <line x1="150" y1="95" x2="150" y2="135" stroke="#3b82f6" strokeWidth="10" strokeLinecap="round" />
                        {/* Bottom Wall segment */}
                        <line x1="151" y1="168" x2="152" y2="230" stroke="#3b82f6" strokeWidth="10" strokeLinecap="round" />
                        
                        {/* Hole Highlight circle */}
                        <circle cx="150" cy="151" r="11" fill="none" stroke="#ef4444" strokeWidth="1.2" className="animate-pulse" />
                        {/* Red leaking mixing blood flow arrow */}
                        <path d="M 158 150 L 142 152" fill="none" stroke="#ef4444" strokeWidth="2.5" markerStart="url(#arrow)" />
                        <path d="M 158 150 L 142 152" fill="none" stroke="#f43f5e" strokeWidth="4.5" opacity="0.3" strokeLinecap="round" />
                        <text x="110" y="142" fill="#ef4444" fontSize="7" fontFamily="monospace" fontWeight="bold">SEPTAL_SHUNT_LEAK</text>
                      </g>
                    ) : (
                      // INTACT SEPTAL WALL
                      <line x1="150" y1="95" x2="151" y2="230" stroke="rgba(34, 211, 238, 0.4)" strokeWidth={selectedDisease === "heart_failure" ? "14" : "9"} strokeLinecap="round" />
                    )}

                    {/* THE MITRAL VALVE SYSTEM LEAFLETS */}
                    {selectedDisease === "valve_disease" ? (
                      <g>
                        {/* Leaky Mitral Leaflets back regurgitation arrow */}
                        {activeTreatments.valve_replace ? (
                          // GLEAMING REPLACEMENT VALVE SYMBOL
                          <g>
                            <circle cx="178" cy="100" r="8.5" fill="#0f172a" stroke="#22d3ee" strokeWidth="2.2" className="animate-pulse" />
                            <line x1="170" y1="100" x2="186" y2="100" stroke="#22d3ee" strokeWidth="2.5" />
                            <text x="190" y="98" fill="#22d3ee" fontSize="7" fontFamily="monospace" fontWeight="bold">SYNTHETIC_VALVE</text>
                          </g>
                        ) : (
                          // FLAPPING LEAKY MITRAL PATHOLOGY
                          <g>
                            {/* Outward stretched loose leaflets */}
                            <line x1="165" y1="98" x2="175" y2="108" stroke="#ef4444" strokeWidth="2.2" />
                            <line x1="190" y1="100" x2="182" y2="114" stroke="#ef4444" strokeWidth="2.2" />
                            {/* Blue swirl indicating regurgitation turbulence */}
                            <path d="M 178 115 Q 186 100 174 85" fill="none" stroke="#c084fc" strokeWidth="1.8" strokeDasharray="1.5,1.5" className="animate-pulse" />
                            <text x="180" y="85" fill="#ef4444" fontSize="7.5" fontFamily="monospace" fontWeight="bold">REGURG_FLOW_BACK</text>
                          </g>
                        )}
                      </g>
                    ) : (
                      // NORMAL HEART VALVES
                      <g>
                        <line x1="166" y1="98" x2="174" y2="106" stroke="rgba(34, 211, 238, 0.6)" strokeWidth="1.8" />
                        <line x1="188" y1="100" x2="181" y2="106" stroke="rgba(34, 211, 238, 0.6)" strokeWidth="1.8" />
                      </g>
                    )}

                    {/* PACEMAKER ELECTRONIC PACING IMPLANT WIRE */}
                    {activeTreatments.pacemaker && (
                      <g>
                        {/* Pacemaker casing box inside top lateral shoulder */}
                        <rect x="238" y="45" width="22" height="15" rx="3.5" fill="#1e293b" stroke="#facc15" strokeWidth="1.5" />
                        <text x="242" y="55" fill="#facc15" fontSize="5.5" fontFamily="monospace" fontWeight="bold">PM_GEN</text>
                        
                        {/* Core helical wires wrapping down to right ventricle */}
                        <path 
                          d="M 238 52 Q 135 68 128 178" 
                          fill="none" 
                          stroke="#facc15" 
                          strokeWidth="1.5" 
                          strokeDasharray="2.5,2.5" 
                          className="animate-pulse"
                        />
                        <circle cx="128" cy="178" r="3" fill="#facc15" />
                        <text x="65" y="215" fill="#facc15" fontSize="7" fontFamily="monospace" fontWeight="bold">LEAD_STABILIZER_AV</text>
                      </g>
                    )}

                  </g>
                )}

                {/* THE SA PACEMAKER NODAL RAYS - Arrhythmia visual representation */}
                {selectedDisease === "arrhythmia" && !activeTreatments.pacemaker && (
                  <g id="atrial-ectopic-foci">
                    {/* Chaotic spark bursts across Atrial area */}
                    <path d="M 85 85 L 94 92 M 100 74 L 111 80" stroke="#fbbf24" strokeWidth="1.5" className="animate-ping" />
                    <circle cx="95" cy="80" r="5" fill="rgba(250, 204, 21, 0.4)" className="animate-pulse" />
                    <circle cx="118" cy="74" r="5" fill="rgba(250, 204, 21, 0.4)" className="animate-pulse" />
                    
                    <text x="62" y="65" fill="#fbbf24" fontSize="7.5" fontFamily="monospace" fontWeight="bold">ECTOPIC_REENTRY_CHAOS</text>
                  </g>
                )}

                {/* SCIENTIFIC HUD DIMENSION LINES & LABELS */}
                <g opacity="0.45">
                  {/* Left Ventricle tag */}
                  <line x1="210" y1="180" x2="260" y2="180" stroke="rgba(34, 211, 238, 0.5)" strokeWidth="0.8" />
                  <circle cx="210" cy="180" r="1.5" fill="#22d3ee" />
                  <text x="238" y="174" fill="#22d3ee" fontSize="7.2" fontFamily="monospace">LV_MYO_CHG</text>

                  {/* Aorto-pulmonic tag */}
                  <line x1="85" y1="45" x2="45" y2="45" stroke="rgba(34, 211, 238, 0.5)" strokeWidth="0.8" />
                  <circle cx="85" cy="45" r="1.5" fill="#22d3ee" />
                  <text x="45" y="38" fill="#22d3ee" fontSize="7.2" fontFamily="monospace">AORTIC_ARCH_T3</text>
                </g>

              </svg>

            </div>

            {/* TREATMENT EFFECTS CORNER STATUS METRICS */}
            <div className="absolute bottom-3 right-3 pointer-events-none flex flex-col items-end gap-1 px-2.5 py-1.5 rounded-lg bg-slate-950/85 border border-slate-850 text-[10px] font-mono text-cyan-400">
              <span className="font-bold">STATUS PANEL:</span>
              <span className="text-slate-350">BLOCKAGES: <span className="text-amber-400 font-bold">{getDynamicBlockagePct()}%</span></span>
              <span className="text-slate-350">EJECTION_EF: <span className="text-emerald-400 font-bold">{getDynamicEjectionFraction()}%</span></span>
              <span className="text-slate-350">SpO2_OXYGEN: <span className="text-blue-400 font-bold">{getDynamicOxygenation()}%</span></span>
            </div>

            {/* INTERACTIVE COMPONENT LABELS / DIAGRAM EXPLAINER */}
            <div className="text-[10px] p-2 bg-slate-950/80 border border-slate-900 rounded-lg font-mono text-slate-500 text-center">
              💡 <span className="text-slate-400">Interact with custom procedure dials in the right panel to test real-world cures.</span>
            </div>

          </div>

          {/* SIMULATOR MODIFICATION SLIDER FOR PATIENT EXERCISE Strain */}
          <div className="p-4 rounded-xl border bg-slate-900/40 border-slate-900 text-xs">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                Patient Muscle Exercise Burden:
              </span>
              <span className="text-[10px] font-mono font-bold text-cyan-450 bg-slate-950 px-2 py-0.5 rounded border border-slate-900">
                {exerciseFactor === 1.0 ? "REST_STABILIZED // 1x Rate" : `${exerciseFactor.toFixed(1)}x Physical Load`}
              </span>
            </div>
            
            <input 
              type="range"
              min="1.0"
              max="2.5"
              step="0.2"
              value={exerciseFactor}
              onChange={(e) => setExerciseFactor(parseFloat(e.target.value))}
              className="w-full h-1 accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[8px] font-mono text-slate-550 mt-1">
              <span>REPOSE / Rest (70 BPM)</span>
              <span>CARDIAC WORKLOAD (Aerobic peak)</span>
            </div>
          </div>

        </div>

        {/* RIGHT COMP: INTERVENTIONS OVERLAY SELECTOR & DOCTOR TRAINING CHALLENGE (SPAN 3) */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          
          {/* THERAPEUTICS COGNITION MANAGER */}
          <div className="p-4 rounded-2xl border bg-slate-900/50 border-slate-900 shadow-lg flex flex-col" id="interventions-selector-card">
            
            <div className="flex justify-between items-center border-b border-slate-800/40 pb-3 mb-3">
              <h3 className="text-xs font-mono font-bold text-slate-450 uppercase flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-emerald-400" />
                Deploy Interventions
              </h3>
              
              <button 
                onClick={resetAllTreatments}
                className="text-[10px] font-mono text-slate-500 hover:text-slate-350 underline cursor-pointer"
              >
                Clear all
              </button>
            </div>

            <p className="text-[10px] text-slate-500 leading-snug mb-3">
              Apply surgical and pharmaceutical modalities to heal the active heart pathology.
            </p>

            <div className="space-y-2.5">
              {(Object.keys(MEDICAL_TREATMENTS) as Array<TreatmentKey>).map((key) => {
                const treatment = MEDICAL_TREATMENTS[key];
                const active = activeTreatments[key];
                const isApplicable = activeDiseaseData.treatments.includes(key);

                return (
                  <button
                    key={key}
                    onClick={() => toggleTreatment(key)}
                    className={`w-full py-2.5 px-3 rounded-lg border text-left flex items-start gap-2.5 transition-all text-xs cursor-pointer ${
                      active
                        ? "bg-emerald-950/20 border-emerald-500 text-emerald-400 shadow-sm"
                        : isApplicable
                          ? "bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-700"
                          : "bg-slate-950/20 border-slate-950/55 text-slate-600 opacity-30 cursor-not-allowed"
                    }`}
                    disabled={!isApplicable}
                    title={!isApplicable ? "This therapeutic is not indicated for the current cardiac disease process" : ""}
                  >
                    <div className={`p-1.5 rounded border shrink-0 ${
                      active ? "bg-emerald-950 border-emerald-700 text-emerald-400" : "bg-slate-900 border-slate-800 text-slate-550"
                    }`}>
                      <treatment.icon className="w-3.5 h-3.5" />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="font-bold tracking-tight text-[11px]">{treatment.name}</span>
                        {active && (
                          <span className="text-[8px] font-mono text-emerald-400 border border-emerald-900/50 bg-emerald-950 px-1 py-0.2 rounded animate-pulse">ACTIVE</span>
                        )}
                        {!isApplicable && (
                          <span className="text-[8px] font-mono text-slate-650">N/A</span>
                        )}
                      </div>
                      
                      <div className="text-[9px] font-mono text-slate-500 mt-0.5">
                        {treatment.difficulty} // Targets {treatment.healingTarget}
                      </div>

                      {active && (
                        <p className="text-[9px] text-slate-400 mt-1 leading-normal animate-fade-in bg-slate-950/80 p-1.5 rounded border border-slate-900">
                          {treatment.mechanics}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* DOCTOR EXAM CLINICAL TRAINING CARDS CASES */}
          <div className="p-4 rounded-2xl border bg-slate-900/50 border-cyan-900/30 shadow-lg flex flex-col" id="cardiac-case-widget">
            
            <div className="flex justify-between items-center border-b border-slate-800/30 pb-2.5 mb-3">
              <h3 className="text-xs font-mono font-bold text-cyan-450 uppercase flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                ER Diagnostic Case Files
              </h3>
              <span className="text-[9px] font-mono bg-cyan-950 text-cyan-400 px-1.5 py-0.2 rounded-md border border-cyan-800/30">
                CASE {CLINICAL_CASES[activeCaseIdx].id}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs text-slate-350">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 leading-relaxed text-[11px]" id="case-study-description">
                <div className="text-[9px] font-bold text-cyan-400 uppercase mb-1 flex items-center gap-1">
                  <UserSquare className="w-3.5 h-3.5" />
                  PATIENT HISTORY:
                </div>
                <p className="text-slate-300">{CLINICAL_CASES[activeCaseIdx].summary}</p>
                
                <div className="text-[9px] font-bold text-rose-400 uppercase mt-2.5 mb-1">
                  PHYSICAL FINDINGS & VITAL SENSORS:
                </div>
                <p className="text-slate-400 text-[10px] leading-snug">{CLINICAL_CASES[activeCaseIdx].physicalFindings}</p>

                <div className="text-[9px] font-bold text-yellow-400 uppercase mt-2.5 mb-1">
                  TELEMETRY ECG SNAPSHOT:
                </div>
                <p className="text-slate-400 text-[10px] leading-snug">{CLINICAL_CASES[activeCaseIdx].ecgSnapshot}</p>
              </div>

              {/* ANSWER CHOICES LIST */}
              <div className="space-y-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">DIAGNOSE HEART PATHOLOGY:</p>
                {CLINICAL_CASES[activeCaseIdx].choices.map((choice) => {
                  const isChosen = chosenAnswerKey === choice.key;
                  const isCorrect = choice.isCorrect;
                  return (
                    <button
                      key={choice.key}
                      onClick={() => handleCaseAnswerChoice(choice.key)}
                      disabled={chosenAnswerKey !== null}
                      className={`w-full py-2 px-3 rounded-lg text-left text-[11px] transition-all flex items-center justify-between cursor-pointer ${
                        chosenAnswerKey !== null
                          ? isCorrect
                            ? "bg-emerald-950/25 border-emerald-500 text-emerald-450"
                            : isChosen
                              ? "bg-rose-955/20 border-rose-500 text-rose-450"
                              : "bg-slate-950/40 border-slate-900 text-slate-600"
                          : "bg-slate-950 hover:bg-slate-900 border-slate-850 hover:border-slate-700 text-slate-300"
                      }`}
                    >
                      <span className="font-bold">{choice.label}</span>
                      {chosenAnswerKey !== null && isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* RATIONALE RECOGNITION BOX */}
              {showCaseRationale && (
                <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-850 text-[10px] leading-relaxed animate-fade-in text-slate-400 text-cyan-350">
                  <div className="font-bold flex items-center gap-1 text-[9px] uppercase tracking-wide text-cyan-400 mb-0.5">
                    <Award className="w-3.5 h-3.5" />
                    CLINICAL ANALYSIS RATIONALE
                  </div>
                  <p className="mb-2">
                    {CLINICAL_CASES[activeCaseIdx].choices.find(c => c.key === chosenAnswerKey)?.response}
                  </p>
                  <p className="text-slate-450 text-[9px] border-t border-slate-900 pt-1.5">
                    {CLINICAL_CASES[activeCaseIdx].rationalText}
                  </p>

                  <button
                    onClick={nextCaseFile}
                    className="w-full mt-2.5 py-1.5 bg-cyan-950 hover:bg-cyan-900/80 border border-cyan-800 text-cyan-350 font-bold rounded-lg text-[9px] transition-all uppercase cursor-pointer"
                  >
                    LOAD NEXT CASE FILE
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* 3. SYMPTOMS & TREATMENT METRIC MATRIX GUIDE (BOTTOM-MOST CHEAT SHEET) */}
      <div className="p-5 rounded-2xl border bg-slate-900/40 border-slate-900 text-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6" id="quick-biomedical-perfusion-strip">
        <div className="space-y-1">
          <h4 className="font-bold font-dis text-slate-250 flex items-center gap-1.5 uppercase tracking-wide">
            <Info className="w-4 h-4 text-cyan-400" />
            Active Heart Diseases Physiology Glossary
          </h4>
          <p className="text-[11px] text-slate-500 max-w-4xl leading-relaxed">
            Electro-physiological deviations directly translate into systematic hypoxia or arterial stiffness. Treating CAD prevents acute Infarctions, while pacing Arrhythmias prevents turbulent embolism and strokes. Study the active dynamic clinical HUD maps to test bypass routes and mechanical mitral valve reconstructed models.
          </p>
        </div>

        <div className="flex items-center gap-4 py-1.5 px-3 bg-slate-950 border border-slate-900 rounded-xl text-[10px] font-mono text-slate-400 shrink-0">
          <div className="space-y-0.5">
            <div>LAB SCORE: <span className="text-emerald-400 font-bold">{quizScore} / 3 CASE FILES</span></div>
            <div>VERIFIED: <span className="text-cyan-400 font-bold">100% Gated Exam Completed</span></div>
          </div>
        </div>
      </div>

    </div>
  );
}
