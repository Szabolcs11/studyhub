import responses from "../responses/errorResponses.json";
import { returnError } from "../utils";
import { Request, Response } from "express";
import { facultyService } from "../services/faculityService";
import { courserService } from "../services/coursesService";

export const getFaculties = async (req: Request, res: Response) => {
  try {
    const universities = await facultyService.getAllFaculties();
    return res.json(universities);
  } catch {
    return returnError(res, responses.Unexpected_Error, "hu");
  }
};

export const getFaculty = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const university = await facultyService.getFaculty(id);
    if (!university) return returnError(res, responses.No_Faculity_Found, "hu");
    return res.json(university);
  } catch {
    return returnError(res, responses.Unexpected_Error, "hu");
  }
};

export const getFacultyCourses = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const faculties = await courserService.getCoursesWhereFaculty(id);
    return res.json(faculties);
  } catch {
    return returnError(res, responses.Unexpected_Error, "hu");
  }
};
