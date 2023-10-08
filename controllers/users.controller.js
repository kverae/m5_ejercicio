const User = require("../models/user.model")

module.exports.create = (req, res) => {
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
}

module.exports.list = (req, res) => {
    const criteria = {}
    if(req.query.name){
        criteria.name = new RegExp(req.query.name, "i")
    }
    User.find(criteria).then((users) => {
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
