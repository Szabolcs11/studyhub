import { Request, Response } from "express";
import responses from "../responses/errorResponses.json";
import {
  authenticateUser,
  checkPassword,
  destroySession,
  getUserByEmail,
  getUserByNickname,
  isUsernameTaken,
  registerUser,
  updateLastLogin,
  updatePassword,
} from "../services/authService";
import { language } from "../types";
import { returnError } from "../utils";
import { COOKIE_NAMES } from "../config/contants";
import { createSession, createUser, getUserBySessionToken } from "../database/authQueries";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const register = async (req: Request, res: Response) => {
  const { Nickname, Password, PasswordConfirm, Email } = req.body;
  const language = (req.headers.language as language) || "hu";

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
  const language = (req.headers.language as language) || "hu";

  const sessionToken = await authenticateUser(Email, Password);
  if (!sessionToken) return returnError(res, responses.Invalid_Username_Or_Password, language);

  await updateLastLogin(Email);

  res.cookie(COOKIE_NAMES.SESSION, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.json({ success: true, message: responses.Login_Successful[language] });
};

export const logout = async (req: Request, res: Response) => {
  const language = (req.headers.language as language) || "hu";
  const token = req.cookies?.sessiontoken;
  if (token) await destroySession(token);
  res.clearCookie(COOKIE_NAMES.SESSION);
  res.json({ success: true, message: responses.Logout_Successful[language] });
};

export const authenticate = async (req: Request, res: Response) => {
  const language = (req.headers.language as language) || "hu";
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

export const changePassword = async (req: Request, res: Response) => {
  const language = (req.headers.language as language) || "hu";
  const token = req.cookies?.sessiontoken;
  const { CurrentPassword, NewPassword, NewPasswordConfirm } = req.body;

  if (!CurrentPassword) return returnError(res, responses.Fill_The_Fields, language);
  if (!NewPassword) return returnError(res, responses.Fill_The_Fields, language);
  if (!NewPasswordConfirm) return returnError(res, responses.Fill_The_Fields, language);

  if (NewPassword !== NewPasswordConfirm) return returnError(res, responses.Passwords_Do_Not_Match, language);

  if (!token) {
    return returnError(res, responses.You_Are_Not_Logged_In, language);
  }

  const user = await getUserBySessionToken(token);

  if (!user) {
    return returnError(res, responses.You_Are_Not_Logged_In, language);
  }

  const isCorrectPassword = await checkPassword(user.Id, CurrentPassword);
  if (!isCorrectPassword) return returnError(res, responses.Invalid_Password, language);

  const changed = await updatePassword(user.Id, NewPassword);
  if (!changed) return returnError(res, responses.Unexpected_Error, language);

  return res.status(200).json({
    success: true,
    message: responses.Successfully_Changed_Password[language],
  });
};

export const googleLogin = async (req: Request, res: Response) => {
  const { token } = req.body;
  const language = (req.headers.language as language) || "hu";
  if (!token) return returnError(res, responses.Fill_The_Fields, language);

  console.log("process.env.GOOGLE_CLIENT_ID");
  console.log(process.env.GOOGLE_CLIENT_ID);
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) return res.status(400).json({ message: "Invalid token" });
  const { sub, email, name } = payload;
  if (!sub || !email || !name) return res.status(400).json({ message: "Invalid token payload" });
  req.body.Identifier = email;
  req.body.GoogleId = sub;

  let userId;
  const user = await getUserByEmail(email!);
  if (user) {
    if (!user.GoogleID) {
      return await returnError(res, responses.Email_Already_Taken_Use_Password_To_Login, language);
    } else if (user.GoogleID !== sub) {
      return await returnError(res, responses.Email_Already_Taken_Use_Password_To_Login, language);
    }
    userId = user.Id;
  } else {
    // Register new user
    const isUsernameTake = await isUsernameTaken(name);
    let selectedName = name;
    if (isUsernameTake) {
      const splittedEmail = email.split("@");
      if (splittedEmail.length) {
        selectedName = splittedEmail[0];
        const isEmailUsernameTaken = await isUsernameTaken(selectedName);
        if (isEmailUsernameTaken) {
          return await returnError(res, responses.Username_Already_Exists, language);
        }
      } else {
        return await returnError(res, responses.Username_Already_Exists, language);
      }
    }
    const hashedPassword = await bcrypt.hash(sub, 10);
    const insertedUser = await createUser(selectedName, hashedPassword, email, sub);
    if (!insertedUser) {
      return returnError(res, responses.Unexpected_Error, language);
    }
    userId = (insertedUser as any).insertId;
  }

  await updateLastLogin(email);

  const sessionToken = crypto.randomBytes(32).toString("hex");
  console.log("sessionToken", sessionToken);
  await createSession(userId as number, sessionToken);

  res.cookie(COOKIE_NAMES.SESSION, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.json({ success: true, message: responses.Login_Successful[language] });
};
