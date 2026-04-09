import { Request, Response } from "express";
import { userQueries } from "../database/userQueries";
import responses from "../responses/errorResponses.json";
import { likeService } from "../services/likeService";
import { returnError } from "../utils";

export const likeNote = async (req: Request, res: Response) => {
  const noteId = parseInt(req.params.id, 10);
  const token = req.cookies?.sessiontoken;
  if (!token) return returnError(res, responses.You_Need_To_Login_To_Use_This_Function, "hu");

  try {
    const user = await userQueries.findByToken(token);
    if (!user) return returnError(res, responses.You_Need_To_Login_To_Use_This_Function, "hu");
    const liked = await likeService.likeNote(noteId, user.Id);
    const responseMessage = liked ? responses.Successfully_Liked_Note["hu"] : responses.Successfully_Unliked_Note["hu"];
    return res.json({ success: true, message: responseMessage, liked });
  } catch {
    return returnError(res, responses.Unexpected_Error, "hu");
  }
};
