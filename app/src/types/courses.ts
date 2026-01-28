export interface University {
  Id: number;
  Name: string;
  Description: string;
}

export interface Faculty {
  Id: number;
  UniversityId: number;
  Name: string;
  Description: string;
}

export interface Course {
  Id: number;
  FacultyId: number;
  Name: string;
  Description: string;
}

export interface CourseWithFaculty extends Course {
  Faculty: Faculty;
}

export interface FacultyWithCourses extends Faculty {
  Courses: Course[];
}

export interface UniversityWithFaculties extends University {
  Faculties: FacultyWithCourses[];
}