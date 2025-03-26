import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { getDatabase } from "../../firebaseConfig";
import CardSite from "../components/CardSites";
import { toast } from "react-toastify"; // Função toast do React Toastify
import { IoIosSearch } from "react-icons/io";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";

// Objeto com as empresas e suas respectivas logos
const companyLogos = {
  "Nova Metálica": "https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/40b3886f-6f2c-466e-88f5-6af0faa43a00/public", 
  "Fast Sistemas Construtivos": "https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/ab2d9dea-3941-4e10-9c18-e421dbf99700/public",
  "Fast Homes": "https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/e4c70620-1eb2-4aa5-cc40-cae32ffdec00/public",
  "Pousada Le Ange": "https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/8dca7e66-ce93-48a8-b05b-7c8fd4fc6600/public",
  "Milena": "https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/848a015b-f90f-4079-e0f0-f99e09cde000/public",
  "Unity": "https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/c9f7b8c5-3736-4ac4-0d0b-97bf217b5100/public"
};

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
    transition: all 0.1s ease-out;
    &:hover {
      background-color: #00ff2a1f;
      color: #000;
    }
  }
`;

const TopLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

// Input de busca
const SearchInput = styled.input`
  padding: 5px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

// Select para filtrar por empresa no componente principal
const SelectFilter = styled.select`
  padding: 5px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
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
    padding: 0 5px;

    & svg {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      opacity: 0.5;
    }

    & input {
      font-size: 12px;
      border: none;
    }
  }

  & select {
    padding: 5px;
    font-size: 12px;
    border: 1px solid #00000050;
    border-radius: 0;
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

  & h2 {
    font-size: 22px;
    font-weight: 600;
    background: linear-gradient(90deg, #bd0a0a, #2e2d2d, #003aa7);
    -webkit-background-clip: text;
    color: transparent;
  }

  & button {
    padding: 5px 15px;
    background-color: #000000;
    border: 2px solid #727272;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
  }

  & article h2 {
    font-size: 22px;
    font-weight: 600;
    background: linear-gradient(90deg, #bd0a0a, #2e2d2d, #003aa7);
    -webkit-background-clip: text;
    color: transparent;
  }

  & form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 30px;

    & label {
      border: 1px solid #00000020;
      padding: 15px 10px 10px 10px;
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;

      & input,
      & select {
        width: 100%;
      }

      & span {
        background: #fff;
        padding: 2px 5px;
        position: absolute;
        top: -10px;
        left: 5px;
        font-size: 12px;
        font-weight: 600;
        color: #00000080;
      }
    }

    & div {
      display: flex;
      flex-direction: column;
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
  background-color: #fff;
  width: 500px;
  padding: 20px;

  & h2 {
    font-size: 18px;
    font-weight: 600;
    border-bottom: 1px solid #00000020;
    padding: 5px 0;
  }

  & p {
    font-size: 14px;
    padding: 10px 0;
  }

  & div {
    display: flex;
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
  padding: 10px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 15px;
  position: relative;

  & img {
    position: absolute;
    right: 10px;
    top: 10px;
    width: auto;
    padding: 1px;
    border: 1px solid #00000050;
    height: 25px;
    object-fit: contain;
  }

  & h2 {
    font-size: 18px;
    font-weight: 600;
  }

  & a {
    font-size: 14px;
    color: #008ee0;
    text-decoration: none;
    margin-top: -10px;
  }

  & article {
    display: flex;
    width: 100%;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;

    & button {
      padding: 3px 10px;
      width: 50%;
      border: 1px solid #00000050;
      transition: all 0.1s ease-out;
      cursor: pointer;
      font-size: 14px;

      &:nth-child(1) {
        background-color: #000;
        color: #fff;
        &:hover {
          background-color: #00ff2a1f;
          color: #000;
        }
      }

      &:nth-child(2) {
        background-color: #fff;
        &:hover {
          background-color: #ff00001f;
          color: #000;
        }
      }
    }
  }
`;

// Novo componente para exibir o status do site (ativo/inativo) no card
const StatusIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  padding: 2px;
  border: 1px solid #00000050;
  font-size: 18px;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row !important;
  gap: 10px;

  & button {
    padding: 5px 10px;
    font-size: 14px;
    border: 1px solid #000;
    transition: all 0.1s ease-out;
    &:nth-child(1) {
      background-color: #353535;
      color: #fff;
    }
    &:nth-child(2) {
      background-color: #fff;
      color: #000;
    }
  }
`;

// Componente para seleção de empresa no modal (exibe as logos com tooltips)
const CompanySelection = styled.div`
  width: 100%;
  display: flex !important;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: row !important;
  gap: 10px;
  flex-wrap: wrap;
  height: auto;

  & img {
    width: auto;
  }
`;

const CompanyIcon = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  border: ${(props) => (props.selected ? "2px solid #000" : "1px solid #00000030")};
  opacity: ${(props) => (props.selected ? "1" : "0.8")};
  cursor: pointer;
  transition: all 0.2s ease-out;
  &:hover {
    background-color: #00000010;
  }
`;

// Estilo do checkbox conforme design fornecido
const CheckboxContainer = styled.label`
  position: relative;
  cursor: pointer;
  display: flex !important;
  flex-direction: row !important;

  & p {
    font-size: 14px;
    opacity: 0.8;
  }

  input {
    width: max-content !important;
    display: none !important;
    border: none !important;
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
    stroke: #000;
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
    stroke: #188d00;
    stroke-width: 5;
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

// Modal para adicionar/editar site – removido o campo de logo manual e mantida apenas a seleção de empresa, tipo e status
const EditModalSite = ({ siteData, onSave, onCancel }) => {
  // Define o active padrão como true, caso não exista
  const [formValues, setFormValues] = useState({ active: true, ...siteData });

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormValues({ ...formValues, active: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formValues);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>{formValues.id ? "Editar Site" : "Adicionar Site"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Tipo de site</span>
            <select
              name="name"
              value={formValues.name || ""}
              onChange={handleFieldChange}
            >
              <option value="">Selecione</option>
              <option value="Landing Page">Landing Page</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Institucional">Institucional</option>
              <option value="Sistema">Sistema</option>
              <option value="Outros">Outros</option>
            </select>
          </label>
          <label>
            <span>Acesso via URL</span>
            <input
              type="text"
              name="url"
              value={formValues.url || ""}
              onChange={handleFieldChange}
              placeholder="(ex.: https://seusite.com)"
            />
          </label>
          {/* Seleção de empresa: ao clicar em um ícone, define a empresa e a logo automaticamente */}
          <label>
            <span>Empresa</span>
            <CompanySelection>
              {Object.entries(companyLogos).map(([key, url]) => (
                <CompanyIcon
                  key={key}
                  src={url}
                  alt={key}
                  title={key}
                  selected={formValues.empresa === key}
                  onClick={() =>
                    setFormValues({ ...formValues, empresa: key, logo: url })
                  }
                />
              ))}
            </CompanySelection>
          </label>
          {/* Checkbox para definir se o site está ativo */}
          <label>
            <span>Status</span>
            <CheckboxContainer>
              <p>O site está ativo ou inativo?</p>
              <input
                type="checkbox"
                name="active"
                checked={formValues.active}
                onChange={handleCheckboxChange}
              />
              <svg viewBox="0 0 64 64">
                <path
                  d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                  className="path"
                ></path>
              </svg>
            </CheckboxContainer>
          </label>
          <Buttons>
            <button type="submit">Salvar</button>
            <button type="button" onClick={onCancel}>
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
          <button onClick={onConfirm}>Confirmar</button>
          <button onClick={onCancel}>Cancelar</button>
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
  // Estado para busca pelo nome
  const [searchTerm, setSearchTerm] = useState("");
  // Estado para filtrar por empresa
  const [empresaFilter, setEmpresaFilter] = useState("");

  const db = getDatabase();

  const fetchSites = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, "sites");
      const snapshot = await getDocs(colRef);
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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

  const filteredSites = sites.filter((site) => {
    const matchesName = (site.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmpresa = empresaFilter ? site.empresa === empresaFilter : true;
    return matchesName && matchesEmpresa;
  });

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "sites", id));
      setDeleteSiteId(null);
      await fetchSites();
      toast.info("Site excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir site:", error);
      toast.error("Erro ao excluir site!");
    }
  };

  const handleEditSave = async (updatedSite) => {
    try {
      await updateDoc(doc(db, "sites", updatedSite.id), updatedSite);
      setEditingSite(null);
      await fetchSites();
      toast.success("Site atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar site:", error);
      toast.error("Erro ao atualizar site!");
    }
  };

  const handleAddSave = async (newSite) => {
    try {
      await addDoc(collection(db, "sites"), newSite);
      setIsAdding(false);
      await fetchSites();
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
          <FilterContainer>
            <div>
              <IoIosSearch />
              <SearchInput
                type="text"
                placeholder="Buscar site pelo nome"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <SelectFilter
              value={empresaFilter}
              onChange={(e) => setEmpresaFilter(e.target.value)}
            >
              <option value="">Todas as Empresas</option>
              {Object.keys(companyLogos).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </SelectFilter>
          </FilterContainer>
        <button onClick={() => setIsAdding(true)}>Adicionar novo site</button>
      </Top>
      <Container>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          filteredSites.map((site) => (
            <Card key={site.id}>
              <img
                src={site.empresa ? companyLogos[site.empresa] : site.logo}
                alt={site.name}
                title={site.empresa ? site.empresa : ""}
              />
              <h2>{site.name}</h2>
              <a href={site.url} target="_blank" rel="noopener noreferrer">
                {site.url}
              </a>
              <article>
                <button
                  onClick={() => {
                    setEditingSite(site);
                    setIsAdding(false);
                  }}
                >
                  Editar
                </button>
                <button onClick={() => setDeleteSiteId(site.id)}>Excluir</button>
              </article>
              {/* Exibe o status do site: ícone verde se ativo, vermelho se inativo */}
              <StatusIcon>
                {site.active ? (
                  <IoCheckmarkOutline color="green" />
                ) : (
                  <IoCloseOutline color="red" />
                )}
              </StatusIcon>
            </Card>
          ))
        )}
      </Container>
      {isAdding && (
        <EditModalSite
          siteData={{ active: true }}
          onSave={handleAddSave}
          onCancel={() => setIsAdding(false)}
        />
      )}
      {editingSite && (
        <EditModalSite
          siteData={editingSite}
          onSave={handleEditSave}
          onCancel={() => setEditingSite(null)}
        />
      )}
      {deleteSiteId && (
        <ConfirmDeleteModal
          onConfirm={() => handleDelete(deleteSiteId)}
          onCancel={() => setDeleteSiteId(null)}
        />
      )}
    </Content>
  );
};

export default Sites;
