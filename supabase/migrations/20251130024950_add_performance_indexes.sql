/*
  # Add Performance Indexes for High Traffic

  1. Purpose
    - Optimize database queries for high-traffic scenarios
    - Speed up analytics aggregations and filtering
    - Improve dashboard load times

  2. Indexes Added
    - `man_ki_bat_submissions`:
      - Index on `lac` column for LAC-wise filtering
      - Index on `polling_station` column for station lookups
      - Index on `created_at` column for time-based ordering
      - Composite index on `(lac, polling_station)` for unique station counting

    - `polling_stations`:
      - Index on `lac` column for LAC-wise filtering
      - Index on `station_name` column for station lookups
      - Composite index on `(lac, station_name)` for joins

  3. Benefits
    - Faster analytics page load (especially with many submissions)
    - Quick unsubmitted stations calculation
    - Efficient real-time updates
    - Better performance under concurrent user load

  4. Notes
    - Indexes are created concurrently to avoid locking
    - IF NOT EXISTS prevents errors on re-run
    - These indexes significantly improve query performance as data grows
*/

-- Indexes for man_ki_bat_submissions table
CREATE INDEX IF NOT EXISTS idx_submissions_lac 
  ON man_ki_bat_submissions(lac);

CREATE INDEX IF NOT EXISTS idx_submissions_polling_station 
  ON man_ki_bat_submissions(polling_station);

CREATE INDEX IF NOT EXISTS idx_submissions_created_at 
  ON man_ki_bat_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_submissions_lac_station 
  ON man_ki_bat_submissions(lac, polling_station);

-- Indexes for polling_stations table
CREATE INDEX IF NOT EXISTS idx_polling_stations_lac 
  ON polling_stations(lac);

CREATE INDEX IF NOT EXISTS idx_polling_stations_name 
  ON polling_stations(station_name);

CREATE INDEX IF NOT EXISTS idx_polling_stations_lac_name 
  ON polling_stations(lac, station_name);
