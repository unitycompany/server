import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth, hasRole } from "../../AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { updateUserProfile, setUserPin, getUserPinHash } from "../../firebaseService";
import { useSecurity, hashPin } from "../SecurityContext";
import AcessoLogins from "../pages/Login&Acessos";
import Usuarios from "../pages/Usuarios";
import SteelConecta from "../pages/SteelConecta";
import { toast } from "react-toastify";
import { IoLogOutOutline } from "react-icons/io5";
import PousadaLeAnge from "../pages/BC/pousadaleange";
import FastHomes from "../pages/BC/fasthomes";
import NovaMetalica from "../pages/BC/novametalica";
import Assinaturas from "../pages/Assinaturas";
import {
  FiKey, FiUsers, FiShield, FiSettings,
  FiDollarSign, FiExternalLink, FiEdit2, FiX, FiCheck, FiLock,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

/* ─── Layout ─── */
const Layout = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #f5f5f7;
`;

/* ─── Sidebar ─── */
const Sidebar = styled.aside`
  width: 260px;
  min-width: 260px;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e8e8eb;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 20px 20px 12px;
  display: flex;
  align-items: center;
  gap: 10px;

  & img {
    height: 26px;
    width: auto;
  }
`;

const SidebarNav = styled.nav`
  flex: 1;
  overflow-y: auto;
  padding: 4px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SectionLabel = styled.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #9b9ba7;
  padding: 18px 8px 6px;
  font-weight: 600;
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  background: ${(p) => (p.$active ? "#f0f0f3" : "transparent")};
  color: ${(p) => (p.$active ? "#111" : "#555")};
  font-size: 13.5px;
  font-weight: ${(p) => (p.$active ? "600" : "400")};
  cursor: pointer;
  transition: all 0.12s ease;
  text-align: left;
  font-family: inherit;
  position: relative;

  ${(p) =>
    p.$active &&
    `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 18px;
      background: #111;
      border-radius: 0 3px 3px 0;
    }
  `}

  &:hover {
    background: #f5f5f7;
    color: #111;
  }

  & svg {
    width: 17px;
    height: 17px;
    flex-shrink: 0;
    stroke-width: 1.8;
  }

  & img {
    width: 17px;
    height: 17px;
    border-radius: 4px;
    flex-shrink: 0;
    object-fit: cover;
  }
`;

const ExternalBadge = styled.span`
  margin-left: auto;
  opacity: 0.3;
  display: flex;
  align-items: center;
`;

const Divider = styled.div`
  height: 1px;
  background: #e8e8eb;
  margin: 4px 8px;
`;

/* ─── Sidebar Footer ─── */
const SidebarFooter = styled.div`
  border-top: 1px solid #e8e8eb;
  padding: 8px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 10px;
  border: none;
  border-radius: 8px;
  background: ${(p) => (p.$active ? "#f0f0f3" : "transparent")};
  cursor: pointer;
  transition: all 0.12s ease;
  text-align: left;
  font-family: inherit;

  &:hover {
    background: #f5f5f7;
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(p) => (p.$role === "superadmin" ? "#fce7f3" : p.$role === "admin" ? "#e0e7ff" : "#fef3c7")};
  color: ${(p) => (p.$role === "superadmin" ? "#be185d" : p.$role === "admin" ? "#4f46e5" : "#d97706")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
  text-transform: uppercase;
`;

const UserMeta = styled.div`
  flex: 1;
  overflow: hidden;

  & p {
    font-size: 13px;
    font-weight: 500;
    color: #111;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  & span {
    font-size: 11px;
    color: #9b9ba7;
    text-transform: capitalize;
  }
`;

const FooterAction = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #555;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.12s ease;
  font-family: inherit;
  text-align: left;

  &:hover {
    background: #f5f5f7;
    color: #111;
  }

  &.logout:hover {
    background: #fef2f2;
    color: #dc2626;
  }

  & svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

/* ─── Profile Panel ─── */
const ProfilePanel = styled.div`
  padding: 40px;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  max-height: 100vh;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ProfileAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${(p) => (p.$role === "superadmin" ? "#fce7f3" : p.$role === "admin" ? "#e0e7ff" : "#fef3c7")};
  color: ${(p) => (p.$role === "superadmin" ? "#be185d" : p.$role === "admin" ? "#4f46e5" : "#d97706")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  text-transform: uppercase;
  flex-shrink: 0;
`;

const ProfileInfo = styled.div`
  & h2 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
  }
  & span {
    font-size: 13px;
    color: #9b9ba7;
  }
`;

const ProfileRoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 600;
  width: fit-content;
  margin-top: 4px;
  background: ${(p) => (p.$role === "superadmin" ? "#fce7f3" : p.$role === "admin" ? "#e0e7ff" : "#fef3c7")};
  color: ${(p) => (p.$role === "superadmin" ? "#be185d" : p.$role === "admin" ? "#4f46e5" : "#d97706")};
`;

const ProfileField = styled.div`
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

  & input {
    padding: 10px 12px;
    border: 1px solid #e0e0e3;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    transition: border-color 0.15s;

    &:focus {
      outline: none;
      border-color: #111;
    }

    &:disabled {
      background: #f5f5f7;
      color: #999;
    }
  }
`;

const ProfileActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

const ProfileBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
  border: 1px solid #e0e0e3;
  background: ${(p) => (p.$primary ? "#111" : "#fff")};
  color: ${(p) => (p.$primary ? "#fff" : "#555")};

  &:hover {
    background: ${(p) => (p.$primary ? "#333" : "#f5f5f7")};
  }
`;

/* ─── Main ─── */
const Main = styled.main`
  flex: 1;
  overflow: hidden;
  background: #fff;
  border-radius: 12px 0 0 12px;
`;

/* ─── Menu Config ─── */
const menuConfig = [
  {
    section: "Menu",
    items: [
      { title: "Logins e acessos", icon: <FiKey />, roles: ["superadmin", "admin"] },
      { title: "Assinaturas", icon: <FiDollarSign />, roles: ["superadmin", "admin"] },
      { title: "Gerenciar usuários", icon: <FiUsers />, roles: ["superadmin", "admin"] },
    ],
  },
  {
    section: "Steel Conecta",
    items: [
      { title: "Steel Conecta", icon: <HiOutlineBuildingOffice2 />, roles: ["superadmin", "admin", "franqueado"] },
    ],
  },
  {
    section: "Banco de Dados",
    items: [
      {
        title: "Pousada Le Ange",
        icon: <img src="https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/eb648853-1763-415e-491c-e162bad01800/public" alt="" />,
        roles: ["superadmin", "admin"],
      },
      {
        title: "Fast Homes",
        icon: <img src="https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/8ce698f2-4801-4660-4282-aac5cbde5200/public" alt="" />,
        roles: ["superadmin", "admin"],
      },
    ],
  },
  {
    section: "Externo",
    items: [
      {
        title: "Relatório pré-vendas",
        icon: <FiExternalLink />,
        roles: ["superadmin", "admin"],
        external: "https://relatorio.fastsistemasconstrutivos.com.br",
      },
    ],
  },
];

const componentMap = {
  "Logins e acessos": <AcessoLogins />,
  "Assinaturas": <Assinaturas />,
  "Gerenciar usuários": <Usuarios />,
  "Steel Conecta": <SteelConecta />,
  "Pousada Le Ange": <PousadaLeAnge />,
  "Fast Homes": <FastHomes />,
  "Nova Metálica": <NovaMetalica />,
};

/* ─── PIN Change Styled ─── */
const PinChangeSection = styled.div`
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #e0e0e3;
  border-radius: 10px;
  background: #fafafa;
`;

const PinChangeTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PinInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;

  label {
    font-size: 13px;
    color: #666;
    min-width: 120px;
  }

  input {
    width: 120px;
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    font-family: monospace;
    letter-spacing: 4px;
    text-align: center;
  }
`;

/* ─── Profile Component ─── */
const MeuPerfil = () => {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [nome, setNome] = useState(userProfile?.nome || "");
  const [email] = useState(userProfile?.email || currentUser?.email || "");
  const role = userProfile?.role || "franqueado";
  const initials = (userProfile?.nome || currentUser?.email || "U").slice(0, 2);

  /* PIN change state */
  const [changingPin, setChangingPin] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinLoading, setPinLoading] = useState(false);

  useEffect(() => {
    setNome(userProfile?.nome || "");
  }, [userProfile]);

  const handleSave = async () => {
    try {
      await updateUserProfile(currentUser.uid, { nome });
      await refreshProfile(currentUser.uid);
      toast.success("Perfil atualizado!");
      setEditing(false);
    } catch {
      toast.error("Erro ao atualizar perfil.");
    }
  };

  const resetPinFields = () => {
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    setChangingPin(false);
  };

  const handleChangePin = async () => {
    if (currentPin.length !== 4 || newPin.length !== 4 || confirmPin.length !== 4) {
      toast.error("Todos os campos devem ter 4 dígitos.");
      return;
    }
    if (newPin !== confirmPin) {
      toast.error("Novo PIN e confirmação não coincidem.");
      return;
    }
    setPinLoading(true);
    try {
      const storedHash = await getUserPinHash(currentUser.uid);
      const currentHash = await hashPin(currentPin);
      if (currentHash !== storedHash) {
        toast.error("PIN atual incorreto.");
        setPinLoading(false);
        return;
      }
      const newHash = await hashPin(newPin);
      await setUserPin(currentUser.uid, newHash);
      toast.success("PIN alterado com sucesso!");
      resetPinFields();
    } catch {
      toast.error("Erro ao alterar PIN.");
    } finally {
      setPinLoading(false);
    }
  };

  return (
    <ProfilePanel>
      <ProfileHeader>
        <ProfileAvatar $role={role}>{initials}</ProfileAvatar>
        <ProfileInfo>
          <h2>{userProfile?.nome || "Sem nome"}</h2>
          <span>{email}</span>
          <br />
          <ProfileRoleBadge $role={role}>
            <FiShield size={11} /> {role === "superadmin" ? "Super Admin" : role}
          </ProfileRoleBadge>
        </ProfileInfo>
      </ProfileHeader>

      <ProfileField>
        <label>Nome</label>
        <input
          type="text"
          value={nome}
          disabled={!editing}
          onChange={(e) => setNome(e.target.value)}
        />
      </ProfileField>

      <ProfileField>
        <label>Email</label>
        <input type="text" value={email} disabled />
      </ProfileField>

      <ProfileField>
        <label>Cargo</label>
        <input type="text" value={role} disabled />
      </ProfileField>

      <ProfileField>
        <label>Membro desde</label>
        <input
          type="text"
          value={
            userProfile?.createdAt
              ? new Date(userProfile.createdAt).toLocaleDateString("pt-BR")
              : "—"
          }
          disabled
        />
      </ProfileField>

      <ProfileActions>
        {editing ? (
          <>
            <ProfileBtn $primary onClick={handleSave}>
              <FiCheck size={14} /> Salvar
            </ProfileBtn>
            <ProfileBtn onClick={() => { setEditing(false); setNome(userProfile?.nome || ""); }}>
              <FiX size={14} /> Cancelar
            </ProfileBtn>
          </>
        ) : (
          <>
            <ProfileBtn onClick={() => setEditing(true)}>
              <FiEdit2 size={14} /> Editar perfil
            </ProfileBtn>
            <ProfileBtn onClick={() => setChangingPin((v) => !v)}>
              <FiLock size={14} /> {changingPin ? "Cancelar" : "Alterar PIN"}
            </ProfileBtn>
          </>
        )}
      </ProfileActions>

      {changingPin && (
        <PinChangeSection>
          <PinChangeTitle><FiLock size={14} /> Alterar PIN</PinChangeTitle>
          <PinInputRow>
            <label>PIN atual</label>
            <input
              type="password"
              maxLength={4}
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ""))}
              placeholder="••••"
            />
          </PinInputRow>
          <PinInputRow>
            <label>Novo PIN</label>
            <input
              type="password"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
              placeholder="••••"
            />
          </PinInputRow>
          <PinInputRow>
            <label>Confirmar PIN</label>
            <input
              type="password"
              maxLength={4}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
              placeholder="••••"
            />
          </PinInputRow>
          <ProfileActions>
            <ProfileBtn $primary onClick={handleChangePin} disabled={pinLoading}>
              <FiCheck size={14} /> {pinLoading ? "Salvando..." : "Salvar PIN"}
            </ProfileBtn>
            <ProfileBtn onClick={resetPinFields}>
              <FiX size={14} /> Cancelar
            </ProfileBtn>
          </ProfileActions>
        </PinChangeSection>
      )}
    </ProfilePanel>
  );
};

/* ─── Homepage ─── */
const Homepage = () => {
  const { currentUser, userProfile } = useAuth();
  const { clearPinSession } = useSecurity();
  const userRole = userProfile?.role || "franqueado";
  const initials = (userProfile?.nome || currentUser?.email || "U").slice(0, 2);

  const filteredSections = menuConfig
    .map((s) => ({ ...s, items: s.items.filter((i) => i.roles.includes(userRole)) }))
    .filter((s) => s.items.length > 0);

  const firstItem = filteredSections[0]?.items[0];
  const defaultTitle = firstItem?.external ? null : firstItem?.title || "";
  const [selectedOption, setSelectedOption] = useState(defaultTitle);

  const handleItemClick = (item) => {
    if (item.external) {
      window.open(item.external, "_blank", "noopener,noreferrer");
      return;
    }
    setSelectedOption(item.title);
  };

  const handleLogout = async () => {
    try {
      clearPinSession();
      await signOut(auth);
      localStorage.removeItem("lastLogin");
      toast.success("Logout realizado com sucesso!");
    } catch {
      toast.error("Erro ao fazer logout.");
    }
  };

  const renderContent = () => {
    if (selectedOption === "__profile__") return <MeuPerfil />;
    return componentMap[selectedOption] || null;
  };

  return (
    <Layout>
      <Sidebar>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <SidebarHeader>
            <img src="/logo-unity-company.svg" alt="Unity Company" />
          </SidebarHeader>

          <SidebarNav>
            {filteredSections.map((section, idx) => (
              <React.Fragment key={section.section}>
                {idx > 0 && <Divider />}
                <SectionLabel>{section.section}</SectionLabel>
                {section.items.map((item) => (
                  <NavItem
                    key={item.title}
                    $active={selectedOption === item.title}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.icon}
                    {item.title}
                    {item.external && (
                      <ExternalBadge><FiExternalLink size={12} /></ExternalBadge>
                    )}
                  </NavItem>
                ))}
              </React.Fragment>
            ))}
          </SidebarNav>
        </div>

        <SidebarFooter>
          <Divider />
          <FooterAction onClick={() => setSelectedOption("__profile__")}>
            <FiSettings /> Configurações
          </FooterAction>
          <FooterAction className="logout" onClick={handleLogout}>
            <IoLogOutOutline /> Sair
          </FooterAction>
          <Divider />
          <UserButton
            $active={selectedOption === "__profile__"}
            onClick={() => setSelectedOption("__profile__")}
          >
            <UserAvatar $role={userRole}>{initials}</UserAvatar>
            <UserMeta>
              <p>{userProfile?.nome || currentUser?.email}</p>
              <span>{userRole === "superadmin" ? "Super Admin" : userRole}</span>
            </UserMeta>
          </UserButton>
        </SidebarFooter>
      </Sidebar>

      <Main>{renderContent()}</Main>
    </Layout>
  );
};

export default Homepage;
