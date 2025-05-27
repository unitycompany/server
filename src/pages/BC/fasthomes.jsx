import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getDatabase } from "../../../firebaseConfig"; // ajuste o caminho conforme necessário
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LiaExternalLinkAltSolid } from "react-icons/lia";

// Estilizações
const Content = styled.div`
  max-height: 65vh;
  height: auto;
  width: 100%;
  overflow-y: auto;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  gap: 5px;
  position: relative;

  & .botao-de-adicionar {
    background-color: #0b6e0b;
    width: 100%!important;
    left: 2.5%;
    position: sticky;
    top: 0px;
    z-index: 10;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);

    & button {
      width: 100%;
      height: 100%;
      color: #fff;
      font-weight: 500;
          padding: 5px 10px;
      cursor: pointer;
    }
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 15px;
  width: auto;
  padding: 5px;
  border: 1px solid #00000050;
  transition: all 0.2s ease-in-out;

  &:hover{
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-color: #00000020;
  }

  & .button-url{
    width: 100%;
    margin-top: -10px;
    padding: 5px 10px;
    background-color: #20580a;
    color: #fff;  
    cursor: pointer;
    font-size: 14px;  
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
    transition: all .1s ease-in-out;

    &:hover {
      background-color: #33a107;
    }

    & svg {
      font-size: 18px;
    }
  }

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
      font-weight: 400;
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
  padding: 20px;
  width: 90%;
  max-width: 950px;
  position: relative;
  max-height: 80vh;
  overflow: auto;
  border-radius: 10px;

  & article {
    & h2 {
      font-size: 22px;
      font-weight: 600;
    }
  }

  & form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 30px;

    & div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      width: 100%;
    }

    & label {
      border: 1px solid #00000020;
      padding: 10px 5px 5px 5px;
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

      & .imageURL {
        display: none;
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
  border-top: 1px solid #00000020;
  padding-top: 10px;

  & h3 {
    font-size: 22px;
    font-weight: 600;
  }
`;

const ArraySection = styled.div`
  display: flex;
  align-items: flex-start!important;
  flex-direction: column;
  gap: 10px;
  justify-content: flex-start!important;
  width: 100%;
  
  & .imageURL {
    display: none;
  }

  & aside{
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-between;

     & div {
      /* Alinhar cada item do carrossel em linha (lado a lado) */
      display: flex;
      flex-direction: column!important;
      align-items: flex-start!important;
      justify-content: flex-start;
      gap: 10px;
      width: 49%!important;
      padding: 10px;
      border: 1px solid #00000020;
      /* Remover flex-direction: column e width: max-content */

    }
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
  // Estado inicial agora usa plantaBaixa
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
    // Agora dobra4 é um array de imagens
    dobra4: eventData.dobra4 && Array.isArray(eventData.dobra4.plantaBaixa)
      ? { plantaBaixa: eventData.dobra4.plantaBaixa }
      : { plantaBaixa: eventData.dobra4 && eventData.dobra4.plantaBaixa ? [eventData.dobra4.plantaBaixa] : [] },
  });
  const [previewImagem, setPreviewImagem] = useState(formValues.imagem || "");
  const [previewImagemDois, setPreviewImagemDois] = useState(formValues.imagemDois || "");
  const [carouselPreviews, setCarouselPreviews] = useState(formValues.dobra2.carrossel.map((url) => url || ""));
  // Novos estados para previews dos carrosseis de dobra3 e dobra4
  const [carouselDireitaPreviews, setCarouselDireitaPreviews] = useState(formValues.dobra3.carrosselDireita.map((url) => url || ""));
  const [carouselEsquerdaPreviews, setCarouselEsquerdaPreviews] = useState(formValues.dobra3.carrosselEsquerda.map((url) => url || ""));
  const [plantaBaixaPreviews, setPlantaBaixaPreviews] = useState(formValues.dobra4.plantaBaixa.map((url) => url || ""));
  const textareaRef = React.useRef(null);

  // Ajusta a altura do textarea conforme o conteúdo
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [formValues.dobra2.descricao]);

  // Atualiza campos numéricos ou texto
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
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
      if (fieldName === "imagem") setPreviewImagem(uploadedUrl);
      if (fieldName === "imagemDois") setPreviewImagemDois(uploadedUrl);
    } else {
      // Se o upload falhar, ainda mostrar preview local
      const localUrl = URL.createObjectURL(file);
      if (fieldName === "imagem") setPreviewImagem(localUrl);
      if (fieldName === "imagemDois") setPreviewImagemDois(localUrl);
    }
  };

  // Atualiza previews do carrossel ao alterar o array
  useEffect(() => {
    setCarouselPreviews(formValues.dobra2.carrossel.map((url) => url || ""));
  }, [formValues.dobra2.carrossel]);
  useEffect(() => {
    setCarouselDireitaPreviews(formValues.dobra3.carrosselDireita.map((url) => url || ""));
  }, [formValues.dobra3.carrosselDireita]);
  useEffect(() => {
    setCarouselEsquerdaPreviews(formValues.dobra3.carrosselEsquerda.map((url) => url || ""));
  }, [formValues.dobra3.carrosselEsquerda]);
  useEffect(() => {
    setPlantaBaixaPreviews(formValues.dobra4.plantaBaixa.map((url) => url || ""));
  }, [formValues.dobra4.plantaBaixa]);

  // Handler para upload de arquivo em arrays (ex.: carrossel)
  const handleArrayFileUpload = async (e, section, index, arrayField) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadedUrl = await uploadFileToServer(file);
    let previewUrl = uploadedUrl;
    if (!uploadedUrl) {
      previewUrl = URL.createObjectURL(file);
    }
    // Atualiza preview local
    if (section === "dobra2") {
      setCarouselPreviews((prev) => {
        const updated = [...prev];
        updated[index] = previewUrl;
        return updated;
      });
    } else if (section === "dobra3" && arrayField === "carrosselDireita") {
      setCarouselDireitaPreviews((prev) => {
        const updated = [...prev];
        updated[index] = previewUrl;
        return updated;
      });
    } else if (section === "dobra3" && arrayField === "carrosselEsquerda") {
      setCarouselEsquerdaPreviews((prev) => {
        const updated = [...prev];
        updated[index] = previewUrl;
        return updated;
      });
    } else if (section === "dobra4" && arrayField === "plantaBaixa") {
      setPlantaBaixaPreviews((prev) => {
        const updated = [...prev];
        updated[index] = previewUrl;
        return updated;
      });
    }
    // Atualiza valor no form
    if (previewUrl) {
      const updatedArray = [...formValues[section][arrayField]];
      updatedArray[index] = previewUrl;
      setFormValues((prev) => ({
        ...prev,
        [section]: { ...prev[section], [arrayField]: updatedArray },
      }));
    }
  };

  // Funções para manipulação dos arrays de carrossel (dobra2, dobra3, dobra4)
  // Dobra2
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
    // Ajusta a altura do textarea imediatamente ao digitar
    if (name === 'descricao' && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  // Dobra3 Direita
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
    setCarouselDireitaPreviews((prev) => [...prev, ""]);
  };
  const removeDobra3CarouselDireitaItem = (index) => {
    const updated = formValues.dobra3.carrosselDireita.filter((_, i) => i !== index);
    setFormValues((prev) => ({
      ...prev,
      dobra3: { ...prev.dobra3, carrosselDireita: updated },
    }));
    setCarouselDireitaPreviews((prev) => prev.filter((_, i) => i !== index));
  };
  // Dobra3 Esquerda
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
    setCarouselEsquerdaPreviews((prev) => [...prev, ""]);
  };
  const removeDobra3CarouselEsquerdaItem = (index) => {
    const updated = formValues.dobra3.carrosselEsquerda.filter((_, i) => i !== index);
    setFormValues((prev) => ({
      ...prev,
      dobra3: { ...prev.dobra3, carrosselEsquerda: updated },
    }));
    setCarouselEsquerdaPreviews((prev) => prev.filter((_, i) => i !== index));
  };
  // Dobra4 (Planta Baixa)
  const handlePlantaBaixaChange = (index, value) => {
    const updated = [...formValues.dobra4.plantaBaixa];
    updated[index] = value;
    setFormValues((prev) => ({
      ...prev,
      dobra4: { ...prev.dobra4, plantaBaixa: updated },
    }));
  };
  const addPlantaBaixaItem = () => {
    setFormValues((prev) => ({
      ...prev,
      dobra4: {
        ...prev.dobra4,
        plantaBaixa: [...prev.dobra4.plantaBaixa, ""],
      },
    }));
    setPlantaBaixaPreviews((prev) => [...prev, ""]);
  };
  const removePlantaBaixaItem = (index) => {
    const updated = formValues.dobra4.plantaBaixa.filter((_, i) => i !== index);
    setFormValues((prev) => ({
      ...prev,
      dobra4: { ...prev.dobra4, plantaBaixa: updated },
    }));
    setPlantaBaixaPreviews((prev) => prev.filter((_, i) => i !== index));
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
            {formValues.id ? "Editando casa" : "Adicionando casa"}
          </h2>
        </article>
        <form onSubmit={handleSubmit}>
          {/* Campos Principais */}
          <label>
            <span>Nome da casa</span>
            <input
              type="text"
              name="nome"
              value={formValues.nome}
              onChange={handleFieldChange}
            />
          </label>

          <div>
            <label>
              <span>Área em m²</span>
              <input
                type="text"
                name="area"
                value={formValues.area}
                onChange={handleFieldChange}
              />
            </label>
            <label>
              <span>Banheiros</span>
              <input
                type="number"
                name="banheiros"
                value={formValues.banheiros}
                onChange={handleFieldChange}
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
              <span>Garagem</span>
              <input
                type="number"
                name="garagem"
                value={formValues.garagem}
                onChange={handleFieldChange}
              />
            </label>
          </div> 
          <div>
            <label>
              <span>Foto da Fachada 01 ( Dia )</span>
              <input
                className="imageURL"
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
              {previewImagem && (
                <img src={previewImagem} alt="Preview Fachada Dia" style={{ maxWidth: 200, maxHeight: 120, marginTop: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              )}
            </label>
            {/* Upload para Imagem Dois */}
            <label>
              <span>Foto da Fachada 02 ( Noite )</span>
              <input
                className="imageURL"
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
              {previewImagemDois && (
                <img src={previewImagemDois} alt="Preview Fachada Noite" style={{ maxWidth: 200, maxHeight: 120, marginTop: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              )}
            </label>
          </div>

          <div>
            <label>
              <span>Largura x Fundo (m)</span>
              <input
                type="text"
                name="largura"
                value={formValues.largura}
                onChange={handleFieldChange}
              />
            </label>
            <label>
              <span>Lote mínimo (m)</span>
              <input
                type="text"
                name="lote"
                value={formValues.lote}
                onChange={handleFieldChange}
              />
            </label>
          </div>
          
          <div>
            <label>
              <span>Pavimentos</span>
              <input
                type="text"
                name="pavimentos"
                value={formValues.pavimentos}
                onChange={handleFieldChange}
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
              />
            </label>
            <label>
            <span>Suites</span>
            <input
              type="number"
              name="suites"
              value={formValues.suites}
              onChange={handleFieldChange}
            />
          </label>
          </div>
          
         
          <label>
            <span>Nome da casa em minúsculo</span>
            <input
              type="text"
              name="slug"
              value={formValues.slug}
              onChange={handleFieldChange}
              placeholder="ex.: nome-da-casa"
            />
          </label>
          

          {/* Seção Dobra2 */}
          <Section>
            <h3>Informações Gerais</h3>
            <label>
              <span>Descrição da casa</span>
              <textarea
                ref={textareaRef}
                name="descricao"
                value={formValues.dobra2.descricao}
                onChange={handleDobra2FieldChange}
                style={{ resize: 'vertical', width: '100%', height: 'maxContent' }}
              />
            </label>
          </Section>

          {/* Seção Dobra3 - Organização dos 3 carrosseis */}
          <Section>
            <h3>Carrosseis de Imagens</h3>
            <ArraySection>
              <h3>Carrossel 1</h3>
              <aside>
                {formValues.dobra2.carrossel.map((item, index) => (
                  <div key={index}>
                    <input
                      className="imageURL"
                      type="text"
                      value={item}
                      onChange={(e) => handleDobra2CarouselChange(index, e.target.value)}
                      placeholder={`Imagem ${index + 1}`}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleArrayFileUpload(e, "dobra2", index, "carrossel")}
                    />
                    {carouselPreviews[index] && (
                      <img
                        src={carouselPreviews[index]}
                        alt={`Preview Carrossel 1 - Imagem ${index + 1}`}
                        style={{ width: 180, height: 100, marginLeft: 8, borderRadius: 4, border: '1px solid #ccc' }}
                      />
                    )}
                    <button type="button" onClick={() => removeDobra2CarouselItem(index)}>
                      Remover
                    </button>
                  </div>
                ))}
              </aside>
              <button type="button" onClick={addDobra2CarouselItem}>
                Adicionar Imagem
              </button>
            </ArraySection>
            <ArraySection>
              <h3>Carrossel 2</h3>
              <aside>
                {formValues.dobra3.carrosselDireita.map((item, index) => (
                  <div key={index}>
                    <input
                      className="imageURL"
                      type="text"
                      value={item}
                      onChange={(e) => handleDobra3CarouselDireitaChange(index, e.target.value)}
                      placeholder={`Imagem ${index + 1}`}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleArrayFileUpload(e, "dobra3", index, "carrosselDireita")}
                    />
                    {carouselDireitaPreviews[index] && (
                      <img
                        src={carouselDireitaPreviews[index]}
                        alt={`Preview Carrossel 2 - Imagem ${index + 1}`}
                        style={{ width: 180, height: 100, marginLeft: 8, borderRadius: 4, border: '1px solid #ccc' }}
                      />
                    )}
                    <button type="button" onClick={() => removeDobra3CarouselDireitaItem(index)}>
                      Remover
                    </button>
                  </div>
                ))}
              </aside>
              <button type="button" onClick={addDobra3CarouselDireitaItem}>
                Adicionar Imagem
              </button>
            </ArraySection>
            <ArraySection>
              <h3>Carrossel 3</h3>
              <aside>
                {formValues.dobra3.carrosselEsquerda.map((item, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleDobra3CarouselEsquerdaChange(index, e.target.value)}
                      placeholder={`Imagem ${index + 1}`}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleArrayFileUpload(e, "dobra3", index, "carrosselEsquerda")}
                    />
                    {carouselEsquerdaPreviews[index] && (
                      <img
                        src={carouselEsquerdaPreviews[index]}
                        alt={`Preview Carrossel 3 - Imagem ${index + 1}`}
                        style={{ width: 180, height: 100, marginLeft: 8, borderRadius: 4, border: '1px solid #ccc' }}
                      />
                    )}
                    <button type="button" onClick={() => removeDobra3CarouselEsquerdaItem(index)}>
                      Remover
                    </button>
                  </div>
                ))}
              </aside>
              <button type="button" onClick={addDobra3CarouselEsquerdaItem}>
                Adicionar Imagem
              </button>
            </ArraySection>
          </Section>

          {/* Seção Dobra4 */}
          <Section>
            <h3>Planta Baixa</h3>
            <ArraySection>
              <aside>
                {formValues.dobra4.plantaBaixa.map((item, index) => (
                  <div key={index}>
                    <input
                      className="imageURL"
                      type="text"
                      value={item}
                      onChange={(e) => handlePlantaBaixaChange(index, e.target.value)}
                      placeholder={`Imagem Planta Baixa ${index + 1}`}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleArrayFileUpload(e, "dobra4", index, "plantaBaixa")}
                    />
                    {plantaBaixaPreviews[index] && (
                      <img
                        src={plantaBaixaPreviews[index]}
                        alt={`Preview Planta Baixa ${index + 1}`}
                        style={{ width: 180, height: 100, marginLeft: 8, borderRadius: 4, border: '1px solid #ccc' }}
                      />
                    )}
                    <button type="button" onClick={() => removePlantaBaixaItem(index)}>
                      Remover
                    </button>
                  </div>
                ))}
              </aside>
              <button type="button" onClick={addPlantaBaixaItem}>
                Adicionar Imagem
              </button>
            </ArraySection>
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

const FastHomes = ({ isAdding: isAddingProp = false, setIsAdding }) => {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingHome, setEditingHome] = useState(null);
  const [deleteHomeId, setDeleteHomeId] = useState(null);
  // Estado local para fallback
  const [isAddingLocal, setIsAddingLocal] = useState(false);

  const isAdding = typeof setIsAdding === 'function' ? isAddingProp : isAddingLocal;

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
      await updateDoc(doc(db, "catalogo", updatedValues.id), {
        ...updatedValues,
        area: updatedValues.area ? parseFloat(updatedValues.area) : 0,
      });
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
      const nomeCasa = newValues.nome || '';
      const idDoc = `casa-${newValues.slug}`;
      await addDoc(collection(db, "catalogo"), {
        ...newValues,
        area: newValues.area ? parseFloat(newValues.area) : 0,
        create: serverTimestamp(),
        liveViews: 0,
        views: 100,
        id: idDoc,
        slug: newValues.slug,
      });
      if (typeof setIsAdding === 'function') setIsAdding(false);
      setIsAddingLocal(false);
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
          {/* <span>{home.descricao}</span> */}
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
        <button
          className="button-url"
          onClick={() => window.open(`https://fasthomes.com.br/catalogo-de-casas/${home.slug}`, '_blank')}
        >
          Visitar casa <LiaExternalLinkAltSolid />
        </button>
      </Card>
    );
  };

  return (
    <Content>
      <div className="botao-de-adicionar">
        <button onClick={() => {
          setEditingHome(null);
          if (typeof setIsAdding === 'function') setIsAdding(true);
          else setIsAddingLocal(true);
        }}>
          + Adicionar Casa
        </button>
      </div>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <CardGrid>{homes.map((home) => renderCard(home))}</CardGrid>
        </>
      )}
      {editingHome && (
        <EditModal
          eventData={editingHome}
          onSave={handleEditSave}
          onCancel={() => setEditingHome(null)}
        />
      )}
      {isAdding && !editingHome && (
        <EditModal
          eventData={{}}
          onSave={handleAddSave}
          onCancel={() => {
            if (typeof setIsAdding === 'function') setIsAdding(false);
            setIsAddingLocal(false);
          }}
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
