// Boot sequence for SparkyWiz Mobile App
// Initializes SQLite via expo-sqlite, runs migrations, sets up database for local-db

import { setDatabase, SQLiteDatabase } from '@wiringcode/local-db';

let isBooted = false;

export async function bootApp(): Promise<void> {
  if (isBooted) return;

  // Production: expo-sqlite (install with: npx expo install expo-sqlite)
  // The driver natively matches the SQLiteDatabase interface (execAsync, runAsync, getAllAsync, getFirstAsync)
  const driver = await createExpoSQLiteDriver();
  setDatabase(driver);

  // Run migrations to create tables
  await driver.execAsync(`
    CREATE TABLE IF NOT EXISTS calculations (
      id TEXT PRIMARY KEY NOT NULL,
      type TEXT NOT NULL,
      input_json TEXT NOT NULL,
      result_json TEXT NOT NULL,
      version INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      job_id TEXT
    )
  `);

  await driver.execAsync(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      version INTEGER DEFAULT 1
    )
  `);

  isBooted = true;
}

async function createExpoSQLiteDriver(): Promise<SQLiteDatabase> {
  try {
    // Dynamic import so the app doesn't crash if expo-sqlite isn't installed yet
    const { openDatabaseAsync } = await import('expo-sqlite/next');
    const db = await openDatabaseAsync('sparkywiz.db');
    return db as SQLiteDatabase;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('expo-sqlite not installed. Run: npx expo install expo-sqlite', err);
    throw new Error('expo-sqlite is required. Install with: npx expo install expo-sqlite');
  }
}
