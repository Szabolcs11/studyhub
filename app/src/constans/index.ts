export const API_URL = import.meta.env.VITE_API_URL as string;
export const APP_URL = import.meta.env.VITE_APP_URL as string;

export const ENDPOINTS = {
  AUTHENTICATE: API_URL + "auth/authenticate",
  LOGIN: API_URL + "auth/login",
  REGISTER: API_URL + "auth/register",
  LOGOUT: API_URL + "auth/logout",
  UNIVERSITIES: API_URL + "universities",
  UNIVERSITY_FACULTIES: (id: number) => API_URL + `universities/${id}/faculties`,
  FACULTY_COURSES: (id: number) => API_URL + `faculties/${id}/courses`,
  COURSE_NOTES: (id: number) => API_URL + `courses/${id}/notes`,
  NOTE: API_URL + `notes/`,
  UPLOAD_FILE: API_URL + `files/upload`,
  CHANGE_PASSWORD: API_URL + "auth/changepassword",
};
