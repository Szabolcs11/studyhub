import { useState, useEffect, useMemo } from "react";
import coursesService from "../services/coursesService";
import { type UniversityWithFaculties } from "../types/courses";
import { toast } from "react-toastify";

export const useCourses = () => {
  const [universities, setUniversities] = useState<UniversityWithFaculties[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUniversities, setExpandedUniversities] = useState<Set<number>>(new Set());
  const [expandedFaculties, setExpandedFaculties] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const searchFilter = (data: UniversityWithFaculties[], query: string): UniversityWithFaculties[] => {
    if (!query.trim()) {
      return data;
    }

    const normalizedQuery = query.toLowerCase().trim();

    const filteredData: UniversityWithFaculties[] = [];
    
    for (const university of data) {
      const universityMatches = university.Name.toLowerCase().includes(normalizedQuery) ||
        (university.Description && university.Description.toLowerCase().includes(normalizedQuery));

      const matchingFaculties = university.Faculties.filter((faculty) => {
        const facultyMatches = faculty.Name.toLowerCase().includes(normalizedQuery) ||
          (faculty.Description && faculty.Description.toLowerCase().includes(normalizedQuery));

        const matchingCourses = faculty.Courses.filter((course) => 
          course.Name.toLowerCase().includes(normalizedQuery) ||
          (course.Description && course.Description.toLowerCase().includes(normalizedQuery))
        );

        return facultyMatches || matchingCourses.length > 0;
      }).map((faculty) => {
        const facultyMatches = faculty.Name.toLowerCase().includes(normalizedQuery) ||
          (faculty.Description && faculty.Description.toLowerCase().includes(normalizedQuery));

        const matchingCourses = faculty.Courses.filter((course) => 
          course.Name.toLowerCase().includes(normalizedQuery) ||
          (course.Description && course.Description.toLowerCase().includes(normalizedQuery))
        );

        return {
          ...faculty,
          Courses: facultyMatches ? faculty.Courses : matchingCourses
        };
      });

      if (universityMatches || matchingFaculties.length > 0) {
        filteredData.push({
          ...university,
          Faculties: universityMatches ? university.Faculties : matchingFaculties
        });
      }
    }
    
    return filteredData;
  };

  const filteredUniversities = useMemo(() => {
    return searchFilter(universities, searchQuery);
  }, [universities, searchQuery]);

  useEffect(() => {
    fetchCourses();
  }, []);

  // Auto-expand when searching
  useEffect(() => {
    if (searchQuery.trim()) {
      const allUniversityIds = filteredUniversities.map((u) => u.Id);
      const allFacultyIds = filteredUniversities.flatMap((u) => u.Faculties.map((f) => f.Id));
      setExpandedUniversities(new Set(allUniversityIds));
      setExpandedFaculties(new Set(allFacultyIds));
    }
  }, [searchQuery, filteredUniversities]);

  return {
    universities: filteredUniversities,
    originalUniversities: universities,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    expandedUniversities,
    expandedFaculties,
    toggleUniversity,
    toggleFaculty,
    expandAll,
    collapseAll,
    refetch: fetchCourses,
  };
};
