import bcrypt from "bcrypt";
import crypto from "crypto";
import { createSession, createUser, deleteSession, findUserByEmail, findUserByNickname } from "../database/authQueries";

export const authenticateUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.Password);
  if (!valid) return null;

  const token = crypto.randomBytes(32).toString("hex");
  await createSession(user.Id, token);
  return token;
};

export const destroySession = async (token: string) => {
  await deleteSession(token);
};

export const getUserByNickname = async (email: string) => {
  return await findUserByNickname(email);
};

export const getUserByEmail = async (email: string) => {
  return await findUserByEmail(email);
};

export const registerUser = async (nickname: string, password: string, email: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await createUser(nickname, hashedPassword, email);
};
