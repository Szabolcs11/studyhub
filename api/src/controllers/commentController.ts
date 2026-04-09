import { Request, Response } from "express";
import { returnError } from "../utils";
import responses from "../responses/errorResponses.json";
import { commentService } from "../services/commentService";
import { language } from "../types";

export const getNoteComments = async (req: Request, res: Response) => {
  const noteId = parseInt(req.params.id, 10);
  try {
    const comments = await commentService.getNoteComments(noteId);
    return res.json(comments);
  } catch {
    return returnError(res, responses.Unexpected_Error, "hu");
  }
};

export const createComment = async (req: Request, res: Response) => {
  const language = (req.headers.language as language) || "hu";
  const noteId = parseInt(req.params.id, 10);
  const { content } = req.body;
  const token = req.cookies?.sessiontoken;
  if (!token) return returnError(res, responses.You_Need_To_Login_To_Use_This_Function, language);
  try {
    const commentId = await commentService.createComment(noteId, token, content);
    const comment = await commentService.getCommentById(commentId);
    return res.json({ success: true, comment });
  } catch {
    return returnError(res, responses.Unexpected_Error, "hu");
  }
};
