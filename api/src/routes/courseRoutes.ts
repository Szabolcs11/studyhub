import { Router } from "express";
import { getCourse, getCourseNotes } from "../controllers/coursesController";
import { createNote } from "../controllers/notesController";

const router = Router({ mergeParams: true });

router.get("/:id/", getCourse);
router.get("/:id/notes", getCourseNotes);
router.post("/:id/notes", createNote);

export default router;
