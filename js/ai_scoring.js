// AI Mom Scoring Engine, Strategy Classifier & Personal Profile
class AIScoringEngine {
  constructor() {
    this.profileKey = "mom_argument_profile";
    this.forbiddenPhrases = [
      { phrase: "i know", weight: 28, alert: "Universal Maternal Trigger ('If you knew, why did you do it?!')" },
      { phrase: "everyone else", weight: 35, alert: "Sharma Ji Comparison Inevitability Triggered" },
      { phrase: "everyone does it", weight: 35, alert: "Well-Jumping Protocol Activated" },
      { phrase: "not fair", weight: 30, alert: "Fairness Fallacy Detected in Maternal Jurisdiction" },
      { phrase: "you always", weight: 32, alert: "Dangerous Generalization Attack" },
      { phrase: "you never", weight: 32, alert: "Severe Back-Answering Spike" },
      { phrase: "why can't i", weight: 25, alert: "Direct Insubordination Query" },
      { phrase: "chill", weight: 45, alert: "FATAL ERROR: Advised Indian Mother to 'Chill'" },
      { phrase: "calm down", weight: 50, alert: "NUCLEAR EVENT: Attempted to tell Mom to 'Calm down'" },
      { phrase: "it's not a big deal", weight: 40, alert: "Minimizing Maternal Crisis: Maximum Penalty" },
      { phrase: "leave me alone", weight: 35, alert: "Isolationist Insubordination" },
      { phrase: "whatever", weight: 40, alert: "Disrespect Coefficient Critical" },
      { phrase: "already told you", weight: 30, alert: "Impatience Towards Mother Detected" }
    ];
  }

  // Classify user strategy for a turn
  detectStrategy(text) {
    const lower = text.toLowerCase();

    // 1. Reckless / Defiant
    if (/\b(chill|calm down|not fair|everyone|you always|you never|whatever|leave me|why can't i|so what|don't care)\b/i.test(lower)) {
      return {
        type: "reckless",
        label: "💀 Reckless / Defiant",
        desc: "Directly challenging maternal authority. Slipper trajectory approaching supersonic.",
        danger: 85
      };
    }

    // 2. Negotiation / Compromise
    if (/\b(promise|deal|instead|compromise|next time|if i clean|if i study|i will do|half an hour|tomorrow)\b/i.test(lower)) {
      return {
        type: "negotiation",
        label: "🙏 Negotiation / Compromise",
        desc: "Offering practical concessions. Temporarily stalls airborne projectile.",
        danger: 25
      };
    }

    // 3. Calm / Submissive
    if (/\b(sorry|my mistake|my fault|apologize|you are right|i understand|won't happen again|shavama|maaf)\b/i.test(lower)) {
      return {
        type: "calm",
        label: "😌 Calm / Submissive",
        desc: "Accepting complete responsibility. The only statistically viable survival tactic.",
        danger: 10
      };
    }

    // 4. Escape / Topic Change
    if (/\b(tea|chai|food|eat|dinner|hungry|father|papa|dad|market|groceries|headache|tired)\b/i.test(lower)) {
      return {
        type: "escape",
        label: "🏃 Escape / Diversion",
        desc: "Attempting diversionary tactical maneuver using domestic duties or snacks.",
        danger: 40
      };
    }

    // 5. Logical / Rational Evidence
    return {
      type: "logical",
      label: "🧠 Logical Reasoning",
      desc: "Attempting logic in an Indian household. Highly risky; facts have no legal jurisdiction here.",
      danger: 60
    };
  }

  // Check for forbidden back-answering phrases
  checkBackAnswering(text) {
    const lower = text.toLowerCase();
    let detectedTriggers = [];
    let riskScore = 0;

    for (const item of this.forbiddenPhrases) {
      if (lower.includes(item.phrase)) {
        detectedTriggers.push(item);
        riskScore += item.weight;
      }
    }

    return {
      detected: detectedTriggers.length > 0,
      triggers: detectedTriggers,
      riskScore: Math.min(100, riskScore)
    };
  }

  // Calculate final argument scorecard
  calculateScore(sessionData) {
    const { turns, finalState, strategiesUsed, mistakesMade, situation } = sessionData;

    // Turn counts
    const totalTurns = turns.length;
    const apologies = strategiesUsed.filter(s => s === "calm").length;
    const negotiations = strategiesUsed.filter(s => s === "negotiation").length;
    const recklessCount = strategiesUsed.filter(s => s === "reckless").length;
    const logicCount = strategiesUsed.filter(s => s === "logical").length;

    // Sub-scores
    const logicalReasoning = Math.max(10, Math.min(95, 75 + (logicCount * 4) - (recklessCount * 12)));
    const emotionalControl = Math.max(5, Math.min(95, 80 - (recklessCount * 22) + (apologies * 8)));
    const deEscalation = Math.max(5, Math.min(95, 30 + (apologies * 18) + (negotiations * 12) - (recklessCount * 15)));
    const momResistance = Math.min(99, Math.max(70, finalState.anger + 15));
    const evidenceQuality = Math.max(10, Math.min(90, 60 + (logicCount * 5) - (finalState.suspicion * 0.4)));

    // Final Survival Score
    let finalScore = Math.round((deEscalation * 0.4) + (emotionalControl * 0.3) + (logicalReasoning * 0.2) + (evidenceQuality * 0.1));
    if (finalState.anger >= 90) finalScore = Math.min(finalScore, 35);
    if (recklessCount >= 2) finalScore = Math.min(finalScore, 40);

    // Determine Ending Verdict
    let verdict = {};
    if (finalState.anger >= 92 || recklessCount >= 3) {
      verdict = {
        title: "💀 COMPLETE MATERNAL ESCALATION",
        badge: "SLIPPER AIRBORNE",
        color: "#ef4444",
        summary: "You argued with the speed of sound and the wisdom of a potato. The chappal broke the sound barrier.",
        quote: "“Keep talking. Let your father come home today. Just wait.”"
      };
    } else if (finalState.anger >= 78) {
      verdict = {
        title: "⚡ 'WAIT TILL YOUR FATHER COMES HOME'",
        badge: "CASE DEFERRED TO HIGHER COURT",
        color: "#f59e0b",
        summary: "Mom has escalated your file to the Supreme Court (Dad). You have approximately 4 hours to write your will.",
        quote: "“I am done talking to you. Ask your father if this is allowed.”"
      };
    } else if (negotiations >= 2 && finalState.anger < 60) {
      verdict = {
        title: "🤝 CONDITIONAL NEGOTIATED SETTLEMENT",
        badge: "SURVIVED WITH PENALTIES",
        color: "#38bdf8",
        summary: "You successfully negotiated! In exchange, you will wash dishes, study 6 hours daily, and surrender your phone at 9 PM.",
        quote: "“Fine. But if I see one mess in this house, everything is cancelled.”"
      };
    } else if (apologies >= 2 && finalState.anger < 45) {
      verdict = {
        title: "🏆 PYRRHIC SURVIVAL (VICTORY)",
        badge: "MOM DE-ESCALATED",
        color: "#10b981",
        summary: "You survived! You didn't 'win'—no mortal wins—but you de-escalated Mom before physical projectiles were launched.",
        quote: "“At least you have the sense to apologize. Now go and study.”"
      };
    } else {
      verdict = {
        title: "😐 EXHAUSTION STALEMATE",
        badge: "MUTUALLY ASSURED SIGH",
        color: "#a855f7",
        summary: "Mom walked away shaking her head while mumbling about her fate and blood pressure.",
        quote: "“Do whatever you want. Why should I even care anymore?”"
      };
    }

    const report = {
      scores: {
        logicalReasoning,
        emotionalControl,
        deEscalation,
        momResistance,
        evidenceQuality,
        finalScore
      },
      verdict,
      stats: {
        totalTurns,
        recklessCount,
        negotiations,
        apologies,
        finalAnger: finalState.anger,
        finalSuspicion: finalState.suspicion
      },
      mistakes: mistakesMade.slice(0, 4)
    };

    this.updateProfile(report, strategiesUsed);
    return report;
  }

  // Load Personal Argument Profile from localStorage
  loadProfile() {
    try {
      const saved = localStorage.getItem(this.profileKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return {
      simulationsCompleted: 0,
      totalSurvived: 0,
      totalSlippered: 0,
      strategyCounts: { logical: 0, negotiation: 0, calm: 0, escape: 0, reckless: 0 },
      dangerousPhrasesTriggered: {},
      averageSurvivalScore: 0
    };
  }

  // Update profile with new simulation findings
  updateProfile(report, strategiesUsed) {
    const profile = this.loadProfile();
    profile.simulationsCompleted += 1;

    if (report.scores.finalScore >= 55) profile.totalSurvived += 1;
    if (report.stats.finalAnger >= 85) profile.totalSlippered += 1;

    strategiesUsed.forEach(s => {
      if (profile.strategyCounts[s] !== undefined) profile.strategyCounts[s] += 1;
    });

    profile.averageSurvivalScore = Math.round(
      ((profile.averageSurvivalScore * (profile.simulationsCompleted - 1)) + report.scores.finalScore) / profile.simulationsCompleted
    );

    // Save back
    try {
      localStorage.setItem(this.profileKey, JSON.stringify(profile));
    } catch (e) {}

    return profile;
  }
}

window.aiScoringEngine = new AIScoringEngine();
