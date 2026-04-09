import { Router } from "express";
import { deleteNote, editNode, getNote, getNotes } from "../controllers/notesController";
import { createComment, getNoteComments } from "../controllers/commentController";

const router = Router({ mergeParams: true });

router.get("/:id", getNote);
router.delete("/:id", deleteNote);
router.put("/:id", editNode);
router.get("/", getNotes);

router.get("/:id/comments", getNoteComments);
router.post("/:id/comments", createComment);

export default router;
