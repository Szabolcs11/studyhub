import { Request, Response } from "express";
import { courserService } from "../services/coursesService";
import { returnError } from "../utils";
import responses from "../responses/errorResponses.json";
import { notesService } from "../services/notesService";

export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await courserService.getAllCourses();
    return res.json(courses);
  } catch {
    return returnError(res, responses.Unexpected_Error, "hu");
  }
};

export const getCourse = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const course = await courserService.getCourse(id);
    return res.json(course);
  } catch {
    return returnError(res, responses.Unexpected_Error, "hu");
  }
};

export const getCourseNotes = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const notes = await notesService.getNotesWhereCourseId(id);
    return res.json(notes);
  } catch {
    return returnError(res, responses.Unexpected_Error, "hu");
  }
};
