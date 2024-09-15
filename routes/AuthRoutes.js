import { Router } from "express";
import { loginUser, registerUser } from "../controllers/AuthControllers.js";

const router = Router();

router.post("/api/v1/auth/login", loginUser);
router.post("/api/v1/auth/register", registerUser);

export default router;