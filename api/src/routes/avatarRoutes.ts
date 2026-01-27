import { Router } from "express";
import { promises as fs } from "fs";
import path from "path";

const router = Router();

router.get("/:id", async (req, res) => {
  const uploadRoot = path.resolve(__dirname, "..", "..", "public/avatars");
  const fileName = req.params.id;
  const filePath = path.join(uploadRoot, fileName);

  const fallbackPath = path.join(__dirname, "..", "..", "public/avatars", "DefaultAvatar.svg");

  try {
    await fs.access(filePath);
    return res.sendFile(filePath);
  } catch {
    return res.sendFile(fallbackPath);
  }
});

export default router;
