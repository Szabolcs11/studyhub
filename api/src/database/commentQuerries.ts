import { pool } from "./mysql";

export const commentQuerries = {
  async getCommentsByNoteId(id: number): Promise<Comment[]> {
    const [rows] = await pool.query(
      "SELECT note_comments.id, note_comments.Text, note_comments.CreatedAt, users.id as UserId, users.Nickname as Username FROM note_comments JOIN users ON note_comments.UserId = users.id WHERE note_comments.NoteId = ? ORDER BY note_comments.CreatedAt DESC",
      [id],
    );
    const result = rows as Comment[];
    return result.length > 0 ? result : [];
  },

  async insertComment(noteId: number, userId: number, content: string): Promise<number> {
    const [result] = await pool.query("INSERT INTO note_comments (NoteId, UserId, Text) VALUES (?, ?, ?)", [
      noteId,
      userId,
      content,
    ]);
    return (result as any).insertId;
  },

  async getCommentById(id: number): Promise<Comment | null> {
    const [rows] = await pool.query(
      "SELECT note_comments.id, note_comments.Text, note_comments.CreatedAt, users.id as UserId, users.Nickname as Username FROM note_comments JOIN users ON note_comments.UserId = users.id WHERE note_comments.id = ?",
      [id],
    );
    const result = rows as Comment[];
    return result.length > 0 ? result[0] : null;
  },
};
