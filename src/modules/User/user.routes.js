import { Router } from "express";
import * as Controller from './user.controller.js';
import { isAuth } from "../../middlewares/auth.js";
import { asyncHanndler } from "../../utils/errorHandling.js";

const router = Router();

router.post('/signup', asyncHanndler(Controller.SignUp));
router.post('/login', asyncHanndler(Controller.SignIn));

router.put('/profile', isAuth(), asyncHanndler(Controller.updateProfile));

router.delete('/', isAuth(), asyncHanndler(Controller.deleteProfile));

export default router;