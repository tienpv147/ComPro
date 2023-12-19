import express from "express";
import problem from "./problem";
import accounts from "./accounts";
import ratings from "./ratings";

const router = express.Router();

router.use("/problem", problem);
router.use("/accounts", accounts);
router.use("/ratings", ratings);

export default router;
