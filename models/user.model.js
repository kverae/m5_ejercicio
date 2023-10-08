const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        match: [/.+\@.+\..+/, 'Por favor ingrese un correo válido'] // <- Validación regexp para correo
    },
    bio: {
        type: String,
        maxlength: 200
    },
    password: {
        type: String,
        require: true
    },
    active: {
        type: Boolean,
        default: false
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