import { text } from "express";
import mongoose, { mongo } from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
    },
    text:{
        type: String,
    },
    image:{
        type: String,
    },
},
{timestamps: true}
);

const MessageModel = mongoose.model("Message", messageSchema);

export default MessageModel;