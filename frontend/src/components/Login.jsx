// LoginPage.tsx
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../config/axios";
import toast from "react-hot-toast";
import useAuth from "../contexts/AuthContext";
import useUser from "../contexts/UserContext";

export default function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  // const { setUser } = useUser();

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
    localStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  // useEffect(() => {
  //   async function getUserDetails() {
  //     try {
  //       const res = await API.get("/users/me");
  //       const data = res.data;
  //       if (!data.success) {
  //         setIsAuthenticated(false);
  //         return toast.error(data.message);
  //       }
  //       setIsAuthenticated(true);
  //     } catch (error) {
  //       setIsAuthenticated(false);
  //       console.log(error.message);
  //     }
  //   }
  //   getUserDetails();
  // }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4">
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20"
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
