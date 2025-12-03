import React, { useState, useEffect } from "react";
import styled from "styled-components";
import InputMask from "react-input-mask";
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc, setDoc } from "firebase/firestore";
import { getDatabase } from "../../../firebaseConfig"; // ajuste o caminho conforme necessário
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheck } from "react-icons/fa"; // para referência do ícone
import Joyride from "react-joyride";

const EVENT_COLLECTION = "Eventos";
const EVENT_ARCHIVE_COLLECTION = "EventosArquivados";

// Exemplo opcional de mapeamento de ícones
const iconMap = {
  '<FaUtensils />': "FaUtensils",
  '<FaRegCreditCard />': "FaRegCreditCard",
  '<FaPaw />': "FaPaw"
};

const InputContainer = styled.div`
  position: relative;
`;

// Ícone de check posicionado à direita do input
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
  justify-content: center;
  gap: 15px;
  width: 30%;
  padding: 10px;
  border: 1px solid #00000050;
  max-width: 280px;

  & div {
    display: flex;
    flex-direction: column;
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

    & span {
      font-size: 12px;
      line-height: 120%;
      margin-top: -5px;
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
        position: absolute;
        top: -10px;
        left: 5px;
        font-size: 12px;
        font-weight: 600;
        color: #00000090;
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
  display: flex;
  flex-direction: row!important;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  width: 100%;

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
  border: 2px solid #000000;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
`;

const modalSteps = [
  {
    target: ".nome", // Alterado para incluir o ponto
    content: "Nome do pacote, por exemplo 'Noite de Pizzas'",
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
    target: ".parcelas",
    content: "Defina a quantidade de parcelas minimas de acordo com o preço do pacote",
  },
  {
    target: ".pagamento",
    content: "Coloque aqui o preço da suite mais barata, de acordo com as parcelas definidas anteriormente",
  },
  {
    target: ".topicos",
    content: "Os tópicos já estarão pré definidos, será necessários manipular apenas o Tópico 3, definindo a data do evento que irá ocorrer, (ex.: 27/04 Noite de Pizzas)",
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

// Converte uma data no formato "dd/mm/aaaa" para objeto Date
const parseDateBR = (brDate) => {
  if (!brDate || brDate.indexOf("_") !== -1) return null;
  const parts = brDate.split("/");
  if (parts.length !== 3) return null;
  const [day, month, year] = parts;
  return new Date(year, month - 1, day);
};

// Formata as datas no formato "dd/mm/aaaa até dd/mm/aaaa (X diárias)"
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
// Componente do Modal de Edição / Adição para Evento
// -------------------------
const EditModal = ({ eventData, onSave, onCancel }) => {
  const initialDataEntrada = eventData.dataEntrada || "";
  const initialDataSaida = eventData.dataSaida || "";

  const defaultFeatures = [
    { icon: "<FaCheck />", text: "Taxa pet free (não cobramos por pet)" },
    { icon: "<FaCheck />", text: "Todas as refeições incluídas" },
    { icon: "<FaCheck />", text: "Noite Especial no Sábado" }
  ];
  // Se não houver features, inicia com um tópico padrão com ícone "<FaCheck />"
  const initialFeatures =
    eventData.features && eventData.features.length === 3
      ? eventData.features
      : defaultFeatures;


  const [formValues, setFormValues] = useState({
    ...eventData,
    dataEntrada: initialDataEntrada,
    dataSaida: initialDataSaida,
    dateRange: eventData.dateRange || "",
    archived: eventData.archived ?? false,
    _collection: eventData._collection || EVENT_COLLECTION,
    features: initialFeatures
  });

  const { dataEntrada, dataSaida } = formValues;

  useEffect(() => {
    if (!dataEntrada || !dataSaida) return;
    const newRange = formatCardDates(dataEntrada, dataSaida);
    if (!newRange) return;
    setFormValues((prev) => (prev.dateRange === newRange ? prev : { ...prev, dateRange: newRange }));
  }, [dataEntrada, dataSaida]);

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "archived") {
      setFormValues({ ...formValues, archived: type === "checkbox" ? checked : value === "true" });
      return;
    }
    setFormValues({ ...formValues, [name]: value });
  };

  const features = formValues.features || [];
  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = features.map((feat, i) =>
      i === index ? { ...feat, [field]: value } : feat
    );
    setFormValues({ ...formValues, features: updatedFeatures });
  };

  const addFeature = () => {
    const updatedFeatures = [...features, { icon: "<FaCheck />", text: "" }];
    setFormValues({ ...formValues, features: updatedFeatures });
  };

  const removeFeature = (index) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFormValues({ ...formValues, features: updatedFeatures });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const autoDateRange = formatCardDates(formValues.dataEntrada, formValues.dataSaida);
    const finalDateRange = formValues.dateRange && formValues.dateRange.trim() !== ""
      ? formValues.dateRange
      : autoDateRange;

    if (!finalDateRange) {
      toast.error("Informe o período ou defina as datas.");
      return;
    }

    onSave({
      ...formValues,
      dateRange: finalDateRange,
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
          <h2>{formValues.id ? "Editar Evento" : "Adicionar Evento"}</h2>
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
                name="dateRange"
                value={formValues.dateRange || ""}
                onChange={handleFieldChange}
                placeholder="dd/mm/aaaa até dd/mm/aaaa (X diárias)"
              />
              {formValues.dateRange && formValues.dateRange.trim() !== "" && <CheckIconStyled size={16} />}
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
                name="image"
                value={formValues.image || ""}
                onChange={handleFieldChange}
                placeholder="Imagem do pacote como URL"
              />
              <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  const uploadedUrl = await uploadFileToServer(file);
                  if (uploadedUrl) {
                    setFormValues({ ...formValues, image: uploadedUrl });
                  }
                }
              }}
            />
            {formValues.image && (
              <button type="button" onClick={() => setFormValues({ ...formValues, image: "" })}>
                Remover Imagem
              </button>
            )}
              {formValues.image && formValues.image.trim() !== "" && <CheckIconStyled size={16} />}
            </InputContainer>
          </label>
          <label className="parcelas">
            <span>Quantas parcelas do pagamento mínimo</span>
            <InputContainer>
              <select
                name="payment"
                value={formValues.payment || ""}
                onChange={handleFieldChange}
              >
                <option value="">Selecione a parcela mínima</option>
                {[8, 9, 10, 11, 12].map((num) => (
                  <option key={num} value={`${num}x`}>
                    {num + "x"}
                  </option>
                ))}
              </select>
              {formValues.payment && formValues.payment !== "" && <CheckIconStyled size={16} />}
            </InputContainer>
          </label>
          <label className="pagamento">
            <span>Preço do pagamento mínimo</span>
            <InputContainer>
              <input
                type="text"
                name="price"
                value={formValues.price || ""}
                onChange={handleFieldChange}
                placeholder="436,00"
              />
              {formValues.price && formValues.price.trim() !== "" && <CheckIconStyled size={16} />}
            </InputContainer>
          </label>
          <div className="topicos">
            <h3>Tópicos:</h3>
            {formValues.features.map((feat, index) => (
              <div
                key={index}
                style={{
                  border: "1px dashed #ccc",
                  padding: "5px",
                  marginBottom: "5px"
                }}
              >
                <label>
                  <span>Tópico {index + 1}:</span>
                  <InputContainer>
                    <input
                      content="Noite Especial no Sábado"
                      type="text"
                      value={feat.text}
                      onChange={(e) => handleFeatureChange(index, "text", e.target.value)}
                      placeholder={index === 2 ? "Digite o terceiro tópico" : ""}
                      readOnly={index < 2}
                    />
                    {feat.text.trim() !== "" && <CheckIconStyled size={16} />}
                  </InputContainer>
                </label>
              </div>
            ))}
          </div>
          <Buttons>
            <button className="salvar" type="submit">Salvar</button>
            <button className="cancelar" type="button" onClick={onCancel}>Cancelar</button>
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
        <p>Tem certeza que deseja excluir este evento?</p>
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          <button onClick={onConfirm}>Confirmar</button>
          <button onClick={onCancel}>Cancelar</button>
        </div>
      </ModalExcluir>
    </ModalOverlay>
  );
};

const Event = ({ onBack }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteEventTarget, setDeleteEventTarget] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const db = getDatabase("banco2");

  const buildEventPayload = (values, overrides = {}) => {
    const { id: _id, _collection, features, ...rest } = values;
    return {
      ...rest,
      ...overrides,
      features:
        typeof features === "string"
          ? JSON.parse(features)
          : Array.isArray(features)
          ? features
          : [],
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
        fetchCollectionData(EVENT_COLLECTION, false),
        fetchCollectionData(EVENT_ARCHIVE_COLLECTION, true),
      ]);
      setEvents([...activeItems, ...archivedItems]);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteEventTarget) return;
    try {
      const collectionName = deleteEventTarget._collection || (deleteEventTarget.archived ? EVENT_ARCHIVE_COLLECTION : EVENT_COLLECTION);
      await deleteDoc(doc(db, collectionName, deleteEventTarget.id));
      setDeleteEventTarget(null);
      fetchEvents();
      toast.warn("Evento excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      toast.error("Erro ao excluir evento!");
    }
  };

  const handleEditSave = async (updatedValues) => {
    try {
      const targetCollection = updatedValues.archived ? EVENT_ARCHIVE_COLLECTION : EVENT_COLLECTION;
      const currentCollection = updatedValues._collection || (updatedValues.archived ? EVENT_ARCHIVE_COLLECTION : EVENT_COLLECTION);
      const payload = buildEventPayload(updatedValues, { archived: updatedValues.archived ?? false });

      if (currentCollection === targetCollection) {
        await updateDoc(doc(db, targetCollection, updatedValues.id), payload);
      } else {
        await setDoc(doc(db, targetCollection, updatedValues.id), payload);
        await deleteDoc(doc(db, currentCollection, updatedValues.id));
      }

      setEditingEvent(null);
      fetchEvents();
      toast.success("Evento atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      toast.error("Erro ao atualizar evento!");
    }
  };

  const handleAddSave = async (newValues) => {
    try {
      const payload = buildEventPayload(newValues, { archived: false });
      await addDoc(collection(db, EVENT_COLLECTION), payload);
      setIsAdding(false);
      fetchEvents();
      toast.success("Evento adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar evento:", error);
      toast.error("Erro ao adicionar evento!");
    }
  };

  const handleArchiveToggle = async (targetEvent) => {
    try {
      const sourceCollection = targetEvent._collection || (targetEvent.archived ? EVENT_ARCHIVE_COLLECTION : EVENT_COLLECTION);
      const destinationCollection = targetEvent.archived ? EVENT_COLLECTION : EVENT_ARCHIVE_COLLECTION;
      const payload = buildEventPayload(targetEvent, { archived: !targetEvent.archived });

      await setDoc(doc(db, destinationCollection, targetEvent.id), payload);
      await deleteDoc(doc(db, sourceCollection, targetEvent.id));

      fetchEvents();
      toast.info(targetEvent.archived ? "Evento reativado com sucesso!" : "Evento arquivado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar status do evento:", error);
      toast.error("Não foi possível alterar o status do evento!");
    }
  };

  const renderCard = (event) => {
    return (
      <Card key={event.id} style={{ opacity: event.archived ? 0.6 : 1 }}>
        <div>
          <StatusTag $archived={event.archived}>
            {event.archived ? "Arquivado" : "Ativo"}
          </StatusTag>
          <img src={event.image} alt={event.title} />
          <h1>{event.title}</h1>
          <span>{event.dateRange}</span>
        </div>
        <article>
          <button
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
          <button onClick={() => setDeleteEventTarget(event)}>Excluir</button>
        </article>
      </Card>
    );
  };

  return (
    <Content>
      <div style={{ marginBottom: "20px", display: 'flex', alignItems: 'center', gap: 10 }}>
        <AddButton
          onClick={() => {
            setIsAdding(true);
            setEditingEvent(null);
          }}
        >
          Adicionar Evento
        </AddButton>
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
          <CardGrid>{events.map((event) => renderCard(event))}</CardGrid>
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
      {deleteEventTarget && (
        <ConfirmDeleteModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteEventTarget(null)}
        />
      )}
    </Content>
  );
};

export default Event;
