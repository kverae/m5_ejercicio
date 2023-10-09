const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        minlength: 5
    },
    text: {
        type: String,
        require: true,
        minlength: 5
    },
    image: {
        type: String,
        require: true
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        require: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = doc._id
            delete ret._id
            delete ret.__v
            return ret
        }
    }
})

const Post = mongoose.model("Post", schema)

module.exports = Post;