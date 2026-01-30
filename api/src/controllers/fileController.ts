import { Request, Response } from "express";
import responses from "../responses/errorResponses.json";
import { language } from "../types";
import { returnError } from "../utils";
import path from "path";
import { promises as fs } from "fs";

export const uploadFile = async (req: Request, res: Response) => {
  const lang = (req.headers.language as language) || "hu";

  try {
    if (!req.file) {
      return returnError(res, { en: "No file provided" }, lang);
    }

    res.status(200).json({
      success: true,
      message: responses.Successfully_Uploaded_File[lang],
      data: req.file.filename,
    });
  } catch (error: any) {
    returnError(res, { en: error.message, hu: error.message }, lang);
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  const lang = (req.headers.language as language) || "hu";

  try {
    const { filename } = req.params;

    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return returnError(res, responses.Invalid_Filename, lang);
    }

    const filePath = path.join(__dirname, "../../public/uploads", filename);

    await fs.unlink(filePath);

    res.status(200).json({
      success: true,
      message: { en: "File deleted successfully", hu: "Fájl sikeresen törölve" },
    });
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return returnError(res, { en: "File not found", hu: "Fájl nem található" }, lang);
    }
    returnError(res, { en: error.message, hu: error.message }, lang);
  }
};

export const downloadFile = async (req: Request, res: Response) => {
  const lang = (req.headers.language as language) || "hu";

  try {
    const { filename } = req.params;

    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return returnError(res, responses.Invalid_Filename, lang);
    }

    const filePath = path.join(__dirname, "../../public/uploads", filename);

    await fs.access(filePath);

    res.download(filePath);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return returnError(res, { en: "File not found", hu: "Fájl nem található" }, lang);
    }
    returnError(res, { en: error.message, hu: error.message }, lang);
  }
};
