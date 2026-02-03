export const QUERIES = {
  streetSweepingTableExists:
    `
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'street_sweeping'
      );
    `,

  checkRowCount: `SELECT COUNT(*) FROM street_sweeping`,

  insertStreetSweeping:
  `
    INSERT INTO street_sweeping
      (corridor, fullname, weekday, cnn, cnnrightleft, blocksweepid,
       blockside, limits, fromhour, tohour, holidays,
       week1, week2, week3, week4, week5, geom)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
       ST_GeomFromText($17, 4326))
  `,

  insertMetaData:
  `
  INSERT INTO data_metadata
    (dataset_name, last_updated, record_count)
  VALUES
    ($1, NOW(), $2)
  `,

  getSweepingSchedulesByCoordinates:
  `WITH point AS (
  SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326) as car
),
offset_calc AS (
  SELECT
    corridor,
    blockside,
    limits,
    fullname,
    weekday,
    fromhour,
    tohour,
    geom as centerline,
    ST_Azimuth(ST_StartPoint(geom), ST_EndPoint(geom)) as street_bearing,
    CASE
      WHEN blockside IN ('NorthEast', 'North', 'East') THEN pi()/2
      WHEN blockside IN ('SouthWest', 'South', 'West') THEN -pi()/2
      WHEN blockside = 'SouthEast' THEN
        CASE
          WHEN degrees(ST_Azimuth(ST_StartPoint(geom), ST_EndPoint(geom))) BETWEEN 0 AND 180
          THEN pi()/2 ELSE -pi()/2
        END
      WHEN blockside = 'NorthWest' THEN
        CASE
          WHEN degrees(ST_Azimuth(ST_StartPoint(geom), ST_EndPoint(geom))) BETWEEN 0 AND 180
          THEN -pi()/2 ELSE pi()/2
        END
      ELSE 0
    END as offset_direction
  FROM street_sweeping, point p
  WHERE ST_DWithin(geom::geography, p.car::geography, $4)
),
sidewalk_line AS (
  SELECT
    *,
    ST_MakeLine(
      ST_Project(ST_StartPoint(centerline)::geography, $3::double precision, street_bearing + offset_direction)::geometry,
      ST_Project(ST_EndPoint(centerline)::geography, $3::double precision, street_bearing + offset_direction)::geometry
    ) as sidewalk_line
  FROM offset_calc
)
SELECT
  corridor,
  limits,
  blockside,
  fullname || ' ' || fromhour || ':00-' || tohour || ':00' as schedule,
  sidewalk_line,
  ST_Distance(sidewalk_line::geography, (SELECT car FROM point)::geography) as distance_meters
FROM sidewalk_line
ORDER BY distance_meters
LIMIT 8;`,
// $1 = longitude, $2 = latitude, $3 = esitmated street width / 2, $4 = accuracy radius + estimated street width / 2
//probably want to reformat this to send the full week1 week2, weekday, holiday, etc, and handle some of that calculation on the server.
}
