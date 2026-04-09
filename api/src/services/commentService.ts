import { commentQuerries } from "../database/commentQuerries";
import { userQueries } from "../database/userQueries";

export const commentService = {
  async getNoteComments(id: number) {
    return await commentQuerries.getCommentsByNoteId(id);
  },
  async createComment(noteId: number, token: string, content: string) {
    const user = await userQueries.findByToken(token);
    if (!user) throw new Error("Invalid_Cookie");
    return await commentQuerries.insertComment(noteId, user.Id, content);
  },
  async getCommentById(id: number) {
    return await commentQuerries.getCommentById(id);
  },
};
