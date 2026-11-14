import { statusSteps } from "../data";

const PRIORITIES = ["High", "Medium", "Low"];

function countBy(list, getKey) {
  const counts = new Map();
  for (const item of list) {
    const key = getKey(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

function lastSevenDays(complaints) {
  const zone = "Asia/Kolkata";
  const counts = countBy(complaints, (c) =>
    new Date(c.createdAt).toLocaleDateString("en-CA", { timeZone: zone })
  );
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    const key = date.toLocaleDateString("en-CA", { timeZone: zone });
    days.push({
      label: date.toLocaleDateString("en-IN", { weekday: "short", timeZone: zone }),
      value: counts.get(key) || 0,
    });
  }
  return days;
}

function BarGroup({ title, rows, total }) {
  return (
    <div className="chart-card">
      <h3>{title}</h3>
      {rows.length === 0 && <p className="hint">No data yet.</p>}
      {rows.map((row) => (
        <div className="bar-row" key={row.label}>
          <div className="bar-label">
            <span>{row.label}</span>
            <b>{row.value}</b>
          </div>
          <div className="bar-track">
            <div
              className={`bar-fill ${row.tone || ""}`}
              style={{ width: total ? `${(row.value / total) * 100}%` : "0%" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Charts({ complaints }) {
  const total = complaints.length;
  const byStatus = countBy(complaints, (c) => c.status);
  const byPriority = countBy(complaints, (c) => c.priority);
  const byCategory = countBy(complaints, (c) => c.category);

  const statusRows = statusSteps.map((s) => ({
    label: s,
    value: byStatus.get(s) || 0,
  }));
  const priorityRows = PRIORITIES.map((p) => ({
    label: p,
    value: byPriority.get(p) || 0,
    tone: `tone-${p.toLowerCase()}`,
  }));
  const categoryRows = [...byCategory.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value]) => ({ label, value }));

  const days = lastSevenDays(complaints);
  const maxDay = Math.max(1, ...days.map((d) => d.value));

  return (
    <div className="charts-grid">
      <BarGroup title="By status" rows={statusRows} total={total} />
      <BarGroup title="By priority" rows={priorityRows} total={total} />
      <BarGroup title="Top categories" rows={categoryRows} total={total} />

      <div className="chart-card">
        <h3>Last 7 days</h3>
        <div className="column-chart">
          {days.map((d, i) => (
            <div className="column" key={i}>
              <span className="column-value">{d.value}</span>
              <div className="column-track">
                <div
                  className="column-bar"
                  style={{ height: `${(d.value / maxDay) * 100}%` }}
                />
              </div>
              <span className="column-label">{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}