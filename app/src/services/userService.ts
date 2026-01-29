import type { User } from "../types/courses";

class NotesService {
  async getUserData(): Promise<User[]> {
    try {
      const response = await axios.get(`${API_URL}courses/${courseId}/notes`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching notes for course ${courseId}:`, error);
      throw error;
    }
  }
}
