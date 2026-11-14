import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();
const app = express();
const port = process.env.PORT || 10000;
const origins = (process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:5174,http://localhost:5175").split(",").map(x => x.trim()).filter(Boolean);
app.use(cors({ origin(origin, callback) {
  if (!origin || origins.includes(origin)) return callback(null, true);
  return callback(new Error("Origin is not allowed by CORS"));
}}));
app.use(express.json());

const pool = process.env.DATABASE_URL ? new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
}) : null;

app.get("/health", (_req, res) => res.json({ status: "ok", service: "MOZAICO API" }));

app.get("/api/trips", async (_req, res) => {
  if (!pool) return res.status(503).json({ error: "Database is not configured yet." });
  try {
    const result = await pool.query("SELECT id, origin, destination, departure_time, fare_kes, seats_total FROM trips WHERE departure_time > NOW() ORDER BY departure_time LIMIT 100");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load trips." });
  }
});

// Development placeholder only. Add authentication, permissions, transaction-based
// seat locking and verified payment processing before allowing real bookings.
app.post("/api/bookings", async (req, res) => {
  const { trip_id, passenger_name, passenger_phone, seat_number } = req.body || {};
  if (!trip_id || !passenger_name || !passenger_phone || !seat_number)
    return res.status(400).json({ error: "trip_id, passenger_name, passenger_phone and seat_number are required." });
  if (!pool) return res.status(503).json({ error: "Database is not configured yet." });
  try {
    const result = await pool.query(
      "INSERT INTO bookings (trip_id, passenger_name, passenger_phone, seat_number, status) VALUES ($1,$2,$3,$4,'pending') RETURNING id,status,created_at",
      [trip_id, passenger_name, passenger_phone, seat_number]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Booking could not be created. Check trip and database setup." });
  }
});

app.listen(port, () => console.log(`MOZAICO API listening on ${port}`));
