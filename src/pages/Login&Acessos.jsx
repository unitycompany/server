import React, { useState, useEffect, useCallback } from "react";
import styled, { createGlobalStyle } from "styled-components";
import CardLogin from "../components/CardLogin";
import { getLogins, addLogin, removeLogin, editLogin } from "./../../firebaseService";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaLink, FaLinkedin, FaInstagram, FaYoutube, FaFacebook, FaBehance, FaCpanel,
  FaFigma, FaGithub, FaGoogleDrive, FaGoogle, FaMailchimp, FaPinterest, FaShopify,
  FaSpotify, FaTiktok, FaWordpress,
  FaSearch
} from "react-icons/fa";
import { FaMeta } from "react-icons/fa6";
import { IoLogoFirebase, IoLogoVercel } from "react-icons/io5";
import { SiCloudflare, SiFreepik, SiGoogleads, SiMake, SiSemrush, SiUdemy, SiZapier } from "react-icons/si";
import { PiLinktreeLogo } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";
import { IoIosSearch } from "react-icons/io";
import { RiFileExcel2Fill } from "react-icons/ri";
import { BsRocketTakeoff } from "react-icons/bs";

// Configuração do modal
Modal.setAppElement("#root");

// Objeto para mapear o nome da empresa à sua logo
const companyLogos = {
  "Nova Metálica": "https://via.placeholder.com/40x40?text=Nova",
  "Fast Sistemas Construtivos": "https://via.placeholder.com/40x40?text=FastSC",
  "Fast Homes": "https://via.placeholder.com/40x40?text=FastH",
  "Pousada Le Ange": "https://via.placeholder.com/40x40?text=LeAnge",
  "Milena": "https://via.placeholder.com/40x40?text=Milena"
};

// Array de opções de redes sociais (deve estar declarado antes de ser usado)
const socialOptions = [
  { name: "semlogo", icon: <FaLink /> },
  { name: "linkedin", icon: <FaLinkedin /> },
  { name: "instagram", icon: <FaInstagram /> },
  { name: "youtube", icon: <FaYoutube /> },
  { name: "facebook", icon: <FaFacebook /> },
  { name: "behance", icon: <FaBehance /> },
  { name: "cpanel", icon: <FaCpanel /> },
  { name: "figma", icon: <FaFigma /> },
  { name: "github", icon: <FaGithub /> },
  { name: "drive", icon: <FaGoogleDrive /> },
  { name: "google", icon: <FaGoogle /> },
  { name: "mailchimp", icon: <FaMailchimp /> },
  { name: "pinterest", icon: <FaPinterest /> },
  { name: "shopify", icon: <FaShopify /> },
  { name: "spotify", icon: <FaSpotify /> },
  { name: "tiktok", icon: <FaTiktok /> },
  { name: "wordpress", icon: <FaWordpress /> },
  { name: "vercel", icon: <IoLogoVercel /> },
  { name: "meta", icon: <FaMeta /> },
  { name: "googleads", icon: <SiGoogleads /> },
  { name: "linktree", icon: <PiLinktreeLogo /> },
  { name: "zapier", icon: <SiZapier /> },
  { name: "make", icon: <SiMake /> },
  { name: "cloudflare", icon: <SiCloudflare /> },
  { name: "firebase", icon: <IoLogoFirebase /> },
  { name: "semrush", icon: <SiSemrush /> },
  { name: "freepik", icon: <SiFreepik /> },
  { name: "excel", icon: <RiFileExcel2Fill /> },
  { name: "turbocloud", icon: <BsRocketTakeoff /> },
  { name: "udemy", icon: <SiUdemy /> },
];

// Novo styled component para o checkbox com estilo customizado
const CheckboxContainer = styled.label`
  position: relative;
  cursor: pointer;

  input {
    display: none!important;
    border: none!important;
  }
  svg {
    overflow: visible;
    font-size: 10px;
    top: 0;
    left: 0;
    border: none;
    width: 20px;
    height: 20px;
  }
  .path {
    fill: none;
    stroke: #000000;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: stroke-dasharray 0.5s ease;
    stroke-dasharray: 0 0 240 9999999;
    stroke-dashoffset: 1;
    transform: scale(-1, 1);
    transform-origin: center;
    animation: hi 0.5s;
  }
  input:checked ~ svg .path {
    stroke-dasharray: 0 262 70 9999999;
    transition-delay: 0s;
    transform: scale(1, 1);
    animation: none;
  }
  @keyframes hi {
    0% { stroke-dashoffset: 20; }
    to { stroke-dashoffset: 1; }
  }
`;

const Content = styled.div`
  padding: 0 2.5% 2.5% 2.5%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: flex-start;
  gap: 10px;
  width: 100%;
  overflow-y: auto;
  max-height: 100vh;
  position: relative;

  & h1 {
    font-weight: 600;
  }
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #000;
  padding: 5px 0px;
  position: sticky;
  top: 0;
  background-color: #ffffff;
  box-shadow: 0 0 50px rgba(255,255,255, 1);
  z-index: 1;

    & > aside {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  
  & button {
    padding: 5px 15px;
    background-color: #000000;
    border: 2px solid #727272;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;

    &:nth-child(1){
      background-color: transparent;
      color: #000;

      &:hover{
        background-color: #000;
        color: #fff;
      }
    }

    &:hover {
      background-color: #00ff2a1f;
      color: #000;
    }
  }
`;

const FilterContainer = styled.div`
  width: auto;
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 10px 0;

  & div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    width: auto;
    height: auto;
    border: 1px solid #00000050;
    padding: 5px;

    & svg {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      opacity: 0.5;
    }

    & input {
      font-size: 12px;
    }
  }

  & select {
    padding: 5px;
    font-size: 12px;
    border: 1px solid #00000050;
  }
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 10px;
`;

const ModalContent = styled.div`
  background: white;
  padding: 5px;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  outline: none;
  height: auto;
  max-height: 90vh;
  overflow-y: auto;

  & .StyleGoogle {
    border: 1px solid #00000020;
    padding: 10px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  & h2 {
    font-size: 18px;
    font-weight: 600;
    width: 100%;
    border-bottom: 1px solid #00000020;
    padding: 5px 0 10px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  & label {
    display: flex;
    flex-direction: column;
    gap: 5px;
    border: 1px solid #00000020;
    position: relative;
    & span {
      background: #fff;
      padding: 2px 5px;
      top: -10px;
      left: 5px;
      position: absolute;
      font-size: 12px;
      font-weight: 600;
      color: #00000080;
    }
    & input,
    & select {
      padding: 8px;
      border-radius: 5px;
      font-size: 14px;
    }
  }
  & .social-selection {
    display: flex;
    gap: 3px;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    flex-wrap: wrap;
    border: 1px solid #00000020;
    padding: 5px;
  }
  & .social-icon {
    font-size: 18px;
    padding: 5px;
    border: 1px solid #00000020;
    cursor: pointer;
    opacity: 0.6;
    transition: all 0.2s ease;
  }
  & .social-icon.selected {
    opacity: 1;
    background-color: #000;
    & svg {
      fill: #fff;
    }
  }
  & button {
    padding: 12px 10px;
    background-color: #424242;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 14px;
    &:hover {
      background-color: #000;
    }
  }
  & div {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 5px;
    position: relative;
  }
`;

const ModalExcluir = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  & h2 {
    font-size: 18px;
    font-weight: 600;
    width: 100%;
    border-bottom: 1px solid #00000020;
    padding: 5px 0 5px 0;
  }
  & p {
    font-size: 14px;
    padding: 10px 0;
  }
  & div {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 10px;
    padding: 10px 0;
    & button {
      padding: 5px 10px;
      cursor: pointer;
      border: 1px solid #000;
      text-transform: uppercase;
      font-size: 15px;
      &:nth-child(1) {
        background-color: #cf0a0a;
        color: #fff;
      }
    }
  }
`;

const dbName = "default";

const AcessoLogins = () => {
  const [logins, setLogins] = useState([]);
  const [reload, setReload] = useState(false);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loginToDelete, setLoginToDelete] = useState(null);

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [empresaFilter, setEmpresaFilter] = useState("");
  const [showCursosOnly, setShowCursosOnly] = useState(false);

  // Estado do novo login (inclui googleLogin, empresa, cursoLogin e cardFixo)
  const [newLogin, setNewLogin] = useState({
    nomeSite: "",
    login: "",
    senha: "",
    obs: "",
    googleLogin: false,
    empresa: "",
    siteUrl: "",
    cursoLogin: false, // Adicionado campo explicitamente
    cardFixo: false, // Novo campo para card fixo
  });

  // Estado de edição (mapeando "obs" para "social", mas inclui googleLogin, empresa, cursoLogin e cardFixo)
  const [editLoginData, setEditLoginData] = useState({
    id: "",
    nomeSite: "",
    login: "",
    senha: "",
    social: "",
    googleLogin: false,
    empresa: "",
    siteUrl: "",
    cardFixo: false, // Novo campo para card fixo
  });

  const fetchLogins = useCallback(async () => {
    const data = await getLogins(dbName);
    setLogins(data);
  }, []);

  useEffect(() => {
    fetchLogins();
  }, [fetchLogins, reload]);

  // Filtrando os logins conforme o termo de busca, empresa e cursos
  const filteredLogins = logins.filter((login) => {
    const matchNomeSite = login.nomeSite.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEmpresa = empresaFilter ? login.empresa === empresaFilter : true;
    const matchCurso = showCursosOnly ? login.cursoLogin === true : true;
    return matchNomeSite && matchEmpresa && matchCurso;
  });

  // Organizar logins: fixos primeiro, depois ordem alfabética
  const sortedLogins = filteredLogins.sort((a, b) => {
    // Cards fixos sempre primeiro
    if (a.cardFixo && !b.cardFixo) return -1;
    if (!a.cardFixo && b.cardFixo) return 1;

    // Se ambos são fixos ou ambos não são fixos, ordenar alfabeticamente
    return a.nomeSite.localeCompare(b.nomeSite);
  });

  const handleAddLogin = async () => {
    if (!newLogin.nomeSite || !newLogin.login || !newLogin.senha) {
      toast.error("Preencha todos os campos!");
      return;
    }
    await addLogin(dbName, newLogin); // newLogin já inclui cursoLogin
    setNewLogin({
      nomeSite: "",
      login: "",
      senha: "",
      obs: "",
      googleLogin: false,
      empresa: "",
      siteUrl: "",
      cursoLogin: false, // Resetar campo
      cardFixo: false, // Resetar campo
    });
    setModalAddIsOpen(false);
    toast.success("Login adicionado com sucesso!");
    setReload((prev) => !prev);
  };

  const handleRemoveLogin = async () => {
    if (loginToDelete) {
      await removeLogin(dbName, loginToDelete);
      setDeleteModal(false);
      toast.warn("Login removido!");
      setReload((prev) => !prev);
    }
  };

  const openEditModal = (login) => {
    setEditLoginData({
      id: login.id,
      nomeSite: login.nomeSite,
      login: login.login,
      senha: login.senha,
      social: login.obs || "",
      googleLogin: login.googleLogin || false,
      empresa: login.empresa || "",
      siteUrl: login.siteUrl || "",
      cursoLogin: login.cursoLogin || false,
      cardFixo: login.cardFixo || false,
    });
    setModalEditIsOpen(true);
  };

  const handleEditLogin = async () => {
    const { id, nomeSite, login, senha, social, googleLogin, empresa, siteUrl, cursoLogin, cardFixo } = editLoginData;
    if (!nomeSite || !login || !senha) {
      toast.error("Preencha todos os campos!");
      return;
    }
    await editLogin(dbName, id, {
      nomeSite,
      login,
      senha,
      obs: social,
      googleLogin,
      empresa,
      siteUrl,
      cursoLogin,
      cardFixo
    });
    toast.success("Login atualizado com sucesso!");
    setModalEditIsOpen(false);
    setReload((prev) => !prev);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddLogin();
    }
  };

  // Verifica se há pelo menos um login de curso
  const hasCursos = sortedLogins.some(login => login.cursoLogin);

  return (
    <>
      <Content>
        <Top>
          <h1>Login e Senhas</h1>

          <FilterContainer>
            <div>
              <IoIosSearch />
              <input
                type="text"
                placeholder="Buscar nome do site"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={empresaFilter}
              onChange={(e) => setEmpresaFilter(e.target.value)}
            >
              <option value="">Todas as Empresas</option>
              <option value="Unity">Unity</option>
              <option value="Nova Metálica">Nova Metálica</option>
              <option value="Fast Sistemas Construtivos">Fast Sistemas Construtivos</option>
              <option value="Fast Homes">Fast Homes</option>
              <option value="Pousada Le Ange">Pousada Le Ange</option>
              <option value="Milena">Milena</option>
            </select>
          </FilterContainer>

          <aside>
            <button
              onClick={() => setShowCursosOnly((prev) => !prev)}
              style={{
                background: showCursosOnly ? '#000' : undefined,
                color: showCursosOnly ? '#fff' : undefined,
                borderColor: showCursosOnly ? '#ffffff80' : undefined,
              }}
            >
              {showCursosOnly ? 'Voltar' : 'Cursos'}
            </button>
            <button onClick={() => setModalAddIsOpen(true)}>Adicionar novo login</button>
          </aside>

        </Top>

        <Container hasCursos={hasCursos}>
          {sortedLogins.map((login) => (
            <CardLogin
              key={login.id}
              id={login.id}
              nomeSite={login.nomeSite}
              login={login.login}
              senha={login.senha}
              obs={login.obs}
              empresa={login.empresa}
              siteUrl={login.siteUrl}
              googleLogin={login.googleLogin}
              onRemove={() => {
                setLoginToDelete(login.id);
                setDeleteModal(true);
              }}
              onEdit={() => openEditModal(login)}
              className={login.cursoLogin ? 'curso-card' : ''}
              cursoLogin={login.cursoLogin}
              cardFixo={login.cardFixo}
            />
          ))}
        </Container>

        {/* Modal para Adicionar Novo Login */}
        <Modal
          isOpen={modalAddIsOpen}
          onRequestClose={() => setModalAddIsOpen(false)}
          style={{
            overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: "10" },
            content: { margin: "auto", width: "max-content", overflow: "hidden", height: "max-content" },
          }}
        >
          <ModalContent>
            <h2>Adicionar Novo Login</h2>
            <label>
              <span>Nome do Site:</span>
              <input
                type="text"
                value={newLogin.nomeSite}
                onChange={(e) => setNewLogin({ ...newLogin, nomeSite: e.target.value })}
                onKeyDown={handleKeyPress}
              />
            </label>
            <label>
              <span>URL do site</span>
              <input type="text"
                value={newLogin.siteUrl || ""}
                onChange={(e) => setNewLogin({ ...newLogin, siteUrl: e.target.value })}
                placeholder="https://www.exemplo.com"
                onKeyDown={handleKeyPress}
              />
            </label>
            <label>
              <span>Login:</span>
              <input
                type="text"
                value={newLogin.login}
                onChange={(e) => setNewLogin({ ...newLogin, login: e.target.value })}
                onKeyDown={handleKeyPress}
              />
            </label>
            <label>
              <span>Senha:</span>
              <input
                type="text"
                value={newLogin.senha}
                onChange={(e) => setNewLogin({ ...newLogin, senha: e.target.value })}
                onKeyDown={handleKeyPress}
              />
            </label>

            {/* Seletor de ícone (social) com tooltip */}
            <div className="social-selection">
              {socialOptions.map((option) => (
                <div
                  key={option.name}
                  title={option.name}
                  className={`social-icon ${newLogin.obs === option.name ? "selected" : ""}`}
                  onClick={() => setNewLogin({ ...newLogin, obs: option.name })}
                >
                  {option.icon}
                </div>
              ))}
            </div>

            {/* Select para definir empresa */}
            <label>
              <span>Definir Empresa:</span>
              <select
                value={newLogin.empresa}
                onChange={(e) => setNewLogin({ ...newLogin, empresa: e.target.value })}
              >
                <option value="">Selecione uma empresa</option>
                <option value="Unity">Unity</option>
                <option value="Nova Metálica">Nova Metálica</option>
                <option value="Fast Sistemas Construtivos">Fast Sistemas Construtivos</option>
                <option value="Fast Homes">Fast Homes</option>
                <option value="Pousada Le Ange">Pousada Le Ange</option>
                <option value="Milena">Milena</option>
              </select>
            </label>

            {/* Checkbox customizado para "É necessário logar pelo Google?" */}
            <div className="StyleGoogle">
              <span>É necessário logar pelo Google?</span>
              <CheckboxContainer>
                <input
                  type="checkbox"
                  checked={newLogin.googleLogin}
                  onChange={(e) => setNewLogin({ ...newLogin, googleLogin: e.target.checked })}
                />
                <svg viewBox="0 0 64 64">
                  <path
                    d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                    pathLength="575.0541381835938"
                    className="path"
                  ></path>
                </svg>
              </CheckboxContainer>
            </div>

            <div className="StyleGoogle">
              <span>É um link de curso?</span>
              <CheckboxContainer>
                <input
                  type="checkbox"
                  checked={newLogin.cursoLogin || false}
                  onChange={(e) => setNewLogin({ ...newLogin, cursoLogin: e.target.checked })}
                />
                <svg viewBox="0 0 64 64">
                  <path
                    d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                    pathLength="575.0541381835938"
                    className="path"
                  ></path>
                </svg>
              </CheckboxContainer>
            </div>

            <div className="StyleGoogle">
              <span>É um card fixo?</span>
              <CheckboxContainer>
                <input
                  type="checkbox"
                  checked={newLogin.cardFixo || false}
                  onChange={(e) => setNewLogin({ ...newLogin, cardFixo: e.target.checked })}
                />
                <svg viewBox="0 0 64 64">
                  <path
                    d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                    pathLength="575.0541381835938"
                    className="path"
                  ></path>
                </svg>
              </CheckboxContainer>
            </div>

            <button onClick={handleAddLogin}>Criar login</button>
          </ModalContent>
        </Modal>

        {/* Modal para Edição */}
        <Modal
          isOpen={modalEditIsOpen}
          onRequestClose={() => setModalEditIsOpen(false)}
          style={{
            overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: "10" },
            content: { margin: "auto", width: "max-content", overflow: "hidden", height: "max-content" },
          }}
        >
          <ModalContent>
            <h2>
              Editar Login{" "}
              {editLoginData.social &&
                socialOptions.find((option) => option.name === editLoginData.social)?.icon}
            </h2>

            <label>
              <span>Nome do Site:</span>
              <input
                type="text"
                value={editLoginData.nomeSite}
                onChange={(e) => setEditLoginData({ ...editLoginData, nomeSite: e.target.value })}
              />
            </label>
            <label>
              <span>URL do site</span>
              <input type="text"
                value={editLoginData.siteUrl || ""}
                onChange={(e) => setEditLoginData({ ...editLoginData, siteUrl: e.target.value })}
                placeholder="https://www.exemplo.com"
                onKeyDown={handleKeyPress}
              />
            </label>
            <label>
              <span>Login:</span>
              <input
                type="text"
                value={editLoginData.login}
                onChange={(e) => setEditLoginData({ ...editLoginData, login: e.target.value })}
              />
            </label>
            <label>
              <span>Senha:</span>
              <input
                type="text"
                value={editLoginData.senha}
                onChange={(e) => setEditLoginData({ ...editLoginData, senha: e.target.value })}
              />
            </label>

            {/* Seletor de ícone (social) com tooltip */}
            <div className="social-selection">
              {socialOptions.map((option) => (
                <div
                  key={option.name}
                  title={option.name}
                  className={`social-icon ${editLoginData.social === option.name ? "selected" : ""}`}
                  onClick={() => setEditLoginData({ ...editLoginData, social: option.name })}
                >
                  {option.icon}
                </div>
              ))}
            </div>

            {/* Select para definir empresa */}
            <label>
              <span>Definir Empresa:</span>
              <select
                value={editLoginData.empresa}
                onChange={(e) => setEditLoginData({ ...editLoginData, empresa: e.target.value })}
              >
                <option value="">Selecione uma empresa</option>
                <option value="Unity">Unity</option>
                <option value="Nova Metálica">Nova Metálica</option>
                <option value="Fast Sistemas Construtivos">Fast Sistemas Construtivos</option>
                <option value="Fast Homes">Fast Homes</option>
                <option value="Pousada Le Ange">Pousada Le Ange</option>
                <option value="Milena">Milena</option>
              </select>
            </label>

            {/* Checkbox customizado para "É necessário logar pelo Google?" */}
            <div className="StyleGoogle">
              <span>É necessário logar pelo Google?</span>
              <CheckboxContainer>
                <input
                  type="checkbox"
                  checked={editLoginData.googleLogin}
                  onChange={(e) => setEditLoginData({ ...editLoginData, googleLogin: e.target.checked })}
                />
                <svg viewBox="0 0 64 64">
                  <path
                    d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                    pathLength="575.0541381835938"
                    className="path"
                  ></path>
                </svg>
              </CheckboxContainer>
            </div>
            <div className="StyleGoogle">
              <span>É um link de curso?</span>
              <CheckboxContainer>
                <input
                  type="checkbox"
                  checked={editLoginData.cursoLogin || false}
                  onChange={(e) => setEditLoginData({ ...editLoginData, cursoLogin: e.target.checked })}
                />
                <svg viewBox="0 0 64 64">
                  <path
                    d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                    pathLength="575.0541381835938"
                    className="path"
                  ></path>
                </svg>
              </CheckboxContainer>
            </div>
            <div className="StyleGoogle">
              <span>É um card fixo?</span>
              <CheckboxContainer>
                <input
                  type="checkbox"
                  checked={editLoginData.cardFixo || false}
                  onChange={(e) => setEditLoginData({ ...editLoginData, cardFixo: e.target.checked })}
                />
                <svg viewBox="0 0 64 64">
                  <path
                    d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                    pathLength="575.0541381835938"
                    className="path"
                  ></path>
                </svg>
              </CheckboxContainer>
            </div>

            <button onClick={handleEditLogin}>Atualizar login</button>
          </ModalContent>
        </Modal>

        {/* Modal para Exclusão */}
        <Modal
          isOpen={deleteModal}
          onRequestClose={() => setDeleteModal(false)}
          style={{
            overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
            content: { margin: "auto", width: "400px", height: "180px" },
          }}
        >
          <ModalExcluir>
            <h2>Confirmar Exclusão</h2>
            <p>Tem certeza que deseja excluir este login?</p>
            <div>
              <button onClick={handleRemoveLogin}>Excluir</button>
              <button onClick={() => setDeleteModal(false)}>Cancelar</button>
            </div>
          </ModalExcluir>
        </Modal>
      </Content>
    </>
  );
};

export default AcessoLogins;
