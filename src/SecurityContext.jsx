import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { toast } from "react-toastify";

const SecurityContext = createContext({
  pinVerified: false,
  verifyPin: () => false,
  clearPinSession: () => {},
  isScreenBlocked: false,
  lastActivity: null,
});

// Hash PIN com SHA-256
export async function hashPin(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutos
const ACTIVITY_CHECK_INTERVAL = 30 * 1000; // Verifica a cada 30s

export const SecurityProvider = ({ children }) => {
  const [pinVerified, setPinVerified] = useState(false);
  const [isScreenBlocked, setIsScreenBlocked] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const inactivityTimerRef = useRef(null);

  // ─── PIN Session ───
  const verifyPin = useCallback(() => {
    setPinVerified(true);
    // PIN session expira em 5 minutos
    setTimeout(() => setPinVerified(false), 5 * 60 * 1000);
  }, []);

  const clearPinSession = useCallback(() => {
    setPinVerified(false);
  }, []);

  // ─── Inactivity Auto-Logout ───
  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  const handleAutoLogout = useCallback(async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("lastLogin");
      setPinVerified(false);
      toast.warning("Sessão expirada por inatividade. Faça login novamente.", { autoClose: 5000 });
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    const events = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"];
    events.forEach(e => window.addEventListener(e, resetActivity, { passive: true }));

    inactivityTimerRef.current = setInterval(() => {
      if (Date.now() - lastActivityRef.current > INACTIVITY_LIMIT) {
        handleAutoLogout();
      }
    }, ACTIVITY_CHECK_INTERVAL);

    return () => {
      events.forEach(e => window.removeEventListener(e, resetActivity));
      if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);
    };
  }, [resetActivity, handleAutoLogout]);

  // ─── Screen Capture Detection ───
  useEffect(() => {
    // Detecta Picture-in-Picture e Screen Capture API
    const checkScreenCapture = () => {
      if (document.pictureInPictureElement) {
        setIsScreenBlocked(true);
        return;
      }
      setIsScreenBlocked(false);
    };

    // Listener para quando a visibilidade muda (pode indicar captura)
    const handleVisibilityChange = () => {
      checkScreenCapture();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("enterpictureinpicture", () => setIsScreenBlocked(true));
    document.addEventListener("leavepictureinpicture", () => setIsScreenBlocked(false));

    // Detecção via Display Media API — se alguém usar getDisplayMedia
    const originalGetDisplayMedia = navigator.mediaDevices?.getDisplayMedia;
    if (navigator.mediaDevices && originalGetDisplayMedia) {
      navigator.mediaDevices.getDisplayMedia = function (...args) {
        setIsScreenBlocked(true);
        return originalGetDisplayMedia.apply(this, args);
      };
    }

    // Bloqueia PrintScreen e atalhos de captura
    const handleKeyDown = (e) => {
      // PrintScreen
      if (e.key === "PrintScreen") {
        e.preventDefault();
        navigator.clipboard?.writeText?.("");
        toast.error("Captura de tela bloqueada por segurança.");
        return;
      }
      // Ctrl+Shift+S (screenshot em alguns sistemas)
      if (e.ctrlKey && e.shiftKey && e.key === "S") {
        e.preventDefault();
        toast.error("Captura de tela bloqueada por segurança.");
        return;
      }
      // Ctrl+P (print)
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        toast.error("Impressão bloqueada por segurança.");
        return;
      }
    };

    // Bloqueia menu de contexto (right click)
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleContextMenu);
      if (navigator.mediaDevices && originalGetDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia;
      }
    };
  }, []);

  // Bloqueia select de texto em informações sensíveis (via CSS global)
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .sensitive-data {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      @media print {
        body { display: none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <SecurityContext.Provider value={{
      pinVerified,
      verifyPin,
      clearPinSession,
      isScreenBlocked,
    }}>
      {isScreenBlocked ? (
        <div style={{
          position: "fixed", inset: 0, zIndex: 99999,
          background: "#0f172a", display: "flex", alignItems: "center",
          justifyContent: "center", flexDirection: "column", gap: "16px",
        }}>
          <div style={{ fontSize: "48px" }}>🔒</div>
          <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: 600 }}>
            Acesso Bloqueado
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "14px", textAlign: "center", maxWidth: "400px" }}>
            Gravação ou captura de tela detectada. O acesso ao sistema está
            temporariamente bloqueado por segurança.
          </p>
        </div>
      ) : children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error("useSecurity must be used within a SecurityProvider");
  }
  return context;
};
