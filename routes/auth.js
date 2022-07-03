const { Router } = require("express");

const authController = require("../controllers/auth");

const router = Router();

router.post("/sign-up", authController.signUp);

module.exports = router;
