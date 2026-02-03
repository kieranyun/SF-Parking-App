import { pool } from './connection';
import fs from 'fs/promises';
import path from 'path';
import { QUERIES } from './queries';

export async function runMigration(filename: string): Promise<void> {
  const client = await pool.connect();

  try {
    const sqlPath = path.join(__dirname, '../../migrations', filename);
    const sql = await fs.readFile(sqlPath, 'utf-8');
    await client.query(sql);
    console.log(`Migration ${filename} completed`);
  } finally {
    client.release();
  }
}

//just calls the sql script in '001_initial_setup.sql'
export async function initializeDatabase(): Promise<void> {
  await runMigration('001_initial_setup.sql');
}

//Returns true if the street_sweeping table DOES NOT exist
export async function needsInitialization(): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query(QUERIES.streetSweepingTableExists);
    return !result.rows[0].exists;
  } catch(error) {
    console.error('error checking initialization, ', error);
    return true;
  } finally {
    client.release();
  }
}