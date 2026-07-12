// CalculationRepository -- save/fetch calculations from SQLite
import { getDatabase } from '@wiringcode/local-db';
import { calculateVoltageDrop, VoltageDropResult } from '@wiringcode/calculators';

export interface CalculationRecord {
  id: string;
  type: string;
  input_json: string;
  result_json: string;
  version: number;
  created_at: string;
  updated_at: string;
  job_id: string | null;
}

export interface VoltageDropInputData {
  phase: 1 | 3;
  voltage: number;
  material: string;
  wireSize: string;
  distance: number;
  current: number;
}

export class CalculationRepository {
  async save(input: VoltageDropInputData, result: VoltageDropResult, type: string = 'voltageDrop', jobId: string | null = null): Promise<string> {
    const db = getDatabase();
    const id = String(Date.now());
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO calculations (id, type, input_json, result_json, version, created_at, updated_at, job_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, type, JSON.stringify(input), JSON.stringify(result), 1, now, now, jobId]
    );

    return id;
  }

  async getAll(): Promise<CalculationRecord[]> {
    const db = getDatabase();
    return db.getAllAsync<CalculationRecord>(
      'SELECT * FROM calculations ORDER BY created_at DESC'
    ) as Promise<CalculationRecord[]>;
  }

  async getByJobId(jobId: string): Promise<CalculationRecord[]> {
    const db = getDatabase();
    return db.getAllAsync<CalculationRecord>(
      'SELECT * FROM calculations WHERE job_id = ? ORDER BY created_at DESC',
      [jobId]
    ) as Promise<CalculationRecord[]>;
  }

  async delete(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM calculations WHERE id = ?', [id]);
  }

  async count(): Promise<number> {
    const db = getDatabase();
    const row = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM calculations'
    );
    return row?.count ?? 0;
  }

  async clearAll(): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM calculations');
  }
}

export const calculationRepository = new CalculationRepository();
