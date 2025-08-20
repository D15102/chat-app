import {
  IconButton,
  Popover,
  Skeleton,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
import { MessageSquare, Search } from "lucide-react";
import { useEffect, useState } from "react";
import API from "../../config/axios";
import toast from "react-hot-toast";
import useChatUsers from "../contexts/ChatUsersContext";
import useConversations from "../contexts/ConversationContext";
import useSocketContext from "../contexts/SocketContext.jsx";
import useAllUsers from "../contexts/AllUserContext.js";

const Left = ({
  selectedChatUser,
  setSelectedChatUser,
  message,
  setMessage,
  showConversations,
  setShowConversations,
  lastConversationMessage,
}) => {
  const [availableUsersLoading, setAvailableUsersLoading] = useState(false);
  const { allUsers, setAllUsers } = useAllUsers();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { chatUsers, setChatUsers } = useChatUsers();

  const [filteredChatUsers, setFilteredChatUsers] = useState([]);
  const { conversations, setConversations } = useConversations();
  const { onlineUsers } = useSocketContext();

  const handleChatUserFilter = (e) => {
    const value = e.target.value.toLowerCase();
    if (value.trim() === "") {
      setFilteredChatUsers(chatUsers);
    }
    const result = chatUsers.filter((chatuser) =>
      chatuser.username.toLowerCase().includes(value)
    );
    setFilteredChatUsers(result);
  };

  const handlePopUsersFilter = (e) => {
    const keyword = e.target.value.toLowerCase();
    if (keyword.trim() === "") {
      setFilteredUsers(allUsers);
    } else {
      const results = allUsers.filter((user) =>
        user.username.toLowerCase().includes(keyword)
      );
      setFilteredUsers(results);
    }
  };

  const handleAddPopUsers = (id) => {
    const exists = chatUsers.find((user) => user._id === id);

    if (!exists) {
      const user = filteredUsers.find((u) => u._id === id);

      if (user) {
        setChatUsers((prev) => [...prev, user]);

        setFilteredUsers((prev) => prev.filter((u) => u._id !== id));
        setAllUsers((prev) => prev.filter((u) => u._id !== id));
      }
    } else {
      toast("User Already Added To Chat ℹ️")
    }
  };

  const handleChatUserClick = async (user) => {
    setSelectedChatUser(user);
    try {
      const res = await API.get(`/message/get/${user._id}`);
      const data = res.data;
      if (!data.success) {
        setShowConversations(false);
        // console.log(data.message);
        return toast.error(data.message);
      }
      // console.log(data);
      setShowConversations(true);
      setConversations(data.messages);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const handleShowAvailableUsers = async () => {
      try {
        setAvailableUsersLoading(true);
        const res = await API.get("/users/getAllUsers");
        const data = res.data;
        if (!data.success) {
          return toast.error(data.message);
        }
        setAllUsers(data.allUsers);
        setFilteredUsers(data.allUsers);
      } catch (error) {
        console.error(error);
      } finally {
        setAvailableUsersLoading(false);
      }
    };
    handleShowAvailableUsers();
  }, []);

  useEffect(() => {
    if (Array.isArray(chatUsers) && chatUsers.length > 0) {
      setFilteredChatUsers(chatUsers);
    }
  }, [chatUsers]);

  useEffect(() => {
    if (Array.isArray(allUsers) && allUsers.length > 0) {
      // console.log(allUsers);
      sessionStorage.setItem("allUsers", JSON.stringify(allUsers));
    }
  }, [allUsers]);

  useEffect(() => {
    if (Array.isArray(filteredChatUsers) && filteredChatUsers.length > 0) {
      sessionStorage.setItem("chatUsers", JSON.stringify(filteredChatUsers));
    }
  }, [filteredChatUsers]);

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-2 relative transition-colors duration-200">
      {/* Top Search Field */}
      <TextField.Root
        placeholder="Search Others.."
        className="mx-2 bg-white dark:bg-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg"
        onChange={handleChatUserFilter}
      >
        <TextField.Slot>
          <Search size={18} className="text-gray-500 dark:text-gray-400" />
        </TextField.Slot>
      </TextField.Root>

      {/* User List */}
      <div className="w-full h-[35.9rem] mt-2 px-2 overflow-y-auto">
        {Array.isArray(filteredChatUsers) && filteredChatUsers.length > 0 ? (
          filteredChatUsers.map((user, idx) => {
            const isSelected = selectedChatUser?._id === user._id; // check if this chat is selected
            const isOnline = onlineUsers.includes(user._id);
            return (
              <div
                key={idx}
                className={`px-2 py-2 rounded-xl mb-2 transition-colors flex items-center space-x-4 cursor-pointer
          ${
            isSelected
              ? "bg-lime-200 hover:bg-lime-300 text-black" // selected styles
              : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
          }`}
                onClick={() => handleChatUserClick(user)} // set the selected chat
              >
                <img
                  src={user.profilePicture}
                  alt=""
                  className="rounded-full w-12 h-12 object-cover border-3 border-black dark:border-red-400"
                />
                {isOnline ? (
                  <div className="inline-grid *:[grid-area:1/1]">
                    <div className="status status-success animate-ping"></div>
                    <div className="status status-success"></div>
                  </div>
                ) : (
                  <div className="inline-grid *:[grid-area:1/1]">
                    <div className="status status-primary animate-ping"></div>
                    <div className="status status-primary"></div>
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <p
                    className={`text-sm font-medium ${
                      isSelected ? "text-black" : ""
                    }`}
                  >
                    {user.username}
                  </p>
                  <p
                    className={`text-xs ${
                      isSelected
                        ? "text-black"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {isSelected && lastConversationMessage
                      ? lastConversationMessage
                      : ""}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="w-full h-full flex justify-center items-center flex-col space-y-2 text-gray-700 dark:text-gray-300">
            <p className="text-2xl font-medium">No Users Added Yet</p>
            <p className="text-md">Start A New Conversation 👇</p>
          </div>
        )}
      </div>

      {/* Popover Button */}
      <div className="absolute bottom-3 right-4">
        <Popover.Root>
          <Popover.Trigger>
            <IconButton
              radius="full"
              size={"3"}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <Tooltip content="New Conversation">
                <MessageSquare className="text-gray-200" />
              </Tooltip>
            </IconButton>
          </Popover.Trigger>

          <Popover.Content
            sideOffset={8}
            className="rounded-xl p-3 shadow-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
            width="360px"
          >
            {/* Search inside Popover */}
            <TextField.Root
              placeholder="Search users by their names…"
              className="mb-3 bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg"
              onChange={handlePopUsersFilter}
            >
              <TextField.Slot>
                <Search
                  size={18}
                  className="text-gray-500 dark:text-gray-400"
                />
              </TextField.Slot>
            </TextField.Root>

            {/* Scrollable User List */}
            <div className="max-h-[15rem] overflow-y-auto pr-1">
              {availableUsersLoading ? (
                <div className="flex flex-col space-y-3">
                  <Skeleton width="100%" height="40px" />
                  <Skeleton width="100%" height="40px" />
                  <Skeleton width="100%" height="40px" />
                </div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <Popover.Close key={user._id}>
                    <div
                      className="bg-gray-100 dark:bg-gray-700 px-2 py-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 mb-2 transition-colors flex items-center space-x-4 cursor-pointer"
                      onClick={(e) => handleAddPopUsers(user._id)}
                    >
                      <img
                        src={user.profilePicture}
                        alt=""
                        className="rounded-full w-10 h-10 object-cover"
                      />
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">{user.username}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </Popover.Close>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  No users found
                </p>
              )}
            </div>
          </Popover.Content>
        </Popover.Root>
      </div>
    </div>
  );
};

export default Left;
