import { language } from "../types";
import { returnError } from "../utils";
import responses from "./../responses/errorResponses.json";
import { Request, Response, NextFunction } from "express";

const forbiddenWords = ["admin", "badword"];

export const validateLoginInput = (req: Request, res: Response, next: NextFunction) => {
  const language = (req.headers.language as language) || "hu";
  const { Email, Password } = req.body;

  if (!Email) return returnError(res, responses.Missing_Email, language);
  if (!Password) return returnError(res, responses.Missing_Password, language);

  next();
};

export const validateRegisterInput = (req: Request, res: Response, next: NextFunction) => {
  const language = (req.headers.language as language) || "hu";
  const { Nickname, Password, PasswordConfirm, Email } = req.body;

  if (!Nickname) return returnError(res, responses.Missing_Username, language);
  if (!Password) return returnError(res, responses.Missing_Password, language);
  if (!PasswordConfirm) return returnError(res, responses.Missing_Password_Confirmation, language);
  if (!Email) return returnError(res, responses.Missing_Email, language);
  if (Nickname.length < 3) return returnError(res, responses.Username_Too_Short, language);
  if (Password.length < 6) return returnError(res, responses.Password_Too_Short, language);
  if (Password !== PasswordConfirm) return returnError(res, responses.Passwords_Do_Not_Match, language);
  for (const word of forbiddenWords) {
    if (Nickname.toLowerCase().includes(word)) {
      return returnError(res, responses.Invalid_Words, language);
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(Email)) {
    return returnError(res, responses.Invalid_Email_Format, language);
  }

  next();
};
