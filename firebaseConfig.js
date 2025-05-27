import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuração para múltiplos bancos de dados
const firebaseConfigs = {
    default: {
        apiKey: "AIzaSyDo4S4KzcN0PC0jSvO7YXlYVBhGQGXklJ4",
        authDomain: "unitycompany-2dbbe.firebaseapp.com",
        projectId: "unitycompany-2dbbe",
        storageBucket: "unitycompany-2dbbe.firebasestorage.app",
        messagingSenderId: "431197538746",
        appId: "1:431197538746:web:b7feb362820ca1b9bb7583"
    },
    banco2: {
        apiKey: "AIzaSyCmxpECb0zIcRehhx_EN9basvK01yjKfho",
        authDomain: "pousada-le-ange.firebaseapp.com",
        projectId: "pousada-le-ange",
        storageBucket: "pousada-le-ange.firebasestorage.app",
        messagingSenderId: "495576784631",
        appId: "1:495576784631:web:df7a577e163530ceea3df2"
    },
    banco3: {
        apiKey: "AIzaSyAvi_MR__0wTrYhRLXBUV8_fcFYNxSab7Y",
        authDomain: "fast-homes-a9c85.firebaseapp.com",
        projectId: "fast-homes-a9c85",
        storageBucket: "fast-homes-a9c85.firebasestorage.app",
        messagingSenderId: "856460284462",
        appId: "1:856460284462:web:91092e41b5fe66279385bf"
    },
    banco4: {
        apiKey: "AIzaSyCm0N9VNANfmzK_GfJxx1regbzmmHJt2jo",
        authDomain: "novametalica-bb05f.firebaseapp.com",
        projectId: "novametalica-bb05f",
        storageBucket: "novametalica-bb05f.firebasestorage.app",
        messagingSenderId: "38158997573",
        appId: "1:38158997573:web:9dfe87a086f9e68082eb2c"
    }
};

// Inicializa (ou pega) a app padrão
const defaultApp =
  !getApps().length
    ? initializeApp(firebaseConfigs.default)
    : getApp("default");

// Exporta o Auth da app padrão
export const auth = getAuth(defaultApp);

/**
 * Retorna a instância do Firestore para o dbName informado.
 * @param {string} dbName — “default” ou “banco3”
 */
export function getDatabase(dbName = "default") {
  if (!firebaseConfigs[dbName]) {
    console.error(`Banco de dados "${dbName}" não encontrado.`);
    return null;
  }

  if (dbName === "default") {
    return getFirestore(defaultApp);
  }

  // Apps nomeados
  let namedApp;
  try {
    namedApp = getApp(dbName);
  } catch {
    namedApp = initializeApp(firebaseConfigs[dbName], dbName);
  }
  return getFirestore(namedApp);
}