import { coursesQuerry } from "../database/coursesQuerries";

export const courserService = {
  async getAllCourses() {
    return await coursesQuerry.getAll();
  },

  async getCourse(id: number) {
    return await coursesQuerry.getById(id);
  },

  async getCoursesWhereFaculty(id: number) {
    return await coursesQuerry.getWhereFacultyId(id);
  },
};
