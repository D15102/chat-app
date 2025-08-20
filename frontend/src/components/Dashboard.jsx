import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"; // ✅ correct package
import { ChevronDown, Upload, LogOut, User } from "lucide-react";
import API from "../../config/axios.js";
import toast from "react-hot-toast";
import useUser from "../contexts/UserContext.js";
import styled from "styled-components";
import useTheme from "../contexts/ThemeContext.js";
import { useNavigate } from "react-router-dom";
import useAuth from "../contexts/AuthContext.js";
import Left from "./Left.jsx";
import Right from "./Right.jsx";
import { Spinner } from "@radix-ui/themes";
import useChatUsers from "../contexts/ChatUsersContext.js";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, setUser } = useUser();
  const { themeMode, lightMode, darkMode } = useTheme();
  const [isLoading, setisLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [message, setMessage] = useState("");
  const { chatUsers, setChatUsers } = useChatUsers();
  const [showConversations, setShowConversations] = useState(false);
  const [lastConversationMessage, setLastConversationMessage] = useState(null);

  const handleLogout = async () => {
    try {
      setisLoading(true);
      const res = await API.get(`/users/logout`);
      const data = res.data;
      if (!data.success) return toast.error(data.message);
      toast.success(data.message);
      setChatUsers([]);
      setUser({});
      sessionStorage.removeItem("chatUsers");
      sessionStorage.removeItem("user");
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setisLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file");
    try {
      setIsUploading(true);
      const res = await API.post(
        "/users/upload/profilePicture",
        { file },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = res.data;
      if (!data.success) {
        return toast.error(data.message);
      }
      console.log(data);
      toast.success(data.message);
      setUser(data.user);
      setFile(null);
      setPreview(null);
      setOpen(false);
      // window.location.reload()
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    async function getUserDetails() {
      try {
        const res = await API.get("/users/me");
        const data = res.data;
        if (!data.success) {
          setIsAuthenticated(false);
          return;
        }
        setIsAuthenticated(true);
        // console.log(data.user)
        setUser(data.user);
      } catch (error) {
        setIsAuthenticated(false);
        console.log(error.message);
      }
    }
    // getUserDetails();
  }, []);

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //for user changes
  useEffect(() => {
    sessionStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navbar */}
      <nav className="sticky top-0 left-0 w-full h-16 bg-white dark:bg-gray-800 shadow flex items-center justify-between px-6 z-50">
        <div className="text-xl font-bold text-blue-600">MyDashboard</div>

        {/* Right Section */}
        <div className="relative flex items-center gap-4" ref={dropdownRef}>
          <h1 className="hidden md:block text-lg font-semibold text-gray-800 dark:text-gray-100">
            Welcome, <span className="text-blue-500">{user.username}</span> 👋
          </h1>

          {/* Theme Switch */}
          <StyledWrapper>
            <label className="switch">
              <input
                type="checkbox"
                checked={themeMode === "dark"}
                onChange={(e) =>
                  e.currentTarget.checked ? darkMode() : lightMode()
                }
              />
              <div className="slider" />
              <div className="slider-card">
                <div className="slider-card-face slider-card-front" />
                <div className="slider-card-face slider-card-back" />
              </div>
            </label>
          </StyledWrapper>

          {/* Avatar */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <img
              src={user.profilePicture}
              alt="user avatar"
              className="w-10 h-10 rounded-full border border-gray-300 object-cover"
            />
            <ChevronDown
              className={`w-5 h-5 text-gray-600 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-14 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-4"
              >
                {/* User Info */}
                <div className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <User size={16} /> {user.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>

                {/* Upload Profile */}
                <div className="mb-3">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    {preview ? (
                      <img
                        src={preview}
                        alt="preview"
                        className="w-16 h-16 object-cover rounded-full mb-2"
                      />
                    ) : (
                      <Upload className="w-6 h-6 mb-2 text-gray-500" />
                    )}
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {file ? file.name : "Upload new avatar"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                  <button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className={`mt-2 flex justify-center items-center gap-2 w-full py-2 rounded-lg text-white text-sm transition bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed`}
                  >
                    {isUploading && <Spinner />}
                    Upload
                  </button>
                </div>

                {/* Actions */}
                <button
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    toast.success("Profile clicked!");
                    setOpen(false);
                  }}
                >
                  Profile
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm text-red-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Logging out..."
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogOut size={16} /> Log Out
                    </span>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Main */}
      <main className="w-full min-h-[calc(100vh-64px)] flex">
        <Left
          selectedChatUser={selectedChatUser}
          setSelectedChatUser={setSelectedChatUser}
          message={message}
          setMessage={setMessage}
          showConversations={showConversations}
          setShowConversations={setShowConversations}
          lastConversationMessage={lastConversationMessage}
        />
        <Right
          selectedChatUser={selectedChatUser}
          message={message}
          setMessage={setMessage}
          showConversations={showConversations}
          setShowConversations={setShowConversations}
          lastConversationMessage={lastConversationMessage}
          setLastConversationMessage={setLastConversationMessage}
        />
      </main>
    </div>
  );
}

const StyledWrapper = styled.div`
  .switch {
    --circle-dim: 1.2em;
    font-size: 14px;
    position: relative;
    display: inline-block;
    width: 3em;
    height: 1.6em;
    vertical-align: middle;
  }
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f5aeae;
    transition: 0.4s;
    border-radius: 30px;
  }
  .slider-card {
    position: absolute;
    height: var(--circle-dim);
    width: var(--circle-dim);
    border-radius: 50%;
    left: 0.25em;
    bottom: 0.25em;
    transition: 0.4s;
    pointer-events: none;
  }
  .slider-card-face {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    border-radius: 50%;
    transition: 0.4s transform;
  }
  .slider-card-front {
    background-color: #dc3535;
  }
  .slider-card-back {
    background-color: #379237;
    transform: rotateY(180deg);
  }
  input:checked ~ .slider-card .slider-card-back {
    transform: rotateY(0);
  }
  input:checked ~ .slider-card .slider-card-front {
    transform: rotateY(-180deg);
  }
  input:checked ~ .slider-card {
    transform: translateX(1.4em);
  }
  input:checked ~ .slider {
    background-color: #9ed99c;
  }
`;
