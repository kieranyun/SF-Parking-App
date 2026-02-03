import { pool } from '../db/connection';

export interface ParkingRestriction {
  type: string;
  street: string;
  weekday?: string;
  fromTime?: string;
  toTime?: string;
  schedule?: string;
  distance: number;
}

// TODO: Create a function to find parking restrictions near a coordinate
export async function findRestrictionsNearPoint(
  latitude: number,
  longitude: number,
  radiusMeters: number = 50
): Promise<ParkingRestriction[]> {
  const client = await pool.connect();

  try {
    // TODO: Write a PostGIS query to find nearby restrictions
    // You'll need to use:
    // - ST_MakePoint(longitude, latitude) to create a point
    // - ST_SetSRID(..., 4326) to set coordinate system
    // - ST_DWithin to find features within radius
    // - ST_Distance to calculate exact distance
    // - ORDER BY distance

    // TODO: Execute query and map results to ParkingRestriction objects

    return [];
  } finally {
    client.release();
  }
}

// TODO: Helper function to format schedule string
function formatSchedule(weekday?: string, fromTime?: string, toTime?: string): string {
  // TODO: Format as "Monday 8:00 AM-10:00 AM"
  return '';
}