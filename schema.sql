CREATE TABLE IF NOT EXISTS trips (
  id BIGSERIAL PRIMARY KEY,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_time TIMESTAMPTZ NOT NULL,
  fare_kes NUMERIC(10,2) NOT NULL CHECK (fare_kes >= 0),
  seats_total INTEGER NOT NULL CHECK (seats_total > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  trip_id BIGINT NOT NULL REFERENCES trips(id),
  passenger_name TEXT NOT NULL,
  passenger_phone TEXT NOT NULL,
  seat_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trips_departure_time ON trips(departure_time);
CREATE INDEX IF NOT EXISTS idx_bookings_trip_id ON bookings(trip_id);

-- Production must add a seat map, uniqueness constraints/locking, user accounts,
-- roles, audit history, and carefully designed payment reconciliation.
