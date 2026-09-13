// Real Mom Mode: Conversation Analyzer, Diarization & Mom Logic Engine
class RealMomEngine {
  constructor() {
    this.activeTopic = "Going Out";
    this.startTime = null;
    this.durationSeconds = 0;
    this.timerInterval = null;
    this.speakerTimes = { YOU: 0, MOM: 0 };
    this.interruptions = 0;
    this.topicChanges = 0;
    this.momAnger = 40;
    this.youAnger = 25;
    this.history = [];
    this.escalationPoints = [];
    this.lastSpeaker = null;
    this.lastSpeakerTime = null;
  }

  start(topic = "Going Out") {
    this.activeTopic = topic;
    this.startTime = Date.now();
    this.durationSeconds = 0;
    this.speakerTimes = { YOU: 0, MOM: 0 };
    this.interruptions = 0;
    this.topicChanges = 0;
    this.momAnger = 40;
    this.youAnger = 25;
    this.history = [];
    this.escalationPoints = [];
    this.lastSpeaker = null;
    this.lastSpeakerTime = null;

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.durationSeconds++;
    }, 1000);
  }

  stop() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  addTurn(speaker, text) {
    const raw = text.trim();
    if (!raw) return null;
    const lower = raw.toLowerCase();
    const now = Date.now();

    // Check interruption
    let isInterruption = false;
    if (this.lastSpeaker && this.lastSpeaker !== speaker && this.lastSpeakerTime) {
      const timeSinceLast = (now - this.lastSpeakerTime) / 1000;
      if (timeSinceLast < 2.0 && raw.length > 5) {
        this.interruptions++;
        isInterruption = true;
      }
    }
    this.lastSpeaker = speaker;
    this.lastSpeakerTime = now;

    // Estimate speaking duration based on word count (avg 130 words/min = ~2.2 words/sec)
    const words = raw.split(/\s+/).length;
    const estimatedSeconds = Math.max(2, Math.round(words / 2.2));
    this.speakerTimes[speaker] += estimatedSeconds;

    // 1. Analyze Back-Answering
    const backAnswer = window.aiScoringEngine ? window.aiScoringEngine.checkBackAnswering(raw) : { detected: false, triggers: [], riskScore: 0 };

    // 2. Analyze Historical Crimes
    const matchedCrime = window.crimesDB ? window.crimesDB.matchCrime(raw) : null;

    // 3. Mom Logic Patterns Detection
    const momLogic = this.detectMomLogic(speaker, lower);

    // 4. Topic Deflection check
    let topicDeflection = false;
    if (speaker === "MOM") {
      if (/\b(clean|room|mess|study|phone|curfew|dishes|bath|lazy)\b/i.test(lower) && !this.activeTopic.toLowerCase().includes("room") && !this.activeTopic.toLowerCase().includes("clean")) {
        topicDeflection = true;
        this.topicChanges++;
      }
    }

    // 5. Update Anger Levels
    const prevMomAnger = this.momAnger;
    const prevYouAnger = this.youAnger;

    if (speaker === "YOU") {
      if (backAnswer.detected) {
        this.momAnger = Math.min(100, this.momAnger + 18);
        this.youAnger = Math.min(100, this.youAnger + 8);
      } else if (/\b(sorry|apologize|calm|understand|okay|fine)\b/i.test(lower)) {
        this.momAnger = Math.max(15, this.momAnger - 12);
        this.youAnger = Math.max(10, this.youAnger - 10);
      } else if (/\b(but|why|not fair|everyone)\b/i.test(lower)) {
        this.momAnger = Math.min(100, this.momAnger + 12);
        this.youAnger = Math.min(100, this.youAnger + 10);
      } else {
        this.momAnger = Math.min(100, this.momAnger + 4);
      }
    } else {
      // Mom Speaking
      if (momLogic.detected) {
        this.momAnger = Math.min(100, this.momAnger + 8);
        this.youAnger = Math.min(100, this.youAnger + 15); // Mom logic spikes user frustration
      } else if (matchedCrime) {
        this.momAnger = Math.min(100, this.momAnger + 15);
        this.youAnger = Math.min(100, this.youAnger + 18);
      } else {
        this.momAnger = Math.min(100, this.momAnger + 3);
      }
    }

    // Check for dramatic Escalation Point
    const momDelta = this.momAnger - prevMomAnger;
    if (momDelta >= 12) {
      this.escalationPoints.push({
        turnIndex: this.history.length + 1,
        speaker,
        text: raw,
        delta: momDelta,
        momAnger: this.momAnger,
        reason: backAnswer.detected ? `Back-answering trigger: "${backAnswer.triggers[0].phrase}"` : "Rapid emotional escalation"
      });
    }

    const turnData = {
      id: Date.now(),
      turnIndex: this.history.length + 1,
      speaker,
      text: raw,
      words,
      estimatedSeconds,
      isInterruption,
      backAnswer,
      matchedCrime,
      momLogic,
      topicDeflection,
      momAnger: this.momAnger,
      youAnger: this.youAnger,
      timestamp: this.getFormattedTime()
    };

    this.history.push(turnData);
    return turnData;
  }

  // Detect distinct maternal rhetorical patterns
  detectMomLogic(speaker, lower) {
    if (speaker !== "MOM") return { detected: false };

    // 1. Universal Well-Jumping Fallacy
    if (/jump.*(well|bridge|cliff)|well.*jump|if everyone|everyone else/i.test(lower)) {
      return {
        detected: true,
        type: "well_jump",
        title: "🌀 UNIVERSAL WELL-JUMPING FALLACY",
        badge: "COMPARISON AXIOM",
        desc: "'If everyone jumps into a well, will you also jump?'",
        counterEffectiveness: "0%"
      };
    }

    // 2. Supreme Authority Override ("Because I Said So")
    if (/because i said so|paranjathukondu|my house|i am your mother|as long as you live/i.test(lower)) {
      return {
        detected: true,
        type: "authority_override",
        title: "🚨 SUPREME AUTHORITY OVERRIDE DETECTED",
        badge: "AUTHORITY: ∞",
        desc: "Article 1 Protocol: 'Because I Said So.' All active laws of physics suspended.",
        counterEffectiveness: "0%"
      };
    }

    // 3. Comparison With Other Children (Sharma ji's son / cousins)
    if (/sharma|rohan|rahul|cousin|look at him|look at her|other children|at your age/i.test(lower)) {
      return {
        detected: true,
        type: "peer_comparison",
        title: "📊 COMPARATIVE PEER SUPERIORITY INDEX",
        badge: "SHARMA JI EFFECT",
        desc: "External specimen invoked as statistically flawless human entity.",
        counterEffectiveness: "1.2%"
      };
    }

    // 4. Relativistic Time Dilation (Phone = All Day)
    if (/(24 hours|whole day|all day|all night|morning to night).*phone|phone.*(all day|hours|24)/i.test(lower)) {
      return {
        detected: true,
        type: "time_dilation",
        title: "⏳ RELATIVISTIC TIME DILATION",
        badge: "TEMPORAL WARP",
        desc: "25 minutes of screen time mathematically rounded up to 14.5 hours.",
        counterEffectiveness: "0%"
      };
    }

    // 5. Cosmic Matrimonial Inevitability
    if (/marry|who will marry|future|ruined|destoyed|fate|bhagyam/i.test(lower)) {
      return {
        detected: true,
        type: "matrimonial_doom",
        title: "🔮 COSMIC MATRIMONIAL INEVITABILITY",
        badge: "FUTURE PROJECTION",
        desc: "Minor domestic transgression projected to total societal catastrophe.",
        counterEffectiveness: "0%"
      };
    }

    // 6. Father Escalation
    if (/father|papa|dad|wait till|let him come/i.test(lower)) {
      return {
        detected: true,
        type: "father_escalation",
        title: "⚡ CASE DEFERRED TO SUPREME COURT (FATHER)",
        badge: "JUDICIAL ESCALATION",
        desc: "Mom transfers jurisdiction to higher patriarchal authority.",
        counterEffectiveness: "0%"
      };
    }

    return { detected: false };
  }

  getSpeakingPercentages() {
    const total = this.speakerTimes.YOU + this.speakerTimes.MOM;
    if (total === 0) return { you: 50, mom: 50 };
    const youPct = Math.round((this.speakerTimes.YOU / total) * 100);
    return { you: youPct, mom: 100 - youPct };
  }

  getFormattedTime() {
    const mins = Math.floor(this.durationSeconds / 60);
    const secs = this.durationSeconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  }

  // Calculate final Unnecessary Argument Scoreboard
  calculateFinalScore() {
    this.stop();
    const p = this.getSpeakingPercentages();
    const youTurns = this.history.filter(h => h.speaker === "YOU");
    const momTurns = this.history.filter(h => h.speaker === "MOM");

    const logicScore = Math.min(95, Math.max(40, 75 + Math.round(youTurns.length * 3) - Math.round(this.interruptions * 6)));
    const momLogicCount = this.history.filter(h => h.momLogic && h.momLogic.detected).length;
    const crimesCount = this.history.filter(h => h.matchedCrime).length;

    const report = {
      duration: this.getFormattedTime(),
      speakingTimes: p,
      interruptions: this.interruptions,
      topicChanges: this.topicChanges,
      momLogicCount,
      crimesCount,
      escalationPoints: this.escalationPoints,
      scores: {
        you: {
          logic: logicScore,
          evidence: Math.min(92, Math.max(35, 70 - Math.round(this.topicChanges * 5))),
          communication: Math.min(90, Math.max(30, 65 - (this.interruptions * 8))),
          emotionalControl: Math.max(15, 100 - this.youAnger),
          escalation: -(Math.round(this.youAnger * 0.4)),
          authority: 0
        },
        mom: {
          logic: Math.max(20, 60 - (momLogicCount * 8)),
          evidence: 91,
          authority: "∞",
          historicalEvidence: Math.min(99, 85 + (crimesCount * 6)),
          emotionalControl: Math.max(10, 100 - this.momAnger)
        }
      },
      verdict: {
        winner: "MOM",
        logicalWinner: "YOU",
        practicalWinner: "MOM",
        reason: "She is your mother. Supreme Constitutional Override applied.",
        quote: "“Argue all you want with your charts and logic. In this house, my word is the law.”"
      }
    };

    return report;
  }
}

window.realMomEngine = new RealMomEngine();
