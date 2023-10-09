const User = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

module.exports.login = (req, res) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if(user && user.active){
            bcrypt.compare(req.body.password, user.password)
            .then(match => {
                if(match){
                    const token = jwt.sign(
                        {sub: user.id, exp: Date.now()/1000 + 300},
                        "super-secret"
                    )
                    res.json({token})
                } else {
                    res.status(401).json({message: "Unauthorized"})
                }
            })
        } else {
            res.status(400).json({message: "email not found or user is not active"})
        }
    })
}

module.exports.create = (req, res) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        req.body.password = hash
        console.log("body: " + JSON.stringify(req.body))
        User.create(req.body)
        .then((user) => {
            res.status(201).json(user)
        })
        .catch(() => {
            res.status(400).json({
                message: "Error creating user"
            })
        })
    })
    
}

module.exports.activate = (req, res) => {
    User.findByIdAndUpdate(req.query.key, {active: true}, { 
        new: true, runValidators: true
    })
    .then(user => {
        if(user)
            res.status(200).json({message: "User successfully verified"})
        else
            res.status(404).json({message: "User not verify"})
    })
    .catch(() => {
        res.status(400).json({
            message: "Error verifying user"
        })
    })
}

module.exports.list = (req, res) => {
    const criteria = {}
    if(req.query.name){
        criteria.name = new RegExp(req.query.name, "i")
    }
    User.find(criteria)
    .populate("posts")
    .then((users) => {
        res.json(users)
    })
}

module.exports.detail = (req, res) => {
    User.findById(req.params.id).then((user) => {
        if(user)
            res.status(200).json(user)
        else
            res.status(404).json({message: "User not found"})
    })
}

module.exports.update = (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, { 
        new: true, runValidators: true
    })
    .then(user => {
        if(user)
            res.status(200).json(user)
        else
            res.status(404).json({message: "User not found"})
    })
    .catch(() => {
        res.status(400).json({
            message: "Error updating user"
        })
    })
}

module.exports.delete = (req, res) => {
    User.findByIdAndDelete(req.params.id)
    .then(user => {
        if(user)
            res.status(204).json(user)
        else
            res.status(404).json({message: "User not found"})
    })
}
