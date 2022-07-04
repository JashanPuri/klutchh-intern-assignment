const { Router } = require("express");

const authController = require("../controllers/auth");

const router = Router();

// sign up user
router.post("/sign-up", authController.signUp);

// sign in user
router.post("/sign-in", authController.signIn);

module.exports = router;
