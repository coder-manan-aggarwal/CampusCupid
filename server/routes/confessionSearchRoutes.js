import express from "express";
import { searchConfessions } from "../controllers/confessionSearchController.js";

const router = express.Router();

router.get("/search", searchConfessions);

export default router;
