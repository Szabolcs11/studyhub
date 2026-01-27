export type language = "hu" | "en" | "de";

export interface User {
  Id: number;
  Nickname: string;
  Email: string;
  Password: string;
}

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
