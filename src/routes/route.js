const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")

router.post("/login", userController.loginUser)
router.post("/register", userController.createUser)
router.get("/user/:userId/profile", userController.getUser)
router.put("/user/:userId/profile", userController.updateUser)

module.exports = router