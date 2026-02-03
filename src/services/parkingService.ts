import { QueryResult } from 'pg';
import { pool } from '../db/connection';
import { QUERIES } from '../db/queries';

const EST_STREET_WIDTH_METERS = 10;
const GPS_ACCURACY_RADIUS_METERS = 6;

export interface ParkingRestriction {
  type: string;
  street: string;
  weekday?: string;
  fromTime?: string;
  toTime?: string;
  schedule?: string;
  distance: number;
}

// export interface CnnSide {
//   cnn: number;
//   side: 'L' | 'R';
// }

// export async function findCnnSidebyCoordinates(
//   latitude: number,
//   longitude: number,
//   radiusFt: number = 30 //TODO: determine accuracy of the GPS device
// ): Promise<CnnSide[]> {

// }

// TODO: Create a function to find parking restrictions near a coordinate
export async function findRestrictionsNearPoint(
  latitude: number,
  longitude: number
  ): Promise<QueryResult | []> { //update type
  const client = await pool.connect();

  try {
    const result = await client.query(QUERIES.getSweepingSchedulesByCoordinates,[longitude, latitude, EST_STREET_WIDTH_METERS/2, (GPS_ACCURACY_RADIUS_METERS + (EST_STREET_WIDTH_METERS/2))])

    console.log(result);
    return result;
  } catch (error) {
    console.error('error querying by coordinates', error)
    return [];
  } finally {
    client.release();
  }
}

// TODO: Helper function to format schedule string
// function formatSchedule(weekday?: string, fromTime?: string, toTime?: string): string {
//   // TODO: Format as "Monday 8:00 AM-10:00 AM"
//   return '';
// }