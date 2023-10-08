const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true
    },
    bio: {
        type: String,
        maxlength: 200
    },
    password: {
        type: String,
        require: true
    },
    avatar: {
        type: String
    }
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = doc._id
            delete ret._id
            delete ret.__v
            delete ret.password
            return ret
        }
    }
})

const User = mongoose.model("User", schema)

module.exports = User;