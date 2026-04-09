import { noteQuerry } from "../database/noteQuerries";
import { userQueries } from "../database/userQueries";

export const notesService = {
  async getAllNotes(token?: string) {
    let userId;
    if (token) {
      const user = await userQueries.findByToken(token);
      if (user) userId = user.Id;
    }
    return await noteQuerry.getAll(userId || 0);
  },

  async getNote(id: number, token?: string) {
    let userId;
    if (token) {
      const user = await userQueries.findByToken(token);
      if (user) userId = user.Id;
    }
    return await noteQuerry.getById(id, userId || 0);
  },

  async getNotesWhereCourseId(id: number) {
    return await noteQuerry.getNotesWhereCourseId(id);
  },

  async create(title: string, attachmentUrl: string, description: string, token: string, courseId: number) {
    const user = await userQueries.findByToken(token);
    if (!user) throw new Error("Invalid_Cookie");
    return await noteQuerry.create(title, attachmentUrl, description, user.Id, courseId);
  },

  async delete(id: number) {
    return await noteQuerry.deleteWhereId(id);
  },

  async edit(id: number, title: string, attachmentUrl: string, description: string, token: string) {
    const user = await userQueries.findByToken(token);
    if (!user) throw new Error("Invalid_Cookie");
    return await noteQuerry.editWhereId(id, title, attachmentUrl, description);
  },
};
