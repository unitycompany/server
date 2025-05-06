import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { getDatabase } from "./firebaseConfig";

// Função para obter todos os logins do banco de dados correto
export const getLogins = async (dbName) => {
    try {
        const db = getDatabase(dbName);
        if (!db) return [];

        const querySnapshot = await getDocs(collection(db, "logins"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Erro ao buscar logins:", error);
        return [];
    }
};

// Função para adicionar um novo login
export const addLogin = async (dbName, loginData) => {
    try {
        const db = getDatabase(dbName);
        if (!db) return;

        await addDoc(collection(db, "logins"), loginData);
    } catch (error) {
        console.error("Erro ao adicionar login:", error);
    }
};

// Função para editar um login
export const editLogin = async (dbName, loginId, newData) => {
    try {
        const db = getDatabase(dbName);
        if (!db) return;

        const loginRef = doc(db, "logins", loginId);
        await updateDoc(loginRef, newData);
    } catch (error) {
        console.error("Erro ao editar login:", error);
    }
};

// Função para remover um login
export const removeLogin = async (dbName, loginId) => {
    try {
        const db = getDatabase(dbName);
        if (!db) return;

        await deleteDoc(doc(db, "logins", loginId));
    } catch (error) {
        console.error("Erro ao remover login:", error);
    }
};