// Real Mom Charts: Live Dual Anger Graph & Recurring Arguments Chart
class RealMomCharts {
  constructor() {}

  // Render continuous live dual anger graph on HTML5 Canvas
  drawDualAnger(canvas, history) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background grid & labels
    const padding = { top: 25, bottom: 30, left: 40, right: 25 };
    const graphW = width - padding.left - padding.right;
    const graphH = height - padding.top - padding.bottom;

    // Draw Y-axis guide lines (0, 25, 50, 75, 100)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
    ctx.font = "10px JetBrains Mono, monospace";

    [0, 25, 50, 75, 100].forEach(val => {
      const y = padding.top + graphH - (val / 100 * graphH);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillText(`${val}%`, 8, y + 3);
    });

    if (!history || history.length === 0) {
      // Empty state placeholder
      ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
      ctx.font = "12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Awaiting conversation turns to plot live anger curves...", width / 2, height / 2);
      ctx.textAlign = "left";
      return;
    }

    // Prepare data points (prepend start baseline at index 0)
    const pointsMom = [{ turn: 0, anger: 40 }];
    const pointsYou = [{ turn: 0, anger: 25 }];

    history.forEach((h, idx) => {
      pointsMom.push({ turn: idx + 1, anger: h.momAnger, reason: h.backAnswer?.detected });
      pointsYou.push({ turn: idx + 1, anger: h.youAnger });
    });

    const totalPoints = pointsMom.length;
    const getX = (idx) => padding.left + (idx / Math.max(1, totalPoints - 1)) * graphW;
    const getY = (val) => padding.top + graphH - (Math.min(100, Math.max(0, val)) / 100 * graphH);

    // 1. Draw You Anger Curve (Cyan)
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    pointsYou.forEach((pt, i) => {
      const x = getX(i);
      const y = getY(pt.anger);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 2. Draw Mom Anger Curve (Crimson with glow)
    ctx.shadowColor = "rgba(255, 51, 102, 0.5)";
    ctx.shadowBlur = 8;
    ctx.strokeStyle = "#ff3366";
    ctx.lineWidth = 3;
    ctx.beginPath();
    pointsMom.forEach((pt, i) => {
      const x = getX(i);
      const y = getY(pt.anger);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset

    // 3. Draw Points & Escalation Markers
    pointsMom.forEach((pt, i) => {
      if (i === 0) return;
      const x = getX(i);
      const y = getY(pt.anger);

      ctx.fillStyle = pt.anger >= 75 ? "#ef4444" : "#ff3366";
      ctx.beginPath();
      ctx.arc(x, y, pt.anger >= 80 ? 6 : 4, 0, Math.PI * 2);
      ctx.fill();

      // Escalation Warning Ring if anger jumped
      if (pt.anger >= 75) {
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // 4. Legend
    ctx.font = "11px Inter, sans-serif";
    ctx.fillStyle = "#ff3366";
    ctx.fillText("● Mom Anger", padding.left + 10, 16);
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("● Your Anger", padding.left + 100, 16);
  }

  // Render Recurring Arguments Bar Chart
  drawRecurringArguments(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const data = [
      { topic: "Phone usage & Screen Time", pct: 42, count: 184 },
      { topic: "Going Outside / Curfew", pct: 28, count: 122 },
      { topic: "Room Cleanliness & Biohazards", pct: 16, count: 70 },
      { topic: "Sleep Schedule (Waking Up Late)", pct: 10, count: 44 },
      { topic: "Food & 'Not Eating Properly'", pct: 4, count: 18 }
    ];

    el.innerHTML = `
      <div style="font-family: var(--font-display); font-size: 1.05rem; font-weight: 800; color: white; margin-bottom: 0.85rem;">
        📂 TOP RECURRING DOMESTIC DISPUTES
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.65rem;">
        ${data.map(d => `
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-family: var(--font-mono); color: #cbd5e1; margin-bottom: 3px;">
              <span>${d.topic}</span>
              <span style="color: var(--mom-accent); font-weight: 700;">${d.pct}% (${d.count} times)</span>
            </div>
            <div style="height: 7px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;">
              <div style="width: ${d.pct * 2.3}%; height: 100%; background: linear-gradient(90deg, #ff3366, #ff758c); border-radius: 4px;"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

window.realMomCharts = new RealMomCharts();
