const express = require('express');
const verifyToken = require('../../middlewares/auth');



const router = express.Router();

const authController = require("./auth.controller");

router.get("/", verifyToken, authController.checkLogged)

router.get("/verify/:token", authController.verifySuccess)

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", verifyToken, authController.logout);

router.post("/refresh", authController.requestRefreshToken);


module.exports = router;