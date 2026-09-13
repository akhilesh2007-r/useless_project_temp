// Training Feedback Loop: AI Simulator vs Real World Comparator
class RealFeedbackLoop {
  constructor() {
    this.profileKey = "mom_argument_profile";
  }

  // Compare AI Simulator Profile with Real Argument Results
  compareSimulationWithReality(realReport) {
    const aiProfile = window.aiScoringEngine ? window.aiScoringEngine.loadProfile() : null;

    // AI Baselines (or defaults if user hasn't trained yet)
    const aiCompleted = aiProfile ? aiProfile.simulationsCompleted : 0;
    const aiAvgScore = aiProfile ? aiProfile.averageSurvivalScore || 62 : 62;
    const aiSurvRate = aiProfile && aiProfile.simulationsCompleted > 0 
      ? Math.round((aiProfile.totalSurvived / aiProfile.simulationsCompleted) * 100) 
      : 55;
    const aiBackAnswerRate = aiProfile && aiProfile.simulationsCompleted > 0 
      ? Math.round((aiProfile.totalSlippered / aiProfile.simulationsCompleted) * 35) 
      : 24;

    // Real World Results
    const realAngerHandling = Math.max(15, Math.round(100 - (window.realMomEngine ? window.realMomEngine.momAnger : 75)));
    const realSurvival = realReport.scores.you.logic > 70 && realAngerHandling > 40 ? 45 : 18;
    const realBackAnswerCount = window.realMomEngine ? window.realMomEngine.history.filter(h => h.backAnswer && h.backAnswer.detected).length : 2;
    const realBackAnswerRate = Math.min(95, Math.round((realBackAnswerCount / Math.max(1, window.realMomEngine.history.length)) * 100));

    // Training Transfer Effectiveness Formula
    // Measures how well simulation resilience transferred to high-stakes reality
    const diffAnger = realAngerHandling - aiAvgScore;
    const diffBack = aiBackAnswerRate - realBackAnswerRate;
    let transferEffectiveness = Math.round(55 + (diffAnger * 0.3) + (diffBack * 0.2));
    transferEffectiveness = Math.min(92, Math.max(22, transferEffectiveness));

    // Diagnosed Weaknesses & Strengths
    const weaknesses = [];
    const strengths = [];

    if (window.realMomEngine && window.realMomEngine.interruptions >= 2) {
      weaknesses.push("❌ You interrupt frequently when feeling cornered");
    } else {
      strengths.push("✓ Maintained conversational patience without interrupting");
    }

    if (realBackAnswerRate >= 30) {
      weaknesses.push("❌ Reflexive back-answering triggers maternal fury ('I know', 'Everyone else')");
    } else {
      strengths.push("✓ Kept back-answering risk contained below critical threshold");
    }

    if (window.realMomEngine && window.realMomEngine.topicChanges >= 2) {
      weaknesses.push("❌ Vulnerable to maternal topic deflection (drifted into room cleanliness/past sins)");
    }

    if (realReport.scores.you.logic >= 75) {
      strengths.push("✓ High logical structure and structured evidence presentation");
    }

    if (weaknesses.length === 0) {
      weaknesses.push("❌ Becoming defensive when maternal logic defies laws of physics");
    }

    // Feed diagnosed weaknesses back into localStorage for future AI Mom scenarios
    this.feedWeaknessesBackToAI(weaknesses);

    return {
      aiCompleted,
      metrics: {
        aiAvgScore,
        realAngerHandling,
        aiSurvRate,
        realSurvival,
        aiBackAnswerRate,
        realBackAnswerRate
      },
      transferEffectiveness,
      weaknesses,
      strengths,
      verdictText: transferEffectiveness > 65
        ? "TRAINING EFFECTIVE: Your AI simulation practice noticeably buffered you from total obliteration."
        : "SIMULATION GAP DETECTED: Real Mom presence caused complete collapse of simulated composure."
    };
  }

  // Feed diagnosed weaknesses into AI Simulator Profile
  feedWeaknessesBackToAI(weaknesses) {
    try {
      const saved = localStorage.getItem(this.profileKey);
      const profile = saved ? JSON.parse(saved) : {};
      profile.realWorldWeaknesses = weaknesses;
      profile.lastRealTestDate = new Date().toISOString();
      localStorage.setItem(this.profileKey, JSON.stringify(profile));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }
}

window.realFeedbackLoop = new RealFeedbackLoop();
