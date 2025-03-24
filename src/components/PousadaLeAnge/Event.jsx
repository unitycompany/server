import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { getDatabase } from "../../../firebaseConfig"; // ajuste o caminho conforme necessário
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mapeamento de ícones, se necessário (aqui só como exemplo)
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
    align-items: flex-start;
    justify-content: center;
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

// Estilos para os modais
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

const Buttons = styled.div`
  display: flex!important;
  align-items: center!important;
  justify-content: flex-start!important;
  flex-direction: row!important;
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
  border: 2px solid #000000;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
`;

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

// -------------------------
// Componente do Modal de Edição / Adição
// -------------------------
const EditModal = ({ eventData, onSave, onCancel }) => {
  const [formValues, setFormValues] = useState({ ...eventData });

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
    const updatedFeatures = [...features, { icon: "", text: "" }];
    setFormValues({ ...formValues, features: updatedFeatures });
  };

  const removeFeature = (index) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFormValues({ ...formValues, features: updatedFeatures });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formValues);
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
            <span>Data</span>
            <input
              type="text"
              name="dateRange"
              value={formValues.dateRange || ""}
              onChange={handleFieldChange}
              placeholder="21/03/2025 até 23/03/2025 (2 diárias)"
            />
          </label>
          <label>
            <span>Imagem (URL)</span>
            <input
              type="text"
              name="image"
              value={formValues.image || ""}
              onChange={handleFieldChange}
              placeholder="Imagem do pacote como url"
            />
            {/* Input para upload via API */}
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
            {/* Botão para remover a imagem, se houver */}
            {formValues.image && (
              <button
                type="button"
                onClick={() => setFormValues({ ...formValues, image: "" })}
              >
                Remover Imagem
              </button>
            )}
          </label>
          <label>
            <span>Quantas parcelas do pagamento mínimo</span>
            <input
              type="text"
              name="payment"
              value={formValues.payment || ""}
              onChange={handleFieldChange}
              placeholder="9x"
            />
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
                    value={feat.icon}
                    onChange={(e) =>
                      handleFeatureChange(index, "icon", e.target.value)
                    }
                    placeholder="<FaCheck />"
                  />
                </label>
                <label>
                  <span>Tópico:</span>
                  <input
                    type="text"
                    value={feat.text}
                    onChange={(e) =>
                      handleFeatureChange(index, "text", e.target.value)
                    }
                    placeholder="tópico"
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

// -------------------------
// Componente do Modal de Confirmação de Exclusão
// -------------------------
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

// -------------------------
// Componente Principal "Event"
// -------------------------
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
          <button onClick={() => {
            setEditingEvent(event);
            setIsAdding(false);
          }}>
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
          <CardGrid>{events.map((event) => renderCard(event))}</CardGrid>
          <div style={{ marginTop: "20px" }}>
            <AddButton
              onClick={() => {
                setIsAdding(true);
                setEditingEvent(null);
              }}
            >
              Adicionar Evento
            </AddButton>
          </div>
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
