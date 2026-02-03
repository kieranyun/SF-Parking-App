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
  `
}