// LoginPage.tsx
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../config/axios";
import toast from "react-hot-toast";
import useAuth from "../contexts/AuthContext";
import useUser from "../contexts/UserContext";
import styled from "styled-components";
import useTheme from "../contexts/ThemeContext";

export default function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const { user, setUser } = useUser();
  const { themeMode, darkMode, lightMode } = useTheme();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setisLoading(true);
      const res = await API.post(`/users/login`, loginData);
      const data = res.data;
      if (!data.success) {
        return toast.error(data.message);
      }
      toast.success(data.message);
      setIsAuthenticated(true);
      setUser(data.user);
      setLoginData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      navigate("/dashboard");
    } catch (error) {
      console.log(error.message);
    } finally {
      setisLoading(false);
    }
  };

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    sessionStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    sessionStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    sessionStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-gray-900 dark:via-gray-800 dark:to-black p-4 transition-colors">
      {/* Toggle Switch */}
      <div className="absolute top-4 right-4">
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
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/10 dark:bg-gray-900/60 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-gray-700"
      >
        {/* Title */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-white text-center mb-6"
        >
          Welcome Back 👋
        </motion.h1>

        {/* Form */}
        <form className="space-y-4" onSubmit={onSubmit}>
          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm text-white/80 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter your email"
              value={loginData.email}
              onChange={handleChange}
              name="email"
              required
            />
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm text-white/80 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter your password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </motion.div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-full py-3 mt-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin text-white inline-block mr-2"
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
                Logging In...
              </>
            ) : (
              "Login"
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-white/70 mt-6"
        >
          Don’t have an account?{" "}
          <Link to="/signup" className="text-pink-300 hover:underline">
            Sign up
          </Link>
        </motion.p>
      </motion.div>
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
