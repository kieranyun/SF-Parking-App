import axios from 'axios';
import { pool } from './connection';
import { QUERIES } from './queries';

const SF_OPEN_DATA_URL = 'https://data.sfgov.org/resource/yhqp-riqs.geojson';

// TODO: Create a function to load street sweeping data from SF Open Data
export async function loadStreetSweepingData(): Promise<number> {
  const client = await pool.connect();

  try {
    console.log('Fetching data from SF Open Data...');

    // TODO: Fetch GeoJSON data from SF_OPEN_DATA_URL
    // Hint: Use axios.get with $limit parameter
    const headers: any = {};
    if (process.env.DATASF_APP_TOKEN) {
      headers['X-App-Token'] = process.env.DATASF_APP_TOKEN;
    }

    const results = await axios.get(SF_OPEN_DATA_URL, {
      params: {
        $limit: 50000, // 37878 rows as of 2/2/26
      },
      headers
    });

    const features = results.data.features;

    await client.query('BEGIN') //starts a db transaction
    

    // TODO: Clear existing data

    // TODO: Loop through features and insert into database
    // For each feature:
    //   - Extract properties
    //   - Convert GeoJSON LineString coordinates to WKT format
    //   - Insert into street_sweeping table using ST_GeomFromText

    // TODO: Update metadata table with last_updated timestamp

    // TODO: Commit transaction

    console.log('Data loaded successfully');
    return 0; // Return count of inserted records
  } catch (error) {
    // TODO: Rollback transaction on error
    console.error('Error loading data:', error);
    throw error;
  } finally {
    client.release();
  }
}

// TODO: Helper function to convert GeoJSON coordinates to WKT
function coordinatesToWKT(coordinates: number[][]): string {
  // TODO: Convert [[lon, lat], [lon, lat], ...] to "LINESTRING(lon lat, lon lat, ...)"
  return '';
}

export async function needsDataLoad(): Promise<boolean> {
  const client = await pool.connect();

  try {
    const result = await client.query(QUERIES.checkRowCount);
    const count = parseInt(result.rows[0].count);
    return count === 0;
  } catch (error) {
    console.error('Error checking data:', error);
    return true; // If error, assume we need data
  } finally {
    client.release();
  }
}