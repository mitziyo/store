import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";

// Start 6
router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
// End 6

export default router;
