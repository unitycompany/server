// App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Homepage from "./partials/Homepage";
import Login from "./partials/Login";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "../AuthContext";
import { SecurityProvider } from "./SecurityContext";
import { PinSetup } from "./components/PinModal";
import "react-toastify/dist/ReactToastify.css";

const AuthenticatedApp = () => {
  const { currentUser, loading, needsPinSetup, completePinSetup, userProfile } = useAuth();
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

  if (loading) return null;

  if (showLogin) return <Login onLoginSuccess={() => setShowLogin(false)} />;

  // Mostra modal de configuração de PIN se o usuário ainda não definiu
  if (needsPinSetup) {
    return (
      <PinSetup
        isOpen={true}
        onComplete={completePinSetup}
        userEmail={userProfile?.email || currentUser?.email}
      />
    );
  }

  return <Homepage />;
};


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SecurityProvider>
          <AuthenticatedApp />
          <ToastContainer position="top-right" autoClose={2000} closeOnClick pauseOnHover draggable />
        </SecurityProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
