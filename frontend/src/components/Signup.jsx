// Signup.tsx
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import API from "../../config/axios.js";
import useAuth from "../contexts/AuthContext.js";
import useUser from "../contexts/UserContext.js";
import styled from "styled-components";
import useTheme from "../contexts/ThemeContext";
import axios from "axios";

export default function Signup() {
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setisLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const { themeMode, darkMode, lightMode } = useTheme();
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      return toast.error("Password and Confirm Password must match");
    }
    try {
      setisLoading(true);
      const res = await API.post(`/users/signup`, {
        ...signupData,
        signUpMode: "Email",
      });
      const data = res.data;
      if (!data.success) {
        return toast.error(data.message);
      }
      toast.success(data.message);
      setUser(data.user);
      setSignupData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      console.log(error.message);
    } finally {
      setisLoading(false);
    }
  };

  const handleChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGithubSignup = async () => {
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${
        import.meta.env.VITE_GITHUB_CLIENT_ID_SIGNUP
      }`
    );
  };

  useEffect(() => {
    const queryString = window.location.search;
    // console.log(queryString);
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code");
    console.log(code);
    if (code && localStorage.getItem("signup_access_token") === null) {
      async function getAcceessToken() {
        try {
          const res = await API.get(
            `/users/github/getAccessToken?code=${code}&mode=Signup`
          );
          const data = res.data;
          if (data.access_token) {
            localStorage.setItem("signup_access_token", data.access_token);
            githubSignup(data.access_token);
          }
          // console.log(data);
        } catch (error) {
          console.log(error);
        }
      }

      getAcceessToken();
    }

    async function githubSignup(access_token) {
      try {
        setIsGithubLoading(true);
        setisLoading(true);
        const res = await API.post(
          `/users/signup`,
          {
            signUpMode: "Github",
          },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        const data = res.data;
        if (!data.success) {
          return toast.error(data.message);
        }
        console.log(data);
        setIsAuthenticated(true);
        setUser(data.user);
        toast.success(data.message);
        navigate("/dashboard");
      } catch (error) {
        console.log(error);
      } finally {
        setIsGithubLoading(false);
        setisLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-emerald-600 to-blue-600 dark:from-gray-900 dark:via-gray-800 dark:to-black p-4 transition-colors">
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
          Create Account ✨
        </motion.h1>

        {/* Form */}
        <form className="space-y-4" onSubmit={onSubmit}>
          {/* Username */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm text-white/80 mb-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your username"
              name="username"
              value={signupData.username}
              onChange={handleChange}
              required
            />
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm text-white/80 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              name="email"
              value={signupData.email}
              onChange={handleChange}
              required
            />
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm text-white/80 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Create a password"
              name="password"
              value={signupData.password}
              onChange={handleChange}
              required
            />
          </motion.div>

          {/* Confirm Password */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm text-white/80 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Re-enter password"
              name="confirmPassword"
              value={signupData.confirmPassword}
              onChange={handleChange}
              required
            />
          </motion.div>

          {/* Button */}
          <motion.button
            whileHover={!isLoading ? { scale: 1.05 } : {}}
            whileTap={!isLoading ? { scale: 0.95 } : {}}
            transition={{ type: "spring", stiffness: 300 }}
            disabled={isLoading}
            className="w-full py-3 mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
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
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>
        {/* Social Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 space-y-3"
        >
          {/* Google Button */}
          {/* <button
            type="button"
            className="w-full cursor-pointer flex items-center justify-center gap-3 py-3 bg-white text-gray-800 font-medium rounded-xl shadow-md hover:bg-gray-100 transition"
            disabled={isLoading}
          >
            {isGoogleLoading ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin text-black inline-block mr-2"
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
                Connecting To Google...
              </>
            ) : (
              <>
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continue with Google
              </>
            )}
          </button> */}

          {/* Github Button */}

          <button
            type="button"
            className="w-full cursor-pointer flex items-center justify-center gap-3 py-3 bg-gray-700 text-white font-medium rounded-xl shadow-md hover:bg-gray-600 transition"
            disabled={isLoading}
            onClick={handleGithubSignup}
          >
            {isGithubLoading ? (
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
                Connecting To GitHub...
              </>
            ) : (
              <>
                <img
                  src="https://www.svgrepo.com/show/475654/github-color.svg"
                  alt="GitHub"
                  className="w-5 h-5"
                />
                Continue with GitHub
              </>
            )}
          </button>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-sm text-white/70 mt-6"
        >
          Already have an account?{" "}
          <Link to="/" className="text-blue-300 hover:underline">
            Login
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
