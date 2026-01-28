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

export interface Note {
  Id: number;
  CourseId: number;
  Title: string;
  AttachmentUrl: string;
  Description: string;
  UploaderUserId: number;
  CreatedAt: string;
  LastEdited?: string;
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

export interface CreateNoteRequest {
  Title: string;
  AttachmentUrl: string;
  Description: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
