// Previous Crimes Database Management
class CrimesDB {
  constructor() {
    this.defaultCrimes = [
      { id: 1, year: 2018, crime: "Forgot to switch off fan", keywords: ["fan", "switch off", "electricity", "current", "bill"] },
      { id: 2, year: 2019, crime: "Left glass in sink without washing", keywords: ["glass", "sink", "dish", "wash", "kitchen", "cup"] },
      { id: 3, year: 2020, crime: "Didn't clean room (pigsty condition)", keywords: ["clean", "room", "mess", "dirty", "bed", "floor", "clothes"] },
      { id: 4, year: 2021, crime: "Used phone while studying", keywords: ["phone", "mobile", "study", "studying", "exam", "screen", "reels", "scroll"] },
      { id: 5, year: 2022, crime: "Came home late past curfew", keywords: ["late", "home", "night", "outside", "curfew", "time", "clock"] },
      { id: 6, year: 2023, crime: "Forgot to close bedroom door with AC on", keywords: ["door", "close", "ac", "cool", "insect", "mosquito", "bill"] },
      { id: 7, year: 2024, crime: "Left phone charger plugged into socket", keywords: ["charger", "plug", "plugged", "socket", "fire", "switch", "battery"] },
      { id: 8, year: 2025, crime: "Said '5 minutes' and took 45 minutes", keywords: ["5 minutes", "five minutes", "wait", "ready", "coming", "delay"] }
    ];

    this.crimes = this.loadCrimes();
  }

  loadCrimes() {
    try {
      const saved = localStorage.getItem("mom_crimes_db");
      return saved ? JSON.parse(saved) : [...this.defaultCrimes];
    } catch (e) {
      return [...this.defaultCrimes];
    }
  }

  saveCrimes() {
    try {
      localStorage.setItem("mom_crimes_db", JSON.stringify(this.crimes));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }

  addCrime(year, crimeText, customKeywords = "") {
    const kw = customKeywords
      ? customKeywords.split(",").map(k => k.trim().toLowerCase()).filter(Boolean)
      : crimeText.toLowerCase().split(/\s+/).filter(w => w.length > 3);

    const newEntry = {
      id: Date.now(),
      year: parseInt(year) || new Date().getFullYear(),
      crime: crimeText.trim(),
      keywords: kw
    };
    this.crimes.push(newEntry);
    this.saveCrimes();
    return newEntry;
  }

  deleteCrime(id) {
    this.crimes = this.crimes.filter(c => c.id !== id);
    this.saveCrimes();
  }

  resetToDefault() {
    this.crimes = [...this.defaultCrimes];
    this.saveCrimes();
  }

  // Match conversation text against historical database
  matchCrime(text) {
    if (!text) return null;
    const lower = text.toLowerCase();
    for (const entry of this.crimes) {
      for (const kw of entry.keywords) {
        if (lower.includes(kw)) {
          return entry;
        }
      }
    }
    return null;
  }
}

window.crimesDB = new CrimesDB();
