// App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Homepage from "./partials/Homepage";
import Login from "./partials/Login";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "../AuthContext";
import "react-toastify/dist/ReactToastify.css";

const AuthenticatedApp = () => {
  const { currentUser, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    if (!loading) {
      const lastLogin = localStorage.getItem("lastLogin");
      const loginTimeout = 1000 * 60 * 60 * 24;

      if (lastLogin && Date.now() - lastLogin < loginTimeout && currentUser) {
        setShowLogin(false);
      } else {
        setShowLogin(true);
      }
    }
  }, [currentUser, loading]);

  if (loading) return null; // ou um spinner, se quiser

  return showLogin ? <Login onLoginSuccess={() => setShowLogin(false)} /> : <Homepage />;
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
