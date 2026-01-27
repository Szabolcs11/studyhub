import { University } from "./../types/";
import { pool } from "./mysql";

export const universitiesQuerry = {
  async getAll(): Promise<University[]> {
    const [rows] = await pool.query("SELECT * FROM universities");
    return rows as University[];
  },

  async getById(id: number): Promise<University | null> {
    const [rows] = await pool.query("SELECT * FROM universities WHERE id = ?", [id]);
    const result = rows as University[];
    return result.length > 0 ? result[0] : null;
  },
};
