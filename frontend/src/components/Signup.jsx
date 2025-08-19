import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import API from "../../config/axios.js";
import useAuth from "../contexts/AuthContext.js";
import useUser from "../contexts/UserContext.js";

export default function Signup() {
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { user, setUser } = useUser();
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const onSubmit = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      return toast.error("Password And Confirm Password Must Matched");
    }
    try {
      setisLoading(true);
      const res = await API.post(`/users/signup`, signupData);
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

  useEffect(() => {
    sessionStorage.setItem("user", JSON.stringify(user));
  }, [user]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-emerald-600 to-blue-600 p-4">
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
          Create Account ✨
        </motion.h1>

        {/* Form */}
        <form className="space-y-4" onSubmit={onSubmit}>
          {/* Name */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm text-white/80 mb-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your full name"
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
              value={signupData.confirmPassword}
              onChange={handleChange}
              name="confirmPassword"
              required
            />
          </motion.div>

          {/* Button */}
          {/* Button */}
          <motion.button
            whileHover={!isLoading ? { scale: 1.05 } : {}}
            whileTap={!isLoading ? { scale: 0.95 } : {}}
            transition={{ type: "spring", stiffness: 300 }}
            disabled={isLoading}
            className={`w-full py-3 mt-4 flex items-center justify-center gap-2
    bg-gradient-to-r from-blue-500 to-teal-500 
    text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl 
    disabled:opacity-70 disabled:cursor-not-allowed`}
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
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>

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
