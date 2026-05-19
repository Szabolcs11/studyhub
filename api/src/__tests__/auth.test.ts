import request from "supertest";
import app from "../app";
import responses from "../responses/errorResponses.json";
import {
  authenticateUser,
  checkPassword,
  destroySession,
  getUserByEmail,
  getUserByNickname,
  registerUser,
  updateLastLogin,
  updatePassword,
} from "../services/authService";
import { getUserBySessionToken, validateSessionToken } from "../database/authQueries";

jest.mock("../middlewares/logger", () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

jest.mock("../services/authService", () => ({
  authenticateUser: jest.fn(),
  checkPassword: jest.fn(),
  destroySession: jest.fn(),
  getUserByEmail: jest.fn(),
  getUserByNickname: jest.fn(),
  isUsernameTaken: jest.fn(),
  registerUser: jest.fn(),
  updateLastLogin: jest.fn(),
  updatePassword: jest.fn(),
}));

jest.mock("../database/authQueries", () => ({
  createSession: jest.fn(),
  createUser: jest.fn(),
  getUserBySessionToken: jest.fn(),
  validateSessionToken: jest.fn(),
}));

const mockedAuthenticateUser = jest.mocked(authenticateUser);
const mockedCheckPassword = jest.mocked(checkPassword);
const mockedDestroySession = jest.mocked(destroySession);
const mockedGetUserByEmail = jest.mocked(getUserByEmail);
const mockedGetUserByNickname = jest.mocked(getUserByNickname);
const mockedRegisterUser = jest.mocked(registerUser);
const mockedUpdateLastLogin = jest.mocked(updateLastLogin);
const mockedUpdatePassword = jest.mocked(updatePassword);
const mockedGetUserBySessionToken = jest.mocked(getUserBySessionToken);
const mockedValidateSessionToken = jest.mocked(validateSessionToken);

describe("auth routes", () => {
  beforeEach(() => {
    process.env.APP_URL = "http://localhost:5173";
  });

  describe("POST /api/auth/register", () => {
    it("rejects missing required fields", async () => {
      const response = await request(app).post("/api/auth/register").set("language", "en").send({});

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: false,
        message: responses.Missing_Username.en,
      });
      expect(mockedRegisterUser).not.toHaveBeenCalled();
    });

    it("rejects an already used nickname", async () => {
      mockedGetUserByNickname.mockResolvedValueOnce({
        Id: 1,
        Nickname: "taken",
        Email: "taken@example.com",
        Password: "hashed",
      });

      const response = await request(app).post("/api/auth/register").set("language", "en").send({
        Nickname: "taken",
        Email: "new@example.com",
        Password: "secret1",
        PasswordConfirm: "secret1",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: false,
        message: responses.Username_Already_Exists.en,
      });
      expect(mockedGetUserByEmail).not.toHaveBeenCalled();
      expect(mockedRegisterUser).not.toHaveBeenCalled();
    });

    it("creates a user when the input is valid and unique", async () => {
      mockedGetUserByNickname.mockResolvedValueOnce(null);
      mockedGetUserByEmail.mockResolvedValueOnce(null);
      mockedRegisterUser.mockResolvedValueOnce({ insertId: 12 } as any);

      const response = await request(app).post("/api/auth/register").set("language", "en").send({
        Nickname: "student",
        Email: "student@example.com",
        Password: "secret1",
        PasswordConfirm: "secret1",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: responses.Registration_Successful.en,
      });
      expect(mockedRegisterUser).toHaveBeenCalledWith("student", "secret1", "student@example.com");
    });
  });

  describe("POST /api/auth/login", () => {
    it("sets the session cookie after a valid login", async () => {
      mockedAuthenticateUser.mockResolvedValueOnce("session-token");

      const response = await request(app).post("/api/auth/login").set("language", "en").send({
        Email: "student@example.com",
        Password: "secret1",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: responses.Login_Successful.en,
      });
      expect(response.headers["set-cookie"][0]).toContain("sessiontoken=session-token");
      expect(mockedUpdateLastLogin).toHaveBeenCalledWith("student@example.com");
    });

    it("rejects invalid credentials without setting a cookie", async () => {
      mockedAuthenticateUser.mockResolvedValueOnce(null);

      const response = await request(app).post("/api/auth/login").set("language", "en").send({
        Email: "student@example.com",
        Password: "wrong-password",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: false,
        message: responses.Invalid_Username_Or_Password.en,
      });
      expect(response.headers["set-cookie"]).toBeUndefined();
      expect(mockedUpdateLastLogin).not.toHaveBeenCalled();
    });
  });

  describe("POST /api/auth/authenticate", () => {
    it("rejects requests without a session cookie", async () => {
      const response = await request(app).post("/api/auth/authenticate").set("language", "en").send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: false,
        message: responses.You_Are_Not_Logged_In.en,
      });
    });

    it("returns the current user for a valid session cookie", async () => {
      const user = {
        Id: 1,
        Nickname: "student",
        Email: "student@example.com",
        LastLogin: "2026-05-19",
        CreatedAt: "2026-05-01",
      };
      mockedGetUserBySessionToken.mockResolvedValueOnce(user);

      const response = await request(app)
        .post("/api/auth/authenticate")
        .set("language", "en")
        .set("Cookie", ["sessiontoken=session-token"])
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        user,
      });
    });
  });

  describe("POST /api/auth/logout", () => {
    it("destroys a valid session and clears the session cookie", async () => {
      mockedGetUserBySessionToken.mockResolvedValueOnce({
        Id: 1,
        Nickname: "student",
        Email: "student@example.com",
        LastLogin: "2026-05-19",
        CreatedAt: "2026-05-01",
      });

      const response = await request(app)
        .post("/api/auth/logout")
        .set("language", "en")
        .set("Cookie", ["sessiontoken=session-token"])
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: responses.Logout_Successful.en,
      });
      expect(mockedDestroySession).toHaveBeenCalledWith("session-token");
      expect(response.headers["set-cookie"][0]).toContain("sessiontoken=;");
    });

    it("rejects logout when the session cookie is invalid", async () => {
      mockedGetUserBySessionToken.mockResolvedValueOnce(null);

      const response = await request(app)
        .post("/api/auth/logout")
        .set("language", "en")
        .set("Cookie", ["sessiontoken=bad-token"])
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: false,
        message: responses.You_Are_Not_Logged_In.en,
      });
      expect(mockedDestroySession).not.toHaveBeenCalled();
    });
  });

  describe("POST /api/auth/changepassword", () => {
    it("changes the password when the session and current password are valid", async () => {
      const user = {
        Id: 1,
        Nickname: "student",
        Email: "student@example.com",
        LastLogin: "2026-05-19",
        CreatedAt: "2026-05-01",
      };
      mockedGetUserBySessionToken.mockResolvedValueOnce(user).mockResolvedValueOnce(user);
      mockedCheckPassword.mockResolvedValueOnce(true);
      mockedUpdatePassword.mockResolvedValueOnce({ affectedRows: 1 } as any);

      const response = await request(app)
        .post("/api/auth/changepassword")
        .set("language", "en")
        .set("Cookie", ["sessiontoken=session-token"])
        .send({
          CurrentPassword: "secret1",
          NewPassword: "secret2",
          NewPasswordConfirm: "secret2",
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: responses.Successfully_Changed_Password.en,
      });
      expect(mockedUpdatePassword).toHaveBeenCalledWith(1, "secret2");
    });

    it("rejects a mismatched password confirmation", async () => {
      mockedGetUserBySessionToken.mockResolvedValueOnce({
        Id: 1,
        Nickname: "student",
        Email: "student@example.com",
        LastLogin: "2026-05-19",
        CreatedAt: "2026-05-01",
      });

      const response = await request(app)
        .post("/api/auth/changepassword")
        .set("language", "en")
        .set("Cookie", ["sessiontoken=session-token"])
        .send({
          CurrentPassword: "secret1",
          NewPassword: "secret2",
          NewPasswordConfirm: "different",
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: false,
        message: responses.Passwords_Do_Not_Match.en,
      });
      expect(mockedGetUserBySessionToken).toHaveBeenCalledTimes(1);
      expect(mockedUpdatePassword).not.toHaveBeenCalled();
    });
  });

  describe("auth guard middleware", () => {
    it("prevents login when the request already has a valid session", async () => {
      mockedValidateSessionToken.mockResolvedValueOnce(true);

      const response = await request(app)
        .post("/api/auth/login")
        .set("language", "en")
        .set("Cookie", ["sessiontoken=session-token"])
        .send({
          Email: "student@example.com",
          Password: "secret1",
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: false,
        message: responses.Already_Logged_In.en,
      });
      expect(mockedAuthenticateUser).not.toHaveBeenCalled();
    });
  });
});
