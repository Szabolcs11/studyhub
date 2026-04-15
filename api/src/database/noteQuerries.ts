import { ResultSetHeader } from "mysql2";
import { Faculty, Note } from "./../types/";
import { pool } from "./mysql";
import { facultyQuerry } from "./facultyQueries";
import { coursesQuerry } from "./coursesQuerries";

export const noteQuerry = {
  async getAll(userId: number): Promise<any[]> {
    const [rows] = await pool.query(
      `
    SELECT
    notes.Id,
    notes.Title,
    notes.UploaderUserId,
    notes.CourseId,
    users.Id AS userId,
    users.Nickname AS userNickname,
    users.AvatarURL AS userAvatarURL,
    notes.CreatedAt,
    notes.AttachmentUrl,
    notes.Description,

    COALESCE(c.CommentCount, 0) AS CommentCount

FROM notes
JOIN users ON users.Id = notes.UploaderUserId

-- comment count
LEFT JOIN (
    SELECT NoteId, COUNT(*) AS CommentCount
    FROM note_comments
    GROUP BY NoteId
) c ON c.NoteId = notes.Id

ORDER BY notes.CreatedAt DESC;
  `,
    );

    await Promise.all(
      (rows as any[]).map(async (note: any) => {
        const course = await coursesQuerry.getById(note.CourseId);
        note.course = course;

        const faculty = await facultyQuerry.getById(note.course.FacultyId);
        note.faculty = faculty;

        const likeCount = await this.likesCount(note.Id);
        note.LikeCount = likeCount;
        const liked = await this.isLikedByUser(note.Id, userId);
        note.Liked = liked;
      }),
    );

    const data = (rows as any[]).map((row) => ({
      Id: row.Id,
      Title: row.Title,
      UploaderUserId: row.UploaderUserId,
      CreatedAt: row.CreatedAt,
      CourseId: row.CourseId,
      AttachmentUrl: row.AttachmentUrl,
      Description: row.Description,
      CommentCount: row.CommentCount,
      LikeCount: row.LikeCount,
      Liked: row.Liked,
      User: {
        Id: row.userId,
        Nickname: row.userNickname,
        AvatarURL: row.userAvatarURL,
      },
      Course: row.course,
      Faculty: row.faculty,
    }));

    return data;
  },

  async getById(id: number, userId: number): Promise<Faculty | null> {
    const [rows] = await pool.query(
      `
  SELECT 
    notes.*,

    (SELECT COUNT(*) 
     FROM note_likes 
     WHERE note_likes.NoteId = notes.Id) AS LikeCount,

    CASE 
      WHEN EXISTS (
        SELECT 1 
        FROM note_likes 
        WHERE note_likes.NoteId = notes.Id 
          AND note_likes.UserId = ?
      ) THEN TRUE
      ELSE FALSE
    END AS Liked

  FROM notes  
  WHERE notes.Id = ?
  `,
      [userId, id],
    );
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

  async likesCount(noteId: number): Promise<number> {
    const [rows] = await pool.query(`SELECT COUNT(*) AS LikeCount FROM note_likes WHERE NoteId = ?`, [noteId]);
    const likeCount = (rows as any)[0].LikeCount;
    return likeCount;
  },

  async isLikedByUser(noteId: number, userId: number): Promise<boolean> {
    const [rows] = await pool.query(`SELECT 1 FROM note_likes WHERE NoteId = ? AND UserId = ?`, [noteId, userId]);
    return (rows as any).length > 0;
  },
};
