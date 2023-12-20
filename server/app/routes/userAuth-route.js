import express from 'express';
import * as userAuthController from '../controller/userAuth-controller.js';
import authenticateUser from '../middleware/userAuth-middleware.js';

const router = express.Router();

router.route("/signUp")
        .post(userAuthController.registerUser);

router.route("/signIn")
        .post(userAuthController.login);

router.route("/signOut")
        .post(authenticateUser,userAuthController.logout);

router.route("/verifyEmail")
        .post(userAuthController.verifyEmail);

export default router;