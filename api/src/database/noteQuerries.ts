import { ResultSetHeader } from "mysql2";
import { Faculty, Note } from "./../types/";
import { pool } from "./mysql";

export const noteQuerry = {
  async getAll(): Promise<any[]> {
    const [rows] = await pool.query(`
    SELECT
      notes.Id,
      notes.Title,
      notes.UploaderUserId,
      notes.CourseId,
      users.Id   AS userId,
      users.Nickname AS userNickname,
      users.AvatarURL AS userAvatarURL,
      notes.CreatedAt,
      notes.AttachmentUrl,
      notes.Description
    FROM notes
    JOIN users ON users.Id = notes.UploaderUserId
    ORDER BY notes.CreatedAT DESC
  `);

    return (rows as any[]).map((row) => ({
      Id: row.Id,
      Title: row.Title,
      UploaderUserId: row.UploaderUserId,
      CreatedAt: row.CreatedAt,
      CourseId: row.CourseId,
      AttachmentUrl: row.AttachmentUrl,
      Description: row.Description,
      User: {
        Id: row.userId,
        Nickname: row.userNickname,
        AvatarURL: row.userAvatarURL,
      },
    }));
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
