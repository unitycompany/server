import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getAllUsers, updateUserProfile, deleteUserProfile, createUserProfile, resetUserPin, setUserPin } from "../../firebaseService";
import { useAuth, hasRole } from "../../AuthContext";
import { useSecurity, hashPin } from "../SecurityContext";
import PinModal from "../components/PinModal";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { getSecondaryAuth } from "../../firebaseConfig";
import Modal from "react-modal";
import {
  FiShield, FiTrash2, FiEdit2, FiX, FiCheck, FiUserPlus, FiSearch, FiMail, FiUser, FiPhone,
  FiEye, FiEyeOff, FiLock, FiUnlock, FiAlertTriangle
} from "react-icons/fi";

Modal.setAppElement("#root");

const maskPhone = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

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
  background: ${(p) => (p.$role === "superadmin" ? "#fce7f3" : p.$role === "admin" ? "#e0e7ff" : "#fef3c7")};
  color: ${(p) => (p.$role === "superadmin" ? "#be185d" : p.$role === "admin" ? "#4f46e5" : "#d97706")};
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
  background: ${(p) => (p.$role === "superadmin" ? "#fce7f3" : p.$role === "admin" ? "#e0e7ff" : "#fef3c7")};
  color: ${(p) => (p.$role === "superadmin" ? "#be185d" : p.$role === "admin" ? "#4f46e5" : "#d97706")};
`;

const PinStatusBadge = styled.span`
  font-size: 9px !important;
  padding: 1px 5px;
  border-radius: 3px;
  font-weight: 600 !important;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  width: fit-content;
  background: ${(p) => (p.$active ? "#d1fae5" : "#fef3c7")};
  color: ${(p) => (p.$active ? "#065f46" : "#92400e")};
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
  const { userProfile, currentUser } = useAuth();
  const { pinVerified, verifyPin } = useSecurity();

  // Modal states
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // PIN modal states
  const [pinModal, setPinModal] = useState(false);
  const [pinAction, setPinAction] = useState(null); // { type: 'viewPin', userId: ... }
  const [visiblePins, setVisiblePins] = useState({}); // { userId: true }

  // Edit form
  const [editData, setEditData] = useState({ id: "", nome: "", email: "", numero: "", role: "franqueado" });

  // Add form
  const [newUser, setNewUser] = useState({ nome: "", email: "", senha: "", numero: "", role: "franqueado", pin: "" });

  // Delete target
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Change PIN modal
  const [changePinModal, setChangePinModal] = useState(false);
  const [changePinTarget, setChangePinTarget] = useState(null);
  const [newPinValue, setNewPinValue] = useState("");

  const isSuperAdmin = userProfile?.role === "superadmin";
  const isAdmin = hasRole(userProfile?.role, "admin");

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

  /* ─── PIN verification for sensitive actions ─── */
  const requirePin = (action) => {
    if (pinVerified) {
      executeAction(action);
      return;
    }
    setPinAction(action);
    setPinModal(true);
  };

  const handlePinSubmit = async (pin) => {
    const pinHashed = await hashPin(pin);
    const myProfile = userProfile;
    if (myProfile?.pinHash !== pinHashed) {
      return false; // PIN incorreto
    }
    verifyPin();
    setPinModal(false);
    if (pinAction) executeAction(pinAction);
    return true;
  };

  const executeAction = (action) => {
    if (action?.type === "viewPin") {
      setVisiblePins(prev => ({ ...prev, [action.userId]: true }));
      setTimeout(() => {
        setVisiblePins(prev => {
          const copy = { ...prev };
          delete copy[action.userId];
          return copy;
        });
      }, 30000); // Esconde após 30 segundos
    }
  };

  /* ─── Add User ─── */
  const handleAddUser = async () => {
    if (!newUser.nome || !newUser.email || !newUser.senha) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    if (newUser.pin && newUser.pin.length !== 4) {
      toast.error("O PIN deve ter exatamente 4 dígitos.");
      return;
    }
    try {
      const secondaryAuth = getSecondaryAuth();
      const cred = await createUserWithEmailAndPassword(secondaryAuth, newUser.email, newUser.senha);
      const profileData = {
        nome: newUser.nome,
        email: newUser.email,
        numero: newUser.numero,
        role: newUser.role,
        permissions: [],
      };
      // Se definiu PIN no cadastro, salva o hash
      if (newUser.pin) {
        profileData.pinHash = await hashPin(newUser.pin);
        profileData.pinSetAt = new Date().toISOString();
      }
      await createUserProfile(cred.user.uid, profileData);
      await firebaseSignOut(secondaryAuth);
      toast.success("Usuário criado com sucesso!");
      setAddModal(false);
      setNewUser({ nome: "", email: "", senha: "", numero: "", role: "franqueado", pin: "" });
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
      numero: user.numero || "",
      role: user.role || "franqueado",
    });
    setEditModal(true);
  };

  const handleSaveEdit = async () => {
    // Não permite que não-superadmin defina alguém como superadmin
    if (editData.role === "superadmin" && !isSuperAdmin) {
      toast.error("Apenas Super Admin pode promover a Super Admin.");
      return;
    }
    try {
      await updateUserProfile(editData.id, {
        nome: editData.nome,
        email: editData.email,
        numero: editData.numero,
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
    if (user.role === "superadmin" && !isSuperAdmin) {
      toast.error("Você não pode remover um Super Admin.");
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

  /* ─── Reset PIN (superadmin only) ─── */
  const handleResetPin = async (userId) => {
    if (!isSuperAdmin) {
      toast.error("Apenas Super Admin pode resetar PINs.");
      return;
    }
    try {
      await resetUserPin(userId);
      toast.success("PIN resetado! O usuário precisará definir um novo PIN no próximo login.");
      loadUsers();
    } catch {
      toast.error("Erro ao resetar PIN.");
    }
  };

  /* ─── Change PIN (superadmin only) ─── */
  const openChangePin = (user) => {
    setChangePinTarget(user);
    setNewPinValue("");
    setChangePinModal(true);
  };

  const handleChangePin = async () => {
    if (!isSuperAdmin) {
      toast.error("Apenas Super Admin pode alterar PINs.");
      return;
    }
    if (newPinValue.length !== 4) {
      toast.error("O PIN deve ter exatamente 4 dígitos.");
      return;
    }
    try {
      const pinHashed = await hashPin(newPinValue);
      await setUserPin(changePinTarget.id, pinHashed);
      toast.success(`PIN de ${changePinTarget.nome || changePinTarget.email} alterado com sucesso!`);
      setChangePinModal(false);
      setChangePinTarget(null);
      setNewPinValue("");
      loadUsers();
    } catch {
      toast.error("Erro ao alterar PIN.");
    }
  };

  // Disponibiliza as roles baseadas na role do usuário logado
  const availableRoles = () => {
    if (isSuperAdmin) return ["superadmin", "admin", "franqueado"];
    return ["admin", "franqueado"];
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "superadmin": return "Super Admin";
      case "admin": return "Admin";
      default: return "Franqueado";
    }
  };

  if (!isAdmin) {
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
                  {user.numero && <span><FiPhone size={10} /> {user.numero}</span>}
                  <div style={{ display: "flex", gap: "4px", alignItems: "center", flexWrap: "wrap" }}>
                    <Badge $role={user.role}>
                      <FiShield size={10} />
                      {getRoleLabel(user.role)}
                    </Badge>
                    <PinStatusBadge $active={!!user.pinHash}>
                      {user.pinHash ? <><FiLock size={8} /> PIN</> : <><FiUnlock size={8} /> Sem PIN</>}
                    </PinStatusBadge>
                  </div>
                </UserMeta>
              </UserInfo>
              <Actions>
                {isSuperAdmin && (
                  <>
                    <IconBtn
                      onClick={() => openChangePin(user)}
                      title="Alterar PIN do usuário"
                    >
                      <FiLock size={14} /> {user.pinHash ? "Alterar PIN" : "Definir PIN"}
                    </IconBtn>
                    {user.pinHash && (
                      <IconBtn
                        className="danger"
                        onClick={() => handleResetPin(user.id)}
                        title="Resetar PIN (usuário terá que redefinir no login)"
                      >
                        <FiAlertTriangle size={14} /> Reset
                      </IconBtn>
                    )}
                  </>
                )}
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
            <label>Telefone</label>
            <input
              type="text"
              value={newUser.numero}
              onChange={(e) => setNewUser({ ...newUser, numero: maskPhone(e.target.value) })}
              placeholder="(00) 00000-0000"
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
            <label>PIN de Segurança (opcional)</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={newUser.pin}
              onChange={(e) => setNewUser({ ...newUser, pin: e.target.value.replace(/\D/g, "").slice(0, 4) })}
              placeholder="4 dígitos (pode definir depois)"
            />
          </FieldGroup>
          <FieldGroup>
            <label>Cargo</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              {availableRoles().map(r => (
                <option key={r} value={r}>{getRoleLabel(r)}</option>
              ))}
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
            <label>Telefone</label>
            <input
              type="text"
              value={editData.numero}
              onChange={(e) => setEditData({ ...editData, numero: maskPhone(e.target.value) })}
              placeholder="(00) 00000-0000"
            />
          </FieldGroup>
          <FieldGroup>
            <label>Cargo</label>
            <select
              value={editData.role}
              onChange={(e) => setEditData({ ...editData, role: e.target.value })}
            >
              {availableRoles().map(r => (
                <option key={r} value={r}>{getRoleLabel(r)}</option>
              ))}
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

      {/* ─── Change PIN Modal (superadmin) ─── */}
      <Modal
        isOpen={changePinModal}
        onRequestClose={() => setChangePinModal(false)}
        style={{ overlay: ModalOverlay, content: { ...ModalBox, width: "380px" } }}
      >
        <ModalInner>
          <h2><FiLock size={16} style={{ marginRight: 6 }} />
            {changePinTarget?.pinHash ? "Alterar" : "Definir"} PIN
          </h2>
          <p style={{ fontSize: 13, color: "#555", margin: 0 }}>
            {changePinTarget?.pinHash ? "Definir novo" : "Criar"} PIN de 4 dígitos para{" "}
            <strong>{changePinTarget?.nome || changePinTarget?.email}</strong>.
          </p>
          <FieldGroup>
            <label>Novo PIN (4 dígitos)</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={newPinValue}
              onChange={(e) => setNewPinValue(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="0000"
              style={{ fontSize: 20, textAlign: "center", letterSpacing: 12 }}
            />
          </FieldGroup>
          <ModalActions>
            <ModalBtn onClick={() => setChangePinModal(false)}>Cancelar</ModalBtn>
            <ModalBtn $primary onClick={handleChangePin} disabled={newPinValue.length !== 4}>
              Salvar PIN
            </ModalBtn>
          </ModalActions>
        </ModalInner>
      </Modal>

      {/* ─── PIN Modal ─── */}
      <PinModal
        isOpen={pinModal}
        onSubmit={handlePinSubmit}
        onCancel={() => { setPinModal(false); setPinAction(null); }}
        title="Autenticação Requerida"
        description="Digite seu PIN para acessar informações sensíveis."
      />
    </Container>
  );
};

export default Usuarios;
