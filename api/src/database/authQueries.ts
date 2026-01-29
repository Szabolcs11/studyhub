import { User } from "../types";
import { pool } from "./mysql";

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await pool.query("SELECT * FROM users WHERE Email = ?", [email]);
  const result = rows as any[];
  return result.length > 0 ? result[0] : null;
};

export const findUserByNickname = async (nickname: string): Promise<User | null> => {
  const [rows] = await pool.query("SELECT * FROM users WHERE Nickname = ?", [nickname]);
  const result = rows as any[];
  return result.length > 0 ? result[0] : null;
};

export const findUserById = async (id: number): Promise<User | null> => {
  const [rows] = await pool.query("SELECT * FROM users WHERE Id = ?", [id]);
  const result = rows as any[];
  return result.length > 0 ? result[0] : null;
};

export const createSession = async (userID: number, token: string) => {
  await pool.execute("INSERT INTO sessions (UserID, Token) VALUES (?, ?)", [userID, token]);
};

export const deleteSession = async (token: string) => {
  await pool.execute("DELETE FROM sessions WHERE Token = ?", [token]);
};

export const createUser = async (nickname: string, password: string, email: string) => {
  const [result] = await pool.execute("INSERT INTO users (Nickname, Password, Email) VALUES (?, ?, ?)", [
    nickname,
    password,
    email,
  ]);
  return result;
};

export const getUserBySessionToken = async (token: string) => {
  const [rows] = await pool.execute(
    "SELECT users.Id, users.Nickname FROM users JOIN sessions ON users.Id = sessions.UserId WHERE sessions.Token = ?",
    [token],
  );
  return (rows as any[])[0] || null;
};

export const validateSessionToken = async (token: string) => {
  const [rows] = await pool.execute("SELECT * FROM sessions WHERE Token = ?", [token]);
  const result = rows as any[];
  return result.length > 0;
};

export const changePassword = async (id: number, hashedPassword: string) => {
  const [result] = await pool.execute("UPDATE users SET Password = ? WHERE Id = ?", [hashedPassword, id]);
  return result;
};
