import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import useChatUsers from "../contexts/ChatUsersContext";
import API from "../../config/axios";
import useConversations from "../contexts/ConversationContext";
import useUser from "../contexts/UserContext";
import useSocketContext from "../contexts/SocketContext";
import { format } from "date-fns";

const Right = ({
  selectedChatUser,
  message,
  setMessage,
  showConversations,
  setShowConversations,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { chatUsers } = useChatUsers();
  const { user } = useUser();
  const { conversations, setConversations } = useConversations();
  const { onlineUsers, socket } = useSocketContext();
  const lastMessageRef = useRef(null);
  const handleSendMessage = async (id) => {
    if (!message) {
      setIsLoading(false);
      return toast("Give Some Message.. ℹ️");
    }
    try {
      setIsLoading(true);
      const res = await API.post(`/message/send/${id}`, { message });
      const data = res.data;
      console.log(data);

      setConversations((prev) => [...prev, data.newMessage]);
      setShowConversations(true);
      setMessage("");
    } catch (error) {
      console.log(error);
    }
    try {
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }, [conversations]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      setConversations((prev) => [...prev, message]);
    };

    socket.on("newMessage", handleNewMessage);

    // cleanup when component unmounts or socket changes
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, setConversations]);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      {selectedChatUser ? (
        <>
          <div className="px-1 py-2 transition-colors ease-out duration-150 flex justify-baseline items-center space-x-4 cursor-default text-black dark:text-white w-full h-16 bg-slate-300 dark:bg-gray-800 shadow z-20">
            <img
              src={selectedChatUser.profilePicture}
              alt=""
              className="rounded-full w-12 h-12 object-cover"
            />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">{selectedChatUser.username}</p>
              <p className="text-xs font-normal">
                {onlineUsers.includes(selectedChatUser._id)
                  ? "online"
                  : "offline"}
              </p>
            </div>
          </div>

          <div className="w-full h-full flex flex-col">
            {/* Messages Area */}
            <div className="w-full h-full bg-lime-50 flex flex-col space-y-4 py-4 px-2">
              {Array.isArray(conversations) &&
              conversations.length > 0 &&
              showConversations ? (
                conversations.map((conversation, idx) => (
                  <div
                    key={idx}
                    ref={lastMessageRef}
                    className={`inline-block max-w-[20rem] px-2 py-1 text-sm rounded-lgfont-medium 
                      ${
                        conversation.senderId === user._id
                          ? `self-end bg-lime-300`
                          : `self-start bg-blue-200`
                      }
                      `}
                  >
                    {conversation.message}
                    <p className="font-normal text-[9px] text-end">
                      {conversation.createdAt &&
                        format(new Date(conversation.createdAt), "hh:mm a")}
                    </p>
                  </div>
                ))
              ) : (
                <p>No Conversations Yet</p>
              )}
            </div>

            {/* Bottom Input Area */}
            <div className="w-full h-17 bg-lime-200 flex items-center justify-center px-2 space-x-2">
              <input
                type="text"
                className="w-full p-2 text-sm font-[verdana] bg-white rounded-xl border-none outline-none focus:ring-2 focus:ring-slate-400 transition-all duration-150"
                placeholder="Enter A Message.."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSendMessage(selectedChatUser._id)
                }
              />

              <motion.button
                className="p-2 bg-green-300 rounded-full hover:bg-green-400 disabled:bg-green-200 disabled:cursor-not-allowed"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                }}
                disabled={isLoading}
                onClick={(e) => handleSendMessage(selectedChatUser._id)}
              >
                <Send size={23} />
              </motion.button>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="text-2xl text-gray-700 font-medium">
            No Chat Selected Yet..
          </p>
          <p className="text-xl text-gray-500 font-medium">
            Select From Left Tab 👈
          </p>
        </>
      )}
    </div>
  );
};

export default Right;
