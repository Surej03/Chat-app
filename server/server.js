import express from 'express';
import 'dotenv/config';
import cors from "cors"
import http from "http"
import cookieParser from "cookie-parser";
import helmet from "helmet";
import connectDB from './config/mongodb.js';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { Server } from 'socket.io';
 
// Create express app and http server
const app = express();
const server = http.createServer(app)

// Initialize socket.io server
export const io = new Server(server, {
    cors: {origin:"*"}
})

// Store online users
export const userSocketMap = {}; //{userId: socketId}

// Scoket.io handler function
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User connected", userId);

    // when the user is available will add the socket id to the userSocketMap
    if(userId) userSocketMap[userId] = socket.id
     
    // Emit online users to all connected clients;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", ()=>{
        console.log("User disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
        
    })
})

const PORT = process.env.PORT || 5000;

// middleware setup
app.use(express.json({limit: "10mb"}));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use(cookieParser())
// Secure HTTP headers
app.use(helmet());

await connectDB();

//Routes
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

//npm run server
app.use("/api/status", (req, res)=> res.send("Server is alive!"))


server.listen(PORT, () => {
    console.log(`App is running at port ${PORT}`)
})