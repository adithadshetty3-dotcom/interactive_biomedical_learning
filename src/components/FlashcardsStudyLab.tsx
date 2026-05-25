import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  RotateCcw, 
  Brain, 
  Heart, 
  Activity,
  Sparkles,
  Info,
  Trophy,
  Award,
  Sliders,
  Zap,
  Users,
  Gauge
} from "lucide-react";

// --- Types compatible with App.tsx to avoid compilation issues ---
export interface FlashcardsLabProps {
  xp: number;
  gainXP: (amount: number) => void;
  streak: number;
  setStreak: React.Dispatch<React.SetStateAction<number>>;
  soundEnabled: boolean;
  playPulseSound: (type: "correct" | "wrong" | "lub-dub" | "alarm" | "flatline") => void;
}

interface Flashcard {
  id: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  front: string;
  back: string;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatarColor: string;
  streak: number;
  cardsStudied: number;
  isCurrentUser?: boolean;
}

// --- CURATED DECK WITH DIFFICULTIES DETAILED BY LEVEL ---
const CURATED_DECK: Flashcard[] = [
  // ================= HEART ANATOMY =================
  // --- EASY (10 cards) ---
  {
    id: "anat-easy-1",
    topic: "Heart Anatomy",
    difficulty: "Easy",
    front: "What are the four chambers of the heart?",
    back: "Right atrium, right ventricle, left atrium, left ventricle."
  },
  {
    id: "anat-easy-2",
    topic: "Heart Anatomy",
    difficulty: "Easy",
    front: "What do heart valves do?",
    back: "Prevent blood from flowing backwards between chambers."
  },
  {
    id: "anat-easy-3",
    topic: "Heart Anatomy",
    difficulty: "Easy",
    front: "Which side of the heart pumps oxygenated blood?",
    back: "The left side."
  },
  {
    id: "anat-easy-4",
    topic: "Heart Anatomy",
    difficulty: "Easy",
    front: "Where are the atria located in the heart?",
    back: "At the top of the heart, receiving blood returning from body/lungs."
  },
  {
    id: "anat-easy-5",
    topic: "Heart Anatomy",
    difficulty: "Easy",
    front: "Where are the ventricles located in the heart?",
    back: "At the bottom of the heart, pumping blood out to body/lungs."
  },
  {
    id: "anat-easy-6",
    topic: "Heart Anatomy",
    difficulty: "Easy",
    front: "What is the heart's main artery that carries blood out to the body?",
    back: "The Aorta."
  },
  {
    id: "anat-easy-7",
    topic: "Heart Anatomy",
    difficulty: "Easy",
    front: "What is the major vein that brings oxygen-poor blood back from the upper body?",
    back: "Superior vena cava."
  },
  {
    id: "anat-easy-8",
    topic: "Heart Anatomy",
    difficulty: "Easy",
    front: "What is the major vein that brings oxygen-poor blood back from the lower body?",
    back: "Inferior vena cava."
  },
  {
    id: "anat-easy-9",
    topic: "Heart Anatomy",
    difficulty: "Easy",
    front: "How many protective layers of tissue wrap the heart?",
    back: "Three layers: Epicardium (outer), Myocardium (middle), Endocardium (inner)."
  },
  {
    id: "anat-easy-10",
    topic: "Heart Anatomy",
    difficulty: "Easy",
    front: "What is the wall separating the left and right sides of the heart called?",
    back: "The cardiac septum."
  },

  // --- MEDIUM (10 cards) ---
  {
    id: "anat-med-1",
    topic: "Heart Anatomy",
    difficulty: "Medium",
    front: "What is the myocardium?",
    back: "The muscular wall of the heart responsible for pumping blood."
  },
  {
    id: "anat-med-2",
    topic: "Heart Anatomy",
    difficulty: "Medium",
    front: "What keeps the atrioventricular valves from inverting during ventricular contraction?",
    back: "Chordae tendineae (heart strings) attached to papillary muscles."
  },
  {
    id: "anat-med-3",
    topic: "Heart Anatomy",
    difficulty: "Medium",
    front: "Which valve separates the right atrium from the right ventricle?",
    back: "The tricuspid valve."
  },
  {
    id: "anat-med-4",
    topic: "Heart Anatomy",
    difficulty: "Medium",
    front: "Which valve separates the left atrium from the left ventricle?",
    back: "The bicuspid (mitral) valve."
  },
  {
    id: "anat-med-5",
    topic: "Heart Anatomy",
    difficulty: "Medium",
    front: "What is the function of the coronary arteries?",
    back: "To supply oxygen-rich blood directly to the heart muscle itself."
  },
  {
    id: "anat-med-6",
    topic: "Heart Anatomy",
    difficulty: "Medium",
    front: "Which sound of the heart represents 'lub' vs 'dub'?",
    back: "'Lub' is the closing of AV valves; 'Dub' is the closing of semilunar valves."
  },
  {
    id: "anat-med-7",
    topic: "Heart Anatomy",
    difficulty: "Medium",
    front: "What is the function of the pericardium?",
    back: "A double-walled sac containing fluid that cushions the heart and reduces friction."
  },
  {
    id: "anat-med-8",
    topic: "Heart Anatomy",
    difficulty: "Medium",
    front: "Which semilunar valve separates the right ventricle from the pulmonary trunk?",
    back: "The pulmonary valve."
  },
  {
    id: "anat-med-9",
    topic: "Heart Anatomy",
    difficulty: "Medium",
    front: "Which semilunar valve separates the left ventricle from the aorta?",
    back: "The aortic valve."
  },
  {
    id: "anat-med-10",
    topic: "Heart Anatomy",
    difficulty: "Medium",
    front: "What is the auricle of an atrium?",
    back: "An ear-like pouch on the outer surface of each atrium that increases its capacity."
  },

  // --- HARD (10 cards) ---
  {
    id: "anat-hard-1",
    topic: "Heart Anatomy",
    difficulty: "Hard",
    front: "What is the fossa ovalis?",
    back: "A depression in the interatrial septum; a remnant of the fetal shunting foramen ovale."
  },
  {
    id: "anat-hard-2",
    topic: "Heart Anatomy",
    difficulty: "Hard",
    front: "What are trabeculae carneae?",
    back: "Muscular ridges on the internal walls of the ventricles that prevent suction flatlining."
  },
  {
    id: "anat-hard-3",
    topic: "Heart Anatomy",
    difficulty: "Hard",
    front: "Which coronary branch supplies the majority of the cardiac ventricular septum?",
    back: "The left anterior descending (LAD) coronary artery."
  },
  {
    id: "anat-hard-4",
    topic: "Heart Anatomy",
    difficulty: "Hard",
    front: "What structures compose the fibrous skeleton of the heart?",
    back: "Four dense collagen rings that encircle the valves and electrically isolate atria from ventricles."
  },
  {
    id: "anat-hard-5",
    topic: "Heart Anatomy",
    difficulty: "Hard",
    front: "What is the significance of the pectinate muscles?",
    back: "Parallel ridges of muscle fibers found in the outer walls of the right atrium and auricles."
  },
  {
    id: "anat-hard-6",
    topic: "Heart Anatomy",
    difficulty: "Hard",
    front: "What are the names of the three cusps that form the aortic semilunar valve?",
    back: "The Left coronary, Right coronary, and Non-coronary cusps."
  },
  {
    id: "anat-hard-7",
    topic: "Heart Anatomy",
    difficulty: "Hard",
    front: "What is the ligamentum arteriosum?",
    back: "A small fibrous ligament remnant of the ductus arteriosus that connected pulmonary artery to aorta in the fetus."
  },
  {
    id: "anat-hard-8",
    topic: "Heart Anatomy",
    difficulty: "Hard",
    front: "Where is the coronary sinus located anatomically?",
    back: "In the posterior coronary sulcus, draining deoxygenated cardiac blood back into the right atrium."
  },
  {
    id: "anat-hard-9",
    topic: "Heart Anatomy",
    difficulty: "Hard",
    front: "What are the papillary muscles, and how many are in each ventricle?",
    back: "They contract to hold valves tight; three are in the right ventricle, and two are in the left ventricle."
  },
  {
    id: "anat-hard-10",
    topic: "Heart Anatomy",
    difficulty: "Hard",
    front: "What is the significance of the moderator band (septomarginal trabecula)?",
    back: "A muscular band crossing the right ventricle cavity to convey the right bundle of His to the anterior papillary muscle."
  },


  // ================= CIRCULATION =================
  // --- EASY (10 cards) ---
  {
    id: "circ-easy-1",
    topic: "Circulation",
    difficulty: "Easy",
    front: "What color is oxygen-rich blood compared to oxygen-poor blood?",
    back: "Oxygen-rich is bright red, while oxygen-poor is darker crimson red."
  },
  {
    id: "circ-easy-2",
    topic: "Circulation",
    difficulty: "Easy",
    front: "Describe the path of deoxygenated blood returning from the body.",
    back: "Vena cava -> Right atrium -> Right ventricle -> Pulmonary artery."
  },
  {
    id: "circ-easy-3",
    topic: "Circulation",
    difficulty: "Easy",
    front: "Does the pulmonary artery carry oxygenated or deoxygenated blood?",
    back: "Deoxygenated blood, traveling to the lungs for gas exchange."
  },
  {
    id: "circ-easy-4",
    topic: "Circulation",
    difficulty: "Easy",
    front: "Do veins carry blood towards or away from the heart?",
    back: "Towards the heart."
  },
  {
    id: "circ-easy-5",
    topic: "Circulation",
    difficulty: "Easy",
    front: "Do arteries carry blood towards or away from the heart?",
    back: "Away from the heart."
  },
  {
    id: "circ-easy-6",
    topic: "Circulation",
    difficulty: "Easy",
    front: "Which tiny blood vessels allow oxygen and nutrients to diffuse into tissues?",
    back: "Capillaries."
  },
  {
    id: "circ-easy-7",
    topic: "Circulation",
    difficulty: "Easy",
    front: "What fluid represents the liquid part of blood?",
    back: "Plasma."
  },
  {
    id: "circ-easy-8",
    topic: "Circulation",
    difficulty: "Easy",
    front: "What type of blood cells carry oxygen?",
    back: "Red blood cells (erythrocytes) containing hemoglobin."
  },
  {
    id: "circ-easy-9",
    topic: "Circulation",
    difficulty: "Easy",
    front: "What is the blood pressure reading when the heart is contracting?",
    back: "Systolic blood pressure."
  },
  {
    id: "circ-easy-10",
    topic: "Circulation",
    difficulty: "Easy",
    front: "What is the blood pressure reading when the heart is relaxing between beats?",
    back: "Diastolic blood pressure."
  },

  // --- MEDIUM (10 cards) ---
  {
    id: "circ-med-1",
    topic: "Circulation",
    difficulty: "Medium",
    front: "What is pulmonary circulation?",
    back: "Movement of blood between the heart and lungs to capture oxygen and release CO2."
  },
  {
    id: "circ-med-2",
    topic: "Circulation",
    difficulty: "Medium",
    front: "What is systemic circulation?",
    back: "Movement of oxygenated blood from the left side of the heart to the rest of the body."
  },
  {
    id: "circ-med-3",
    topic: "Circulation",
    difficulty: "Medium",
    front: "What carries oxygenated blood from lungs to the heart?",
    back: "Pulmonary veins (the only veins carrying high-oxygen blood)."
  },
  {
    id: "circ-med-4",
    topic: "Circulation",
    difficulty: "Medium",
    front: "What is cardiac output?",
    back: "The volume of blood the heart pumps per minute (Stroke Volume x Heart Rate)."
  },
  {
    id: "circ-med-5",
    topic: "Circulation",
    difficulty: "Medium",
    front: "What pressure must the left ventricle overcome to pump blood?",
    back: "Systemic vascular resistance or afterload."
  },
  {
    id: "circ-med-6",
    topic: "Circulation",
    difficulty: "Medium",
    front: "What is venous return?",
    back: "The flow of blood back to the heart, assisted by skeletal muscle pumps and valves."
  },
  {
    id: "circ-med-7",
    topic: "Circulation",
    difficulty: "Medium",
    front: "What is hepatic portal circulation?",
    back: "The pathway that routes digestive tract venous blood through the liver before returning to systemic circulation."
  },
  {
    id: "circ-med-8",
    topic: "Circulation",
    difficulty: "Medium",
    front: "What is stroke volume (SV)?",
    back: "The volume of blood pumped out of a ventricle during a single contraction (normally around 70 mL)."
  },
  {
    id: "circ-med-9",
    topic: "Circulation",
    difficulty: "Medium",
    front: "How do arteriole diameters regulate blood pressure?",
    back: "Vasoconstriction increases resistance and pressure, while vasodilation decreases it."
  },
  {
    id: "circ-med-10",
    topic: "Circulation",
    difficulty: "Medium",
    front: "What are baroreceptors?",
    back: "Sensory nerve endings in the carotid sinus and aortic arch that monitor blood pressure changes."
  },

  // --- HARD (10 cards) ---
  {
    id: "circ-hard-1",
    topic: "Circulation",
    difficulty: "Hard",
    front: "What is the Frank-Starling Law of the Heart?",
    back: "Stroke volume increases in response to an increase in end-diastolic volume (increased stretch equals stronger contraction)."
  },
  {
    id: "circ-hard-2",
    topic: "Circulation",
    difficulty: "Hard",
    front: "Which forces govern capillary fluid exchange?",
    back: "Hydrostatic pressure (pushes fluid out) and blood colloid osmotic pressure (pulls fluid in)."
  },
  {
    id: "circ-hard-3",
    topic: "Circulation",
    difficulty: "Hard",
    front: "What is the physiological significance of the Circle of Willis?",
    back: "An arterial anastomosis at the base of the brain providing collateral circulation if a major artery is blocked."
  },
  {
    id: "circ-hard-4",
    topic: "Circulation",
    difficulty: "Hard",
    front: "How does the renin-angiotensin-aldosterone system (RAAS) affect blood pressure?",
    back: "Fosters vasoconstriction and water/sodium retention to raise blood pressure."
  },
  {
    id: "circ-hard-5",
    topic: "Circulation",
    difficulty: "Hard",
    front: "What is mean arterial pressure (MAP), and how is it calculated?",
    back: "Average pressure in arteries: MAP = Diastolic BP + (1/3 * Pulse Pressure)."
  },
  {
    id: "circ-hard-6",
    topic: "Circulation",
    difficulty: "Hard",
    front: "What is the windkessel effect?",
    back: "The elastic damping of arterial pulse waves by compliant systemic arteries during diastole."
  },
  {
    id: "circ-hard-7",
    topic: "Circulation",
    difficulty: "Hard",
    front: "Describe coronary autoregulation of blood flow.",
    back: "Local metabolic factors like adenosine and nitric oxide trigger vasodilation during high myocardial workload."
  },
  {
    id: "circ-hard-8",
    topic: "Circulation",
    difficulty: "Hard",
    front: "What is the physiological shunt in pediatric fetal circulation?",
    back: "The ductus venosus, foramen ovale, and ductus arteriosus bypassing non-functional lungs and liver."
  },
  {
    id: "circ-hard-9",
    topic: "Circulation",
    difficulty: "Hard",
    front: "What are the components of Virchow's Triad regarding venous thrombogenesis?",
    back: "Endothelial injury, hemodynamic stasis (sluggish flow), and hypercoagulability (increased clotting tendency)."
  },
  {
    id: "circ-hard-10",
    topic: "Circulation",
    difficulty: "Hard",
    front: "What happens to circulation during anaphylactic shock?",
    back: "Widespread systemic vasodilation causes a critical drop in venous return and mean arterial pressure."
  },


  // ================= PACEMAKER & ELECTRICAL =================
  // --- EASY (10 cards) ---
  {
    id: "elect-easy-1",
    topic: "Pacemaker & Electrical",
    difficulty: "Easy",
    front: "What is the natural pacemaker of the heart?",
    back: "The sinoatrial (SA) node."
  },
  {
    id: "elect-easy-2",
    topic: "Pacemaker & Electrical",
    difficulty: "Easy",
    front: "Where is the SA node located?",
    back: "In the upper wall of the right atrium."
  },
  {
    id: "elect-easy-3",
    topic: "Pacemaker & Electrical",
    difficulty: "Easy",
    front: "What abbreviation describes the electrocardiogram?",
    back: "ECG or EKG."
  },
  {
    id: "elect-easy-4",
    topic: "Pacemaker & Electrical",
    difficulty: "Easy",
    front: "What does a pacemaker do?",
    back: "Sends tiny electrical impulses to regulate abnormal, slow heart rates."
  },
  {
    id: "elect-easy-5",
    topic: "Pacemaker & Electrical",
    difficulty: "Easy",
    front: "What is an arrhythmia?",
    back: "An abnormal or irregular heart rhythm."
  },
  {
    id: "elect-easy-6",
    topic: "Pacemaker & Electrical",
    difficulty: "Easy",
    front: "What does a defibrillator do?",
    back: "Delivers an electric shock to restore a normal heart rhythm during cardiac arrest."
  },
  {
    id: "elect-easy-7",
    topic: "Pacemaker & Electrical",
    difficulty: "Easy",
    front: "Which wave on an ECG represents atrial depolarization?",
    back: "The P wave."
  },
  {
    id: "elect-easy-8",
    topic: "Pacemaker & Electrical",
    difficulty: "Easy",
    front: "What does tachycardia mean?",
    back: "A fast resting heart rate, typically over 100 beats per minute."
  },
  {
    id: "elect-easy-9",
    topic: "Pacemaker & Electrical",
    difficulty: "Easy",
    front: "What does bradycardia mean?",
    back: "A slow resting heart rate, typically under 60 beats per minute."
  },
  {
    id: "elect-easy-10",
    topic: "Pacemaker & Electrical",
    difficulty: "Easy",
    front: "Can cardiac muscles contract without brains or nervous signals?",
    back: "Yes, because they possess intrinsic autorhythmicity (automaticity)."
  },

  // --- MEDIUM (10 cards) ---
  {
    id: "elect-med-1",
    topic: "Pacemaker & Electrical",
    difficulty: "Medium",
    front: "What does the AV node do?",
    back: "Transfers electrical impulses from atria to ventricles, introducing a brief delay to let ventricles fill."
  },
  {
    id: "elect-med-2",
    topic: "Pacemaker & Electrical",
    difficulty: "Medium",
    front: "What is depolarization in cardiac physiology?",
    back: "The process where heart muscle cells receive an electrical signal, shifting interior charge to positive."
  },
  {
    id: "elect-med-3",
    topic: "Pacemaker & Electrical",
    difficulty: "Medium",
    front: "What is repolarization on an ECG?",
    back: "The return of cell membrane potentials to rest (e.g., T wave representing ventricular repolarization)."
  },
  {
    id: "elect-med-4",
    topic: "Pacemaker & Electrical",
    difficulty: "Medium",
    front: "What are Purkinje fibers?",
    back: "Subendocardial fibers that distribute action potentials rapidly across the ventricular myocardium."
  },
  {
    id: "elect-med-5",
    topic: "Pacemaker & Electrical",
    difficulty: "Medium",
    front: "What occurs during the QRS complex on an ECG?",
    back: "Ventricular depolarization (and hidden atrial repolarization)."
  },
  {
    id: "elect-med-6",
    topic: "Pacemaker & Electrical",
    difficulty: "Medium",
    front: "Why is there a delay at the AV node?",
    back: "Allows the atria to fully empty their blood contents into the ventricles before ventricular systole begins."
  },
  {
    id: "elect-med-7",
    topic: "Pacemaker & Electrical",
    difficulty: "Medium",
    front: "What is the cardiac action potential plateau phase?",
    back: "Phase 2, driven by slow-opening calcium channels allowing Ca2+ influx to sustain contraction."
  },
  {
    id: "elect-med-8",
    topic: "Pacemaker & Electrical",
    difficulty: "Medium",
    front: "What is the PR interval on an ECG?",
    back: "The time from the onset of atrial depolarization to the onset of ventricular depolarization."
  },
  {
    id: "elect-med-9",
    topic: "Pacemaker & Electrical",
    difficulty: "Medium",
    front: "What are intercalated discs?",
    back: "Specialized connections containing gap junctions that let electrical impulses spread instantly between cardiac cells."
  },
  {
    id: "elect-med-10",
    topic: "Pacemaker & Electrical",
    difficulty: "Medium",
    front: "What is ectopic pacemaker automaticity?",
    back: "When cells outside the SA node (such as AV node or Purkinje fibers) initiate premature heartbeats."
  },

  // --- HARD (10 cards) ---
  {
    id: "elect-hard-1",
    topic: "Pacemaker & Electrical",
    difficulty: "Hard",
    front: "What is the Bundle of His and its branches?",
    back: "A tract that bifurcates into the left and right bundle branches, running down the interventricular septum to conduct impulses."
  },
  {
    id: "elect-hard-2",
    topic: "Pacemaker & Electrical",
    difficulty: "Hard",
    front: "Explain Phase 0 of the cardiac ventricular action potential.",
    back: "Rapid depolarization caused by the sudden opening of voltage-gated fast sodium channels."
  },
  {
    id: "elect-hard-3",
    topic: "Pacemaker & Electrical",
    difficulty: "Hard",
    front: "What ionic current drives Pacemaker potential (Phase 4 slow depolarization in SA node)?",
    back: "The funny current (If) carried mainly by sodium ions through HCN channels."
  },
  {
    id: "elect-hard-4",
    topic: "Pacemaker & Electrical",
    difficulty: "Hard",
    front: "Describe the difference between absolute (effective) and relative refractory periods in heart muscle.",
    back: "During ERP, cells cannot undergo another action potential; during RRP, a massive stimulus can trigger a premature beat."
  },
  {
    id: "elect-hard-5",
    topic: "Pacemaker & Electrical",
    difficulty: "Hard",
    front: "What is a 1st Degree AV Block on an ECG?",
    back: "A prolonged, consistent PR interval greater than 200 ms (0.2 seconds) with no dropped beats."
  },
  {
    id: "elect-hard-6",
    topic: "Pacemaker & Electrical",
    difficulty: "Hard",
    front: "What are the characteristics of Mobitz Type I (Wenckebach) 2nd Degree AV Block?",
    back: "Progressive elongation of the PR interval until a QRS complex is dropped, then the cycle resets."
  },
  {
    id: "elect-hard-7",
    topic: "Pacemaker & Electrical",
    difficulty: "Hard",
    front: "What are the characteristics of Mobitz Type II 2nd Degree AV Block?",
    back: "Intermittent, sudden dropped QRS complexes without prior PR elongation, often indicating bundle branch pathology."
  },
  {
    id: "elect-hard-8",
    topic: "Pacemaker & Electrical",
    difficulty: "Hard",
    front: "What represents the absolute refractory period on an action potential curve?",
    back: "The phase from depolarization through phase 2, ending midway through phase 3 repolarization."
  },
  {
    id: "elect-hard-9",
    topic: "Pacemaker & Electrical",
    difficulty: "Hard",
    front: "What causes Long QT Syndrome, and what is its primary risk?",
    back: "Delayed repolarization from mutated potassium/sodium channels, raising risk for Torsades de Pointes."
  },
  {
    id: "elect-hard-10",
    topic: "Pacemaker & Electrical",
    difficulty: "Hard",
    front: "How does parasympathetic acetylcholine affect SA node action potentials?",
    back: "Activates GIRK potassium channels to hyperpolarize the cell, and lowers cAMP to slow the funny current (decreasing heart rate)."
  }
];

export default function FlashcardsStudyLab({
  xp,
  gainXP,
  streak,
  setStreak,
  soundEnabled,
  playPulseSound
}: FlashcardsLabProps) {
  // Topic filter ("All" or specific list)
  const [activeTab, setActiveTab] = useState<string>("All Topics");
  // Difficulty level filter ("All" or specific list)
  const [activeDifficulty, setActiveDifficulty] = useState<string>("All Levels");
  
  // Track currently filtered subset of cards
  const [filteredCards, setFilteredCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Stats in current live session to update leaderboard rank dynamically
  const [userMasteredCount, setUserMasteredCount] = useState<number>(0);
  const [alreadyCounted, setAlreadyCounted] = useState<Record<string, boolean>>({});

  // Leaderboard data
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, name: "Sarah Jenkins (MD/PhD)", avatarColor: "from-blue-600 to-indigo-600", streak: 15, cardsStudied: 32 },
    { rank: 2, name: "Alex Mercer (Resident)", avatarColor: "from-purple-600 to-pink-600", streak: 8, cardsStudied: 24 },
    { rank: 3, name: "You (Revision)", avatarColor: "from-emerald-600 to-teal-500", streak: streak || 0, cardsStudied: 0, isCurrentUser: true },
    { rank: 4, name: "Elena Rostova (Neuro)", avatarColor: "from-amber-600 to-orange-500", streak: 5, cardsStudied: 16 },
    { rank: 5, name: "Marcus Brody (Cardiac)", avatarColor: "from-red-600 to-rose-500", streak: 3, cardsStudied: 9 },
  ]);

  // Combine and filter cards based on active settings (Topic + Difficulty)
  useEffect(() => {
    let subset = [...CURATED_DECK];

    if (activeTab !== "All Topics") {
      subset = subset.filter(card => card.topic === activeTab);
    }
    
    if (activeDifficulty !== "All Levels") {
      subset = subset.filter(card => card.difficulty === activeDifficulty);
    }

    setFilteredCards(subset);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [activeTab, activeDifficulty]);

  // Handle live updates to Leaderboard whenever cardsStudied changes or user study session builds momentum
  const performRevisionProgress = (cardId: string) => {
    if (!alreadyCounted[cardId]) {
      setAlreadyCounted(prev => ({ ...prev, [cardId]: true }));
      const newCount = userMasteredCount + 1;
      setUserMasteredCount(newCount);
      gainXP(15); // Friendly study reward

      // Play elegant cardiac chime
      playPulseSound("correct");

      // Update local storage streak on learning persistence
      const nextStreak = streak + 1;
      setStreak(nextStreak);

      // Re-map leaderboard with updated scores and sort them!
      setLeaderboard(prev => {
        const updated = prev.map(item => {
          if (item.isCurrentUser) {
            return {
              ...item,
              cardsStudied: newCount,
              streak: nextStreak
            };
          }
          // Increment other people sometimes to make it lively/dynamic
          if (Math.random() > 0.75) {
            return {
              ...item,
              cardsStudied: item.cardsStudied + 1,
              streak: item.streak + (Math.random() > 0.8 ? 1 : 0)
            };
          }
          return item;
        });

        // Re-sort leaderboard entries by cardsStudied desc
        const sorted = [...updated].sort((a, b) => b.cardsStudied - a.cardsStudied);
        
        // Re-assign ranks
        return sorted.map((entry, idx) => ({
          ...entry,
          rank: idx + 1
        }));
      });
    }
  };

  // Trigger progress trigger when flipped
  useEffect(() => {
    if (isFlipped && filteredCards[currentIndex]) {
      performRevisionProgress(filteredCards[currentIndex].id);
    }
  }, [isFlipped, currentIndex]);

  // Handler for next card navigation
  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % filteredCards.length);
    }, 150);
  };

  // Handler for previous card navigation
  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 150);
  };

  // Handler to shuffle card deck for currently active category
  const handleShuffle = () => {
    setIsFlipped(false);
    setTimeout(() => {
      const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
      setFilteredCards(shuffled);
      setCurrentIndex(0);
    }, 150);
  };

  // Handler to flip all cards back to question side
  const handleFlipAllBack = () => {
    setIsFlipped(false);
  };

  const currentCard = filteredCards[currentIndex];

  // Define badges or border colors depending on difficulty
  const getDifficultyBadgeColor = (diff: "Easy" | "Medium" | "Hard") => {
    switch (diff) {
      case "Easy": return "bg-emerald-950/40 text-emerald-405 border-emerald-900 text-emerald-400";
      case "Medium": return "bg-amber-950/40 text-amber-405 border-amber-900 text-amber-400";
      case "Hard": return "bg-rose-950/40 text-rose-405 border-rose-900 text-rose-400";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8" id="flashcard-study-revision-container">
      {/* 0. EMBEDDED CRITICAL ANIMATION STYLES */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .card-inner {
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-front, .card-back {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
        .card-back {
          transform: rotateY(180deg);
        }
        .card-inner.flipped {
          transform: rotateY(180deg);
        }
        
        /* Neon texts glow and styles */
        .shadow-neon-text {
          text-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
        }
      `}</style>

      {/* 1. BIYLI HEADER & TITLE SECTION */}
      <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-900 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-[0.2em] font-semibold">
            <Brain className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>BIYLI Physiology revision Core • SYS_REV_LEVELS</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1.5 tracking-tight font-sans">
            Flashcard Study Lab
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immersive physiological deck calibrated by difficulty. Active leaderboard tracks student persistence.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[11px] font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>Streak: <b className="text-white">{streak}</b></span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span>XP: <b className="text-white">{xp}</b></span>
          </div>
        </div>
      </div>

      {/* 2. LEVEL & TOPIC FILTERS PACK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-900/60 shadow">
        
        {/* LEVEL SEGREGATION TABS */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
            <Sliders className="w-3 h-3 text-emerald-400" />
            <span>Filter By Level (Difficulty)</span>
          </label>
          <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-900">
            {["All Levels", "Easy", "Medium", "Hard"].map((level) => {
              const matches = level === activeDifficulty;
              const levelLabel = level === "Easy" ? "Easy ●" : level === "Medium" ? "Medium ●" : level === "Hard" ? "Hard ●" : "All Levels";
              
              // Difficulty level indicator dot color
              const getDotCol = () => {
                if (level === "Easy") return "text-emerald-500";
                if (level === "Medium") return "text-amber-500";
                if (level === "Hard") return "text-rose-500";
                return "";
              };

              return (
                <button
                  key={level}
                  onClick={() => setActiveDifficulty(level)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                    matches
                      ? "bg-slate-900 text-white border border-slate-800 shadow"
                      : "text-slate-400 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <span className={getDotCol()}>{levelLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TOPIC FILTER TABS */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
            <Heart className="w-3 h-3 text-cyan-400" />
            <span>Filter By Medical Topic</span>
          </label>
          <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-900">
            {["All Topics", "Heart Anatomy", "Circulation", "Pacemaker & Electrical"].map((topic) => {
              const matches = topic === activeTab;
              return (
                <button
                  key={topic}
                  onClick={() => setActiveTab(topic)}
                  className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center whitespace-nowrap overflow-hidden text-ellipsis ${
                    matches
                      ? "bg-slate-900 text-white border border-slate-800 shadow"
                      : "text-slate-400 hover:text-slate-200 border border-transparent"
                  }`}
                  title={topic}
                >
                  {topic.replace("Pacemaker & Electrical", "Pacemaker")}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. CORE TWO-COLUMN GRID PAGE LAYOUT (FLASHCARD & LEADERBOARD COEXISTING) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT COMPONENT: STAGE, CARDS AND NAVIGATION */}
        <div className="lg:col-span-3 space-y-6">
          
          {filteredCards.length > 0 ? (
            <div className="flex flex-col items-center space-y-6">
              
              {/* FLIP CARD CONTAINER */}
              <div 
                className="w-full max-w-2xl h-[320px] perspective-1000 relative select-none cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
                id="revision-interactive-wrapper"
              >
                <div className={`w-full h-full card-inner relative rounded-2xl ${isFlipped ? "flipped" : ""}`}>
                  
                  {/* FRONT OF THE CARD - Dark navy, white question text, glowing border */}
                  <div className="card-front bg-slate-950 border border-slate-900 rounded-2xl p-8 flex flex-col justify-between shadow-2xl overflow-hidden hover:border-slate-850 transition-all group">
                    {/* Glowing neon-accented indicator depending on difficulty level */}
                    <div className={`absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent ${
                      currentCard.difficulty === "Easy" ? "via-emerald-500" : currentCard.difficulty === "Medium" ? "via-amber-500" : "via-rose-500"
                    } to-transparent opacity-70 group-hover:opacity-100 transition-opacity`} />
                    
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <div className="flex items-center gap-2">
                        <span className="uppercase tracking-widest text-[#00E5FF] font-semibold">{currentCard.topic}</span>
                        <span className="text-slate-600">|</span>
                        <span className={`px-2 py-0.5 rounded border text-[9px] uppercase ${getDifficultyBadgeColor(currentCard.difficulty)}`}>
                          {currentCard.difficulty}
                        </span>
                      </div>
                      <span className="border border-slate-850 px-2 py-0.5 rounded bg-slate-900">QUESTION STAGE</span>
                    </div>

                    <div className="text-center py-4 flex-grow flex items-center justify-center">
                      <p className="text-xl md:text-2xl font-bold font-sans text-white tracking-wide leading-relaxed px-2">
                        {currentCard.front}
                      </p>
                    </div>

                    <div className="flex justify-center items-center">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 animate-pulse bg-cyan-950/20 px-3 py-1 rounded-full border border-cyan-900/30">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        Click anywhere to flip and reveal answer
                      </span>
                    </div>
                  </div>

                  {/* BACK OF THE CARD - Sightly lighter navy, neon-green/emerald answer text */}
                  <div className="card-back bg-slate-900 border border-emerald-950/60 rounded-2xl p-8 flex flex-col justify-between shadow-2xl overflow-hidden">
                    {/* Glowing neon-accented indicator on back */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-90" />
                    
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="uppercase tracking-widest text-emerald-400">{currentCard.topic}</span>
                        <span className="text-slate-600">|</span>
                        <span className={`px-2 py-0.5 rounded border text-[ entry-9px] uppercase ${getDifficultyBadgeColor(currentCard.difficulty)}`}>
                          {currentCard.difficulty}
                        </span>
                      </div>
                      <span className="border border-emerald-950 bg-emerald-950/20 text-emerald-400 px-2 py-0.5 rounded">ANSWER STATE</span>
                    </div>

                    <div className="text-center py-4 flex-grow flex items-center justify-center">
                      <p className="text-xl md:text-2xl font-extrabold font-sans text-emerald-400 tracking-wide leading-relaxed px-2 shadow-neon-text">
                        {currentCard.back}
                      </p>
                    </div>

                    <div className="flex justify-center items-center">
                      <span className="text-[10px] font-mono text-slate-450 uppercase tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-slate-850">
                        Click anywhere to flip back to question
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* CONTROLS BAR */}
              <div className="w-full bg-slate-950 border border-slate-900 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                
                {/* Prev & Next Navigation Buttons */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handlePrev}
                    className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 cursor-pointer transition-all active:scale-95 hover:text-white"
                    title="Previous study card"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <span className="text-xs font-mono text-slate-400 px-4 py-2 bg-slate-900 rounded-xl border border-slate-850">
                    Card <b className="text-emerald-400 font-bold">{currentIndex + 1}</b> of {filteredCards.length}
                  </span>

                  <button
                    onClick={handleNext}
                    className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 cursor-pointer transition-all active:scale-95 hover:text-white"
                    title="Next study card"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Shuffle & Flip All Back Reset Actions */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={handleShuffle}
                    className="flex-1 sm:flex-none py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 cursor-pointer text-xs font-bold font-mono transition-all flex items-center justify-center gap-2"
                    title="Randomize the active subset deck"
                  >
                    <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Shuffle Order</span>
                  </button>

                  <button
                    onClick={handleFlipAllBack}
                    className="flex-1 sm:flex-none py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 cursor-pointer text-xs font-bold font-mono transition-all flex items-center justify-center gap-2"
                    title="Reset cards back to Question state"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                    <span>Flip All Back</span>
                  </button>
                </div>

              </div>

              {/* Quick instructions indicator */}
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono italic">
                <Info className="w-3.5 h-3.5 text-emerald-500" />
                <span>Tip: Flipping a previously unrevised card registers +1 Mastered Card and raises your Leaderboard rank!</span>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6 bg-slate-950/60 rounded-2xl border border-slate-900 text-center space-y-4">
              <Sliders className="w-10 h-10 text-slate-600 animate-pulse" />
              <h3 className="text-lg font-bold text-slate-300">No segment found for this combination</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                No cards match both difficulty level <b className="text-slate-400">"{activeDifficulty}"</b> and topic <b className="text-slate-400">"{activeTab}"</b>. Alter your dynamic filters to retry.
              </p>
              <button
                onClick={() => {
                  setActiveTab("All Topics");
                  setActiveDifficulty("All Levels");
                }}
                className="py-1.5 px-4 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 text-xs font-bold rounded-lg cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}

        </div>

        {/* RIGHT COMPONENT: FUTURISTIC REVISION LEADERBOARD */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* THE LEADERBOARD PANEL */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 shadow-xl flex flex-col h-full min-h-[360px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-900">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Revision Leaderboard
                </h3>
              </div>
              <div className="flex items-center gap-1 bg-slate-900/60 py-0.5 px-2 rounded border border-slate-850">
                <Users className="w-3 h-3 text-cyan-400" />
                <span className="text-[9px] font-mono text-slate-500">PEERS: 5</span>
              </div>
            </div>

            <div className="mt-3 flex-grow space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {leaderboard.map((student, idx) => {
                const isUser = student.isCurrentUser;
                return (
                  <div
                    key={student.name}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                      isUser
                        ? "bg-slate-900/50 border-emerald-500/30 shadow-[0px_0px_10px_0px_rgba(16,185,129,0.1)]"
                        : "bg-slate-950/80 border-slate-900/80"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* RANK CIRCLE WITH SPECIAL COLORS FOR FIRST/SECOND/THIRD */}
                      <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-mono font-bold ${
                        student.rank === 1 
                          ? "bg-amber-400 text-slate-950" 
                          : student.rank === 2 
                          ? "bg-slate-300 text-slate-950" 
                          : student.rank === 3 
                          ? "bg-amber-700 text-white" 
                          : "bg-slate-900 text-slate-400"
                      }`}>
                        {student.rank}
                      </span>

                      {/* PROFILE AVATAR INTRODUCTIONS */}
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${student.avatarColor} flex items-center justify-center font-bold text-xs text-white uppercase shadow-sm`}>
                        {student.name.charAt(0)}
                      </div>

                      {/* NAME AND PERSISTENCE METRIC */}
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${isUser ? "text-emerald-400" : "text-slate-205 text-slate-300"}`}>
                          {student.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 mt-0.5">
                          <span className="text-slate-450 text-slate-400">Cards: <b className="text-slate-200">{student.cardsStudied}</b></span>
                          <span>•</span>
                          <span className="text-amber-500">🔥 {student.streak}</span>
                        </div>
                      </div>
                    </div>

                    {/* STATUS CHIP */}
                    {isUser && (
                      <div className="shrink-0 flex items-center gap-1 py-0.5 px-2 rounded-full border border-emerald-500/20 bg-emerald-950/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] font-mono text-emerald-400">YOU</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* LEADERBOARD FOOTER BANNER */}
            <div className="mt-4 pt-3 border-t border-slate-900/80 bg-slate-900/20 p-2.5 rounded-xl border border-slate-900 flex items-center gap-3">
              <Gauge className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-[10px] font-mono">
                <div className="text-slate-300 font-bold">Your studying index:</div>
                <div className="text-slate-500">Studied <span className="text-emerald-400 font-bold">{userMasteredCount} / 12</span> cards this session</div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
