import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:10000";

function App() {
  const [health, setHealth] = useState("Checking API…");
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/health`).then(r => r.json())
      .then(data => setHealth(data.status === "ok" ? "Connected" : "API response received"))
      .catch(() => setHealth("Not connected yet"));
    fetch(`${API}/api/trips`).then(r => {
      if (!r.ok) throw new Error("Trips are not available yet");
      return r.json();
    }).then(setTrips).catch(err => setError(err.message));
  }, []);

  return <main>
    <header><div className="brand">MOZAICO <span>COACHES LIMITED</span></div><div className="status">API: {health}</div></header>
    <section className="hero">
      <p className="eyebrow">MANAGEMENT DASHBOARD STARTER</p>
      <h1>MOZAICO Control Centre</h1>
      <p>Manage trips, fleet, staff and company reports.</p>
    </section>
    <section className="panel">
      <h2>Upcoming trips</h2>
      {trips.length ? <div className="trips">{trips.map(t => <article key={t.id}>
        <strong>{t.origin} → {t.destination}</strong>
        <p>{new Date(t.departure_time).toLocaleString()}</p>
        <p>Fare: KES {Number(t.fare_kes).toLocaleString()}</p>
      </article>)}</div> : <p className="muted">{error || "No trips have been added yet. Configure the database and add trip records to begin."}</p>}
    </section>
    <footer>© {new Date().getFullYear()} MOZAICO COACHES LIMITED · Starter system</footer>
  </main>;
}
createRoot(document.getElementById("root")).render(<App />);
