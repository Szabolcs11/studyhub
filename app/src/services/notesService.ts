import axios from "axios";
import { API_URL } from "../constans";
import { type Note, type CreateNoteRequest, type ApiResponse } from "../types/courses";

class NotesService {
  async getCourseNotes(courseId: number): Promise<Note[]> {
    try {
      const response = await axios.get(`${API_URL}courses/${courseId}/notes`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching notes for course ${courseId}:`, error);
      throw error;
    }
  }

  async getNotes(): Promise<Note[] | null> {
    try {
      const response = await axios.get(`${API_URL}notes/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching notes", error);
      return null;
    }
  }

  async getNote(noteId: number): Promise<Note | null> {
    try {
      const response = await axios.get(`${API_URL}notes/${noteId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching note ${noteId}:`, error);
      return null;
    }
  }

  async createNote(courseId: number, noteData: CreateNoteRequest): Promise<ApiResponse<{ noteId: number }>> {
    try {
      const response = await axios.post(`${API_URL}courses/${courseId}/notes`, noteData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || "Hiba történt a jegyzet létrehozása közben";
      throw new Error(errorMessage);
    }
  }

  async updateNote(noteId: number, noteData: CreateNoteRequest): Promise<ApiResponse> {
    try {
      const response = await axios.put(`${API_URL}notes/${noteId}`, noteData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || "Hiba történt a jegyzet módosítása közben";
      throw new Error(errorMessage);
    }
  }

  async deleteNote(noteId: number): Promise<ApiResponse> {
    try {
      const response = await axios.delete(`${API_URL}notes/${noteId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || "Hiba történt a jegyzet törlése közben";
      throw new Error(errorMessage);
    }
  }
}

const notesService = new NotesService();
export default notesService;
