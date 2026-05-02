const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
        unique: true
    },
    bio: {
        type: String,
        default: ""
    },
    profilePicture: {
        type: String,
        default: ""
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth"
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth"
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);