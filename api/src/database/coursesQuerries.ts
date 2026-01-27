import { Faculty } from "./../types/";
import { pool } from "./mysql";

export const coursesQuerry = {
  async getAll(): Promise<Faculty[]> {
    const [rows] = await pool.query("SELECT * FROM faculties");
    return rows as Faculty[];
  },

  async getById(id: number): Promise<Faculty | null> {
    const [rows] = await pool.query("SELECT * FROM courses WHERE id = ?", [id]);
    const result = rows as Faculty[];
    return result.length > 0 ? result[0] : null;
  },

  async getWhereFacultyId(id: number): Promise<Faculty[] | null> {
    const [rows] = await pool.query("SELECT * FROM courses WHERE FacultyId = ?", [id]);
    return rows as Faculty[];
  },
};
