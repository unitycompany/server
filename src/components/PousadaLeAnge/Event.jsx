import React, { useState, useEffect } from "react";
import styled from "styled-components";
import InputMask from "react-input-mask";
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { getDatabase } from "../../../firebaseConfig"; // ajuste o caminho conforme necessário
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheck } from "react-icons/fa"; // para referência do ícone

// Exemplo opcional de mapeamento de ícones
const iconMap = {
  '<FaUtensils />': "FaUtensils",
  '<FaRegCreditCard />': "FaRegCreditCard",
  '<FaPaw />': "FaPaw"
};

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

    & button {
      cursor: pointer;
      width: 50%;
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
  max-width: 600px;
  position: relative;
  max-height: 80vh;
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
      & select {
        width: 100%;
        padding: 5px;
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

  // Se não houver features, inicia com um tópico padrão com ícone "<FaCheck />"
  const initialFeatures =
    eventData.features && eventData.features.length > 0
      ? eventData.features
      : [{ icon: "<FaCheck />", text: "" }];

  const [formValues, setFormValues] = useState({
    ...eventData,
    dataEntrada: initialDataEntrada,
    dataSaida: initialDataSaida,
    features: initialFeatures
  });

  // Calcula dinamicamente a string de período conforme os campos de data são preenchidos
  const computedDateRange =
    formValues.dataEntrada && formValues.dataSaida
      ? formatCardDates(formValues.dataEntrada, formValues.dataSaida)
      : "";

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
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
    if (!formValues.dataEntrada || !formValues.dataSaida) {
      toast.error("Preencha as duas datas.");
      return;
    }
    const newDateRange = formatCardDates(formValues.dataEntrada, formValues.dataSaida);
    onSave({
      ...formValues,
      dateRange: newDateRange,
      dataEntrada: formValues.dataEntrada,
      dataSaida: formValues.dataSaida
    });
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <article>
          <h2>{formValues.id ? "Editar Evento" : "Adicionar Evento"}</h2>
        </article>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Nome do Pacote</span>
            <input
              type="text"
              name="title"
              value={formValues.title || ""}
              onChange={handleFieldChange}
              placeholder="Noite de Pizzas"
            />
          </label>
          <label>
            <span>Data de Entrada</span>
            <InputMask
              mask="99/99/9999"
              name="dataEntrada"
              value={formValues.dataEntrada}
              onChange={handleFieldChange}
              placeholder="dd/mm/aaaa"
            />
          </label>
          <label>
            <span>Data de Saída</span>
            <InputMask
              mask="99/99/9999"
              name="dataSaida"
              value={formValues.dataSaida}
              onChange={handleFieldChange}
              placeholder="dd/mm/aaaa"
            />
          </label>
          <label>
            <span>Período</span>
            <input type="text" readOnly value={computedDateRange} />
          </label>
          <label>
            <span>Imagem (URL)</span>
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
          </label>
          <label>
            <span>Quantas parcelas do pagamento mínimo</span>
            <select
              name="payment"
              value={formValues.payment || ""}
              onChange={handleFieldChange}
            >
              <option value="">Selecione</option>
              {[8, 9, 10, 11, 12].map((num) => (
                <option key={num} value={num}>
                  {num}x
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Preço do pagamento mínimo</span>
            <input
              type="text"
              name="price"
              value={formValues.price || ""}
              onChange={handleFieldChange}
              placeholder="436,00"
            />
          </label>
          <div>
            <h3>Tópicos:</h3>
            {features.map((feat, index) => (
              <div
                key={index}
                style={{
                  border: "1px dashed #ccc",
                  padding: "5px",
                  marginBottom: "5px"
                }}
              >
                <label>
                  <span>Ícone:</span>
                  <input
                    type="text"
                    value={feat.icon || "<FaCheck />"}
                    onChange={(e) => handleFeatureChange(index, "icon", e.target.value)}
                    placeholder="<FaCheck />"
                  />
                </label>
                <label>
                  <span>Tópico:</span>
                  <input
                    type="text"
                    value={feat.text}
                    onChange={(e) => handleFeatureChange(index, "text", e.target.value)}
                    placeholder="Diga algo que temos (ex.: Taxa pet free, Refeições incluídas)"
                  />
                </label>
                <button type="button" onClick={() => removeFeature(index)}>
                  Remover
                </button>
              </div>
            ))}
            <button type="button" onClick={addFeature}>
              Adicionar Novo Tópico
            </button>
          </div>
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

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const db = getDatabase("banco2");

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, "Eventos"); // Certifique-se de que o nome da coleção esteja correto
      const snapshot = await getDocs(colRef);
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEvents(items);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteConfirm = async (id) => {
    try {
      await deleteDoc(doc(db, "Eventos", id));
      setDeleteEventId(null);
      fetchEvents();
      toast.warn("Evento excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      toast.error("Erro ao excluir evento!");
    }
  };

  const handleEditSave = async (updatedValues) => {
    try {
      const updatedData = {
        ...updatedValues,
        features:
          typeof updatedValues.features === "string"
            ? JSON.parse(updatedValues.features)
            : updatedValues.features
      };
      await updateDoc(doc(db, "Eventos", updatedValues.id), updatedData);
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
      const updatedData = {
        ...newValues,
        features:
          typeof newValues.features === "string"
            ? JSON.parse(newValues.features)
            : newValues.features
      };
      await addDoc(collection(db, "Eventos"), updatedData);
      setIsAdding(false);
      fetchEvents();
      toast.success("Evento adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar evento:", error);
      toast.error("Erro ao adicionar evento!");
    }
  };

  const renderCard = (event) => {
    return (
      <Card key={event.id}>
        <div>
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
          <button onClick={() => setDeleteEventId(event.id)}>Excluir</button>
        </article>
      </Card>
    );
  };

  return (
    <Content>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <div style={{ marginBottom: "20px" }}>
            <AddButton
              onClick={() => {
                setIsAdding(true);
                setEditingEvent(null);
              }}
            >
              Adicionar Evento
            </AddButton>
          </div>
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
      {deleteEventId && (
        <ConfirmDeleteModal
          onConfirm={() => handleDeleteConfirm(deleteEventId)}
          onCancel={() => setDeleteEventId(null)}
        />
      )}
    </Content>
  );
};

export default Event;
