import UserModel from "../models/userModel.js"
import cloudinary from "../config/cloudinary.js";
import MessageModel from "../models/messageModel.js";
import { io, userSocketMap } from "../server.js";


//displaying users in the sidebar
export const getUsersForSidebar = async(req, res) =>{
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await UserModel.find({ _id: { $ne: loggedInUserId} }).select("-password")

        res.status(200).json({
            success: true,
            users: filteredUsers,
            loggedInUserId: req.user._id
        });

    } catch (error) {
        console.error("Error in getUsersForSidebar controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}


//get both users message
export const getMessages = async(req, res) => {
    try {
        // this id should be called in the message routes to get the particular user's chat
        // id is renamed to userChatId, for the better code readability
        const {id: userToChatId} = req.params
        const myId = req.user._id;

        const messages = await MessageModel.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId},
            ]
        })

        res.status(200).json({success : true, messages});


    } catch (error) {
        console.error("Error in getMessages controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

//To send messages
export const sendMessage = async(req, res) =>{
    try {
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image){
            // upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new MessageModel({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save()

        // todo: realtime functionality goes here by socket.io
        //emit the new messages to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessages", newMessage)
        }

        res.status(201).json({success: true, newMessage});
    } catch (error) {
        console.error("Error in sendMessage controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

// api to mark message as seen using message id
export const markMessageAsSeen = async(req, res) =>{
    try {
        const {id} = req.params;
        await MessageModel.findByIdAndUpdate(id, {seen:true})
        res.json({success:true})
    } catch (error) {
        console.error("Error in markMessageAsSeen controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}
