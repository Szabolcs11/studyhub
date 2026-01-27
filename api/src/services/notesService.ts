import { noteQuerry } from "../database/noteQuerries";
import { userQueries } from "../database/userQueries";

export const notesService = {
  async getAllNotes() {
    return await noteQuerry.getAll();
  },

  async getNote(id: number) {
    return await noteQuerry.getById(id);
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
