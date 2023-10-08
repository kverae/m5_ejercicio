const express = require("express")
const router = express.Router()
const users = require("../controllers/users.controller")
const posts = require("../controllers/posts.controller")

router.post("/users", users.create)
router.get("/users", users.list)
router.get("/users/:id", users.detail)
router.patch("/users/:id", users.update)
router.delete("/users/:id", users.delete)

router.post("/posts", posts.create)
router.get("/posts", posts.list)
router.get("/posts/:id", posts.detail)
router.patch("/posts/:id", posts.update)
router.delete("/posts/:id", posts.delete)


module.exports = router;