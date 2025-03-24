// App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Homepage from "./partials/Homepage";
import Login from "./partials/Login";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "../AuthContext";
import "react-toastify/dist/ReactToastify.css";

const AuthenticatedApp = () => {
  const { currentUser } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    const lastLogin = localStorage.getItem('lastLogin');
    const loginTimeout = 10 * 0 * 0 * 0; // 24 horas

    if (lastLogin && (Date.now() - lastLogin) < loginTimeout && currentUser) {
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
  }, [currentUser]);

  const handleLoginSuccess = (user) => {
    setShowLogin(false);
  };

  return showLogin ? <Login onLoginSuccess={handleLoginSuccess} /> : <Homepage />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthenticatedApp />
        <ToastContainer position="top-right" autoClose={2000} closeOnClick pauseOnHover draggable />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
