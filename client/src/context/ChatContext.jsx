import {createContext, useContext, useEffect, useState } from "react";
import { AppContext } from "./AppContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

const ChatContextProvider = ({children}) =>{

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const {socket, axios} = useContext(AppContext)

    //function to get all user for sidebar
    const getUsers = async () =>{
        try {
            const {data} = await axios.get("/api/messages/users", {withCredentials: true});
            if(data.success){
      // filter out the logged-in user
      const loggedInUserId = data.loggedInUserId; 
      setUsers(data.users.filter(user => user._id !== loggedInUserId))
      setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        getUsers();
    }, [])

    //function  to get messages for selected users;
    const getMessages = async(userId) =>{
        try {
            const {data} = await axios.get(`/api/messages/${userId}`, {withCredentials: true});
            if(data.success){
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to send messages to selected users
    const sendMessages = async(messageData) =>{
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData, {withCredentials: true});
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages, data.newMessage])
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to get messages for selected users
    const getInstantMessages = async() =>{
        if(!socket) return;

        socket.on("newMessages", (newMessage) =>{
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((prevMessages)=>[...prevMessages, newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`, {withCredentials: true})
            }else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages,[newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? 
                    prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    // function to get messages for selected users
    const unsubFromMessages = async() =>{
        if(socket) socket.off("newMessages");
    }

    useEffect(()=>{
        getInstantMessages();
        return ()=> unsubFromMessages();
    },[socket, selectedUser])

    const value = {
        messages, setMessages, users, setUsers, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages, getUsers, getMessages, sendMessages, unsubFromMessages
    }

    return(
        <ChatContext.Provider value = {value}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatContextProvider;