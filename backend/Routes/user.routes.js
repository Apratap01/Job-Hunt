import express from 'express'
import { login, logout, register, updateProfile } from '../controllers/user.controller.js';
import isAthenticated from '../middlewares/isAuth.js';


const router = express.Router();

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/profile/update").post(isAthenticated,updateProfile)
router.route("/logout").post(logout)

export default router;