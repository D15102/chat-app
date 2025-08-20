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
  lastConversationMessage,
  setLastConversationMessage,
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

      setConversations((prev) => [...prev, data.newMessage]);
      setShowConversations(true);
      setMessage("");
    } catch (error) {
      console.log(error);
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

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, setConversations]);

  useEffect(() => {
    setLastConversationMessage(conversations[conversations.length - 1]?.message);
  }, [conversations]);

  return (
    <div className="w-full flex flex-col justify-center items-center dark:bg-gray-900">
      {selectedChatUser ? (
        <>
          {/* Top Chat Header */}
          <div className="px-1 py-2 transition-colors ease-out duration-150 flex justify-baseline items-center space-x-4 cursor-default text-black dark:text-white w-full h-16 bg-slate-300 dark:bg-gray-800 shadow z-20">
            <img
              src={selectedChatUser.profilePicture}
              alt=""
              className="rounded-full w-12 h-12 object-cover border-3 border-black dark:border-red-400"
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

          {/* Chat Section */}
          <div className="w-full h-full flex flex-col">
            {/* Messages Area */}
            <div className="w-full h-full bg-lime-50 dark:bg-gray-900 flex flex-col space-y-4 py-4 px-2 overflow-y-auto">
              {Array.isArray(conversations) &&
              conversations.length > 0 &&
              showConversations ? (
                conversations.map((conversation, idx) => {
                  return (
                    <div
                      key={idx}
                      ref={lastMessageRef}
                      className={`inline-block max-w-[20rem] px-2 py-1 text-sm rounded-lg font-medium 
                      ${
                        conversation.senderId === user._id
                          ? `self-end bg-lime-300 dark:bg-lime-600 dark:text-white`
                          : `self-start bg-blue-200 dark:bg-blue-600 dark:text-white`
                      }
                      `}
                    >
                      {conversation.message}
                      <p className="font-normal text-[9px] text-end text-gray-600 dark:text-gray-300">
                        {conversation.createdAt &&
                          format(new Date(conversation.createdAt), "hh:mm a")}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  No Conversations Yet
                </p>
              )}
            </div>

            {/* Bottom Input Area */}
            <div className="w-full h-17 bg-lime-200 dark:bg-gray-800 flex items-center justify-center px-2 space-x-2">
              <input
                type="text"
                className="w-full p-2 text-sm font-[verdana] bg-white dark:bg-gray-700 dark:text-white rounded-xl border-none outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-gray-500 transition-all duration-150"
                placeholder="Enter A Message.."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSendMessage(selectedChatUser._id)
                }
              />

              <motion.button
                className="p-2 bg-green-300 dark:bg-green-600 rounded-full hover:bg-green-400 dark:hover:bg-green-700 disabled:bg-green-200 dark:disabled:bg-green-900 disabled:cursor-not-allowed text-black dark:text-white"
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
          <p className="text-2xl text-gray-700 dark:text-gray-200 font-medium">
            No Chat Selected Yet..
          </p>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">
            Select From Left Tab 👈
          </p>
        </>
      )}
    </div>
  );
};

export default Right;
