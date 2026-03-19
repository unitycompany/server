import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { getUserProfile, createUserProfile, setUserPin } from "./firebaseService";
import { hashPin } from "./src/SecurityContext";

const AuthContext = createContext({
  currentUser: null,
  userProfile: null,
  loading: true,
  needsPinSetup: false,
});

// Utilidade para verificar hierarquia de cargos
export const ROLE_HIERARCHY = { superadmin: 3, admin: 2, franqueado: 1 };
export const hasRole = (userRole, requiredRole) => {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsPinSetup, setNeedsPinSetup] = useState(false);

  const refreshProfile = async (uid) => {
    const profile = await getUserProfile(uid);
    setUserProfile(profile);
    setNeedsPinSetup(!!(profile && !profile.pinHash));
    return profile;
  };

  const completePinSetup = async (pin) => {
    if (!currentUser) return;
    const pinHashed = await hashPin(pin);
    await setUserPin(currentUser.uid, pinHashed);
    await refreshProfile(currentUser.uid);
    setNeedsPinSetup(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        let profile = await getUserProfile(user.uid);
        if (!profile) {
          await createUserProfile(user.uid, {
            nome: user.displayName || user.email,
            email: user.email,
            role: "franqueado",
            permissions: [],
          });
          profile = await getUserProfile(user.uid);
        }
        setUserProfile(profile);
        setNeedsPinSetup(!!(profile && !profile.pinHash));
      } else {
        setUserProfile(null);
        setNeedsPinSetup(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfile,
      loading,
      refreshProfile,
      needsPinSetup,
      completePinSetup,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};