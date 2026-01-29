import { Router } from "express";
import { deleteNote, editNode, getNote, getNotes } from "../controllers/notesController";

const router = Router({ mergeParams: true });

router.get("/:id", getNote);
router.delete("/:id", deleteNote);
router.put("/:id", editNode);
router.get("/", getNotes);

export default router;
