import { universitiesQuerry } from "../database/universityQueries";
import { facultyQuerry } from "../database/facultyQueries";

export const universityService = {
  async getAllUniversities() {
    return await universitiesQuerry.getAll();
  },

  async getUniversity(id: number) {
    return await universitiesQuerry.getById(id);
  },

  async getUniversityFaculties(id: number) {
    return await facultyQuerry.getWhereUniversityId(id);
  },
};
