import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import coursesService from "../services/coursesService";
import notesService from "../services/notesService";
import { type Course, type Faculty, type Note, type CreateNoteRequest } from "../types/courses";
import axios from "axios";
import { ENDPOINTS } from "../constans";

export const useCourseDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCreatingNote, setIsCreatingNote] = useState(false);

  const fetchCourseDetails = async () => {
    if (!id) {
      setError("Érvénytelen kurzus ID");
      setIsLoading(false);
      return;
    }

    const courseId = parseInt(id);

    try {
      setIsLoading(true);
      setError(null);

      const courseData = await coursesService.getCourse(courseId);
      if (!courseData) {
        setError("A keresett kurzus nem található");
        setIsLoading(false);
        return;
      }
      setCourse(courseData);

      const facultyData = await coursesService.getFaculty(courseData.FacultyId);
      setFaculty(facultyData);

      const notesData = await notesService.getCourseNotes(courseId);
      setNotes(notesData);
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || "Hiba történt a kurzus adatainak betöltése közben";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthentication = async () => {
    try {
      const response = await axios.post(
        ENDPOINTS.AUTHENTICATE,
        {},
        {
          withCredentials: true,
        },
      );
      setIsAuthenticated(response.data.success);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const createNote = async (noteData: CreateNoteRequest) => {
    if (!course) {
      toast.error("Hiányzó kurzus információ");
      return false;
    }

    setIsCreatingNote(true);

    try {
      const result = await notesService.createNote(course.Id, noteData);

      if (result.success) {
        toast.success("Jegyzet sikeresen létrehozva!");

        const notesData = await notesService.getCourseNotes(course.Id);
        setNotes(notesData);

        return true;
      } else {
        toast.error(result.message);
        return false;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Hiba történt a jegyzet létrehozása közben";
      toast.error(errorMessage);
      return false;
    } finally {
      setIsCreatingNote(false);
    }
  };

  const updateNote = async (noteId: number, noteData: CreateNoteRequest) => {
    try {
      const result = await notesService.updateNote(noteId, noteData);

      if (result.success) {
        toast.success("Jegyzet sikeresen frissítve!");

        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.Id === noteId ? { ...note, ...noteData, LastEdited: new Date().toISOString() } : note,
          ),
        );

        return true;
      } else {
        toast.error(result.message);
        return false;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Hiba történt a jegyzet frissítése közben";
      toast.error(errorMessage);
      return false;
    }
  };

  const deleteNote = async (noteId: number) => {
    if (!window.confirm("Biztosan törölni szeretnéd ezt a jegyzetet?")) {
      return false;
    }

    try {
      const result = await notesService.deleteNote(noteId);

      if (result.success) {
        toast.success("Jegyzet sikeresen törölve!");

        setNotes((prevNotes) => prevNotes.filter((note) => note.Id !== noteId));

        return true;
      } else {
        toast.error(result.message);
        return false;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Hiba történt a jegyzet törlése közben";
      toast.error(errorMessage);
      return false;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("hu-HU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  useEffect(() => {
    fetchCourseDetails();
    checkAuthentication();
  }, [id]);

  return {
    courseId: id ? parseInt(id) : null,
    course,
    faculty,
    notes,
    isLoading,
    error,
    isAuthenticated,
    isCreatingNote,
    createNote,
    updateNote,
    deleteNote,
    formatDate,
    refetch: fetchCourseDetails,
  };
};
