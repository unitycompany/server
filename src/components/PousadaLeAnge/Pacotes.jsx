import React, { useEffect, useState } from "react";
import styled from "styled-components";
import InputMask from "react-input-mask";
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { getDatabase } from "../../../firebaseConfig"; // ajuste o caminho conforme necessário
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Joyride from 'react-joyride';

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
  max-width: 650px;
  position: relative;
  max-height: 85vh;
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
      & textarea,
      & select {
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

const FloatingButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #34b600;
  color: #fff;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10000;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
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

  const initialTopics = eventData.topics || ["", "", ""];

  const [formValues, setFormValues] = useState({
    ...eventData,
    topics: initialTopics,
    suites: initialSuites,
    dataEntrada: initialDataEntrada,
    dataSaida: initialDataSaida
  });

  // Atualiza os valores do formulário
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
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

  // Computa a string de período conforme as datas são preenchidas
  const computedDescription = (() => {
    if (formValues.dataEntrada && formValues.dataSaida) {
      return formatCardDates(formValues.dataEntrada, formValues.dataSaida);
    }
    return "";
  })();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formValues.dataEntrada || !formValues.dataSaida) {
      toast.error("Preencha as duas datas.");
      return;
    }
    const newDescription = computedDescription;
    onSave({
      ...formValues,
      description: newDescription,
      dataEntrada: formValues.dataEntrada,
      dataSaida: formValues.dataSaida
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
            <span >Nome do Pacote</span>
            <input
              type="text"
              name="title"
              value={formValues.title || ""}
              onChange={handleFieldChange}
              placeholder="Noite de Pizzas"
            />
          </label>
          <label className="categoria">
            <span >Categoria</span>
            <select
              name="categorias"
              value={formValues.categorias || ""}
              onChange={handleFieldChange}
            >
              <option value="">Selecione</option>
              <option value="Feriados">Feriados</option>
              <option value="Programações Especiais">Programações Especiais</option>
              <option value="Promoções">Promoções</option>
            </select>
          </label>
          <label className="entrada">
            <span>Data de Entrada</span>
            <InputMask
              mask="99/99/9999"
              name="dataEntrada"
              value={formValues.dataEntrada}
              onChange={handleFieldChange}
              placeholder="dd/mm/aaaa"
            />
          </label>
          <label className="saida">
            <span>Data de Saída</span>
            <InputMask
              mask="99/99/9999"
              name="dataSaida"
              value={formValues.dataSaida}
              onChange={handleFieldChange}
              placeholder="dd/mm/aaaa"
            />
          </label>
          {/* Preview dinâmico do período */}
          <label className="periodo">
            <span>Período</span>
            <input type="text" readOnly value={computedDescription} />
          </label>
          <label className="imagem">
            <span>Imagem (URL)</span>
            <input
              type="text"
              name="imagem"
              value={formValues.imagem || ""}
              onChange={handleFieldChange}
              placeholder="URL da imagem do pacote"
            />
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
                <input
                  type="text"
                  value={formValues.topics[i] || ""}
                  onChange={(e) => handleTopicChange(i, e.target.value)}
                  placeholder={`Tópico ${i + 1}`}
                />
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
                    <input type="text" value={suite.name} readOnly placeholder="Nome da suite" />
                  </label>
                  <label>
                    <span>Parcela mínima</span>
                    <select
                      value={suite.parcel}
                      onChange={(e) => handleSuiteChange(i, "parcel", e.target.value)}
                    >
                      <option value="">Selecione</option>
                      {[8, 9, 10, 11, 12].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
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

  React.useEffect(() => {
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
      toast.error("Erro ao atualizar o pacote");
    }
  };

  const handleAddSave = async (newValues) => {
    try {
      await addDoc(collection(db, "pacotes"), newValues);
      setIsAdding(false);
      fetchEvents();
      toast.success("Pacote adicionado com sucesso");
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
            className="editar"
            onClick={() => {
              setEditingEvent(event);
              setIsAdding(false);
            }}
          >
            Editar
          </button>
          <button className="excluir" onClick={() => setDeleteEventId(event.id)}>Excluir</button>
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
              className="adicionar"
              onClick={() => {
                setIsAdding(true);
                setEditingEvent(null);
              }}
            >
              Adicionar Pacote
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

export default Pacotes;
