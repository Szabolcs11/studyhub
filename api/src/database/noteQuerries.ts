import { ResultSetHeader } from "mysql2";
import { Faculty, Note } from "./../types/";
import { pool } from "./mysql";

export const noteQuerry = {
  async getAll(): Promise<Faculty[]> {
    const [rows] = await pool.query("SELECT * FROM notes");
    return rows as Faculty[];
  },

  async getById(id: number): Promise<Faculty | null> {
    const [rows] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);
    const result = rows as Faculty[];
    return result.length > 0 ? result[0] : null;
  },

  async getNotesWhereCourseId(id: number): Promise<Note[] | null> {
    const [rows] = await pool.query("SELECT * FROM notes WHERE CourseId = ?", [id]);
    const result = rows as Note[];
    return result;
  },

  async deleteWhereId(id: number): Promise<boolean> {
    const [result] = await pool.query("DELETE FROM notes WHERE id = ?", [id]);

    const { affectedRows } = result as any;
    return affectedRows > 0;
  },

  async editWhereId(id: number, title: string, attachmentUrl: string, description: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE notes
     SET Title = ?,
         AttachmentUrl = ?,
         Description = ?,
         LastEdited = NOW()
     WHERE Id = ?`,
      [title, attachmentUrl, description, id],
    );

    return result.affectedRows > 0;
  },

  async create(
    title: string,
    attachmentUrl: string,
    description: string,
    userId: number,
    courseId: number,
  ): Promise<number> {
    console.log(title, attachmentUrl, description, userId, courseId);

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO notes (Title, AttachmentUrl, Description, CourseId, UploaderUserId)
        VALUES (?, ?, ?, ?, ?)`,
      [title, attachmentUrl, description, courseId, userId],
    );

    return result.insertId;
  },
};
