// Type definitions for the SF Parking App

// TODO: Define request/response types
export interface CheckParkingRequest {
  latitude: number;
  longitude: number;
  bufferMeters?: number;
}

export interface CheckParkingResponse {
  latitude: number;
  longitude: number;
  restrictions: ParkingRestriction[];
  parkingAllowed: boolean;
  checkedAt: string;
  dataLastUpdated?: string;
}

export interface ParkingRestriction {
  type: string;
  street: string;
  weekday?: string;
  fromTime?: string;
  toTime?: string;
  schedule?: string;
  distance: number;
}

// TODO: Add database row types
export interface StreetSweepingRow {
  id: number;
  corridor?: string;
  streetname?: string;
  weekday?: string;
  fromhour?: string;
  tohour?: string;
  // Add more fields as needed
}

// TODO: Add GeoJSON types if needed
export interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'LineString';
    coordinates: number[][];
  };
  properties: FeatureProperties;
}

export interface FeatureProperties {
  corridor: string;
  week3: string;
  week5: string;
  cnnrightleft: string;
  cnn: string;
  week2: string;
  holidays: string;
  fullname: string;
  blockside: string;
  week1: string;
  fromhour: string;
  weekday: string;
  tohour: string;
  blocksweepid: string;
  week4: string;
  limits: string;
}