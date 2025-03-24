import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { getDatabase } from "../../../firebaseConfig"; // ajuste o caminho conforme necessário
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

      & input,
      & textarea {
        width: 100%;
        padding: 5px;
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
// Componente do Modal de Edição / Adição para Pacotes
// -------------------------
const EditModal = ({ eventData, onSave, onCancel }) => {
  // Inicializa os campos para topics e suites se não existirem
  const initialTopics = eventData.topics || ["", "", ""];
  const initialSuites = eventData.suites || [
    { name: "", parcel: "", price: "" },
    { name: "", parcel: "", price: "" },
    { name: "", parcel: "", price: "" }
  ];

  const [formValues, setFormValues] = useState({
    ...eventData,
    topics: initialTopics,
    suites: initialSuites
  });

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Atualiza o valor de um tópico específico
  const handleTopicChange = (index, value) => {
    const updatedTopics = [...formValues.topics];
    updatedTopics[index] = value;
    setFormValues({ ...formValues, topics: updatedTopics });
  };

  // Atualiza um campo de uma suite específica
  const handleSuiteChange = (index, field, value) => {
    const updatedSuites = [...formValues.suites];
    updatedSuites[index] = { ...updatedSuites[index], [field]: field === "price" ? Number(value) : value };
    setFormValues({ ...formValues, suites: updatedSuites });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formValues);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <article>
          <h2>{formValues.id ? "Editar Pacote" : "Adicionar Pacote"}</h2>
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
            <span>Categoria</span>
            <input
              type="text"
              name="categorias"
              value={formValues.categorias || ""}
              onChange={handleFieldChange}
              placeholder="Ex: Luxo, Econômico"
            />
          </label>
          <label>
            <span>Data</span>
            <input
              name="description"
              value={formValues.description || ""}
              onChange={handleFieldChange}
              placeholder="Descrição do pacote"
            />
          </label>
          <label>
            <span>Imagem (URL)</span>
            <input
              type="text"
              name="imagem"
              value={formValues.imagem || ""}
              onChange={handleFieldChange}
              placeholder="URL da imagem do pacote"
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
                    setFormValues({ ...formValues, imagem: uploadedUrl });
                  }
                }
              }}
            />
            {/* Botão para remover a imagem, se houver */}
            {formValues.imagem && (
              <button type="button" onClick={() => setFormValues({ ...formValues, imagem: "" })}>
                Remover Imagem
              </button>
            )}
          </label>
          <div>
            <h3>Tópicos</h3>
            {[0, 1, 2].map((i) => (
              <label key={i}>
                <span>Tópico {i + 1}:</span>
                <input
                  type="text"
                  value={formValues.topics[i] || ""}
                  onChange={(e) => handleTopicChange(i, e.target.value)}
                  placeholder={`Tópico ${i + 1}`}
                />
              </label>
            ))}
          </div>
          <div>
            <h3>Suites</h3>
            {[0, 1, 2].map((i) => {
              const suite = formValues.suites[i] || { name: "", parcel: "", price: "" };
              return (
                <div
                  key={i}
                  style={{
                    border: "1px dashed #ccc",
                    padding: "5px",
                    marginBottom: "5px"
                  }}
                >
                  <label>
                    <span>Suite</span>
                    <input
                      type="text"
                      value={suite.name}
                      onChange={(e) => handleSuiteChange(i, "name", e.target.value)}
                      placeholder="Nome da suite"
                    />
                  </label>
                  <label>
                    <span>Parcela mínima</span>
                    <input
                      type="text"
                      value={suite.parcel}
                      onChange={(e) => handleSuiteChange(i, "parcel", e.target.value)}
                      placeholder="Parcelas da suite"
                    />
                  </label>
                  <label>
                    <span>Preço mínimo</span>
                    <input
                      type="number"
                      value={suite.price}
                      onChange={(e) => handleSuiteChange(i, "price", e.target.value)}
                      placeholder="Preço da suite"
                    />
                  </label>
                </div>
              );
            })}
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

const Pacotes = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const db = getDatabase("banco2");

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, "pacotes");
      const snapshot = await getDocs(colRef);
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEvents(items);
    } catch (error) {
      console.error("Erro ao buscar pacotes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteConfirm = async (id) => {
    try {
      await deleteDoc(doc(db, "pacotes", id));
      setDeleteEventId(null);
      fetchEvents();
      toast.warn("Pacote excluido com sucesso");
    } catch (error) {
      console.error("Erro ao excluir pacote:", error);
      toast.error("Erro ao excluir o pacote");
    }
  };

  const handleEditSave = async (updatedValues) => {
    try {
      await updateDoc(doc(db, "pacotes", updatedValues.id), updatedValues);
      setEditingEvent(null);
      fetchEvents();
      toast.success("Pacote atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar pacote:", error);
      toast.error("Erro ao atualizar o pacote")
    }
  };

  const handleAddSave = async (newValues) => {
    try {
      await addDoc(collection(db, "pacotes"), newValues);
      setIsAdding(false);
      fetchEvents();
      toast.success("Pacote adicionar com sucesso");
    } catch (error) {
      console.error("Erro ao adicionar pacote:", error);
      toast.error("Erro ao adicionar o pacote");
    }
  };

  const renderCard = (event) => {
    return (
      <Card key={event.id}>
        <div>
          <img src={event.imagem} alt={event.title} />
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <span>{event.categorias}</span>
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
          <CardGrid>{events.map((event) => renderCard(event))}</CardGrid>
          <div style={{ marginTop: "20px" }}>
            <AddButton
              onClick={() => {
                setIsAdding(true);
                setEditingEvent(null);
              }}
            >
              Adicionar Pacote
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

export default Pacotes;
