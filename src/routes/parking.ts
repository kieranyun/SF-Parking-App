import { Router } from 'express';
import { findRestrictionsNearPoint } from '../services/parkingService';

export const parkingRouter = Router();

// TODO: Implement POST /api/check-parking endpoint
parkingRouter.post('/check-parking', async (req, res) => {
  try {
    const { latitude, longitude, bufferMeters } = req.body;

    // TODO: Validate input
    // - Check that latitude and longitude are numbers
    // - Check that coordinates are within SF bounds
    //   (roughly lat: 37.7-37.85, lon: -122.55 to -122.35)

    // TODO: Call findRestrictionsNearPoint service

    // TODO: Return response with:
    // - latitude, longitude
    // - restrictions array
    // - parkingAllowed boolean (true if no restrictions)
    // - checkedAt timestamp

    res.json({
      // TODO: Add response data
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// TODO: Implement POST /api/reload-data endpoint
parkingRouter.post('/reload-data', async (req, res) => {
  try {
    // TODO: Call loadStreetSweepingData
    // TODO: Return success response with count
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// TODO: (Optional) Implement GET /api/stats endpoint
parkingRouter.get('/stats', async (req, res) => {
  try {
    // TODO: Get statistics from database:
    // - Total segments
    // - Unique streets
    // - Breakdown by weekday
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});