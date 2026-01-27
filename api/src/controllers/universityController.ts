import responses from "./../responses/errorResponses.json";
import { returnError } from "../utils";
import { Request, Response } from "express";
import { universityService } from "../services/universityService";

export const getUniversities = async (req: Request, res: Response) => {
  try {
    const universities = await universityService.getAllUniversities();
    return res.json(universities);
  } catch {
    return returnError(res, responses.Unexpected_Error, "en");
  }
};

export const getUniversity = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const university = await universityService.getUniversity(id);
    if (!university) return returnError(res, responses.No_University_Found, "en");
    return res.json(university);
  } catch {
    return returnError(res, responses.Unexpected_Error, "en");
  }
};

export const getUniversityFaculties = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const faculties = await universityService.getUniversityFaculties(id);
    return res.json(faculties);
  } catch {
    return returnError(res, responses.Unexpected_Error, "en");
  }
};
