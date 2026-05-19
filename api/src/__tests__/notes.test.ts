import { promises as fs } from "fs";
import path from "path";
import request from "supertest";
import app from "../app";
import { userQueries } from "../database/userQueries";
import { getUserBySessionToken } from "../database/authQueries";
import responses from "../responses/errorResponses.json";
import { commentService } from "../services/commentService";
import { likeService } from "../services/likeService";
import { notesService } from "../services/notesService";

jest.mock("../middlewares/logger", () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

jest.mock("../services/notesService", () => ({
  notesService: {
    create: jest.fn(),
    delete: jest.fn(),
    deleteFile: jest.fn(),
    edit: jest.fn(),
    getAllNotes: jest.fn(),
    getNote: jest.fn(),
    getNotesWhereCourseId: jest.fn(),
  },
}));

jest.mock("../services/commentService", () => ({
  commentService: {
    createComment: jest.fn(),
    getCommentById: jest.fn(),
    getNoteComments: jest.fn(),
  },
}));

jest.mock("../services/likeService", () => ({
  likeService: {
    likeNote: jest.fn(),
  },
}));

jest.mock("../database/userQueries", () => ({
  userQueries: {
    findByToken: jest.fn(),
  },
}));

jest.mock("../database/authQueries", () => ({
  changeLastLogin: jest.fn(),
  changePassword: jest.fn(),
  createSession: jest.fn(),
  createUser: jest.fn(),
  deleteSession: jest.fn(),
  findUserByEmail: jest.fn(),
  findUserById: jest.fn(),
  findUserByNickname: jest.fn(),
  getUserBySessionToken: jest.fn(),
  validateSessionToken: jest.fn(),
}));

const mockedNotesService = notesService as jest.Mocked<typeof notesService>;
const mockedCommentService = commentService as jest.Mocked<typeof commentService>;
const mockedLikeService = likeService as jest.Mocked<typeof likeService>;
const mockedUserQueries = userQueries as jest.Mocked<typeof userQueries>;
const mockedGetUserBySessionToken = jest.mocked(getUserBySessionToken);

const uploadDir = path.resolve(__dirname, "../../public/uploads");
const uploadedFiles: string[] = [];

const owner = {
  Id: 1,
  Nickname: "student",
  Email: "student@example.com",
  LastLogin: "2026-05-19",
  CreatedAt: "2026-05-01",
};

describe("note and file routes", () => {
  beforeEach(() => {
    process.env.APP_URL = "http://localhost:5173";
  });

  afterEach(async () => {
    await Promise.all(
      uploadedFiles.splice(0).map(async (fileName) => {
        try {
          await fs.unlink(path.join(uploadDir, fileName));
        } catch (error: any) {
          if (error.code !== "ENOENT") {
            throw error;
          }
        }
      }),
    );
  });

  describe("GET /api/notes", () => {
    it("returns notes and forwards the session token when present", async () => {
      const notes = [
        {
          Id: 10,
          Title: "Calculus notes",
          AttachmentUrl: "/api/files/calculus.pdf",
          Description: "Limits and derivatives",
          UploaderUserId: 1,
          CourseId: 2,
        },
      ];
      mockedNotesService.getAllNotes.mockResolvedValueOnce(notes);

      const response = await request(app).get("/api/notes").set("Cookie", ["sessiontoken=session-token"]);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(notes);
      expect(mockedNotesService.getAllNotes).toHaveBeenCalledWith("session-token");
    });
  });

  describe("GET /api/notes/:id", () => {
    it("returns one note by id", async () => {
      const note = {
        Id: 10,
        CourseId: 2,
        Title: "Calculus notes",
        AttachmentUrl: "/api/files/calculus.pdf",
        Description: "Limits and derivatives",
        UploaderUserId: 1,
        CreatedAt: "2026-05-19",
      };
      mockedNotesService.getNote.mockResolvedValueOnce(note);

      const response = await request(app).get("/api/notes/10").set("Cookie", ["sessiontoken=session-token"]);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(note);
      expect(mockedNotesService.getNote).toHaveBeenCalledWith(10, "session-token");
    });
  });

  describe("POST /api/courses/:id/notes", () => {
    it("rejects note creation without a session cookie", async () => {
      const response = await request(app).post("/api/courses/2/notes").set("language", "en").send({
        Title: "Calculus notes",
        AttachmentUrl: "/api/files/calculus.pdf",
        Description: "Limits and derivatives",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: false,
        message: responses.You_Need_To_Login_To_Use_This_Function.en,
      });
      expect(mockedNotesService.create).not.toHaveBeenCalled();
    });

    it("creates a note for the selected course", async () => {
      mockedNotesService.create.mockResolvedValueOnce(55);

      const response = await request(app)
        .post("/api/courses/2/notes")
        .set("language", "en")
        .set("Cookie", ["sessiontoken=session-token"])
        .send({
          Title: "Calculus notes",
          AttachmentUrl: "/api/files/calculus.pdf",
          Description: "Limits and derivatives",
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: responses.Successfully_Created_Note.en,
        noteId: 55,
      });
      expect(mockedNotesService.create).toHaveBeenCalledWith(
        "Calculus notes",
        "/api/files/calculus.pdf",
        "Limits and derivatives",
        "session-token",
        2,
      );
    });
  });

  describe("DELETE /api/notes/:id", () => {
    it("rejects delete when the current user is not the uploader", async () => {
      mockedNotesService.getNote.mockResolvedValueOnce({
        Id: 10,
        CourseId: 2,
        Title: "Calculus notes",
        AttachmentUrl: "/api/files/calculus.pdf",
        Description: "Limits and derivatives",
        UploaderUserId: 99,
        CreatedAt: "2026-05-19",
      });
      mockedUserQueries.findByToken.mockResolvedValueOnce({ Id: 1 } as any);

      const response = await request(app)
        .delete("/api/notes/10")
        .set("language", "en")
        .set("Cookie", ["sessiontoken=session-token"]);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: false,
        message: responses.Forbidden.en,
      });
      expect(mockedNotesService.delete).not.toHaveBeenCalled();
      expect(mockedNotesService.deleteFile).not.toHaveBeenCalled();
    });

    it("deletes the note and its attachment when the uploader owns it", async () => {
      mockedNotesService.getNote.mockResolvedValueOnce({
        Id: 10,
        CourseId: 2,
        Title: "Calculus notes",
        AttachmentUrl: "/api/files/calculus.pdf",
        Description: "Limits and derivatives",
        UploaderUserId: 1,
        CreatedAt: "2026-05-19",
      });
      mockedUserQueries.findByToken.mockResolvedValueOnce({ Id: 1 } as any);
      mockedNotesService.delete.mockResolvedValueOnce(true);

      const response = await request(app)
        .delete("/api/notes/10")
        .set("language", "en")
        .set("Cookie", ["sessiontoken=session-token"]);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: responses.Successfully_Deleted_Note.en,
      });
      expect(mockedNotesService.deleteFile).toHaveBeenCalledWith("calculus.pdf");
      expect(mockedNotesService.delete).toHaveBeenCalledWith(10);
    });
  });

  describe("PUT /api/notes/:id", () => {
    it("edits the note when the uploader owns it", async () => {
      mockedNotesService.getNote.mockResolvedValueOnce({
        Id: 10,
        CourseId: 2,
        Title: "Old title",
        AttachmentUrl: "/api/files/old.pdf",
        Description: "Old description",
        UploaderUserId: 1,
        CreatedAt: "2026-05-19",
      });
      mockedUserQueries.findByToken.mockResolvedValueOnce({ Id: 1 } as any);
      mockedNotesService.edit.mockResolvedValueOnce(true);

      const response = await request(app)
        .put("/api/notes/10")
        .set("language", "en")
        .set("Cookie", ["sessiontoken=session-token"])
        .send({
          Title: "Updated title",
          AttachmentUrl: "/api/files/new.pdf",
          Description: "Updated description",
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: responses.Successfully_Edited_Note.en,
      });
      expect(mockedNotesService.edit).toHaveBeenCalledWith(
        10,
        "Updated title",
        "/api/files/new.pdf",
        "Updated description",
        "session-token",
      );
    });
  });

  describe("comments and likes", () => {
    it("creates a comment for a note", async () => {
      const comment = {
        id: 7,
        Text: "Helpful note",
        CreatedAt: "2026-05-19",
        UserId: 1,
        Username: "student",
      };
      mockedCommentService.createComment.mockResolvedValueOnce(7);
      mockedCommentService.getCommentById.mockResolvedValueOnce(comment as any);

      const response = await request(app)
        .post("/api/notes/10/comments")
        .set("language", "en")
        .set("Cookie", ["sessiontoken=session-token"])
        .send({ content: "Helpful note" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, comment });
      expect(mockedCommentService.createComment).toHaveBeenCalledWith(10, "session-token", "Helpful note");
    });

    it("toggles a note like for the authenticated user", async () => {
      mockedUserQueries.findByToken.mockResolvedValueOnce({ Id: 1 } as any);
      mockedLikeService.likeNote.mockResolvedValueOnce(true);

      const response = await request(app).post("/api/notes/10/like").set("Cookie", ["sessiontoken=session-token"]);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: responses.Successfully_Liked_Note.hu,
        liked: true,
      });
      expect(mockedLikeService.likeNote).toHaveBeenCalledWith(10, 1);
    });
  });

  describe("file upload/download/delete", () => {
    it("uploads, downloads, and deletes an authenticated note attachment", async () => {
      mockedGetUserBySessionToken.mockResolvedValue({ ...owner });

      const uploadResponse = await request(app)
        .post("/api/files/upload")
        .set("language", "en")
        .set("Cookie", ["sessiontoken=session-token"])
        .attach("file", Buffer.from("StudyHub upload test"), {
          filename: "notes-test.txt",
          contentType: "text/plain",
        });

      expect(uploadResponse.status).toBe(200);
      expect(uploadResponse.body.success).toBe(true);
      expect(uploadResponse.body.message).toBe(responses.Successfully_Uploaded_File.en);
      expect(uploadResponse.body.data).toMatch(/^notes-test-\d+-\d+\.txt$/);

      const uploadedFileName = uploadResponse.body.data as string;
      uploadedFiles.push(uploadedFileName);

      await expect(fs.access(path.join(uploadDir, uploadedFileName))).resolves.toBeUndefined();

      const downloadResponse = await request(app).get(`/api/files/${uploadedFileName}`).set("language", "en");

      expect(downloadResponse.status).toBe(200);
      expect(downloadResponse.headers["content-disposition"]).toContain(`filename="${uploadedFileName}"`);
      expect(downloadResponse.text).toBe("StudyHub upload test");

      const deleteResponse = await request(app)
        .delete(`/api/files/delete/${uploadedFileName}`)
        .set("language", "en")
        .set("Cookie", ["sessiontoken=session-token"]);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.success).toBe(true);
      expect(deleteResponse.body.message.en).toBe("File deleted successfully");

      uploadedFiles.pop();
      await expect(fs.access(path.join(uploadDir, uploadedFileName))).rejects.toMatchObject({ code: "ENOENT" });
    });

    it("rejects upload when the user is not authenticated", async () => {
      mockedGetUserBySessionToken.mockResolvedValueOnce(null);

      const response = await request(app)
        .post("/api/files/upload")
        .set("language", "en")
        .set("Cookie", ["sessiontoken=bad-token"])
        .attach("file", Buffer.from("StudyHub upload test"), {
          filename: "notes-test.txt",
          contentType: "text/plain",
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: false,
        message: responses.You_Are_Not_Logged_In.en,
      });
    });
  });
});
