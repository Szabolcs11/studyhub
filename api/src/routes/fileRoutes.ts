import { Router } from "express";
import { isAuthenticated } from "../services/isAuthenticated";
import { upload } from "../config/multer";
import { uploadFile, deleteFile, downloadFile } from "../controllers/fileController";

const router = Router();

router.post("/upload", isAuthenticated, upload.single("file"), uploadFile);

router.get("/:filename", downloadFile);

router.delete("/delete/:filename", isAuthenticated, deleteFile);

export default router;
