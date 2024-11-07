import { Router } from "express";
import * as Controller from "./task.controller.js";
import { isAuth } from "../../middlewares/auth.js";
import { asyncHanndler } from "../../utils/errorHandling.js";

const router = Router();

router.post("/" , isAuth() , asyncHanndler(Controller.createTask));

router.put("/update/:_id", isAuth() , asyncHanndler(Controller.updateTask));
router.put("/mark/:_id", isAuth() , asyncHanndler(Controller.markTask));

router.get("/", isAuth() , asyncHanndler(Controller.getTasks));
router.get("/:_id", isAuth() , asyncHanndler(Controller.getTaskById));
router.get("/status/:status", isAuth() , asyncHanndler(Controller.getTasksByStatus));

router.delete("/:_id", isAuth() , asyncHanndler(Controller.deleteTask));

export default router;