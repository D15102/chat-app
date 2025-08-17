import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react"; // ✅ use "framer-motion"
import { ChevronDown } from "lucide-react";
import API from "../../config/axios.js";
import toast from "react-hot-toast";
import useUser from "../contexts/UserContext.js";
import styled from "styled-components";
import useTheme from "../contexts/ThemeContext.js";
import { useNavigate } from "react-router-dom";
import useAuth from "../contexts/AuthContext.js";
export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null); // ✅ for outside click detection
  const { user, setUser } = useUser();
  const { themeMode, lightMode, darkMode } = useTheme();
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      setisLoading(true);
      const res = await API.get(`/users/logout`);
      const data = res.data;
      if (!data.success) {
        return toast.error(data.message);
      }
      toast.success(data.message);
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
    } finally {
      setisLoading(false);
    }
  };

  // //setting authenticated in localstorage
  // useEffect(() => {
  //   localStorage.setItem("isAuthenticated", isAuthenticated);
  // }, [isAuthenticated]);

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
        setUser(data.user);
      } catch (error) {
        setIsAuthenticated(false);
        console.log(error.message);
      }
    }
    getUserDetails();
  }, []);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full h-16 bg-white dark:bg-gray-800 shadow flex items-center justify-between px-6 z-50">
        <div className="text-xl font-bold text-blue-600">MyDashboard</div>

        {/* User + Theme Switch */}
        <div className="relative flex items-center gap-4" ref={dropdownRef}>
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

          {/* Avatar + Dropdown Button */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <img
              src={user.avatar}
              alt="user avatar"
              className="w-10 h-10 rounded-full border border-gray-300"
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
                className="absolute right-0 top-14 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50"
              >
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setOpen(false)} // ✅ close on click
                  >
                    Profile
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setOpen(false)} // ✅ close on click
                  >
                    Settings
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => handleLogout()}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        {/* Spinner */}
                        <svg
                          className="w-5 h-5 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                        Logging Out...
                      </>
                    ) : (
                      "Log Out"
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 px-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Welcome, {user.username} 👋
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
            📊 Stats Card
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
            📅 Recent Activity
          </div>
        </div>
      </main>
    </div>
  );
}

const StyledWrapper = styled.div`
  .switch {
    --circle-dim: 1.2em; /* slightly smaller */
    font-size: 14px;
    position: relative;
    display: inline-block;
    width: 3em; /* smaller width */
    height: 1.6em; /* smaller height */
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
