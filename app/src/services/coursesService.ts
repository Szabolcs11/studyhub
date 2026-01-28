import axios from "axios";
import { ENDPOINTS, API_URL } from "../constans";
import { type University, type Faculty, type Course, type UniversityWithFaculties } from "../types/courses";

class CoursesService {
  async getUniversities(): Promise<University[]> {
    try {
      const response = await axios.get(ENDPOINTS.UNIVERSITIES);
      return response.data;
    } catch (error) {
      console.error("Error fetching universities:", error);
      throw error;
    }
  }

  async getUniversityFaculties(universityId: number): Promise<Faculty[]> {
    try {
      const response = await axios.get(ENDPOINTS.UNIVERSITY_FACULTIES(universityId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching faculties for university ${universityId}:`, error);
      throw error;
    }
  }

  async getFacultyCourses(facultyId: number): Promise<Course[]> {
    try {
      const response = await axios.get(ENDPOINTS.FACULTY_COURSES(facultyId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching courses for faculty ${facultyId}:`, error);
      throw error;
    }
  }

  // Get complete tree structure: University -> Faculties -> Courses
  async getUniversitiesWithFacultiesAndCourses(): Promise<UniversityWithFaculties[]> {
    try {
      const universities = await this.getUniversities();

      const universitiesWithFaculties = await Promise.all(
        universities.map(async (university) => {
          try {
            const faculties = await this.getUniversityFaculties(university.Id);

            const facultiesWithCourses = await Promise.all(
              faculties.map(async (faculty) => {
                try {
                  const courses = await this.getFacultyCourses(faculty.Id);
                  return { ...faculty, Courses: courses };
                } catch (error) {
                  console.error(`Failed to fetch courses for faculty ${faculty.Id}:`, error);
                  return { ...faculty, Courses: [] };
                }
              }),
            );

            return { ...university, Faculties: facultiesWithCourses };
          } catch (error) {
            console.error(`Failed to fetch faculties for university ${university.Id}:`, error);
            return { ...university, Faculties: [] };
          }
        }),
      );

      return universitiesWithFaculties;
    } catch (error) {
      console.error("Error fetching complete university structure:", error);
      throw error;
    }
  }

  async getUniversity(id: number): Promise<University | null> {
    try {
      const response = await axios.get(`${ENDPOINTS.UNIVERSITIES}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching university ${id}:`, error);
      return null;
    }
  }

  async getFaculty(id: number): Promise<Faculty | null> {
    try {
      const response = await axios.get(`${API_URL}faculties/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching faculty ${id}:`, error);
      return null;
    }
  }

  async getCourse(id: number): Promise<Course | null> {
    try {
      const response = await axios.get(`${API_URL}courses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      return null;
    }
  }
}

const coursesService = new CoursesService();
export default coursesService;
