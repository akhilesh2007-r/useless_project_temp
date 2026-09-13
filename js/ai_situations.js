// AI Mom Mode: Random Real-World Situation Generator & Variable Combinator
class SituationGenerator {
  constructor() {
    this.baseSituations = [
      {
        id: "curfew",
        category: "Curfew & Freedom",
        title: "Came Home Past Curfew",
        base: "You arrived home 2.5 hours past your promised curfew",
        complications: [
          "Your phone was switched off the entire time",
          "Tomorrow is an 8:00 AM semester exam",
          "Your neighbor aunty spotted you laughing at the chai stall",
          "You smell suspiciously like cheap pizza and poor decisions"
        ],
        stakes: [
          "Your phone privileges are hanging by a thread",
          "Your dad has been sitting quietly on the sofa without TV",
          "Relatives are arriving tomorrow morning"
        ],
        openings: {
          calm: "Do you know what time it is right now? Sit down. Look at the clock.",
          suspicious: "2:30 AM? And your phone was dead? What a miraculous coincidence. Where were you?",
          strict: "Door was locked at 11. Why are you knocking at 1:30? Give me one valid reason.",
          angry: "WHOSE HOUSE DO YOU THINK THIS IS? A HOTEL?! ANSWER ME!",
          logical: "You had 4 hours to travel 5 kilometers. Walk me through every single minute.",
          boss: "Look who decided to grace us with their royal presence. Phone off. Gate locked. Exam tomorrow. Explain."
        }
      },
      {
        id: "marks",
        category: "Academic Catastrophe",
        title: "Unexpectedly Low Exam Marks",
        base: "You scored 71% in your midterm examination (Target was 95%)",
        complications: [
          "Your cousin Rohan scored 98.4% and got a scholarship",
          "You spent 6 hours playing games the night before",
          "The teacher explicitly wrote 'Lacks focus and distracted' on the paper",
          "You hid the report card inside an old textbook for 4 days"
        ],
        stakes: [
          "Mom already boasted about your intelligence to the WhatsApp family group",
          "Tuition master is coming to the house tomorrow",
          "Pocket money is officially under review"
        ],
        openings: {
          calm: "I found this paper under your mattress. 71%? Beta, is this the result of your 'night studies'?",
          suspicious: "Why did Rohan's mother call me congratulating Rohan before you even showed me your marks?",
          strict: "71% is not a passing grade in this household. Phone on the table. Right now.",
          angry: "DAY AND NIGHT ON THAT SCREAMING GLOWING SCREEN! IS THIS WHAT WE PAY LAKHS OF FEES FOR?!",
          logical: "Sharma ji's son studied 2 hours less than you and got 96%. Where did the remaining 25% evaporate?",
          boss: "71%. Your cousin got 98%. You hid the paper. And you bought chips yesterday. Start talking."
        }
      },
      {
        id: "phone",
        category: "Screen Time & Digital Sins",
        title: "Caught on Phone at 2:30 AM",
        base: "Mom caught you illuminated in bed like a radioactive ghost by your screen",
        complications: [
          "You claimed you were sleeping 45 minutes ago",
          "Blue light reflection was visible under the bedroom door",
          "You frantically threw the phone under your pillow when the door clicked",
          "You have school/college early morning"
        ],
        stakes: [
          "All home Wi-Fi passwords will be reset to Sanskrit mantras",
          "Threat of phone surrender until graduation",
          "Aunty WhatsApp network will be informed"
        ],
        openings: {
          calm: "Beta, what is so urgent in that little box at 2:45 in the morning?",
          suspicious: "Who were you smiling at? Why did your heart rate jump when I opened the door?",
          strict: "Give it to me. Unlocked. Right now. Both hands.",
          angry: "THIS PHONE IS DESTROYING YOUR BRAIN, YOUR EYES, YOUR LIFE, AND THIS ENTIRE FAMILY!",
          logical: "You said you had a severe headache and couldn't study at 8 PM. Did the headache cure at 2 AM?",
          boss: "Under the pillow? Really? That trick was invented in 2008. Hand it over before I throw it out the balcony."
        }
      },
      {
        id: "shopping",
        category: "Financial Recklessness",
        title: "Mysterious Delivery Parcel Arrived",
        base: "A large cardboard box arrived with COD (Cash on Delivery) while you were out",
        complications: [
          "Mom had to pay ₹2,499 from her grocery emergency cash",
          "It contains expensive aesthetic sneakers or useless anime figurines",
          "You claimed last week that you didn't have money for study materials",
          "Your bank account was already supposedly empty"
        ],
        stakes: [
          "Complete embargo on online shopping parcels",
          "Immediate audit of your last 6 months UPI transactions"
        ],
        openings: {
          calm: "The delivery uncle came. I paid 2,500 rupees. Open it in front of me.",
          suspicious: "You said you needed 500 rupees for college project books. Is this box full of books?",
          strict: "Whatever is inside this box goes back unless you give me a written explanation.",
          angry: "MONEY DOES NOT GROW ON THE MANGO TREE OUTSIDE! DO YOU THINK YOUR FATHER OWNS THE RESERVE BANK?!",
          logical: "Cost: 2,500. Utility: Zero. Bank balance: Twelve rupees. Explain the economic justification.",
          boss: "I paid for it. Which means it is my property now. Do you want to explain why I shouldn't donate it?"
        }
      },
      {
        id: "room_mess",
        category: "Domestic Crimes",
        title: "Room Declared Biohazard Zone",
        base: "Your bedroom has reached peak entropy with clothes, wet towels, and dishes",
        complications: [
          "There is a wet towel fermenting directly on the wooden mattress",
          "Two dirty chai cups with living microbial colonies found behind the laptop",
          "Guests are coming over in exactly 30 minutes",
          "You said 'I will clean it in 5 minutes' exactly 7 hours ago"
        ],
        stakes: [
          "Immediate public shaming in front of visiting guests",
          "All your unwashed clothes will be dumped onto your bed"
        ],
        openings: {
          calm: "Is this a bedroom or a municipal dump yard? Look at the floor.",
          suspicious: "Are you raising a new species of insect behind that desk? What is that green plate?",
          strict: "No food, no internet, no leaving this house until every single sock is in the basket.",
          angry: "I AM TIRED OF BEING A FREE MAID SERVANT IN MY OWN RESIDENCE! GET UP AND CLEAN THIS JUNGLE!",
          logical: "5 minutes you said at 11:00 AM. It is now 6:15 PM. Do your clocks run on Neptune time?",
          boss: "Guests ring the bell in 20 minutes. If one relative sees this room, you will be doing the dishes until 2030."
        }
      },
      {
        id: "stay_over",
        category: "Forbidden Social Expeditions",
        title: "Asking for a Weekend Night Out / Trip",
        base: "You need permission to go on a weekend road trip with friends",
        complications: [
          "You don't know the full names of three people going",
          "There is no clear hotel booking or verified adult supervision",
          "You haven't completed your pending chores or homework",
          "Last time you went out, you forgot to call for 14 hours"
        ],
        stakes: [
          "Complete grounding for the upcoming festival",
          "Mom calling every friend's parent to cross-verify"
        ],
        openings: {
          calm: "Going where? With who? Who gave you permission to even dream about this?",
          suspicious: "Who is driving? What does his father do? Give me his mother's phone number right now.",
          strict: "No. Absolutely not. Over my dead body.",
          angry: "YOU THINK YOU HAVE BECOME A BIG ADULT NOW?! LIVING ON VACATIONS WHILE SITTING ON OUR EXPENSES?!",
          logical: "You cannot wake up at 7 AM for college, but you can wake up at 4 AM for a road trip? Explain.",
          boss: "Trip? With whose money? Whose car? And who said yes? Did you ask the wall?"
        }
      }
    ];
  }

  generate(personality = "strict", customCategory = null) {
    let pool = this.baseSituations;
    if (customCategory) {
      pool = pool.filter(s => s.id === customCategory || s.category.toLowerCase().includes(customCategory.toLowerCase()));
      if (pool.length === 0) pool = this.baseSituations;
    }

    const base = pool[Math.floor(Math.random() * pool.length)];
    const comp1 = base.complications[Math.floor(Math.random() * base.complications.length)];
    let comp2 = base.complications[Math.floor(Math.random() * base.complications.length)];
    while (comp2 === comp1 && base.complications.length > 1) {
      comp2 = base.complications[Math.floor(Math.random() * base.complications.length)];
    }

    const stake = base.stakes[Math.floor(Math.random() * base.stakes.length)];
    const openingLine = base.openings[personality] || base.openings["strict"];

    return {
      id: base.id,
      title: base.title,
      category: base.category,
      description: `${base.base}. ${comp1}. Plus: ${comp2}.`,
      complication1: comp1,
      complication2: comp2,
      stake: stake,
      openingPrompt: openingLine,
      dangerRating: Math.floor(Math.random() * 25) + 75 // 75% to 99% initial risk
    };
  }

  getPresets() {
    return this.baseSituations.map(s => ({ id: s.id, title: s.title, category: s.category }));
  }
}

window.situationGenerator = new SituationGenerator();
