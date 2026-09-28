import { createContext, use, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import io from "socket.io-client"

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  axios.defaults.baseURL = backendUrl
  console.log(backendUrl)
  const [loginState, setLoginState] = useState("signup");
  const [selectedUser, setSelectedUser] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [showRightSidebar, setShowRightSidebar] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null);
  const menuRef = useRef();
  const rightSidebarRef = useRef()
  const navigate = useNavigate();


  // check if user is authenticated and if so, set the user data and connect the socket
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check", {withCredentials: true});
      if (data.success) {
        setAuthUser(data.user)
        localStorage.setItem("authUser", JSON.stringify(data.user));
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Login function to handle user authentication and socket connection
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials, {withCredentials: true});

      // Check if backend returned a user object
      if (data && data._id) {
        setAuthUser(data);                  // store user data in context
        localStorage.setItem("authUser", JSON.stringify(data));

        if(data.token){
          setToken(data.token);
        }
        connectSocket(data);              // connect socket with user info
        toast.success(`${state === 'signup' ? 'Account created' : 'Logged in'} successfully`);

        // Optionally generate a token from cookie if backend sets it
        // Axios will automatically send cookie if backend is configured
      } else {
        toast.error('Invalid response from server');
      }
    } catch (error) {
      // Show backend error message if available
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };


// Logout function to handle user logout and socket disconnection
const logout = async () => {
  try {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
    setAuthUser(null);
    setOnlineUsers([]);
    if (socket) socket.disconnect();
    toast.success("Logged out successfully");
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};


  // Update profile function to handle user profile updates
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body, {withCredentials: true});
      if (data.success) {
        setAuthUser(data.user);
        localStorage.setItem("authUser", JSON.stringify(data.user));
        toast.success("Profile updated successfully")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  // connects socket function to handle socket connection and online users updates
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id
      }
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds)
    })
  }

  useEffect(()=>{
    const storedUser = localStorage.getItem("authUser");
    if(storedUser){
      setAuthUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
      if (rightSidebarRef.current && !rightSidebarRef.current.contains(e.target)) {
        setShowRightSidebar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [])

  const value = {
    axios, loginState, setLoginState, selectedUser, setSelectedUser, authUser, setAuthUser, onlineUsers, setOnlineUsers, showRightSidebar, setShowRightSidebar, menuOpen, setMenuOpen, selectedImage, setSelectedImage, menuRef, rightSidebarRef, navigate, socket, setSocket, login, logout, updateProfile
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )

}

export default AppContextProvider;