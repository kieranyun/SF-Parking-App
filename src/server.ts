import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { healthRouter } from './routes/health';
import { parkingRouter } from './routes/parking';
import { testConnection } from './db/connection';
import { initializeDatabase, needsInitialization } from './db/migrations';
import { needsDataLoad, loadStreetSweepingData } from './db/dataLoader';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/health', healthRouter);
app.use('/api', parkingRouter);

async function startServer() {
  try {
    // test db connection
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to database');
    }
    //Run migrations if needed
    if (await needsInitialization()) {
      console.log('Database needs initialization...');
      await initializeDatabase();
    } else {
      console.log('Database already initialized');
    }

    //Load initial data if database is empty
    if (await needsDataLoad()) {
      loadStreetSweepingData();
    } else {
      console.log('DB already populated, not loading fresh data from API')
    }


    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();