import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { getDatabase } from "../../firebaseConfig";
import CardSite from "../components/CardSites";
import { toast } from "react-toastify"; // Função toast do React Toastify

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
    background-color: #000;
    border: 2px solid #727272;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 30px;
  width: 90%;
  max-width: 600px;
  position: relative;
  max-height: 80vh;
  overflow: auto;

  & button {
    padding: 5px 15px;
    background-color: #000000;
    border: 2px solid #727272;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
  }

  & article {
    & h2 {
      font-size: 22px;
      font-weight: 600;
      color: transparent;
      background: linear-gradient(90deg, #bd0a0a, #2e2d2d, #003aa7);
      -webkit-background-clip: text;
    }
  }

  & form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;

    & label {
      border: 1px solid #00000020;
      padding: 15px 10px 10px 10px;
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 10px;

      & input {
        width: 100%;
      }

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

      & p {
        font-size: 14px;
        color: #000;
      }
    }

    & div {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: 10px;

      & button {
        padding: 5px 15px;
        background-color: #000000;
        border: 2px solid #727272;
        color: #fff;
        cursor: pointer;
        font-size: 14px;
      }
    }
  }
`;

const ModalExcluir = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background-color: #fff;
  width: 500px;
  padding: 20px;

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

const AddButton = styled.button`
  margin-top: 20px;
  padding: 5px 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background-color: #353535;
  border: 3px solid #000;
  color: #fff;
`;

const Card = styled.div`
  border: 1px solid #00000050;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 20px;
  width: auto;
  padding: 20px;

  & div {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 10px;

    & button {
      padding: 5px 10px;
      cursor: pointer;
      border: 2px solid #000;

      &:nth-child(1) {
        background-color: #353535;
        color: #fff;
        border-color: #000;
      }

      &:nth-child(2) {
        background-color: #fff;
        color: #000;
        border-color: #000;
      }
    }
  }

  & img {
    width: auto;
    height: 50px;
    object-fit: contain;
  }

  & h2 {
    font-size: 20px;
    font-weight: 600;
  }

  & a {
    font-size: 16px;
    line-height: 120%;
    color: #008ee0;
    cursor: pointer;
    text-decoration: none;
    margin-top: -15px;
  }
`;

const Buttons = styled.div`
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  flex-direction: row !important;
  gap: 10px;
  
  & button {
    padding: 5px 10px;
    &:nth-child(1) {
      background-color: #34b600;
      border-color: #000;
    }
  }
`;

// Função auxiliar para upload de arquivo via API
const uploadFileToServer = async (file) => {
  console.log("Iniciando upload do arquivo:", file);
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await fetch("https://server.unitycompany.com.br/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log("Resposta do upload:", data);
    return data.url || null;
  } catch (error) {
    console.error("Erro no upload:", error);
    return null;
  }
};

const EditModalSite = ({ siteData, onSave, onCancel }) => {
  const [formValues, setFormValues] = useState({ ...siteData });

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    console.log(`Alteração no campo ${name}:`, value);
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form with values:", formValues);
    onSave(formValues);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>{formValues.id ? "Editar Site" : "Adicionar Site"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Nome</span>
            <input
              type="text"
              name="name"
              value={formValues.name || ""}
              onChange={handleFieldChange}
              placeholder="Nome do site"
            />
          </label>
          <label>
            <span>Logo (URL)</span>
            <input
              type="text"
              name="logo"
              value={formValues.logo || ""}
              onChange={handleFieldChange}
              placeholder="Link da imagem do site"
            />
            {/* Input para upload via API */}
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                console.log("Arquivo selecionado para upload:", file);
                if (file) {
                  const uploadedUrl = await uploadFileToServer(file);
                  if (uploadedUrl) {
                    setFormValues({ ...formValues, logo: uploadedUrl });
                    console.log("Upload realizado com sucesso, URL:", uploadedUrl);
                    toast.success("Logo enviada com sucesso!");
                  } else {
                    console.error("Falha no upload da logo");
                    toast.error("Erro ao enviar a logo!");
                  }
                }
              }}
            />
            {formValues.logo && (
              <button type="button" onClick={() => { 
                console.log("Removendo logo");
                setFormValues({ ...formValues, logo: "" });
              }}>
                Remover Logo
              </button>
            )}
          </label>
          <label>
            <span>URL</span>
            <input
              type="text"
              name="url"
              value={formValues.url || ""}
              onChange={handleFieldChange}
              placeholder="URL do site (ex.: https://seusite.com)"
            />
          </label>
          <Buttons>
            <button type="submit">Salvar</button>
            <button type="button" onClick={() => {
              console.log("Cancelando ação no modal");
              onCancel();
            }}>
              Cancelar
            </button>
          </Buttons>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

const ConfirmDeleteModal = ({ onConfirm, onCancel }) => {
  return (
    <ModalOverlay>
      <ModalExcluir>
        <h2>Confirmar Exclusão</h2>
        <p>Tem certeza que deseja excluir este site?</p>
        <Buttons>
          <button onClick={() => { 
            console.log("Confirmando exclusão do site");
            onConfirm();
          }}>
            Confirmar
          </button>
          <button onClick={() => { 
            console.log("Cancelando exclusão");
            onCancel();
          }}>
            Cancelar
          </button>
        </Buttons>
      </ModalExcluir>
    </ModalOverlay>
  );
};

const Sites = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [deleteSiteId, setDeleteSiteId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const db = getDatabase();

  const fetchSites = async () => {
    setLoading(true);
    try {
      console.log("Buscando sites...");
      const colRef = collection(db, "sites");
      const snapshot = await getDocs(colRef);
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log("Sites buscados:", items);
      setSites(items);
    } catch (error) {
      console.error("Erro ao buscar sites:", error);
      toast.error("Erro ao buscar sites!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleDelete = async (id) => {
    try {
      console.log("Iniciando exclusão do site com id:", id);
      await deleteDoc(doc(db, "sites", id));
      setDeleteSiteId(null);
      await fetchSites();
      console.log("Site excluído com sucesso!");
      toast.info("Site excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir site:", error);
      toast.error("Erro ao excluir site!");
    }
  };

  const handleEditSave = async (updatedSite) => {
    try {
      console.log("Iniciando atualização do site:", updatedSite);
      await updateDoc(doc(db, "sites", updatedSite.id), updatedSite);
      setEditingSite(null);
      await fetchSites();
      console.log("Site atualizado com sucesso!");
      toast.success("Site atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar site:", error);
      toast.error("Erro ao atualizar site!");
    }
  };

  const handleAddSave = async (newSite) => {
    console.log("handleAddSave chamado com:", newSite);
    try {
      await addDoc(collection(db, "sites"), newSite);
      setIsAdding(false);
      await fetchSites();
      console.log("Site adicionado com sucesso!");
      toast.success("Site adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar site:", error);
      toast.error("Erro ao adicionar site!");
    }
  };

  return (
    <Content>
      <Top>
        <h1>Sites - Unity Company</h1>
        <button onClick={() => { 
          console.log("Abrindo modal para adicionar novo site");
          setIsAdding(true);
        }}>
          Adicionar novo site
        </button>
      </Top>
      <Container>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          sites.map((site) => (
            <Card key={site.id}>
              <img src={site.logo} alt={site.name} />
              <h2>{site.name}</h2>
              <a href={site.url} target="_blank" rel="noopener noreferrer">
                {site.url}
              </a>
              <div>
                <button onClick={() => {
                  console.log("Abrindo modal para editar o site:", site);
                  setEditingSite(site);
                  setIsAdding(false);
                }}>
                  Editar
                </button>
                <button onClick={() => {
                  console.log("Solicitando exclusão do site com id:", site.id);
                  setDeleteSiteId(site.id);
                }}>
                  Excluir
                </button>
              </div>
            </Card>
          ))
        )}
      </Container>
      {isAdding && (
        <EditModalSite
          siteData={{}}
          onSave={handleAddSave}
          onCancel={() => {
            console.log("Cancelando adição de novo site");
            setIsAdding(false);
          }}
        />
      )}
      {editingSite && (
        <EditModalSite
          siteData={editingSite}
          onSave={handleEditSave}
          onCancel={() => {
            console.log("Cancelando edição do site");
            setEditingSite(null);
          }}
        />
      )}
      {deleteSiteId && (
        <ConfirmDeleteModal
          onConfirm={() => handleDelete(deleteSiteId)}
          onCancel={() => {
            console.log("Cancelando exclusão do site");
            setDeleteSiteId(null);
          }}
        />
      )}
    </Content>
  );
};

export default Sites;
