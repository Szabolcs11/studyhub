import { Faculty } from "./../types/";
import { pool } from "./mysql";

export const facultyQuerry = {
  async getAll(): Promise<Faculty[]> {
    const [rows] = await pool.query("SELECT * FROM faculties");
    return rows as Faculty[];
  },

  async getById(id: number): Promise<Faculty | null> {
    const [rows] = await pool.query("SELECT * FROM faculties WHERE id = ?", [id]);
    const result = rows as Faculty[];
    return result.length > 0 ? result[0] : null;
  },

  async getWhereUniversityId(id: number): Promise<Faculty[] | null> {
    const [rows] = await pool.query("SELECT * FROM faculties WHERE UniversityId = ?", [id]);
    return rows as Faculty[];
  },
};
