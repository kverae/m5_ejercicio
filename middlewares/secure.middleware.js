const jwt = require("jsonwebtoken")

module.exports.checkAuth = (req, res, next) => {
    try {
        const authorization = req.headers.authorization
        const token = authorization.split("Bearer ")[1] // Bearer xxxx
        const decoded = jwt.verify(token, "super-secret")
        req.user = decoded.sub
        next()
    } catch(err){
        console.error(err)
        return res.status(401).json({message: "Unauthorized", error: err})
    }
}