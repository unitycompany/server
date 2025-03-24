import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { getDatabase } from "../../../firebaseConfig"; // ajuste o caminho conforme necessário
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Estilizações
const Content = styled.div`
  max-height: 65vh;
  height: auto;
  width: 100%;
  overflow-y: auto;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 15px;
  width: 30%;
  padding: 10px;
  border: 1px solid #00000050;

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
      width: 48%;
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
  max-width: 800px;
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

    & .section {
      border: 1px solid #ccc;
      padding: 10px;
      margin-bottom: 10px;
    }

    & .array-section {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    & button {
      padding: 5px 15px;
      background-color: #000;
      border: 2px solid #727272;
      color: #fff;
      cursor: pointer;
      font-size: 14px;
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
  align-items: center;
  gap: 10px;
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

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 20px;
  border-bottom: 1px solid #00000050;
  padding-bottom: 20px;

  & h3 {
    font-size: 22px;
    font-weight: 600;
    color: transparent;
    background: linear-gradient(90deg, #bd0a0a, #2e2d2d, #003aa7);
    -webkit-background-clip: text;
  }
`;

const ArraySection = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 10px;
  justify-content: flex-start;
  width: 100%;

  & div {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 5px;
    border: 1px solid #00000050;

    & input {
      width: 100%;
    }
  }

  & h4 {
    font-size: 15px;
    font-weight: 600;
    color: transparent;
    background: linear-gradient(90deg, #bd0a0a, #2e2d2d, #003aa7);
    -webkit-background-clip: text;
  }
`;

/**
 * Função auxiliar para upload de arquivo para o endpoint serverless.
 * Essa função envia o arquivo para /api/upload e retorna a URL da imagem.
 */
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



// --- Modal de Edição / Adição para Fast Homes ---
// Essa versão utiliza o endpoint serverless para upload.
const EditModal = ({ eventData, onSave, onCancel }) => {
  const [formValues, setFormValues] = useState({
    ...eventData,
    area: eventData.area || "",
    banheiros: eventData.banheiros || "",
    churrasqueira: eventData.churrasqueira !== undefined ? eventData.churrasqueira : false,
    descricao: eventData.descricao || "",
    garagem: eventData.garagem || "",
    imagem: eventData.imagem || "",
    imagemDois: eventData.imagemDois || "",
    largura: eventData.largura || "",
    lote: eventData.lote || "",
    nome: eventData.nome || "",
    pavimentos: eventData.pavimentos || "",
    piscina: eventData.piscina !== undefined ? eventData.piscina : false,
    quartos: eventData.quartos || "",
    slug: eventData.slug || "",
    suites: eventData.suites || "",
    dobra2: eventData.dobra2 || { carrossel: [], descricao: "", title1: "" },
    dobra3: eventData.dobra3 || {
      carrosselDireita: [],
      carrosselEsquerda: [],
      descricao: "",
      title: "",
    },
    dobra4: eventData.dobra4 || { imagem: "" },
  });

  // Atualiza campos numéricos ou texto
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["area", "banheiros", "garagem", "quartos", "suites"];
    setFormValues((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleBooleanChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value === "true",
    }));
  };

  // Handler para upload de arquivo para um campo simples (sem preview)
  const handleSimpleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadedUrl = await uploadFileToServer(file);
    if (uploadedUrl) {
      setFormValues((prev) => ({ ...prev, [fieldName]: uploadedUrl }));
    }
  };

  // Handler para upload de arquivo em arrays (ex.: carrossel)
  const handleArrayFileUpload = async (e, section, index, arrayField) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadedUrl = await uploadFileToServer(file);
    if (uploadedUrl) {
      const updatedArray = [...formValues[section][arrayField]];
      updatedArray[index] = uploadedUrl;
      setFormValues((prev) => ({
        ...prev,
        [section]: { ...prev[section], [arrayField]: updatedArray },
      }));
    }
  };

  // Funções para manipulação dos arrays de carrossel (dobra2, dobra3)
  const handleDobra2CarouselChange = (index, value) => {
    const updatedCarousel = [...formValues.dobra2.carrossel];
    updatedCarousel[index] = value;
    setFormValues((prev) => ({
      ...prev,
      dobra2: { ...prev.dobra2, carrossel: updatedCarousel },
    }));
  };

  const addDobra2CarouselItem = () => {
    setFormValues((prev) => ({
      ...prev,
      dobra2: {
        ...prev.dobra2,
        carrossel: [...prev.dobra2.carrossel, ""],
      },
    }));
  };

  const removeDobra2CarouselItem = (index) => {
    const updatedCarousel = formValues.dobra2.carrossel.filter(
      (_, i) => i !== index
    );
    setFormValues((prev) => ({
      ...prev,
      dobra2: { ...prev.dobra2, carrossel: updatedCarousel },
    }));
  };

  const handleDobra2FieldChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      dobra2: { ...prev.dobra2, [name]: value },
    }));
  };

  const handleDobra3CarouselDireitaChange = (index, value) => {
    const updated = [...formValues.dobra3.carrosselDireita];
    updated[index] = value;
    setFormValues((prev) => ({
      ...prev,
      dobra3: { ...prev.dobra3, carrosselDireita: updated },
    }));
  };

  const addDobra3CarouselDireitaItem = () => {
    setFormValues((prev) => ({
      ...prev,
      dobra3: {
        ...prev.dobra3,
        carrosselDireita: [...prev.dobra3.carrosselDireita, ""],
      },
    }));
  };

  const removeDobra3CarouselDireitaItem = (index) => {
    const updated = formValues.dobra3.carrosselDireita.filter(
      (_, i) => i !== index
    );
    setFormValues((prev) => ({
      ...prev,
      dobra3: { ...prev.dobra3, carrosselDireita: updated },
    }));
  };

  const handleDobra3CarouselEsquerdaChange = (index, value) => {
    const updated = [...formValues.dobra3.carrosselEsquerda];
    updated[index] = value;
    setFormValues((prev) => ({
      ...prev,
      dobra3: { ...prev.dobra3, carrosselEsquerda: updated },
    }));
  };

  const addDobra3CarouselEsquerdaItem = () => {
    setFormValues((prev) => ({
      ...prev,
      dobra3: {
        ...prev.dobra3,
        carrosselEsquerda: [...prev.dobra3.carrosselEsquerda, ""],
      },
    }));
  };

  const removeDobra3CarouselEsquerdaItem = (index) => {
    const updated = formValues.dobra3.carrosselEsquerda.filter(
      (_, i) => i !== index
    );
    setFormValues((prev) => ({
      ...prev,
      dobra3: { ...prev.dobra3, carrosselEsquerda: updated },
    }));
  };

  const handleDobra3FieldChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      dobra3: { ...prev.dobra3, [name]: value },
    }));
  };

  const handleDobra4FieldChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      dobra4: { ...prev.dobra4, [name]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formValues);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <article>
          <h2>
            {formValues.id ? "Editar Fast Home" : "Adicionar Fast Home"}
          </h2>
        </article>
        <form onSubmit={handleSubmit}>
          {/* Campos Principais */}
          <label>
            <span>Área em m²</span>
            <input
              type="number"
              name="area"
              value={formValues.area}
              onChange={handleFieldChange}
              placeholder="Área em m²"
            />
          </label>
          <label>
            <span>Banheiros</span>
            <input
              type="number"
              name="banheiros"
              value={formValues.banheiros}
              onChange={handleFieldChange}
              placeholder="Número de banheiros"
            />
          </label>
          <label>
            <span>Churrasqueira</span>
            <select
              name="churrasqueira"
              value={formValues.churrasqueira ? "true" : "false"}
              onChange={handleBooleanChange}
            >
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          </label>
          <label>
            <span>Descrição</span>
            <input
              name="descricao"
              value={formValues.descricao}
              onChange={handleFieldChange}
              placeholder="Descrição da propriedade"
            />
          </label>
          <label>
            <span>Garagem</span>
            <input
              type="number"
              name="garagem"
              value={formValues.garagem}
              onChange={handleFieldChange}
              placeholder="Vagas na garagem"
            />
          </label>
          {/* Upload para Imagem Principal */}
          <label>
            <span>Imagem</span>
            <input
              type="text"
              name="imagem"
              value={formValues.imagem}
              onChange={handleFieldChange}
              placeholder="URL da imagem principal (ou faça o upload abaixo)"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleSimpleFileUpload(e, "imagem")}
            />
          </label>
          {/* Upload para Imagem Dois */}
          <label>
            <span>Imagem Dois</span>
            <input
              type="text"
              name="imagemDois"
              value={formValues.imagemDois}
              onChange={handleFieldChange}
              placeholder="URL da segunda imagem (ou faça o upload abaixo)"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleSimpleFileUpload(e, "imagemDois")}
            />
          </label>
          <label>
            <span>Largura</span>
            <input
              type="text"
              name="largura"
              value={formValues.largura}
              onChange={handleFieldChange}
              placeholder="Largura da propriedade"
            />
          </label>
          <label>
            <span>Lote</span>
            <input
              type="text"
              name="lote"
              value={formValues.lote}
              onChange={handleFieldChange}
              placeholder="Tamanho do lote"
            />
          </label>
          <label>
            <span>Nome</span>
            <input
              type="text"
              name="nome"
              value={formValues.nome}
              onChange={handleFieldChange}
              placeholder="Nome da propriedade"
            />
          </label>
          <label>
            <span>Pavimentos</span>
            <input
              type="text"
              name="pavimentos"
              value={formValues.pavimentos}
              onChange={handleFieldChange}
              placeholder="Número de pavimentos"
            />
          </label>
          <label>
            <span>Piscina</span>
            <select
              name="piscina"
              value={formValues.piscina ? "true" : "false"}
              onChange={handleBooleanChange}
            >
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          </label>
          <label>
            <span>Quartos</span>
            <input
              type="number"
              name="quartos"
              value={formValues.quartos}
              onChange={handleFieldChange}
              placeholder="Número de quartos"
            />
          </label>
          <label>
            <span>Slug</span>
            <input
              type="text"
              name="slug"
              value={formValues.slug}
              onChange={handleFieldChange}
              placeholder="Slug para URL"
            />
          </label>
          <label>
            <span>Suites</span>
            <input
              type="number"
              name="suites"
              value={formValues.suites}
              onChange={handleFieldChange}
              placeholder="Número de suítes"
            />
          </label>

          {/* Seção Dobra2 */}
          <Section>
            <h3>Dobra2</h3>
            <label>
              <span>Titulo</span>
              <input
                type="text"
                name="title1"
                value={formValues.dobra2.title1}
                onChange={handleDobra2FieldChange}
                placeholder="Título da Dobra2"
              />
            </label>
            <label>
              <span>Descrição</span>
              <input
                name="descricao"
                value={formValues.dobra2.descricao}
                onChange={handleDobra2FieldChange}
                placeholder="Descrição da Dobra2"
              />
            </label>
            <ArraySection>
              <h4>Carrossel da Dobra2</h4>
              {formValues.dobra2.carrossel.map((item, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleDobra2CarouselChange(index, e.target.value)
                    }
                    placeholder={`Imagem ${index + 1}`}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleArrayFileUpload(e, "dobra2", index, "carrossel")
                    }
                  />
                  <button type="button" onClick={() => removeDobra2CarouselItem(index)}>
                    Remover
                  </button>
                </div>
              ))}
              <button type="button" onClick={addDobra2CarouselItem}>
                Adicionar Imagem
              </button>
            </ArraySection>
          </Section>

          {/* Seção Dobra3 */}
          <Section>
            <h3>Dobra3</h3>
            <label>
              <span>Descrição</span>
              <input
                name="descricao"
                value={formValues.dobra3.descricao}
                onChange={handleDobra3FieldChange}
                placeholder="Descrição da Dobra3"
              />
            </label>
            <label>
              <span>Title</span>
              <input
                type="text"
                name="title"
                value={formValues.dobra3.title}
                onChange={handleDobra3FieldChange}
                placeholder="Título da Dobra3"
              />
            </label>
            <ArraySection>
              <h4>Carrossel da Direita Dobra3</h4>
              {formValues.dobra3.carrosselDireita.map((item, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleDobra3CarouselDireitaChange(index, e.target.value)
                    }
                    placeholder={`Imagem Direita ${index + 1}`}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleArrayFileUpload(e, "dobra3", index, "carrosselDireita")
                    }
                  />
                  <button type="button" onClick={() => removeDobra3CarouselDireitaItem(index)}>
                    Remover
                  </button>
                </div>
              ))}
              <button type="button" onClick={addDobra3CarouselDireitaItem}>
                Adicionar Imagem
              </button>
            </ArraySection>
            <ArraySection>
              <h4>Carrossel da Esquerda Dobra3</h4>
              {formValues.dobra3.carrosselEsquerda.map((item, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleDobra3CarouselEsquerdaChange(index, e.target.value)
                    }
                    placeholder={`Imagem Esquerda ${index + 1}`}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleArrayFileUpload(e, "dobra3", index, "carrosselEsquerda")
                    }
                  />
                  <button type="button" onClick={() => removeDobra3CarouselEsquerdaItem(index)}>
                    Remover
                  </button>
                </div>
              ))}
              <button type="button" onClick={addDobra3CarouselEsquerdaItem}>
                Adicionar Imagem
              </button>
            </ArraySection>
          </Section>

          {/* Seção Dobra4 */}
          <Section>
            <h3>Dobra4</h3>
            <label>
              <span>Planta Baixa</span>
              <input
                type="text"
                name="imagem"
                value={formValues.dobra4.imagem}
                onChange={handleDobra4FieldChange}
                placeholder="URL da imagem da Dobra4 (ou faça o upload abaixo)"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSimpleFileUpload(e, "dobra4.imagem")}
              />
            </label>
          </Section>

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
        <p>Tem certeza que deseja excluir esta casa do site da Fast Homes?</p>
        <div>
          <button onClick={onConfirm}>Confirmar</button>
          <button onClick={onCancel}>Cancelar</button>
        </div>
      </ModalExcluir>
    </ModalOverlay>
  );
};

const FastHomes = () => {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingHome, setEditingHome] = useState(null);
  const [deleteHomeId, setDeleteHomeId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const db = getDatabase("banco3");

  const fetchHomes = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, "catalogo");
      const snapshot = await getDocs(colRef);
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHomes(items);
    } catch (error) {
      console.error("Erro ao buscar Fast Homes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomes();
  }, []);

  const handleDeleteConfirm = async (id) => {
    try {
      await deleteDoc(doc(db, "catalogo", id));
      setDeleteHomeId(null);
      fetchHomes();
      toast.warn("Casa excluida!");
    } catch (error) {
      console.error("Erro ao excluir Fast Home:", error);
      toast.error("Erro ao excluir a casa")
    }
  };

  const handleEditSave = async (updatedValues) => {
    try {
      await updateDoc(doc(db, "catalogo", updatedValues.id), updatedValues);
      setEditingHome(null);
      fetchHomes();
      toast.success("Casa editada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar Fast Home:", error);
      toast.error("Erro ao editar a casa!")
    }
  };

  const handleAddSave = async (newValues) => {
    try {
      await addDoc(collection(db, "catalogo"), newValues);
      setIsAdding(false);
      fetchHomes();
      toast.success("Casa adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar Fast Home:", error);
      toast.error("Erro ao adicionar a casa!")
    }
  };

  const renderCard = (home) => {
    return (
      <Card key={home.id}>
        <div>
          <img src={home.imagem} alt={home.nome} />
          <h1>{home.nome}</h1>
          <span>{home.descricao}</span>
        </div>
        <article>
          <button
            onClick={() => {
              setEditingHome(home);
              setIsAdding(false);
            }}
          >
            Editar
          </button>
          <button onClick={() => setDeleteHomeId(home.id)}>Excluir</button>
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
          <CardGrid>{homes.map((home) => renderCard(home))}</CardGrid>
          <div style={{ marginTop: "20px" }}>
            <AddButton
              onClick={() => {
                setIsAdding(true);
                setEditingHome(null);
              }}
            >
              Adicionar Fast Home
            </AddButton>
          </div>
        </>
      )}
      {editingHome && (
        <EditModal
          eventData={editingHome}
          onSave={handleEditSave}
          onCancel={() => setEditingHome(null)}
        />
      )}
      {isAdding && (
        <EditModal
          eventData={{}}
          onSave={handleAddSave}
          onCancel={() => setIsAdding(false)}
        />
      )}
      {deleteHomeId && (
        <ConfirmDeleteModal
          onConfirm={() => handleDeleteConfirm(deleteHomeId)}
          onCancel={() => setDeleteHomeId(null)}
        />
      )}
    </Content>
  );
};

export default FastHomes;
