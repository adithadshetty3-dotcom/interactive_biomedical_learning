import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Brain, 
  Trash2, 
  Heart, 
  Sparkles, 
  Info,
  ShieldAlert,
  ArrowRight
} from "lucide-react";

export interface PulseAiChatbotProps {
  soundEnabled: boolean;
  playPulseSound?: (type: "correct" | "wrong" | "lub-dub" | "alarm" | "flatline") => void;
}

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string; // HH:MM format
}

// Complete Chip responses mapped for exact checks
const CHIP_RESPONSES: Record<string, string> = {
  "explain blood circulation step by step": `Great question! Here's how blood circulates step by step: ❤️

1️⃣ Deoxygenated blood from the body enters the Right Atrium through the Vena Cava.
2️⃣ It passes through the Tricuspid Valve into the Right Ventricle.
3️⃣ The Right Ventricle pumps it through the Pulmonary Artery to the Lungs.
4️⃣ In the lungs, blood picks up oxygen and releases CO₂.
5️⃣ Oxygenated blood returns via Pulmonary Veins to the Left Atrium.
6️⃣ It passes through the Bicuspid Valve into the Left Ventricle.
7️⃣ The Left Ventricle pumps it through the Aorta to the entire body.

Full path:
BODY → Vena Cava → Right Atrium → Tricuspid Valve → Right Ventricle → Pulmonary Artery → Lungs → Pulmonary Vein → Left Atrium → Bicuspid Valve → Left Ventricle → Aorta → BODY 🔄

Want me to explain pulmonary or systemic circulation separately?`,

  "what is the sa node?": `The SA Node (Sinoatrial Node) is the natural pacemaker of the heart! ⚡

- Located in the upper wall of the Right Atrium
- Generates electrical impulses 60–100 times per minute
- These impulses trigger each heartbeat
- Controls the heart's rhythm automatically

Think of it as the heart's built-in clock! ⏰
Want to learn about the AV Node next?`,

  "what is tachycardia vs bradycardia?": `Tachycardia vs Bradycardia represent opposite ends of heart rate abnormalities! 📈

🔴 **Tachycardia**:
- Heart rate is too fast (above 100 BPM)
- Waves are compressed close together on an ECG

🟡 **Bradycardia**:
- Heart rate is too slow (below 60 BPM)
- Waves are stretched out with long gaps on an ECG

Both can be simulated in our **ECG Pattern Detection Simulator**! Any specific heart rate issues you want to ask about? 😊`,

  "how does a pacemaker work?": `An Artificial Pacemaker is a small implanted device that regulates abnormal heart rhythms! 🔋

How it works:
- Implanted under the skin near the collarbone
- Connected to the heart via thin wires (leads)
- Monitors heart rhythm constantly
- Sends electrical pulses when heartbeat is too slow

Used for:
✅ Bradycardia
✅ Heart block
✅ Some arrhythmias

Modern pacemakers are tiny, last 7–15 years, and are MRI-compatible!

Real world examples: Medtronic, Abbott, Boston Scientific
Want to learn about defibrillators next?`,

  "quiz me on heart anatomy": `Great! Let's test your knowledge! 🎯

Question: Which vessel carries oxygenated blood from the lungs back to the heart?

A) Aorta
B) Pulmonary Artery
C) Pulmonary Vein ✅
D) Vena Cava

Type A, B, C, or D to answer!
(Hint: Think about what returns FROM the lungs 😉)`,

  "what causes a heart attack?": `A Heart Attack (Myocardial Infarction) happens when blood supply to part of the heart is blocked! 🚨

Cause:
- Plaque buildup blocks a coronary artery
- Part of heart muscle is starved of oxygen
- That muscle begins to die

Symptoms:
- Chest pain or pressure
- Pain radiating to left arm or jaw
- Sweating and nausea
- Shortness of breath

Treatment:
- Emergency angioplasty (open blocked artery)
- Stent placement
- Bypass surgery
- Medications (blood thinners, aspirin)

IMPORTANT: Call emergency services immediately! Every minute matters during a heart attack! ⏱️`,

  "what does an ecg measure?": `An ECG (Electrocardiogram) records the heart's electrical activity as waves! 📈

The main waves are:
- P wave — atria contracting
- QRS complex — ventricles contracting (the tall sharp spike)
- T wave — ventricles relaxing

Normal ECG: regular evenly spaced waves at 60–100 BPM

ECG is used to detect:
✅ Tachycardia (too fast)
✅ Bradycardia (too slow)
✅ Arrhythmia (irregular)
✅ Heart attacks

You can see this live in the ECG Simulator feature of BIYLI!
Want to learn about abnormal ECG patterns?`,

  "what are the four chambers?": `The human heart has FOUR chambers! 🫀

Right side (handles deoxygenated blood):
- Right Atrium — receives blood from body via Vena Cava
- Right Ventricle — pumps blood to lungs

Left side (handles oxygenated blood):
- Left Atrium — receives blood from lungs via Pulmonary Veins
- Left Ventricle — pumps blood to entire body (most powerful chamber!)

The heart also has 4 valves:
- Tricuspid valve (right atrium → right ventricle)
- Pulmonary valve (right ventricle → pulmonary artery)
- Mitral/Bicuspid valve (left atrium → left ventricle)
- Aortic valve (left ventricle → aorta)

Want to learn about blood circulation next?`
};

export default function PulseAiTutorChatbot({
  soundEnabled,
  playPulseSound
}: PulseAiChatbotProps) {
  const [chatInput, setChatInput] = useState<string>("");
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [showChips, setShowChips] = useState<boolean>(true);
  
  // Format HH:MM helper
  const getFormattedTime = (): string => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getIntroMessage = (): Message => ({
    id: "intro-1",
    sender: "bot",
    text: "Hi! I'm PulseAI ❤️\nYour AI heart-learning assistant.\nAsk me anything about the human heart, blood circulation, ECG, pacemakers, or heart diseases!",
    timestamp: getFormattedTime()
  });

  const [messages, setMessages] = useState<Message[]>([getIntroMessage()]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll logic
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isThinking]);

  // SMART RESPONSE MATCHING ENGINE
  const getLocalResponse = (userInput: string): string => {
    const normalized = userInput.toLowerCase().trim();

    // 1. Check for exact chip question matches first (case-insensitive & clean question marks)
    const cleanNormalized = normalized.replace(/\?$/, "").trim();
    for (const [chipName, resp] of Object.entries(CHIP_RESPONSES)) {
      const normChip = chipName.toLowerCase().trim().replace(/\?$/, "");
      if (cleanNormalized === normChip || normalized === chipName.toLowerCase().trim()) {
        return resp;
      }
    }

    // 2. Then check keywords in order of priority (specific heart/circulation terms first)
    const KEYWORD_GROUPS = [
      {
        keywords: ["answer is c", "its c", "option c", "c)", "pulmonary vein"],
        response: `🎉 Correct! Well done!

The Pulmonary Vein carries oxygenated blood from the lungs back to the Left Atrium.

Remember:
- Pulmonary ARTERY = takes deoxygenated blood TO lungs
- Pulmonary VEIN = brings oxygenated blood FROM lungs

Want another question? Just say 'Quiz me!' 😊
Or visit the full Quiz feature in BIYLI for more practice!`
      },
      {
        keywords: ["answer is a", "answer is b", "answer is d", "its a", "its b", "its d"],
        response: `Not quite! The correct answer is C) Pulmonary Vein ✅

The Pulmonary Vein carries oxygenated blood from the lungs back to the Left Atrium.

Don't worry — this is a common confusion!
Pulmonary ARTERY carries deoxygenated blood TO the lungs.
Pulmonary VEIN brings oxygenated blood back FROM the lungs.

Want to try another question? Say 'Quiz me!' 💪`
      },
      {
        keywords: ["blood circulation", "explain circulation", "how does blood flow", "blood flow"],
        response: `Great question! Here's how blood circulates step by step: ❤️

1️⃣ Deoxygenated blood from the body enters the Right Atrium through the Vena Cava.
2️⃣ It passes through the Tricuspid Valve into the Right Ventricle.
3️⃣ The Right Ventricle pumps it through the Pulmonary Artery to the Lungs.
4️⃣ In the lungs, blood picks up oxygen and releases CO₂.
5️⃣ Oxygenated blood returns via Pulmonary Veins to the Left Atrium.
6️⃣ It passes through the Bicuspid Valve into the Left Ventricle.
7️⃣ The Left Ventricle pumps it through the Aorta to the entire body.

Full path:
BODY → Vena Cava → Right Atrium → Tricuspid Valve → Right Ventricle → Pulmonary Artery → Lungs → Pulmonary Vein → Left Atrium → Bicuspid Valve → Left Ventricle → Aorta → BODY 🔄

Want me to explain pulmonary or systemic circulation separately?`
      },
      {
        keywords: ["pulmonary circulation", "pulmonary"],
        response: `Pulmonary Circulation is the movement of blood between the heart and the lungs. 🫁

- Deoxygenated blood leaves the Right Ventricle
- Travels through the Pulmonary Artery to the lungs
- In the lungs: CO₂ is removed, oxygen is absorbed
- Oxygenated blood returns via Pulmonary Veins to the Left Atrium

Key fact: Pulmonary arteries carry deoxygenated blood — the only arteries in the body that do this!

Want to learn about Systemic Circulation next?`
      },
      {
        keywords: ["systemic circulation", "systemic"],
        response: `Systemic Circulation is the movement of oxygenated blood from the heart to the rest of the body. 🌍

- Oxygenated blood leaves the Left Ventricle through the Aorta
- It travels to all organs, muscles, and tissues
- Oxygen is delivered, CO₂ and waste are picked up
- Deoxygenated blood returns to the Right Atrium via Vena Cava

Fun fact: The systemic circuit is much larger than the pulmonary circuit!

Any other circulation questions? 😊`
      },
      {
        keywords: ["sa node", "sinoatrial", "natural pacemaker", "pacemaker of heart"],
        response: `The SA Node (Sinoatrial Node) is the natural pacemaker of the heart! ⚡

- Located in the upper wall of the Right Atrium
- Generates electrical impulses 60–100 times per minute
- These impulses trigger each heartbeat
- Controls the heart's rhythm automatically

Think of it as the heart's built-in clock! ⏰
Want to learn about the AV Node next?`
      },
      {
        keywords: ["av node", "atrioventricular"],
        response: `The AV Node (Atrioventricular Node) acts as a relay station for electrical signals! ⚡

- Receives signals from the SA Node
- Briefly delays the signal (allows atria to finish contracting)
- Then sends the signal down to the ventricles
- Located between the atria and ventricles

This delay is important — it makes sure the ventricles fill with blood before contracting!

Want to know about the Bundle of His next?`
      },
      {
        keywords: ["bundle of his", "bundle", "his"],
        response: `The Bundle of His is a group of specialized heart muscle cells! ⚡

- Receives electrical signals from the AV Node
- Conducts them rapidly down to the ventricles
- Splits into left and right bundle branches
- Ensures both ventricles contract simultaneously

It's like an electrical wire inside the heart!
Want to learn about the full electrical conduction path?`
      },
      {
        keywords: ["ecg", "electrocardiogram", "ecg basics", "what is ecg", "what does ecg measure"],
        response: `An ECG (Electrocardiogram) records the heart's electrical activity as waves! 📈

The main waves are:
- P wave — atria contracting
- QRS complex — ventricles contracting (the tall sharp spike)
- T wave — ventricles relaxing

Normal ECG: regular evenly spaced waves at 60–100 BPM

ECG is used to detect:
✅ Tachycardia (too fast)
✅ Bradycardia (too slow)
✅ Arrhythmia (irregular)
✅ Heart attacks

You can see this live in the ECG Simulator feature of BIYLI!
Want to learn about abnormal ECG patterns?`
      },
      {
        keywords: ["tachycardia", "heart beats fast", "fast heart"],
        response: `Tachycardia means the heart beats TOO FAST! 🔴

- Heart rate: above 100 BPM
- ECG shows: compressed waves very close together
- Causes: stress, fever, dehydration, heart disease

Symptoms:
- Rapid pounding heartbeat
- Dizziness
- Shortness of breath

Treatment:
- Medications
- Cardioversion (electric shock to reset rhythm)
- Catheter ablation

You can see Tachycardia ECG live in the BIYLI ECG Simulator! 📈`
      },
      {
        keywords: ["bradycardia", "heart beats slow", "slow heart"],
        response: `Bradycardia means the heart beats TOO SLOWLY! 🟡

- Heart rate: below 60 BPM
- ECG shows: stretched waves with very long gaps
- Causes: aging, heart damage, certain medications

Symptoms:
- Fatigue
- Fainting
- Shortness of breath

Treatment:
- Lifestyle changes
- Medications
- Artificial pacemaker implantation

Check the ECG Simulator in BIYLI to see Bradycardia visually! 📈`
      },
      {
        keywords: ["arrhythmia", "irregular heartbeat", "irregular heart", "irregular rhythm"],
        response: `Arrhythmia means the heart beats IRREGULARLY! 🟠

- Electrical signals are disturbed or disordered
- ECG shows: uneven spacing between waves
- Some beats may be skipped or extra

Types:
- Atrial fibrillation (AFib) — most common
- Ventricular fibrillation — most dangerous
- Premature beats

Treatment:
- Medications (antiarrhythmics)
- Pacemaker implantation
- Defibrillator (ICD)
- Catheter ablation

See Arrhythmia ECG live in the BIYLI ECG Simulator! 📈`
      },
      {
        keywords: ["artificial pacemaker", "pacemaker implant", "how does pacemaker work", "pacemaker"],
        response: `An Artificial Pacemaker is a small implanted device that regulates abnormal heart rhythms! 🔋

How it works:
- Implanted under the skin near the collarbone
- Connected to the heart via thin wires (leads)
- Monitors heart rhythm constantly
- Sends electrical pulses when heartbeat is too slow

Used for:
✅ Bradycardia
✅ Heart block
✅ Some arrhythmias

Modern pacemakers are tiny, last 7–15 years, and are MRI-compatible!

Real world examples: Medtronic, Abbott, Boston Scientific
Want to learn about defibrillators next?`
      },
      {
        keywords: ["defibrillator", "aed", "icd", "electric shock heart"],
        response: `A Defibrillator delivers an electric shock to reset a dangerous heart rhythm! ⚡

Types:
- AED (Automated External Defibrillator) — used in emergencies
- ICD (Implantable Cardioverter Defibrillator) — implanted inside

How it works:
- Detects life-threatening arrhythmia
- Delivers a controlled electric shock
- Resets the heart's electrical system

AEDs are found in airports, malls, and schools for emergencies!
Want to learn more about pacemakers or heart diseases?`
      },
      {
        keywords: ["heart attack", "myocardial infarction", "mi"],
        response: `A Heart Attack (Myocardial Infarction) happens when blood supply to part of the heart is blocked! 🚨

Cause:
- Plaque buildup blocks a coronary artery
- Part of heart muscle is starved of oxygen
- That muscle begins to die

Symptoms:
- Chest pain or pressure
- Pain radiating to left arm or jaw
- Sweating and nausea
- Shortness of breath

Treatment:
- Emergency angioplasty (open blocked artery)
- Stent placement
- Bypass surgery
- Medications (blood thinners, aspirin)

IMPORTANT: Call emergency services immediately! Every minute matters during a heart attack! ⏱️`
      },
      {
        keywords: ["coronary artery disease", "cad", "blocked artery", "coronary"],
        response: `Coronary Artery Disease (CAD) is the most common heart disease worldwide! ❤️

What happens:
- Plaque (fat, cholesterol) builds up inside coronary arteries
- Arteries become narrow and hardened
- Blood flow to heart muscle is reduced

Risk factors:
- High cholesterol
- Smoking
- Diabetes
- High blood pressure
- Obesity

Treatment:
- Lifestyle changes (diet, exercise)
- Medications
- Angioplasty and stent
- Bypass surgery

Want to learn about Heart Attack or Heart Failure?`
      },
      {
        keywords: ["heart failure", "cardiac failure", "weak heart", "failing heart"],
        response: `Heart Failure means the heart can't pump blood efficiently enough for the body's needs! 💔

Note: It doesn't mean the heart has stopped — it means it's working poorly.

Types:
- Left-sided (most common) — fluid builds in lungs
- Right-sided — fluid builds in legs and abdomen

Symptoms:
- Breathlessness
- Swollen ankles/legs
- Extreme fatigue
- Rapid heartbeat

Treatment:
- Medications (ACE inhibitors, beta blockers)
- Lifestyle changes
- Pacemaker (CRT device)
- Heart transplant in severe cases

Want to learn about other heart diseases?`
      },
      {
        keywords: ["heart anatomy", "chambers", "four chambers", "parts of heart", "heart parts"],
        response: `The human heart has FOUR chambers! 🫀

Right side (handles deoxygenated blood):
- Right Atrium — receives blood from body via Vena Cava
- Right Ventricle — pumps blood to lungs

Left side (handles oxygenated blood):
- Left Atrium — receives blood from lungs via Pulmonary Veins
- Left Ventricle — pumps blood to entire body (most powerful chamber!)

The heart also has 4 valves:
- Tricuspid valve (right atrium → right ventricle)
- Pulmonary valve (right ventricle → pulmonary artery)
- Mitral/Bicuspid valve (left atrium → left ventricle)
- Aortic valve (left ventricle → aorta)

Want to learn about blood circulation next?`
      },
      {
        keywords: ["valve", "heart valve", "tricuspid", "mitral", "bicuspid", "aortic", "pulmonary valve"],
        response: `Heart valves are like one-way doors that keep blood flowing in the right direction! 🚪

The 4 heart valves:

1. Tricuspid Valve
   → Between right atrium and right ventricle

2. Pulmonary Valve
   → Between right ventricle and pulmonary artery

3. Mitral (Bicuspid) Valve
   → Between left atrium and left ventricle

4. Aortic Valve
   → Between left ventricle and aorta

Valve disease happens when valves don't open/close properly, causing blood to leak backwards (regurgitation) or flow to be blocked (stenosis).

Want to learn about valve disease or circulation?`
      },
      {
        keywords: ["quiz", "test me", "quiz me", "ask me", "question", "practice"],
        response: `Great! Let's test your knowledge! 🎯

Question: Which vessel carries oxygenated blood from the lungs back to the heart?

A) Aorta
B) Pulmonary Artery
C) Pulmonary Vein ✅
D) Vena Cava

Type A, B, C, or D to answer!
(Hint: Think about what returns FROM the lungs 😉)`
      },
      {
        keywords: ["what is biyli", "about biyli", "about this app", "what can you do", "what is this"],
        response: `BIYLI stands for Biomedical Interactive Learning Platform! 🎓

It's designed to help biology and biomedical engineering students learn about the human heart through:

❤️ Feature 1 — ECG Pattern Detection Simulator
🫀 Feature 2 — Smart ECG Waveform Analyzer
🏥 Feature 3 — Heart Disease Visual Guide
📝 Feature 4 — Interactive Quiz
🃏 Feature 5 — Flashcard Revision Module
🤖 Feature 6 — PulseAI Chatbot (that's me!)

Ask me anything about any of these topics and I'll help you learn! 😊`
      },
      {
        keywords: ["hi", "hello", "hey", "good morning", "good evening"],
        response: `Hi there! 👋 I'm PulseAI ❤️
Great to see you here!
What would you like to learn about the heart today?
You can ask me about anatomy, circulation, ECG, pacemakers, or heart diseases!`
      }
    ];

    for (const group of KEYWORD_GROUPS) {
      if (group.keywords.some(kw => normalized.includes(kw))) {
        return group.response;
      }
    }

    // 3. Fallback response
    return `Hmm, I'm not sure about that one! 🤔
I'm specialized in heart biology for BIYLI.

Try asking me about:
- Blood circulation
- Heart anatomy
- ECG and arrhythmias
- Pacemakers
- Heart diseases

Or click one of the suggested questions below! ❤️`;
  };

  const handleClearHistory = () => {
    setMessages([getIntroMessage()]);
    setShowChips(true);
    if (playPulseSound) playPulseSound("flatline");
  };

  const handleSendMessage = (customText?: string) => {
    const userText = customText ? customText.trim() : chatInput.trim();
    if (!userText) return;

    if (!customText) {
      setChatInput("");
    }
    
    // Hide suggested chips on first sent message as requested
    if (showChips) {
      setShowChips(false);
    }

    const timeStamp = getFormattedTime();
    const userMsgId = `user-${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      sender: "user",
      text: userText,
      timestamp: timeStamp
    };

    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);
    if (playPulseSound) playPulseSound("lub-dub");

    // 800ms Simulated delay before responding as required
    setTimeout(() => {
      const generatedReply = getLocalResponse(userText);
      const isQuizPrompt = generatedReply.includes("Question:") || generatedReply.includes("Correct!") || generatedReply.includes("Not quite!");
      
      setMessages(prev => [...prev, {
        id: `bot-reply-${Date.now()}`,
        sender: "bot",
        text: generatedReply,
        timestamp: getFormattedTime()
      }]);

      setIsThinking(false);

      if (playPulseSound) {
        if (isQuizPrompt) {
          if (generatedReply.includes("Correct!")) {
            playPulseSound("correct");
          } else if (generatedReply.includes("Not quite!")) {
            playPulseSound("wrong");
          } else {
            playPulseSound("correct");
          }
        } else {
          playPulseSound("correct");
        }
      }
    }, 800);
  };

  // Safe renderer transforming bold (**text**) into JSX elements
  const renderFormattedMessageText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, lineIndex) => {
      const isBullet = line.trim().startsWith("* ") || line.trim().startsWith("- ");
      const cleanLine = isBullet ? line.trim().substring(2) : line;

      // split by ** to find bold contents
      const parts = cleanLine.split(/\*\*([\s\S]*?)\*\*/g);
      const content = parts.map((part, index) => {
        if (index % 2 === 1) {
          return <strong key={index} className="font-extrabold text-[#00FF88]">{part}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={lineIndex} className="list-disc ml-4 my-1 text-slate-300 text-[13.5px] leading-relaxed select-text">
            {content}
          </li>
        );
      } else {
        return (
          <p key={lineIndex} className="my-1 min-h-[1.1rem] text-slate-200 text-[13.5px] leading-relaxed select-text">
            {content}
          </p>
        );
      }
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-160px)] min-h-[500px]" id="pulse-ai-feature-container">
      {/* 0. HEART PULSE RATE ANIMATION AND SUB-ACCENT EFFECTS */}
      <style>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          14% { transform: scale(1.15); }
          28% { transform: scale(1); }
          42% { transform: scale(1.15); }
          70% { transform: scale(1); }
        }
        .heartbeat-pulse {
          animation: heartbeat 0.83s infinite ease-in-out; /* ~72 BPM rate */
        }
      `}</style>

      {/* 1. FUTURISTIC BIYLI MODULE HEADER */}
      <div className="bg-slate-950/95 p-4 rounded-xl border border-slate-900 shadow-xl flex shrink-0 justify-between items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[#00FF88]">
            <Heart className="w-5 h-5 heartbeat-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[#00FF88] font-mono text-[10px] uppercase tracking-[0.25em] font-semibold">
              <span>PulseAI System</span>
              <span className="text-slate-700">|</span>
              <span>Offline Core Verified 🛡️</span>
            </div>
            <h1 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              PulseAI — Your Heart Learning Assistant
            </h1>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-[#00FF88] animate-pulse" />
          <span>Keyword Solver Active</span>
        </div>
      </div>

      {/* 2. SCROLLABLE MESSAGES CONTAINER STAGE */}
      <div className="relative flex-1 bg-slate-950/90 border border-slate-900 rounded-xl overflow-hidden shadow-2xl flex flex-col mb-4">
        
        {/* Messages feed area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 select-text">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"} w-full items-start gap-2.5`}
              >
                {/* Bot Profile Badge */}
                {!isUser && (
                  <div className="w-7 h-7 shrink-0 rounded-lg bg-emerald-950/60 border border-emerald-900 flex items-center justify-center text-[#00FF88]">
                    <Brain className="w-4 h-4 text-[#00FF88] animate-pulse" />
                  </div>
                )}

                <div className="flex flex-col max-w-[85%] sm:max-w-[78%] space-y-1">
                  {/* Message bubble */}
                  <div
                    className={`p-3.5 rounded-xl text-slate-100 text-sm leading-relaxed ${
                      isUser
                        ? "bg-[#00FF88]/10 border border-[#00FF88]/30 rounded-tr-none text-right shadow-[0_2px_8px_0_rgba(0,255,136,0.05)]"
                        : "bg-slate-900/90 border border-slate-800/80 rounded-tl-none shadow-md"
                    }`}
                  >
                    {isUser ? (
                      <p className="select-text whitespace-pre-wrap text-[13.5px]">{msg.text}</p>
                    ) : (
                      <div className="space-y-1.5 select-text">
                        {renderFormattedMessageText(msg.text)}
                      </div>
                    )}
                  </div>
                  
                  {/* Timestamp and details label */}
                  <div className={`text-[9px] font-mono text-slate-500 px-1 flex items-center gap-1.5 ${isUser ? "justify-end" : "justify-start"}`}>
                    <span>{msg.timestamp}</span>
                    <span>•</span>
                    <span className="uppercase tracking-widest text-[8px]">{isUser ? "Student" : "PulseAI ❤️"}</span>
                  </div>
                </div>

                {/* User Avatar Initial */}
                {isUser && (
                  <div className="w-7 h-7 shrink-0 rounded-lg bg-[#00FF88]/15 border border-[#00FF88]/30 flex items-center justify-center font-bold text-xs text-[#00FF88] uppercase">
                    Y
                  </div>
                )}
              </div>
            );
          })}

          {/* THREE-DOT REVISION THINKING INDICATOR */}
          {isThinking && (
            <div className="flex justify-start w-full items-start gap-2.5">
              <div className="w-7 h-7 shrink-0 rounded-lg bg-emerald-950/60 border border-emerald-900 flex items-center justify-center text-[#00FF88]">
                <Brain className="w-4 h-4 text-[#00FF88] animate-spin-slow" />
              </div>
              <div className="flex flex-col space-y-1 max-w-[70%]">
                <div className="p-3 bg-slate-900/40 border border-slate-900 rounded-xl rounded-tl-none flex items-center gap-2.5">
                  <span className="text-xs font-mono text-[#00FF88] animate-pulse">PulseAI is thinking ❤️</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-bounce" style={{ animationDelay: "0s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Anchor for auto scroll */}
          <div ref={messageEndRef} />
        </div>

        {/* 3. CHIPS AREA (Vapor/Cyber suggested prompts) */}
        {showChips && (
          <div className="px-4 py-3 bg-slate-950/95 border-t border-slate-900 select-none">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#00FF88]/80 mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Suggested Question Chips (Select to ask):</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSendMessage("Explain blood circulation step by step")}
                className="py-1 px-3 bg-slate-900 hover:bg-[#00FF88]/10 text-xs text-slate-300 hover:text-[#00FF88] border border-slate-800 hover:border-[#00FF88]/30 rounded-full cursor-pointer transition-all active:scale-95"
              >
                Explain blood circulation step by step
              </button>
              <button
                onClick={() => handleSendMessage("What is the SA node?")}
                className="py-1 px-3 bg-slate-900 hover:bg-[#00FF88]/10 text-xs text-slate-300 hover:text-[#00FF88] border border-slate-800 hover:border-[#00FF88]/30 rounded-full cursor-pointer transition-all active:scale-95"
              >
                What is the SA node?
              </button>
              <button
                onClick={() => handleSendMessage("What is tachycardia vs bradycardia?")}
                className="py-1 px-3 bg-slate-900 hover:bg-[#00FF88]/10 text-xs text-slate-300 hover:text-[#00FF88] border border-slate-800 hover:border-[#00FF88]/30 rounded-full cursor-pointer transition-all active:scale-95"
              >
                What is tachycardia vs bradycardia?
              </button>
              <button
                onClick={() => handleSendMessage("How does a pacemaker work?")}
                className="py-1 px-3 bg-slate-900 hover:bg-[#00FF88]/10 text-xs text-slate-300 hover:text-[#00FF88] border border-slate-800 hover:border-[#00FF88]/30 rounded-full cursor-pointer transition-all active:scale-95"
              >
                How does a pacemaker work?
              </button>
              <button
                onClick={() => handleSendMessage("Quiz me on heart anatomy")}
                className="py-1 px-3 bg-slate-900 hover:bg-[#00FF88]/10 text-xs text-slate-300 hover:text-[#00FF88] border border-slate-800 hover:border-[#00FF88]/30 rounded-full cursor-pointer transition-all active:scale-95"
              >
                Quiz me on heart anatomy
              </button>
              <button
                onClick={() => handleSendMessage("What causes a heart attack?")}
                className="py-1 px-3 bg-slate-900 hover:bg-[#00FF88]/10 text-xs text-slate-300 hover:text-[#00FF88] border border-slate-800 hover:border-[#00FF88]/30 rounded-full cursor-pointer transition-all active:scale-95"
              >
                What causes a heart attack?
              </button>
              <button
                onClick={() => handleSendMessage("What does an ECG measure?")}
                className="py-1 px-3 bg-slate-900 hover:bg-[#00FF88]/10 text-xs text-slate-300 hover:text-[#00FF88] border border-slate-800 hover:border-[#00FF88]/30 rounded-full cursor-pointer transition-all active:scale-95"
              >
                What does an ECG measure?
              </button>
              <button
                onClick={() => handleSendMessage("What are the four chambers?")}
                className="py-1 px-3 bg-slate-900 hover:bg-[#00FF88]/10 text-xs text-slate-300 hover:text-[#00FF88] border border-slate-800 hover:border-[#00FF88]/30 rounded-full cursor-pointer transition-all active:scale-95"
              >
                What are the four chambers?
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 4. INTERACTIVE MESSAGE WRITER PANEL */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 flex items-center gap-2.5">
        <button
          onClick={handleClearHistory}
          className="p-2.5 bg-slate-900 hover:bg-red-950/20 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-950/40 rounded-lg cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
          title="Reset chat to start over"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-mono font-bold">Clear Chat</span>
        </button>

        <div className="relative flex-1 flex items-center animate-fade-in">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isThinking) handleSendMessage();
            }}
            disabled={isThinking}
            placeholder="Ask PulseAI anything about the heart..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg text-xs md:text-sm py-2.5 pl-4 pr-12 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00FF88]/60 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isThinking || !chatInput.trim()}
            className="absolute right-2 p-1.5 bg-[#00FF88]/15 hover:bg-[#00FF88]/25 disabled:bg-slate-900 text-[#00FF88] disabled:text-slate-600 rounded-md border border-[#00FF88]/30 disabled:border-transparent transition-all cursor-pointer disabled:cursor-not-allowed focus:outline-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer clinical support text label */}
      <div className="shrink-0 flex items-center justify-between text-[10px] text-slate-500 font-mono px-2 py-1">
        <span>BIYLI CLINICAL INTELLIGENCE MODULE v2.0</span>
        <span className="flex items-center gap-1 text-slate-550 leading-none">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500 inline-block align-middle" />
          Note: PulseAI is an academic helper tutor and does not provide medical advice.
        </span>
      </div>

    </div>
  );
}
