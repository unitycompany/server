import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, getDoc, setDoc, query, where } from "firebase/firestore";
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

// =================== FUNÇÕES PARA USUÁRIOS (ROLES) ===================

// Criar perfil de usuário no Firestore com role
export const createUserProfile = async (uid, userData) => {
    try {
        const db = getDatabase("default");
        if (!db) return;
        await setDoc(doc(db, "usuarios", uid), {
            ...userData,
            createdAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Erro ao criar perfil de usuário:", error);
        throw error;
    }
};

// Buscar perfil de usuário pelo UID
export const getUserProfile = async (uid) => {
    try {
        const db = getDatabase("default");
        if (!db) return null;
        const userDoc = await getDoc(doc(db, "usuarios", uid));
        if (userDoc.exists()) {
            return { id: userDoc.id, ...userDoc.data() };
        }
        return null;
    } catch (error) {
        console.error("Erro ao buscar perfil de usuário:", error);
        return null;
    }
};

// Buscar todos os usuários
export const getAllUsers = async () => {
    try {
        const db = getDatabase("default");
        if (!db) return [];
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        return [];
    }
};

// Atualizar dados de um usuário (role, nome, email, permissions, etc.)
export const updateUserProfile = async (uid, data) => {
    try {
        const db = getDatabase("default");
        if (!db) return;
        const userRef = doc(db, "usuarios", uid);
        await updateDoc(userRef, data);
    } catch (error) {
        console.error("Erro ao atualizar perfil do usuário:", error);
        throw error;
    }
};

// Alias para compatibilidade
export const updateUserRole = updateUserProfile;

// Remover usuário do Firestore
export const deleteUserProfile = async (uid) => {
    try {
        const db = getDatabase("default");
        if (!db) return;
        await deleteDoc(doc(db, "usuarios", uid));
    } catch (error) {
        console.error("Erro ao remover perfil de usuário:", error);
        throw error;
    }
};