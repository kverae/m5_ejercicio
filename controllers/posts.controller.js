const Post = require("../models/post.model")

module.exports.create = (req, res) => {
    console.log("body: " + JSON.stringify(req.body))
    console.log("file: " + JSON.stringify(req.file))
    req.body.author = req.user
    req.body.image = req.file.path
    Post.create(req.body)
        .then((post) => {
            res.status(201).json(post)
        })
        .catch(() => {
            res.status(400).json({
                message: "Error creating post"
            })
        })
}

module.exports.list = (req, res) => {
    const criteria = {}
    if(req.query.author){
        criteria.author = new RegExp(req.query.author, "i")
    }
    Post.find(criteria)
    .populate("author") // carga los registro de user en author, no solo el id
    .then((posts) => {
        res.json(posts)
    })
}

module.exports.detail = (req, res) => {
    Post.findById(req.params.id).then((post) => {
        if(post)
            res.status(200).json(post)
        else
            res.status(404).json({message: "Post not found"})
    })
}

module.exports.update = (req, res) => {
    Post.findByIdAndUpdate(req.params.id, req.body, { 
        new: true, runValidators: true
    })
    .then(post => {
        if(post)
            res.status(200).json(post)
        else
            res.status(404).json({message: "Post not found"})
    })
    .catch(() => {
        res.status(400).json({
            message: "Error updating post"
        })
    })
}

module.exports.delete = (req, res) => {
    console.log("delete id: " + req.params.id)
    Post.findByIdAndDelete(req.params.id)
    .then(post => {
        if(post)
            res.status(204).json(post)
        else
            res.status(404).json({message: "Post not found"})
    })
}
