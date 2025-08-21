import { Languages, Mic, Mic2, Send, TypeOutline } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import useChatUsers from "../contexts/ChatUsersContext";
import API from "../../config/axios";
import useConversations from "../contexts/ConversationContext";
import useUser from "../contexts/UserContext";
import useSocketContext from "../contexts/SocketContext";
import { format } from "date-fns";
import useSpeechToText from "react-hook-speech-to-text";
import { SparklesTextDemo } from "./SparklesText.jsx";

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
  const [translatedText, setTranslatedText] = useState("");
  const [translationTextId, setTranslationTextId] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateTextOrNoT, setTranslateTextOrNoT] = useState(false);
  const lastMessageRef = useRef(null);

  //speech to text configuration
  const {
    isRecording,
    error,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

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
      setResults([]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async (conversation) => {
    try {
      setTranslatedText("");
      setIsTranslating(true);
      setTranslationTextId(conversation?._id);
      const res = await API.post("/message/translate", {
        message: conversation.message,
      });
      const data = res.data;
      // console.log(data);
      if (!data.success) {
        return toast.error(toast.message);
      }
      setTranslatedText(data.translatedContent);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsTranslating(false);
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
    setLastConversationMessage(
      conversations[conversations.length - 1]?.message
    );
  }, [conversations]);

  useEffect(() => {
    if (Array.isArray(results) && results.length > 0) {
      setMessage(results.map((trans) => trans.transcript).join(" "));
    }
  }, [results]);

  useEffect(() => {
    if (message.trim() === "") {
      setResults([]);
    }
  }, [message]);

  return (
    <div className="w-full relative flex flex-col justify-center items-center dark:bg-gray-900">
      {selectedChatUser ? (
        <>
          {/* Top Chat Header */}
          <div className="absolute top-0 px-1 py-2 transition-colors ease-out duration-150 flex justify-baseline items-center space-x-4 cursor-default text-black dark:text-white w-full h-16 bg-slate-300 dark:bg-gray-800 shadow z-20">
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
          <div className="chat-section w-full h-full flex flex-col">
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
                      <p className="mb-1">
                        {translatedText &&
                        translateTextOrNoT &&
                        translationTextId === conversation?._id
                          ? translatedText
                          : conversation.message}
                      </p>

                      <p
                        className={`mb-1  text-xs font-normal hover:text-blue-500 dark:hover:text-black transition-all duration-200
                           ${
                             isTranslating
                               ? "cursor-not-allowed pointer-events-none select-none"
                               : "cursor-pointer"
                           }
                           `}
                        onClick={(e) => {
                          setTranslateTextOrNoT(!translateTextOrNoT);
                          handleTranslate(conversation);
                        }}
                      >
                        {isTranslating &&
                        translateTextOrNoT &&
                        translationTextId === conversation?._id ? (
                          <>
                            <SparklesTextDemo />
                          </>
                        ) : translateTextOrNoT &&
                          translationTextId === conversation?._id ? (
                          <span className="flex items-center gap-1">
                            See Original Text <TypeOutline size={10} />
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            Translate <Languages size={10} />
                          </span>
                        )}
                      </p>

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

              {/* Transcribe Button */}
              <motion.button
                className="p-2 bg-fuchsia-400 hover:bg-fuchsia-500 dark:bg-fuchsia-600 rounded-full dark:hover:bg-fuchsia-700 text-black dark:text-white"
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
                onClick={isRecording ? stopSpeechToText : startSpeechToText}
              >
                {isRecording ? <Mic2 size={23} /> : <Mic size={23} />}
              </motion.button>

              {/* Message Send Button */}
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
      {/* Big Mic Overlay when recording */}
      {isRecording && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-30">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-r from-fuchsia-500 to-purple-600 shadow-2xl w-[90%] max-w-md"
          >
            {/* Mic Icon */}
            <Mic2 size={80} className="text-white animate-pulse" />

            {/* Listening text */}
            <p className="mt-4 text-white text-lg font-semibold animate-pulse">
              Listening...
            </p>

            {/* Live Transcription */}
            <div className="mt-4 px-4 py-3 bg-white/20 text-white text-center rounded-xl w-full max-h-32 overflow-y-auto">
              {Array.isArray(results) && results.length > 0 ? (
                <p className="text-lg font-medium">
                  {results.map((r) => r.transcript).join(" ")}
                </p>
              ) : (
                <p className="italic text-white/70">Say something...</p>
              )}
            </div>

            {/* Stop button */}
            <button
              onClick={stopSpeechToText}
              className="mt-6 px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium shadow-lg transition"
            >
              Stop
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Right;
