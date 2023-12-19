import express from 'express';
import * as userAuthController from '../controller/userAuth-controller.js';

const router = express.Router();

router.route("/signUp")
        .post(userAuthController.registerUser);

router.route("/signIn")
        .post(userAuthController.login);

export default router;