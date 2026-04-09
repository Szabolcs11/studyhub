import { pool } from "./mysql";

export const likeQuerries = {
  async insertLike(id: number, userId: number): Promise<boolean> {
    const [result] = await pool.query("INSERT INTO note_likes (NoteId, UserId) VALUES (?, ?)", [id, userId]);
    return (result as any).affectedRows > 0;
  },
  async deleteLike(id: number, userId: number): Promise<boolean> {
    const [result] = await pool.query("DELETE FROM note_likes WHERE NoteId = ? AND UserId = ?", [id, userId]);
    return (result as any).affectedRows > 0;
  },
  async findLike(id: number, userId: number): Promise<boolean> {
    const [rows] = await pool.query("SELECT * FROM note_likes WHERE NoteId = ? AND UserId = ?", [id, userId]);
    return (rows as any[]).length > 0;
  },
};
