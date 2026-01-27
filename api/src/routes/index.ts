import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import universityRoutes from "./universityRoutes";
import facultyRoutes from "./facultyRoutes";
import courseRoutes from "./courseRoutes";
import noteRoute from "./noteRoute";
import fileRoutes from "./fileRoutes";
import avatarRoutes from "./avatarRoutes";

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);

router.use("/universities", universityRoutes);

router.use("/faculties", facultyRoutes);

router.use("/courses", courseRoutes);

router.use("/notes", noteRoute);

router.use("/files", fileRoutes);

router.use("/avatars", avatarRoutes);

export default router;
