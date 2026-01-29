import { Router } from "express";
import { register, login, logout, authenticate, changePassword } from "../controllers/authController";
import { validateLoginInput, validateRegisterInput } from "../validators/authValidator";
import { isAlreadyLoggedIn } from "../services/isAlreadyLoggedIn";
import { isAuthenticated } from "../services/isAuthenticated";

const router = Router();

router.post("/register", isAlreadyLoggedIn, validateRegisterInput, register);
router.post("/login", isAlreadyLoggedIn, validateLoginInput, login);
router.post("/logout", isAuthenticated, logout);
router.post("/authenticate", authenticate);
router.post("/changepassword", isAuthenticated, changePassword);

export default router;
