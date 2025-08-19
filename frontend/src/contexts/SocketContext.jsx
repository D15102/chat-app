import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import useUser from "./UserContext";
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useUser();
  useEffect(() => {
    if (user) {
      const socket = io(import.meta.env.VITE_SERVER_URL, {
        query: {
          userId: user._id,
        },
      });
      setSocket(socket);
      socket.on("getOnline", (users) => {
        console.log(users);
        setOnlineUsers(users);
      });
      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
const useSocketContext = () => {
  return useContext(SocketContext);
};

export default useSocketContext;
