import { facultyQuerry as facultyQuerry } from "../database/facultyQueries";
import { coursesQuerry } from "../database/coursesQuerries";

export const facultyService = {
  async getAllFaculties() {
    return await facultyQuerry.getAll();
  },

  async getFaculty(id: number) {
    return await facultyQuerry.getById(id);
  },

  async getCoursesWhereFaculty(id: number) {
    return await coursesQuerry.getWhereFacultyId(id);
  },
};
