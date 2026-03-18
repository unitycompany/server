import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getAllUsers, updateUserProfile, deleteUserProfile, createUserProfile } from "../../firebaseService";
import { useAuth } from "../../AuthContext";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import Modal from "react-modal";
import {
  FiShield, FiTrash2, FiEdit2, FiX, FiCheck, FiUserPlus, FiSearch, FiMail, FiUser
} from "react-icons/fi";

Modal.setAppElement("#root");

const Container = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  max-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;

  & h1 { font-size: 22px; font-weight: 600; }
  & span { font-size: 13px; color: #9b9ba7; }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #e0e0e3;
  border-radius: 8px;
  padding: 7px 10px;

  & svg { color: #9b9ba7; flex-shrink: 0; }
  & input {
    border: none;
    outline: none;
    font-size: 13px;
    font-family: inherit;
    width: 160px;
  }
`;

const AddBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: #111;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;

  &:hover { background: #333; }
  & svg { flex-shrink: 0; }
`;

const UsersGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const UserRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border: 1px solid #e8e8eb;
  border-radius: 10px;
  transition: all 0.15s;

  &:hover {
    border-color: #d0d0d5;
    background: #fafafa;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: ${(p) => (p.$role === "admin" ? "#e0e7ff" : "#fef3c7")};
  color: ${(p) => (p.$role === "admin" ? "#4f46e5" : "#d97706")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  flex-shrink: 0;
`;

const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  & strong { font-size: 14px; font-weight: 600; }
  & span { font-size: 12px; color: #9b9ba7; }
`;

const Badge = styled.span`
  font-size: 10px !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 7px;
  border-radius: 4px;
  font-weight: 600 !important;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  background: ${(p) => (p.$role === "admin" ? "#e0e7ff" : "#fef3c7")};
  color: ${(p) => (p.$role === "admin" ? "#4f46e5" : "#d97706")};
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
`;

const IconBtn = styled.button`
  background: none;
  border: 1px solid #e8e8eb;
  cursor: pointer;
  padding: 7px 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  transition: all 0.15s;
  font-family: inherit;

  &:hover { background: #f5f5f7; border-color: #d0d0d5; }
  &.danger:hover { background: #fef2f2; border-color: #fca5a5; color: #dc2626; }
`;

/* ─── Modal Styles ─── */
const ModalOverlay = {
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  zIndex: "100",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const ModalBox = {
  position: "relative",
  inset: "unset",
  margin: "auto",
  width: "440px",
  maxHeight: "90vh",
  overflow: "auto",
  borderRadius: "12px",
  padding: "0",
  border: "none",
};

const ModalInner = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;

  & h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    padding-bottom: 12px;
    border-bottom: 1px solid #e8e8eb;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  & label {
    font-size: 12px;
    font-weight: 600;
    color: #9b9ba7;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  & input, & select {
    padding: 10px 12px;
    border: 1px solid #e0e0e3;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    transition: border-color 0.15s;

    &:focus { outline: none; border-color: #111; }
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 8px;
  border-top: 1px solid #e8e8eb;
`;

const ModalBtn = styled.button`
  padding: 9px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  border: 1px solid #e0e0e3;
  background: ${(p) => (p.$primary ? "#111" : "#fff")};
  color: ${(p) => (p.$primary ? "#fff" : "#555")};
  transition: all 0.15s;

  &:hover {
    background: ${(p) => (p.$primary ? "#333" : "#f5f5f7")};
  }

  &.danger {
    background: #dc2626;
    color: #fff;
    border-color: #dc2626;
    &:hover { background: #b91c1c; }
  }
`;

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const { userProfile } = useAuth();

  // Modal states
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // Edit form
  const [editData, setEditData] = useState({ id: "", nome: "", email: "", role: "franqueado" });

  // Add form
  const [newUser, setNewUser] = useState({ nome: "", email: "", senha: "", role: "franqueado" });

  // Delete target
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadUsers = async () => {
    const data = await getAllUsers();
    setUsers(data);
  };

  useEffect(() => { loadUsers(); }, []);

  const filtered = users.filter(
    (u) =>
      (u.nome || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  /* ─── Add User ─── */
  const handleAddUser = async () => {
    if (!newUser.nome || !newUser.email || !newUser.senha) {
      toast.error("Preencha todos os campos.");
      return;
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, newUser.email, newUser.senha);
      await createUserProfile(cred.user.uid, {
        nome: newUser.nome,
        email: newUser.email,
        role: newUser.role,
        permissions: [],
      });
      toast.success("Usuário criado com sucesso!");
      setAddModal(false);
      setNewUser({ nome: "", email: "", senha: "", role: "franqueado" });
      loadUsers();
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        toast.error("Este e-mail já está em uso.");
      } else {
        toast.error("Erro ao criar usuário.");
      }
    }
  };

  /* ─── Edit User ─── */
  const openEdit = (user) => {
    setEditData({
      id: user.id,
      nome: user.nome || "",
      email: user.email || "",
      role: user.role || "franqueado",
    });
    setEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateUserProfile(editData.id, {
        nome: editData.nome,
        email: editData.email,
        role: editData.role,
      });
      toast.success("Usuário atualizado!");
      setEditModal(false);
      loadUsers();
    } catch {
      toast.error("Erro ao atualizar.");
    }
  };

  /* ─── Delete User ─── */
  const openDelete = (user) => {
    if (user.id === userProfile?.id) {
      toast.error("Você não pode remover seu próprio perfil.");
      return;
    }
    setDeleteTarget(user);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteUserProfile(deleteTarget.id);
      toast.success("Usuário removido!");
      setDeleteModal(false);
      setDeleteTarget(null);
      loadUsers();
    } catch {
      toast.error("Erro ao remover.");
    }
  };

  if (userProfile?.role !== "admin") {
    return <Container><p>Você não tem permissão para acessar esta página.</p></Container>;
  }

  return (
    <Container>
      <Header>
        <div>
          <h1>Gerenciar Usuários</h1>
          <span>{users.length} usuário(s) registrado(s)</span>
        </div>
        <HeaderActions>
          <SearchBox>
            <FiSearch size={14} />
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchBox>
          <AddBtn onClick={() => setAddModal(true)}>
            <FiUserPlus size={14} /> Novo usuário
          </AddBtn>
        </HeaderActions>
      </Header>

      <UsersGrid>
        {filtered.map((user) => {
          const initials = (user.nome || user.email || "U").slice(0, 2);
          return (
            <UserRow key={user.id}>
              <UserInfo>
                <Avatar $role={user.role}>{initials}</Avatar>
                <UserMeta>
                  <strong>{user.nome || "Sem nome"}</strong>
                  <span>{user.email}</span>
                  <Badge $role={user.role}>
                    <FiShield size={10} />
                    {user.role || "franqueado"}
                  </Badge>
                </UserMeta>
              </UserInfo>
              <Actions>
                <IconBtn onClick={() => openEdit(user)}>
                  <FiEdit2 size={14} /> Editar
                </IconBtn>
                <IconBtn className="danger" onClick={() => openDelete(user)}>
                  <FiTrash2 size={14} />
                </IconBtn>
              </Actions>
            </UserRow>
          );
        })}
      </UsersGrid>

      {/* ─── Add Modal ─── */}
      <Modal
        isOpen={addModal}
        onRequestClose={() => setAddModal(false)}
        style={{ overlay: ModalOverlay, content: ModalBox }}
      >
        <ModalInner>
          <h2>Novo Usuário</h2>
          <FieldGroup>
            <label>Nome</label>
            <input
              type="text"
              value={newUser.nome}
              onChange={(e) => setNewUser({ ...newUser, nome: e.target.value })}
              placeholder="Nome completo"
            />
          </FieldGroup>
          <FieldGroup>
            <label>Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="email@exemplo.com"
            />
          </FieldGroup>
          <FieldGroup>
            <label>Senha</label>
            <input
              type="text"
              value={newUser.senha}
              onChange={(e) => setNewUser({ ...newUser, senha: e.target.value })}
              placeholder="Mínimo 6 caracteres"
            />
          </FieldGroup>
          <FieldGroup>
            <label>Cargo</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="franqueado">Franqueado</option>
            </select>
          </FieldGroup>
          <ModalActions>
            <ModalBtn onClick={() => setAddModal(false)}>Cancelar</ModalBtn>
            <ModalBtn $primary onClick={handleAddUser}>Criar usuário</ModalBtn>
          </ModalActions>
        </ModalInner>
      </Modal>

      {/* ─── Edit Modal ─── */}
      <Modal
        isOpen={editModal}
        onRequestClose={() => setEditModal(false)}
        style={{ overlay: ModalOverlay, content: ModalBox }}
      >
        <ModalInner>
          <h2>Editar Usuário</h2>
          <FieldGroup>
            <label>Nome</label>
            <input
              type="text"
              value={editData.nome}
              onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
            />
          </FieldGroup>
          <FieldGroup>
            <label>Email</label>
            <input
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            />
          </FieldGroup>
          <FieldGroup>
            <label>Cargo</label>
            <select
              value={editData.role}
              onChange={(e) => setEditData({ ...editData, role: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="franqueado">Franqueado</option>
            </select>
          </FieldGroup>
          <ModalActions>
            <ModalBtn onClick={() => setEditModal(false)}>Cancelar</ModalBtn>
            <ModalBtn $primary onClick={handleSaveEdit}>Salvar alterações</ModalBtn>
          </ModalActions>
        </ModalInner>
      </Modal>

      {/* ─── Delete Modal ─── */}
      <Modal
        isOpen={deleteModal}
        onRequestClose={() => setDeleteModal(false)}
        style={{ overlay: ModalOverlay, content: { ...ModalBox, width: "380px" } }}
      >
        <ModalInner>
          <h2>Confirmar Exclusão</h2>
          <p style={{ fontSize: 14, color: "#555", margin: 0 }}>
            Tem certeza que deseja remover <strong>{deleteTarget?.nome || deleteTarget?.email}</strong>?
            Esta ação não pode ser desfeita.
          </p>
          <ModalActions>
            <ModalBtn onClick={() => setDeleteModal(false)}>Cancelar</ModalBtn>
            <ModalBtn className="danger" onClick={handleDelete}>Excluir</ModalBtn>
          </ModalActions>
        </ModalInner>
      </Modal>
    </Container>
  );
};

export default Usuarios;
