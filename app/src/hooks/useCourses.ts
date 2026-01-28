import { useState, useEffect } from "react";
import coursesService from "../services/coursesService";
import { type UniversityWithFaculties } from "../types/courses";
import { toast } from "react-toastify";

export const useCourses = () => {
  const [universities, setUniversities] = useState<UniversityWithFaculties[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUniversities, setExpandedUniversities] = useState<Set<number>>(new Set());
  const [expandedFaculties, setExpandedFaculties] = useState<Set<number>>(new Set());

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await coursesService.getUniversitiesWithFacultiesAndCourses();
      setUniversities(data);
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || "Hiba történt a kurzusok betöltése közben";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUniversity = (universityId: number) => {
    setExpandedUniversities((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(universityId)) {
        newSet.delete(universityId);
      } else {
        newSet.add(universityId);
      }
      return newSet;
    });
  };

  const toggleFaculty = (facultyId: number) => {
    setExpandedFaculties((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(facultyId)) {
        newSet.delete(facultyId);
      } else {
        newSet.add(facultyId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const allUniversityIds = universities.map((u) => u.Id);
    const allFacultyIds = universities.flatMap((u) => u.Faculties.map((f) => f.Id));
    setExpandedUniversities(new Set(allUniversityIds));
    setExpandedFaculties(new Set(allFacultyIds));
  };

  const collapseAll = () => {
    setExpandedUniversities(new Set());
    setExpandedFaculties(new Set());
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    universities,
    isLoading,
    error,
    expandedUniversities,
    expandedFaculties,
    toggleUniversity,
    toggleFaculty,
    expandAll,
    collapseAll,
    refetch: fetchCourses,
  };
};
