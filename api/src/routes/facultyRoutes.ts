import { Router } from "express";
import { getFaculty, getFacultyCourses } from "../controllers/facultyController";

const router = Router({ mergeParams: true });

router.get("/:id", getFaculty);
router.get("/:id/courses", getFacultyCourses);

export default router;
