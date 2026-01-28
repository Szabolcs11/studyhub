import { Request, Response } from "express";
import responses from "../responses/errorResponses.json";
import {
  authenticateUser,
  destroySession,
  getUserByEmail,
  getUserByNickname,
  registerUser,
} from "../services/authService";
import { language } from "../types";
import { returnError } from "../utils";
import { COOKIE_NAMES } from "../config/contants";
import { getUserBySessionToken } from "../database/authQueries";

export const register = async (req: Request, res: Response) => {
  const { Nickname, Password, PasswordConfirm, Email } = req.body;
  const language = (req.headers.language as language) || "en";

  const userExists = await getUserByNickname(Nickname);
  if (userExists) return returnError(res, responses.Username_Already_Exists, language);

  const userExistsByEmail = await getUserByEmail(Email);
  if (userExistsByEmail) return returnError(res, responses.Email_Already_Exists, language);

  if (Password !== PasswordConfirm) return returnError(res, responses.Passwords_Do_Not_Match, language);

  const createdUser = await registerUser(Nickname, Password, Email);
  if (!createdUser) return returnError(res, responses.Error_During_Registration, language);

  res.json({ success: true, message: responses.Registration_Successful[language] });
};

export const login = async (req: Request, res: Response) => {
  const { Email, Password } = req.body;
  const language = (req.headers.language as language) || "en";

  const sessionToken = await authenticateUser(Email, Password);
  if (!sessionToken) return returnError(res, responses.Invalid_Username_Or_Password, language);

  res.cookie(COOKIE_NAMES.SESSION, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.json({ success: true, message: responses.Login_Successful[language] });
};

export const logout = async (req: Request, res: Response) => {
  const language = (req.headers.language as language) || "en";
  const token = req.cookies?.sessiontoken;
  if (token) await destroySession(token);
  res.clearCookie(COOKIE_NAMES.SESSION);
  res.json({ success: true, message: responses.Logout_Successful[language] });
};

export const authenticate = async (req: Request, res: Response) => {
  const language = (req.headers.language as language) || "en";
  const token = req.cookies?.sessiontoken;

  if (!token) {
    return returnError(res, responses.You_Are_Not_Logged_In, language);
  }

  const user = await getUserBySessionToken(token);

  if (!user) {
    res.clearCookie(COOKIE_NAMES.SESSION);
    return returnError(res, responses.You_Are_Not_Logged_In, language);
  }

  return res.status(200).json({
    success: true,
    user: user,
  });
};
