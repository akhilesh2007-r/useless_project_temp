// AI Mom Core Engine: Persona System, Dynamic Memory, Counter-Logic & State Machine
class AIMomEngine {
  constructor() {
    this.personalities = {
      calm: {
        id: "calm",
        name: "🟢 Calm Mom",
        tag: "Patient & Disappointed",
        baseAnger: 25,
        baseSuspicion: 40,
        basePatience: 85,
        baseTrust: 60,
        escalationRate: 0.8,
        description: "Speaks softly, uses emotional guilt, gives you multiple chances before the heavy sigh."
      },
      suspicious: {
        id: "suspicious",
        name: "🟡 Suspicious Mom",
        tag: "FBI Interrogator Mode",
        baseAnger: 40,
        baseSuspicion: 85,
        basePatience: 45,
        baseTrust: 20,
        escalationRate: 1.2,
        description: "Cross-checks every timestamp. Assumes everything you say is a coordinated conspiracy."
      },
      strict: {
        id: "strict",
        name: "🟠 Strict Mom",
        tag: "Zero Tolerance Dictator",
        baseAnger: 50,
        baseSuspicion: 65,
        basePatience: 35,
        baseTrust: 30,
        escalationRate: 1.4,
        description: "Rules over explanations. 'Because I said so' is deployed within 2 turns."
      },
      angry: {
        id: "angry",
        name: "🔴 Angry Mom",
        tag: "Volcanic Eruption Imminent",
        baseAnger: 70,
        baseSuspicion: 75,
        basePatience: 15,
        baseTrust: 15,
        escalationRate: 1.8,
        description: "Starts at boiling point. Every word you utter is categorized as direct defiance."
      },
      logical: {
        id: "logical",
        name: "🧠 Logical Mom",
        tag: "Debate Champion & Math Auditor",
        baseAnger: 35,
        baseSuspicion: 70,
        basePatience: 60,
        baseTrust: 45,
        escalationRate: 1.0,
        description: "Challenges your flawed reasoning with Sharma ji's son statistics and budget audits."
      },
      boss: {
        id: "boss",
        name: "💀 Final Boss Mom",
        tag: "Maximum Threat Level 99",
        baseAnger: 75,
        baseSuspicion: 90,
        basePatience: 10,
        baseTrust: 5,
        escalationRate: 2.2,
        description: "Recalls sins from 2018. Airborne slipper primed. May God have mercy on your soul."
      }
    };

    this.activePersonality = "strict";
    this.state = {
      anger: 50,
      suspicion: 60,
      patience: 40,
      trust: 30,
      topicRisk: 50,
      backAnsweringRisk: 0,
      momLogicChain: 0
    };

    this.conversationMemory = [];
    this.detectedClaims = [];
    this.currentSituation = null;
  }

  // Initialize a new battle session
  initSession(personalityKey = "strict", situationData = null) {
    this.activePersonality = personalityKey;
    const p = this.personalities[personalityKey] || this.personalities["strict"];
    
    this.state = {
      anger: p.baseAnger,
      suspicion: p.baseSuspicion,
      patience: p.basePatience,
      trust: p.baseTrust,
      topicRisk: 50,
      backAnsweringRisk: 10,
      momLogicChain: 0
    };

    this.conversationMemory = [];
    this.detectedClaims = [];
    this.currentSituation = situationData;

    return {
      personality: p,
      state: { ...this.state },
      openingLine: situationData.openingPrompt
    };
  }

  // Process user turn and generate dynamic Mom response
  processUserTurn(userText) {
    const raw = userText.trim();
    const lower = raw.toLowerCase();

    // 1. Analyze Strategy & Back Answering
    const strategy = window.aiScoringEngine ? window.aiScoringEngine.detectStrategy(raw) : { type: "logical", label: "Logical" };
    const backAnswerCheck = window.aiScoringEngine ? window.aiScoringEngine.checkBackAnswering(raw) : { detected: false, triggers: [], riskScore: 0 };
    
    // 2. Check Historical Crimes DB
    const matchedCrime = window.crimesDB ? window.crimesDB.matchCrime(raw) : null;

    // 3. Memory Extraction: Store claims to weaponize later
    this.extractAndStoreClaims(raw);

    // 4. Update Mom Internal State
    this.updateMomState(strategy, backAnswerCheck, matchedCrime, raw);

    // 5. Check Contradiction in previous claims
    const contradiction = this.findContradiction(raw);

    // 6. Formulate Procedural Mom Response
    const responseData = this.generateResponse({
      userText: raw,
      strategy,
      backAnswerCheck,
      matchedCrime,
      contradiction
    });

    // 7. Record Turn to Memory
    this.conversationMemory.push({
      speaker: "YOU",
      text: raw,
      strategy: strategy.type,
      stateSnapshot: { ...this.state }
    });

    this.conversationMemory.push({
      speaker: "MOM",
      text: responseData.text,
      logicCategory: responseData.logicCategory,
      stateSnapshot: { ...this.state }
    });

    return {
      reply: responseData.text,
      logicCategory: responseData.logicCategory,
      strategy,
      backAnswerCheck,
      matchedCrime,
      contradiction,
      state: { ...this.state },
      isGameOver: this.checkIfGameOver()
    };
  }

  // Extract key promises, excuses, and mentions
  extractAndStoreClaims(text) {
    const lower = text.toLowerCase();
    const turnIndex = this.conversationMemory.filter(m => m.speaker === "YOU").length + 1;

    if (/\b(battery|phone died|switched off|no charge|0%)\b/i.test(lower)) {
      this.detectedClaims.push({ type: "phone_dead", turn: turnIndex, claim: "phone was dead" });
    }
    if (/\b(studying|library|class|notes|assignment|exam)\b/i.test(lower)) {
      this.detectedClaims.push({ type: "studying", turn: turnIndex, claim: "was studying" });
    }
    if (/\b(traffic|jam|bus|flat tyre|puncture|rain)\b/i.test(lower)) {
      this.detectedClaims.push({ type: "traffic", turn: turnIndex, claim: "stuck in traffic" });
    }
    if (/\b(friend|rohan|rahul|sneha|priya|group)\b/i.test(lower)) {
      this.detectedClaims.push({ type: "friend", turn: turnIndex, claim: "with friends" });
    }
    if (/\b(5 minutes|five minutes|half an hour|soon)\b/i.test(lower)) {
      this.detectedClaims.push({ type: "time_promise", turn: turnIndex, claim: "promised 5 minutes" });
    }
  }

  // Find contradiction with previous claims
  findContradiction(currentText) {
    const lower = currentText.toLowerCase();

    // Contradiction 1: Said phone was dead, but now mentions calling / checking messages
    const phoneClaim = this.detectedClaims.find(c => c.type === "phone_dead");
    if (phoneClaim && /\b(called|texted|saw message|whatsapp|checked phone|google|map)\b/i.test(lower)) {
      return {
        type: "phone_paradox",
        pastClaim: "phone battery was completely dead",
        currentText: currentText,
        turn: phoneClaim.turn
      };
    }

    // Contradiction 2: Said was studying, now mentions movies / food / cafe
    const studyClaim = this.detectedClaims.find(c => c.type === "studying");
    if (studyClaim && /\b(cafe|burger|pizza|mall|movie|theatre|bunked|chill)\b/i.test(lower)) {
      return {
        type: "study_paradox",
        pastClaim: "you were doing serious academic study",
        currentText: currentText,
        turn: studyClaim.turn
      };
    }

    return null;
  }

  // Update Mom's State based on psychological heuristics
  updateMomState(strategy, backAnswerCheck, matchedCrime, raw) {
    const p = this.personalities[this.activePersonality] || this.personalities["strict"];
    const multiplier = p.escalationRate;

    // Strategy impacts
    if (strategy.type === "reckless") {
      this.state.anger = Math.min(100, this.state.anger + Math.round(18 * multiplier));
      this.state.patience = Math.max(0, this.state.patience - 20);
      this.state.trust = Math.max(0, this.state.trust - 15);
      this.state.backAnsweringRisk = Math.min(100, this.state.backAnsweringRisk + 35);
    } else if (strategy.type === "calm") {
      this.state.anger = Math.max(10, this.state.anger - 12);
      this.state.patience = Math.min(100, this.state.patience + 10);
      this.state.trust = Math.min(100, this.state.trust + 10);
      this.state.backAnsweringRisk = Math.max(5, this.state.backAnsweringRisk - 15);
    } else if (strategy.type === "negotiation") {
      this.state.anger = Math.max(15, this.state.anger - 6);
      this.state.suspicion = Math.min(100, this.state.suspicion + 5); // Mom suspects hidden motive
      this.state.trust = Math.min(100, this.state.trust + 8);
    } else if (strategy.type === "logical") {
      // Logic often annoys mom if tone is dry
      this.state.anger = Math.min(100, this.state.anger + Math.round(6 * multiplier));
      this.state.suspicion = Math.min(100, this.state.suspicion + 8);
    } else if (strategy.type === "escape") {
      this.state.suspicion = Math.min(100, this.state.suspicion + 16);
      this.state.anger = Math.min(100, this.state.anger + 4);
    }

    // Back-answering penalty
    if (backAnswerCheck.detected) {
      this.state.anger = Math.min(100, this.state.anger + 14);
      this.state.backAnsweringRisk = Math.min(100, this.state.backAnsweringRisk + backAnswerCheck.riskScore);
      this.state.momLogicChain += 1;
    }

    // Historical crime recalled penalty
    if (matchedCrime) {
      this.state.anger = Math.min(100, this.state.anger + 12);
      this.state.suspicion = Math.min(100, this.state.suspicion + 20);
      this.state.momLogicChain += 1;
    }

    // Caps / loud typing penalty
    if (raw.length > 5 && raw === raw.toUpperCase() && /[A-Z]/.test(raw)) {
      this.state.anger = Math.min(100, this.state.anger + 20);
      this.state.backAnsweringRisk = 99;
    }
  }

  // Response Generator: Contextual, Dynamic, and Culturally Devastating
  generateResponse(context) {
    const { userText, strategy, backAnswerCheck, matchedCrime, contradiction } = context;
    const pKey = this.activePersonality;

    // Case 1: Contradiction Detected (Peak Mom Interrogation)
    if (contradiction) {
      this.state.momLogicChain += 1;
      if (contradiction.type === "phone_paradox") {
        return {
          text: `WAIT! In Turn ${contradiction.turn}, you dramatically swore your phone battery was dead at 0%! Now you're casually saying you sent a message?! Are you running a power generator in your pocket?! Liar!`,
          logicCategory: "Forensic Contradiction Ambush"
        };
      }
      if (contradiction.type === "study_paradox") {
        return {
          text: `Aha! You said you were at the library with textbooks, now suddenly there were burgers and friends involved?! Was this an exam preparation or a food festival?!`,
          logicCategory: "Academic Fraud Exposure"
        };
      }
    }

    // Case 2: Historical Crime Matched
    if (matchedCrime) {
      return {
        text: `Don't even try to excuse yourself! Just like in ${matchedCrime.year}, when you ${matchedCrime.crime.toLowerCase()}! You think I forgot?! A mother NEVER forgets!`,
        logicCategory: "Historical Precedent Retaliation"
      };
    }

    // Case 3: Back-Answering Triggered
    if (backAnswerCheck.detected) {
      const topTrigger = backAnswerCheck.triggers[0].phrase;
      if (topTrigger === "everyone else" || topTrigger === "everyone does it") {
        return {
          text: `If everyone else jumps into an empty well, will you also put on your sneakers and jump with them?! Tell me! Will you jump?!`,
          logicCategory: "Universal Hydraulic Well-Jump Fallacy"
        };
      }
      if (topTrigger === "chill" || topTrigger === "calm down") {
        return {
          text: `CHILL?! Did you just tell your mother to CHILL?! My blood pressure is 240 and you are ordering me like ice cream?! Watch your mouth!`,
          logicCategory: "Thermodynamic Maternal Explosion"
        };
      }
      if (topTrigger === "not fair") {
        return {
          text: `Not fair?! I spent nine months carrying you and twenty years cooking your meals, and you are giving me a lecture on United Nations human rights?!`,
          logicCategory: "Historical Maternity Guilt Override"
        };
      }
      if (topTrigger === "i know") {
        return {
          text: `If you knew everything, why are we standing here in this disaster?! Knowing everything but applying zero percentage!`,
          logicCategory: "Epistemological Paradox Trap"
        };
      }
    }

    // Case 4: High Anger (> 85%) Airborne Slipper Mode
    if (this.state.anger >= 85) {
      const furiousLines = [
        "KEEP TALKING! Every single sentence is digging your grave deeper! Where is the respect?! Just wait till your father steps inside this house!",
        "I am not listening to one more word! The chappal is in my hand. One more syllable and you will see stars in broad daylight!",
        "Because I said so! That is the law in this house! As long as you eat our food and sleep under our ceiling, you will follow my rules!"
      ];
      return {
        text: furiousLines[Math.floor(Math.random() * furiousLines.length)],
        logicCategory: "Circular Supreme Authority Protocol"
      };
    }

    // Case 5: Negotiation
    if (strategy.type === "negotiation") {
      const negLines = [
        "Promises, promises. You promised the same thing during Diwali and look what happened. Give me collateral first.",
        "You will clean the room AND wash the dishes? Fine, but your phone stays locked in my wardrobe until tomorrow evening.",
        "A compromise? In my house? Since when did we become a democratic parliament?! But go on, tell me what you'll sacrifice."
      ];
      return {
        text: negLines[Math.floor(Math.random() * negLines.length)],
        logicCategory: "High-Collateral Conditional Acceptance"
      };
    }

    // Case 6: Calm / Apology
    if (strategy.type === "calm") {
      const calmLines = [
        "Saying 'sorry' takes two seconds, but who will fix the headache you gave me for three hours? Sit down.",
        "At least you admit you were wrong. But don't think saying sorry wipes the slate clean. You are still grounded for the weekend.",
        "Okay. I hear your apology. Now put the phone down, drink some water, and show me that your brain has actually absorbed this lesson."
      ];
      return {
        text: calmLines[Math.floor(Math.random() * calmLines.length)],
        logicCategory: "De-escalation with Lingering Suspicion"
      };
    }

    // Case 7: Escape / Diversion
    if (strategy.type === "escape") {
      return {
        text: "Do NOT change the subject to dinner or tea! Look at my eyes when I am speaking to you! The food can wait, your accountability cannot!",
        logicCategory: "Anti-Evasion Gravitational Pull"
      };
    }

    // Case 8: Logical / General Arguments (Tailored by Personality)
    if (pKey === "suspicious") {
      return {
        text: `Your story has three missing time gaps. Who called you at 10:15? Show me your WhatsApp call log right now. Unlock it with your thumb.`,
        logicCategory: "Forensic Digital Interrogation"
      };
    } else if (pKey === "logical") {
      return {
        text: `Sharma ji's son also has exams. He also has friends. Why does he not have drama? What mathematical formula are you using to justify this?`,
        logicCategory: "Comparative Peer Superiority Index"
      };
    } else if (pKey === "calm") {
      return {
        text: `Beta, I am not angry, I am just disappointed. We work so hard so that you can have a comfortable life, and this is how you repay us?`,
        logicCategory: "Maximum Emotional Guilt Radiation"
      };
    } else {
      return {
        text: `Excuses! Reams and reams of excuses! When it comes to excuses you can write a PhD thesis, but when it comes to following simple rules your brain shuts down!`,
        logicCategory: "General Incompetence Accusation"
      };
    }
  }

  // Determine if simulation reached end criteria
  checkIfGameOver() {
    if (this.state.anger >= 95) return { over: true, reason: "critical_anger" };
    if (this.state.patience <= 0) return { over: true, reason: "patience_zero" };
    if (this.conversationMemory.filter(m => m.speaker === "YOU").length >= 8) {
      return { over: true, reason: "max_turns" };
    }
    return { over: false };
  }
}

window.aiMomEngine = new AIMomEngine();
