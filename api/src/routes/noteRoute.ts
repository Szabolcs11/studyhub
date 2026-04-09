import { Router } from "express";
import { deleteNote, editNode, getNote, getNotes } from "../controllers/notesController";
import { createComment, getNoteComments } from "../controllers/commentController";
import { likeNote } from "../controllers/likeController";

const router = Router({ mergeParams: true });

router.get("/:id", getNote);
router.delete("/:id", deleteNote);
router.put("/:id", editNode);
router.get("/", getNotes);

router.get("/:id/comments", getNoteComments);
router.post("/:id/comments", createComment);

router.post("/:id/like", likeNote);

export default router;
