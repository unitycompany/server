import React, { useEffect, useState } from "react";
import styled from "styled-components";
import InputMask from "react-input-mask";
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc, setDoc } from "firebase/firestore";
import { getDatabase } from "../../../firebaseConfig"; // ajuste o caminho conforme necessário
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Joyride from 'react-joyride';
import { FaCheck } from "react-icons/fa";

const PACKAGES_COLLECTION = "pacotes";
const PACKAGES_ARCHIVE_COLLECTION = "pacotesArquivados";

// Container para inputs que permite posicionar o ícone de check
const InputContainer = styled.div`
  position: relative;
`;

// Ícone de check posicionado à direita
const CheckIconStyled = styled(FaCheck)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: green;
`;

const Content = styled.div``;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  width: 30%;
  max-width: 280px;
  padding: 10px;
  border: 1px solid #00000050;

  & div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 15px;
    position: relative;

    & img {
      width: 250px;
      height: 200px;
      object-fit: cover;
    }

    & h1 {
      font-size: 20px;
      line-height: 110%;
    }

    & p {
      font-size: 14px;
      line-height: 120%;
    }

    & span {
      font-size: 10px;
      line-height: 120%;
      margin-top: -5px;
      position: absolute;
      top: 10px;
      right: 7px;
      background: #00000040;
      backdrop-filter: blur(5px);
      padding: 5px;
      color: #fff;
    }
  }

  & article {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 10px;
    flex-wrap: wrap;

    & button {
      cursor: pointer;
      flex: 1;
      min-width: 30%;
      padding: 4px 10px;
      border: 1px solid #00000050;
      font-size: 14px;

      &:nth-child(1) {
        background-color: #000;
        color: #fff;
      }
    }
  }
`;

const StatusTag = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 3px 8px;
  font-size: 10px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  background-color: ${(props) => (props.$archived ? '#8b0000' : '#0c8b00')};
  color: #fff;
  border-radius: 4px;
`;

const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  position: relative;
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
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 30px;
  width: 90%;
  max-width: 650px;
  position: relative;
  max-height: 85vh;
  overflow: auto;

  & article h2 {
    font-size: 22px;
    font-weight: 600;
    color: transparent;
    background: linear-gradient(90deg, #bd0a0a, #2e2d2d, #003aa7);
    -webkit-background-clip: text;
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

      & input,
      & textarea,
      & select {
        width: 100%;
        padding: 5px;
        color: #000;

        &::placeholder{
          color: #000;
          opacity: 0.3;
        }
      }

      & span {
        background: #fff;
        padding: 2px 5px;
        top: -10px;
        left: 5px;
        position: absolute;
        font-size: 12px;
        font-weight: 600;
        color: #00000090;
      }
    }

    & div {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;

      & button {
        padding: 5px 15px;
        background-color: #000;
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

const Buttons = styled.div`
  display: flex !important;
  align-items: flex-start !important;
  justify-content: flex-start !important;
  flex-direction: row !important;
  gap: 10px;

  & button {
    &:nth-child(1) {
      background-color: #34b600;
      border-color: #000;
    }
  }
`;

const AddButton = styled.button`
  margin-top: 20px;
  padding: 5px 15px;
  background-color: #34b600;
  border: 2px solid #000;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
`;

const ViewToggleButton = styled.button`
  margin-top: 20px;
  padding: 5px 15px;
  border: 2px solid #000;
  background: ${(props) => (props.$active ? "#000" : "#fff")};
  color: ${(props) => (props.$active ? "#fff" : "#000")};
  cursor: pointer;
  font-size: 16px;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ListRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  border: 1px solid #00000050;
  padding: 8px 10px;
  position: relative;
  min-height: 96px;
`;

const ListMedia = styled.img`
  width: 140px;
  height: 80px;
  object-fit: cover;
  flex: 0 0 auto;
`;

const ListMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;

  & h1 {
    font-size: 20px;
    line-height: 110%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  & p {
    font-size: 14px;
    line-height: 120%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  & span {
    font-size: 12px;
    line-height: 120%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ListActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
  flex: 0 0 auto;

  & button {
    cursor: pointer;
    padding: 4px 10px;
    border: 1px solid #00000050;
    font-size: 14px;
    white-space: nowrap;
  }

  & button:nth-child(1) {
    background-color: #000;
    color: #fff;
  }
`;

// Função para formatar uma data (objeto Date) como "dd/mm/aaaa"
const formatDate = (date) => {
  if (!date) return "";
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Converte uma string "dd/mm/aaaa" para objeto Date
const parseDateBR = (brDate) => {
  if (!brDate || brDate.indexOf("_") !== -1) return null;
  const parts = brDate.split("/");
  if (parts.length !== 3) return null;
  const [day, month, year] = parts;
  return new Date(year, month - 1, day);
};

// Formata as datas no formato desejado: "dd/mm/aaaa até dd/mm/aaaa (X diárias)"
const formatCardDates = (dataEntrada, dataSaida) => {
  if (!dataEntrada || !dataSaida) return "";
  const start = parseDateBR(dataEntrada);
  const end = parseDateBR(dataSaida);
  if (!start || !end) return "";
  const diffTime = end - start;
  const diarias = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return `${dataEntrada} até ${dataSaida} (${diarias} diárias)`;
};

// -------------------------
// Componente do Modal de Edição / Adição para Pacotes
// -------------------------

const modalSteps = [
  {
    target: ".nome", // Alterado para incluir o ponto
    content: "Nome do pacote, por exemplo 'Noite de Pizzas'",
  },
  {
    target: ".categoria",
    content: "Selecione a categoria do pacote",
  },
  {
    target: ".entrada",
    content: "Defina a data de entrada",
  },
  {
    target: ".saida",
    content: "Defina a data de saida",
  },
  {
    target: ".periodo",
    content: "Aqui não será necessário manipular, ele já vai funcionar diretamente como deve ficar",
  },
  {
    target: ".imagem",
    content: "Aqui você irá adicionar a imagem do pacote",
  },
  {
    target: ".topicos",
    content: "Os tópicos já estarão pré definidos, será necessários manipular apenas o Tópico 3, definindo a data do evento que irá ocorrer, (ex.: 27/04 Noite de Pizzas)",
  },
  {
    target: ".suites",
    content: "As suités estarão manipuláveis aqui, você terá que definir as parcelas minimas, é necessário apenas clicar e selecionar. No preço minimo você digitará o valor de acordo com a parcela",
  },
  {
    target: ".salvar",
    content: "Após colocar as informações, clique aqui para salvar",
  },
  {
    target: ".cancelar",
    content: "Caso desista, clique aqui para cancelar",
  },
];

const EditModal = ({ eventData, onSave, onCancel }) => {
  // Nomes padrão das 3 suites
  const defaultSuites = [
    { name: "Standard", parcel: "", price: "" },
    { name: "Superior", parcel: "", price: "" },
    { name: "Master", parcel: "", price: "" }
  ];

  let initialSuites = [];
  if (eventData.suites && eventData.suites.length > 0) {
    initialSuites = [...eventData.suites];
    const defaultNames = ["Standard", "Superior", "Master"];
    for (let i = initialSuites.length; i < 3; i++) {
      initialSuites.push({ name: defaultNames[i], parcel: "", price: "" });
    }
  } else {
    initialSuites = defaultSuites;
  }

  // Para datas, se houver valor salvo (formato "dd/mm/aaaa"), usa-o; caso contrário, inicia vazio
  const initialDataEntrada = eventData.dataEntrada || "";
  const initialDataSaida = eventData.dataSaida || "";

  // Define os tópicos com os dois primeiros preenchidos por padrão
  const defaultTopics = [
    "Taxa pet free (não cobramos por pet)",
    "Todas as refeições incluídas",
    "Noite Especial no Sábado"
  ];

  const initialTopics = eventData.topics && eventData.topics.length === 3
    ? eventData.topics
    : defaultTopics;

  const [formValues, setFormValues] = useState({
    ...eventData,
    topics: initialTopics,
    suites: initialSuites,
    dataEntrada: initialDataEntrada,
    dataSaida: initialDataSaida,
    archived: eventData.archived ?? false,
    description: eventData.description || "",
    _collection: eventData._collection || PACKAGES_COLLECTION
  });

  const { dataEntrada, dataSaida } = formValues;

  useEffect(() => {
    if (!dataEntrada || !dataSaida) return;
    const autoDesc = formatCardDates(dataEntrada, dataSaida);
    if (!autoDesc) return;
    setFormValues((prev) =>
      prev.description === autoDesc ? prev : { ...prev, description: autoDesc }
    );
  }, [dataEntrada, dataSaida]);

  // Atualiza os valores do formulário
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    if (name === "archived") {
      setFormValues({ ...formValues, archived: value === "true" });
      return;
    }
    setFormValues({ ...formValues, [name]: value });
  };

  const handleTopicChange = (index, value) => {
    const updatedTopics = [...formValues.topics];
    updatedTopics[index] = value;
    setFormValues({ ...formValues, topics: updatedTopics });
  };

  const handleSuiteChange = (index, field, value) => {
    const updatedSuites = [...formValues.suites];
    updatedSuites[index] = { ...updatedSuites[index], [field]: field === "price" ? Number(value) : value };
    setFormValues({ ...formValues, suites: updatedSuites });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const autoDesc = formatCardDates(formValues.dataEntrada, formValues.dataSaida);
    const finalDescription = formValues.description && formValues.description.trim() !== ""
      ? formValues.description
      : autoDesc;

    if (!finalDescription) {
      toast.error("Informe o período ou defina as datas.");
      return;
    }
    onSave({
      ...formValues,
      description: finalDescription,
      dataEntrada: formValues.dataEntrada || "",
      dataSaida: formValues.dataSaida || ""
    });
  };

  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRunTour(true), 100);
    return () => clearTimeout(timer);
  })


  return (
    <ModalOverlay>
      <ModalContent>
        <Joyride 
          steps={modalSteps} 
          continuous 
          showSkipButton 
          run={runTour}
          locale={{
            skip: "Pular tutorial",
            back: "Voltar",
            next: "Próximo",
            last: "Encerrar tutorial",
          }}
          styles={{ 
            options: {
               zIndex: 999999 
              },
            spotlight: {
              marginTop: '55px',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            }
          }}
          callback={(data) => console.log("Joyride callback", data)}
        />
        
        <article>
          <h2>{formValues.id ? "Editar Pacote" : "Adicionar Pacote"}</h2>
        </article>
        <form onSubmit={handleSubmit}>
          <label className="nome">
            <span>Nome do Pacote</span>
            <InputContainer>
              <input
                type="text"
                name="title"
                value={formValues.title || ""}
                onChange={handleFieldChange}
                placeholder="Noite de Pizzas"
              />
              {formValues.title && formValues.title.trim() !== "" && <CheckIconStyled size={16} />}
            </InputContainer>
          </label>
          <label className="categoria">
            <span>Categoria</span>
            <InputContainer>
              <select
                name="categorias"
                value={formValues.categorias || ""}
                onChange={handleFieldChange}
              >
                <option value="">Selecione a categoria</option>
                <option value="Feriados">Feriados</option>
                <option value="Programações Especiais">Programações Especiais</option>
                <option value="Promoções">Promoções</option>
              </select>
              {formValues.categorias && formValues.categorias !== "" && <CheckIconStyled size={16} />}
            </InputContainer>
          </label>
          <label className="entrada">
            <span>Data de Entrada</span>
            <InputContainer>
              <InputMask
                mask="99/99/9999"
                name="dataEntrada"
                value={formValues.dataEntrada}
                onChange={handleFieldChange}
                placeholder="dd/mm/aaaa"
              />
              {formValues.dataEntrada && formValues.dataEntrada.trim() !== "" && <CheckIconStyled size={16} />}
            </InputContainer>
          </label>
          <label className="saida">
            <span>Data de Saída</span>
            <InputContainer>
              <InputMask
                mask="99/99/9999"
                name="dataSaida"
                value={formValues.dataSaida}
                onChange={handleFieldChange}
                placeholder="dd/mm/aaaa"
              />
              {formValues.dataSaida && formValues.dataSaida.trim() !== "" && <CheckIconStyled size={16} />}
            </InputContainer>
          </label>
          <label className="periodo">
            <span>Período</span>
            <InputContainer>
              <input
                type="text"
                name="description"
                value={formValues.description || ""}
                onChange={handleFieldChange}
                placeholder="dd/mm/aaaa até dd/mm/aaaa (X diárias)"
              />
              {formValues.description && formValues.description.trim() !== "" && <CheckIconStyled size={16} />}
            </InputContainer>
          </label>
          <label className="status">
            <span>Status</span>
            <InputContainer>
              <select
                name="archived"
                value={formValues.archived ? "true" : "false"}
                onChange={handleFieldChange}
              >
                <option value="false">Ativo</option>
                <option value="true">Arquivado</option>
              </select>
            </InputContainer>
          </label>
          <label className="imagem">
            <span>Imagem (URL)</span>
            <InputContainer>
              <input
                type="text"
                name="imagem"
                value={formValues.imagem || ""}
                onChange={handleFieldChange}
                placeholder="URL da imagem do pacote"
              />
              {formValues.imagem && formValues.imagem.trim() !== "" && <CheckIconStyled size={16} />}
            </InputContainer>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  const uploadedUrl = await uploadFileToServer(file);
                  if (uploadedUrl) {
                    setFormValues({ ...formValues, imagem: uploadedUrl });
                  }
                }
              }}
            />
            {formValues.imagem && (
              <button type="button" onClick={() => setFormValues({ ...formValues, imagem: "" })}>
                Remover Imagem
              </button>
            )}
          </label>
          <div className="topicos">
            <h3>Tópicos</h3>
            {[0, 1, 2].map((i) => (
              <label key={i}>
                <span>Tópico {i + 1}:</span>
                <InputContainer>
                  <input
                    type="text"
                    value={formValues.topics[i] || ""}
                    onChange={(e) => handleTopicChange(i, e.target.value)}
                    placeholder={`Tópico ${i + 1}`}
                  />
                  {formValues.topics[i] && formValues.topics[i].trim() !== "" && <CheckIconStyled size={16} />}
                </InputContainer>
              </label>
            ))}
          </div>
          <div className="suites">
            <h3>Suites</h3>
            {[0, 1, 2].map((i) => {
              const suite = formValues.suites[i] || { name: "", parcel: "", price: "" };
              return (
                <div key={i} style={{ border: "1px dashed #ccc", padding: "5px", marginBottom: "5px" }}>
                  <label>
                    <span>Suite</span>
                    <InputContainer>
                      <input type="text" value={suite.name} readOnly placeholder="Nome da suite" />
                      {suite.name && suite.name.trim() !== "" && <CheckIconStyled size={16} />}
                    </InputContainer>
                  </label>
                  <label>
                    <span>Parcela mínima</span>
                    <InputContainer>
                      <select
                        value={suite.parcel}
                        onChange={(e) => handleSuiteChange(i, "parcel", e.target.value)}
                      >
                        <option value="">Selecione a parcela mínima</option>
                        {[8, 9, 10, 11, 12].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                      {suite.parcel && suite.parcel !== "" && <CheckIconStyled size={16} />}
                    </InputContainer>
                  </label>
                  <label>
                    <span>Preço mínimo</span>
                    <InputContainer>
                      <input
                        type="number"
                        value={suite.price}
                        onChange={(e) => handleSuiteChange(i, "price", e.target.value)}
                        placeholder="Preço da suite"
                      />
                      {suite.price && suite.price.toString().trim() !== "" && <CheckIconStyled size={16} />}
                    </InputContainer>
                  </label>
                </div>
              );
            })}
          </div>
          <Buttons>
            <button className="salvar" type="submit">Salvar</button>
            <button className="cancelar" type="button" onClick={onCancel}>
              Cancelar
            </button>
          </Buttons>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

// Função auxiliar para upload de arquivo para sua API
const uploadFileToServer = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await fetch("https://server.unitycompany.com.br/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data.url) {
      return data.url;
    } else {
      console.error("Erro no upload:", data);
      return null;
    }
  } catch (error) {
    console.error("Erro ao enviar para o endpoint:", error);
    return null;
  }
};

const ConfirmDeleteModal = ({ onConfirm, onCancel }) => {
  return (
    <ModalOverlay>
      <ModalExcluir>
        <h2>Confirmar Exclusão</h2>
        <p>Tem certeza que deseja excluir este pacote?</p>
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          <button onClick={onConfirm}>Confirmar</button>
          <button onClick={onCancel}>Cancelar</button>
        </div>
      </ModalExcluir>
    </ModalOverlay>
  );
};

const Pacotes = ({ onBack }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [viewMode, setViewMode] = useState("card");

  const db = getDatabase("banco2");

  const extractFirstDateBR = (text) => {
    if (typeof text !== "string") return null;
    const match = text.match(/\b\d{2}\/\d{2}\/\d{4}\b/);
    return match ? match[0] : null;
  };

  const getSortDate = (item) => {
    const primaryText = item?.description;
    const extractedPrimary = extractFirstDateBR(primaryText);
    if (extractedPrimary) {
      const parsed = parseDateBR(extractedPrimary);
      if (parsed) return parsed;
    }

    const fallback = item?.dataEntrada;
    if (!fallback) return null;
    if (fallback instanceof Date) return fallback;
    if (typeof fallback === "string") return parseDateBR(fallback);
    if (fallback && typeof fallback.toDate === "function") return fallback.toDate();
    return null;
  };

  const sortByDateAsc = (a, b) => {
    const dateA = getSortDate(a);
    const dateB = getSortDate(b);
    const timeA = dateA ? dateA.getTime() : Number.POSITIVE_INFINITY;
    const timeB = dateB ? dateB.getTime() : Number.POSITIVE_INFINITY;
    return timeA - timeB;
  };

  const sortActiveFirstThenDateAsc = (a, b) => {
    const archivedA = Boolean(a?.archived);
    const archivedB = Boolean(b?.archived);

    if (archivedA !== archivedB) return archivedA ? 1 : -1;
    return sortByDateAsc(a, b);
  };

  const buildPackagePayload = (values, overrides = {}) => {
    const { id: _id, _collection, ...rest } = values;
    return {
      ...rest,
      ...overrides,
    };
  };

  const fetchCollectionData = async (collectionName, isArchived) => {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      archived: isArchived,
      _collection: collectionName,
    }));
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const [activeItems, archivedItems] = await Promise.all([
        fetchCollectionData(PACKAGES_COLLECTION, false),
        fetchCollectionData(PACKAGES_ARCHIVE_COLLECTION, true),
      ]);
      const merged = [...activeItems, ...archivedItems];
      setEvents(merged.sort(sortActiveFirstThenDateAsc));
    } catch (error) {
      console.error("Erro ao buscar pacotes:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const collectionName = deleteTarget._collection || (deleteTarget.archived ? PACKAGES_ARCHIVE_COLLECTION : PACKAGES_COLLECTION);
      await deleteDoc(doc(db, collectionName, deleteTarget.id));
      setDeleteTarget(null);
      fetchEvents();
      toast.warn("Pacote excluido com sucesso");
    } catch (error) {
      console.error("Erro ao excluir pacote:", error);
      toast.error("Erro ao excluir o pacote");
    }
  };

  const handleEditSave = async (updatedValues) => {
    try {
      const targetCollection = updatedValues.archived ? PACKAGES_ARCHIVE_COLLECTION : PACKAGES_COLLECTION;
      const currentCollection = updatedValues._collection || (updatedValues.archived ? PACKAGES_ARCHIVE_COLLECTION : PACKAGES_COLLECTION);
      const payload = buildPackagePayload(updatedValues, { archived: updatedValues.archived ?? false });

      if (currentCollection === targetCollection) {
        await updateDoc(doc(db, targetCollection, updatedValues.id), payload);
      } else {
        await setDoc(doc(db, targetCollection, updatedValues.id), payload);
        await deleteDoc(doc(db, currentCollection, updatedValues.id));
      }

      setEditingEvent(null);
      fetchEvents();
      toast.success("Pacote atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar pacote:", error);
      toast.error("Erro ao atualizar o pacote");
    }
  };

  const handleAddSave = async (newValues) => {
    try {
      const payload = buildPackagePayload(newValues, { archived: false });
      await addDoc(collection(db, PACKAGES_COLLECTION), payload);
      setIsAdding(false);
      fetchEvents();
      toast.success("Pacote adicionado com sucesso");
    } catch (error) {
      console.error("Erro ao adicionar pacote:", error);
      toast.error("Erro ao adicionar o pacote");
    }
  };

  const handleArchiveToggle = async (targetEvent) => {
    try {
      const sourceCollection = targetEvent._collection || (targetEvent.archived ? PACKAGES_ARCHIVE_COLLECTION : PACKAGES_COLLECTION);
      const destinationCollection = targetEvent.archived ? PACKAGES_COLLECTION : PACKAGES_ARCHIVE_COLLECTION;
      const payload = buildPackagePayload(targetEvent, { archived: !targetEvent.archived });

      await setDoc(doc(db, destinationCollection, targetEvent.id), payload);
      await deleteDoc(doc(db, sourceCollection, targetEvent.id));

      fetchEvents();
      toast.info(targetEvent.archived ? "Pacote reativado com sucesso" : "Pacote arquivado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar status do pacote:", error);
      toast.error("Não foi possível alterar o status do pacote");
    }
  };

  const renderCard = (event) => {
    return (
      <Card key={event.id} style={{ opacity: event.archived ? 0.6 : 1 }}>
        <div>
          <StatusTag $archived={event.archived}>
            {event.archived ? "Arquivado" : "Ativo"}
          </StatusTag>
          <img src={event.imagem} alt={event.title} />
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <span>{event.categorias}</span>
        </div>
        <article>
          <button
            className="editar"
            onClick={() => {
              setEditingEvent(event);
              setIsAdding(false);
            }}
          >
            Editar
          </button>
          <button onClick={() => handleArchiveToggle(event)}>
            {event.archived ? "Reativar" : "Arquivar"}
          </button>
          <button className="excluir" onClick={() => setDeleteTarget(event)}>Excluir</button>
        </article>
      </Card>
    );
  };

  const renderListItem = (event) => {
    return (
      <ListRow key={event.id} style={{ opacity: event.archived ? 0.6 : 1 }}>
        <StatusTag $archived={event.archived}>
          {event.archived ? "Arquivado" : "Ativo"}
        </StatusTag>
        <ListMedia src={event.imagem} alt={event.title} />
        <ListMain>
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <span>{event.categorias}</span>
        </ListMain>
        <ListActions>
          <button
            className="editar"
            onClick={() => {
              setEditingEvent(event);
              setIsAdding(false);
            }}
          >
            Editar
          </button>
          <button onClick={() => handleArchiveToggle(event)}>
            {event.archived ? "Reativar" : "Arquivar"}
          </button>
          <button className="excluir" onClick={() => setDeleteTarget(event)}>Excluir</button>
        </ListActions>
      </ListRow>
    );
  };

  return (
    <Content>
      <div style={{ marginBottom: "20px", display: 'flex', alignItems: 'center', gap: 10 }}>
        <AddButton
          className="adicionar"
          onClick={() => {
            setIsAdding(true);
            setEditingEvent(null);
          }}
        >
          Adicionar Pacote
        </AddButton>
        <ViewToggleButton
          type="button"
          $active={viewMode === "card"}
          onClick={() => setViewMode("card")}
        >
          Cards
        </ViewToggleButton>
        <ViewToggleButton
          type="button"
          $active={viewMode === "list"}
          onClick={() => setViewMode("list")}
        >
          Lista
        </ViewToggleButton>
        <AddButton
          style={{ padding: '5px 15px', background: '#fff', border: '2px solid #000', color: '#000', fontWeight: 500, cursor: 'pointer', fontSize: 16 }}
          onClick={onBack ? onBack : () => window.location.reload()}
        >
          Voltar
        </AddButton>
      </div>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          {viewMode === "card" ? (
            <CardGrid>{events.map((event) => renderCard(event))}</CardGrid>
          ) : (
            <ListContainer>{events.map((event) => renderListItem(event))}</ListContainer>
          )}
        </>
      )}
      {editingEvent && (
        <EditModal
          eventData={editingEvent}
          onSave={handleEditSave}
          onCancel={() => setEditingEvent(null)}
        />
      )}
      {isAdding && (
        <EditModal
          eventData={{}}
          onSave={handleAddSave}
          onCancel={() => setIsAdding(false)}
        />
      )}
      {deleteTarget && (
        <ConfirmDeleteModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </Content>
  );
};

export default Pacotes;
