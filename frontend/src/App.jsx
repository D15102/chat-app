import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Toaster } from "react-hot-toast";
import Dashboard from "./components/Dashboard";
import { UserProvider } from "./contexts/UserContext";
import { useEffect, useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./contexts/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ChatUsersProvider } from "./contexts/ChatUsersContext";
import { ConversationProvider } from "./contexts/ConversationContext";
import { SocketProvider } from "./contexts/SocketContext.jsx";

const App = () => {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")) || {});
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("isAuthenticated") || false
  );
  const [themeMode, setThemeMode] = useState(
    localStorage.getItem("themeMode") || "light"
  );
  const [chatUsers, setChatUsers] = useState(
    JSON.parse(sessionStorage.getItem("chatUsers")) || []
  );
  const [conversations, setConversations] = useState([]);

  const lightMode = () => {
    setThemeMode("light");
  };
  const darkMode = () => {
    setThemeMode("dark");
  };

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", themeMode);
  }, [themeMode]);

  useEffect(() => {
    sessionStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  return (
    <UserProvider value={{ user, setUser }}>
      <AuthProvider value={{ isAuthenticated, setIsAuthenticated }}>
        <ThemeProvider value={{ themeMode, lightMode, darkMode }}>
          <ChatUsersProvider value={{ chatUsers, setChatUsers }}>
            <ConversationProvider value={{ conversations, setConversations }}>
              <SocketProvider>
                <div>
                  <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                  <Toaster
                    position="top-center"
                    reverseOrder={false}
                    gutter={8}
                    containerClassName=""
                    containerStyle={{}}
                    toasterId="default"
                    toastOptions={{
                      // Define default options
                      className: "",
                      duration: 1300,
                      removeDelay: 1000,
                      style: {
                        background: "#363636",
                        color: "#fff",
                      },

                      // Default options for specific types
                      success: {
                        duration: 1300,
                        iconTheme: {
                          primary: "green",
                          secondary: "black",
                        },
                      },
                    }}
                  />
                </div>
              </SocketProvider>
            </ConversationProvider>
          </ChatUsersProvider>
        </ThemeProvider>
      </AuthProvider>
    </UserProvider>
  );
};

export default App;
