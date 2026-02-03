import { pool } from '../db/connection';
import { QUERIES } from '../db/queries';
import { ParkingRestriction, CheckParkingRequest } from '../types';

const EST_STREET_WIDTH_METERS = 10.00;
const GPS_ACCURACY_RADIUS_METERS = 6.00;

// TODO: Create a function to find parking restrictions near a coordinate
export async function findRestrictionsNearPoint(CheckParkingRequest: CheckParkingRequest): Promise<ParkingRestriction[] | []> { //update type
  const client = await pool.connect();
  const {longitude, latitude} = CheckParkingRequest
  try {
    const qResult = await client.query(QUERIES.getSweepingSchedulesByCoordinates,[longitude, latitude, EST_STREET_WIDTH_METERS/2, (GPS_ACCURACY_RADIUS_METERS + (EST_STREET_WIDTH_METERS/2))])

    console.log(qResult.rows);

    const result: ParkingRestriction[] = qResult.rows.map(row => {
      return {
        type: 'street sweeping',
        street: row.corridor,
        crossStreets: row.limits, //cross streets
        blockside: row.blockside, //"East", "West", etc..
        restrictionDescription: row.schedule
      }
  })
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