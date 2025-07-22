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

// =================== FUNÇÕES PARA ASSINATURAS ===================

// Função para obter todas as assinaturas do banco de dados
export const getAssinaturas = async (dbName) => {
    try {
        const db = getDatabase(dbName);
        if (!db) return [];

        const querySnapshot = await getDocs(collection(db, "assinaturas"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Erro ao buscar assinaturas:", error);
        return [];
    }
};

// Função para adicionar uma nova assinatura
export const addAssinatura = async (dbName, assinaturaData) => {
    try {
        const db = getDatabase(dbName);
        if (!db) return;

        await addDoc(collection(db, "assinaturas"), assinaturaData);
    } catch (error) {
        console.error("Erro ao adicionar assinatura:", error);
    }
};

// Função para editar uma assinatura
export const editAssinatura = async (dbName, assinaturaId, newData) => {
    try {
        const db = getDatabase(dbName);
        if (!db) return;

        const assinaturaRef = doc(db, "assinaturas", assinaturaId);
        await updateDoc(assinaturaRef, newData);
    } catch (error) {
        console.error("Erro ao editar assinatura:", error);
    }
};

// Função para remover uma assinatura
export const removeAssinatura = async (dbName, assinaturaId) => {
    try {
        const db = getDatabase(dbName);
        if (!db) return;

        await deleteDoc(doc(db, "assinaturas", assinaturaId));
    } catch (error) {
        console.error("Erro ao remover assinatura:", error);
    }
};