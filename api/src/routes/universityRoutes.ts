import { Router } from "express";
import { getUniversities, getUniversity, getUniversityFaculties } from "../controllers/universityController";

const router = Router({ mergeParams: true });

router.get("/", getUniversities);
router.get("/:id", getUniversity);
router.get("/:id/faculties", getUniversityFaculties);

export default router;
