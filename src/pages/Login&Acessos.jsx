import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import CardLogin from "../components/CardLogin";
import { getLogins, addLogin, removeLogin, editLogin } from "./../../firebaseService";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Configuração do modal
Modal.setAppElement("#root");

const Content = styled.div`
    padding: 2.5%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 10px;
    width: 100%;
    overflow-y: auto;

    & h1 {
        font-weight: 600;
    }
`;

const Top = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #00000050;
    padding: 10px 0;

    & button {
        padding: 5px 15px;
        background-color: #000000;
        border: 2px solid #727272;
        color: #fff;
        cursor: pointer;
        font-size: 14px;
        transition: all .2s ease;

        &:hover{
          background-color: #ffffff;
          border-color: #000;
          color: #000;
        }
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
    padding: 10px;
    height: 400px;
    width: 400px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    outline: none;
    height: 100%;

    & h2 {
        font-size: 18px;
        font-weight: 600;
        width: 100%;
        border-bottom: 1px solid #00000020;
        padding: 5px 0 10px 0;
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

        & input {
            padding: 8px;
            border-radius: 5px;
            font-size: 14px;
        }
    }

    & button {
        padding: 8px 10px;
        background-color: #424242;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 14px;
        border-radius: 5px;

        &:hover {
            background-color: #000;
        }
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

        & button{
            padding: 5px 10px;
            cursor: pointer;
            border: 1px solid #000;
            text-transform: uppercase;
            font-size: 15px;

            &:nth-child(1){
                background-color: #cf0a0a;
                color: #fff;
            }
        }
    }
`;

const dbName = "default";

const AcessoLogins = () => {
  const [logins, setLogins] = useState([]);
  const [reloadTrigger, setReloadTrigger] = useState(0); // Estado trigger reload
  const [reload, setReload] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loginToDelete, setLoginToDelete] = useState(null);
  const [newLogin, setNewLogin] = useState({
    nomeSite: "",
    login: "",
    senha: "",
    obs: "",
  });

  const fetchLogins = useCallback(async () => {
    const data = await getLogins(dbName);
    setLogins(data);
  }, []);
  

  useEffect(() => {
    fetchLogins();
  }, [fetchLogins, reload]);
  

  const handleAddLogin = async () => {
    if (!newLogin.nomeSite || !newLogin.login || !newLogin.senha) {
      toast.error("Preencha todos os campos!");
      return;
    }

    await addLogin(dbName, newLogin);
    setNewLogin({ nomeSite: "", login: "", senha: "", obs: "" });
    setModalIsOpen(false);
    toast.success("Login adicionado com sucesso!");
    setReloadTrigger(prev => prev + 1); // opcional, apenas se quiser atualizar aqui também
  };

  const handleRemoveLogin = async () => {
    if (loginToDelete) {
      await removeLogin(dbName, loginToDelete);
      setDeleteModal(false);
      toast.warn("Login removido!");
      setReloadTrigger(prev => prev + 1); // opcional também
    }
  };

  const handleEditLogin = async (id, updatedData) => {
    await editLogin(dbName, id, updatedData);
    toast.success("Login atualizado com sucesso!");
  
    setReload(prev => !prev); // Força a atualização do componente
  };
  
  
  
  
  

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddLogin();
    }
  };

  return (
    <Content>
      <Top>
        <h1>Login e Senhas</h1>
        <button onClick={() => setModalIsOpen(true)}>Adicionar novo login</button>
      </Top>

      <Container>
        {logins.map((login) => (
          <CardLogin
            key={login.id}
            id={login.id}
            nomeSite={login.nomeSite}
            login={login.login}
            senha={login.senha}
            obs={login.obs}
            onRemove={() => {
              setLoginToDelete(login.id);
              setDeleteModal(true);
            }}
            onEdit={handleEditLogin}
          />
        ))}
      </Container>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          content: { margin: "auto", width: "max-content", height: "400px" },
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
          <label>
            <span>Observação:</span>
            <input
              type="text"
              value={newLogin.obs}
              onChange={(e) => setNewLogin({ ...newLogin, obs: e.target.value })}
              onKeyDown={handleKeyPress}
            />
          </label>
          <button onClick={handleAddLogin}>Criar login</button>
        </ModalContent>
      </Modal>

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
  );
};


export default AcessoLogins;