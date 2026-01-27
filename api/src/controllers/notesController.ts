import { Request, Response } from "express";
import responses from "../responses/errorResponses.json";
import { notesService } from "../services/notesService";
import { returnError } from "../utils";
import { language } from "../types";

export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await notesService.getAllNotes();
    return res.json(notes);
  } catch {
    return returnError(res, responses.Unexpected_Error, "en");
  }
};

export const getNote = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const note = await notesService.getNote(id);
    return res.json(note);
  } catch {
    return returnError(res, responses.Unexpected_Error, "en");
  }
};

export const createNote = async (req: Request, res: Response) => {
  try {
    const language = (req.headers.language as language) || "hu";
    const id = Number(req.params.id);
    const { Title, AttachmentUrl, Description } = req.body;
    const token = req.cookies?.sessiontoken;
    if (!token) return returnError(res, responses.You_Need_To_Login_To_Use_This_Function, language);
    const noteId = await notesService.create(Title, AttachmentUrl, Description, token, id);
    return res.status(200).json({
      success: true,
      message: responses.Successfully_Created_Note[language],
      noteId: noteId,
    });
  } catch {
    return returnError(res, responses.Unexpected_Error, "en");
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const language = (req.headers.language as language) || "hu";
    const id = Number(req.params.id);
    const note = await notesService.getNote(id);
    if (!note) {
      return returnError(res, responses.Invalid_Id, language);
    }
    const success = await notesService.delete(id);
    if (success) {
      return res.status(200).json({
        success: true,
        message: responses.Successfully_Deleted_Note[language],
      });
    }
  } catch {
    return returnError(res, responses.Unexpected_Error, "en");
  }
};

export const editNode = async (req: Request, res: Response) => {
  try {
    const language = (req.headers.language as language) || "hu";
    const id = Number(req.params.id);
    const { Title, AttachmentUrl, Description } = req.body;
    const token = req.cookies?.sessiontoken;
    if (!token) return returnError(res, responses.You_Need_To_Login_To_Use_This_Function, language);
    const note = await notesService.getNote(id);
    if (!note) {
      return returnError(res, responses.Invalid_Id, language);
    }
    const success = await notesService.edit(id, Title, AttachmentUrl, Description, token);
    if (success) {
      return res.status(200).json({
        success: true,
        message: responses.Successfully_Edited_Note[language],
      });
    }
  } catch {
    return returnError(res, responses.Unexpected_Error, "en");
  }
};
