const express = require("express")
const router = express.Router()
const users = require("../controllers/users.controller")
const posts = require("../controllers/posts.controller")
const middleware = require("../middlewares/secure.middleware")

router.post("/users/login", users.login)
router.post("/users", users.create)
router.get("/users", middleware.checkAuth, users.list)
router.get("/users/:id", middleware.checkAuth, users.detail)
router.patch("/users/:id", users.update)
router.delete("/users/:id", middleware.checkAuth, users.delete)

router.post("/posts", middleware.checkAuth, posts.create)
router.get("/posts", middleware.checkAuth, posts.list)
router.get("/posts/:id", middleware.checkAuth, posts.detail)
router.patch("/posts/:id", middleware.checkAuth, posts.update)
router.delete("/posts/:id", middleware.checkAuth, posts.delete)


module.exports = router;