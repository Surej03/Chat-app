import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    fullName: {type: String, required: true},
    password: {type: String, required: true},
    profilePic: {type: String, default: ""},
    profilePicId: {type: String, default: ""},
    bio: {type: String},
},
{timestamps: true}
);

// mongoose.models.user will check the existing models in the name of user if not ("||")OR operator will execute
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;