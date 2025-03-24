import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { getDatabase } from "../../../firebaseConfig";
import MyEditor from "../RichTextEditor";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Content = styled.div``;

const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const Card = styled.div`
  border: 1px solid #00000050;
  padding: 10px;
  margin-bottom: 10px;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 15px;

  & h1 {
    font-size: 20px;
    line-height: 120%;
  }

  & p {
    margin-top: -8px;
    font-size: 14px;
    font-weight: 400;
  }

  & div {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    gap: 10px;
    margin-top: 10px;

    & button {
        padding: 5px 15px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;

        &:nth-child(1){
            background-color: #353535;
            color: #fff;
            border: 2px solid #000;
        }

        &:nth-child(2){
            background-color: #ffffff;
            color: #000000;
            border: 2px solid #000;
        }
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 30px;
  width: 90%;
  max-width: 1000px;
  position: relative;
  max-height: 80vh;
  overflow: auto;

  & button {
        padding: 5px 15px;
        font-weight: 400;
        background-color: #000000;
        border: 2px solid #727272;
        color: #fff;
        cursor: pointer;
        font-size: 14px;
    }

  & article {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    border-bottom: 1px solid #00000020;
    padding: 10px 0;

    & button {
        padding: 5px 15px;
        font-weight: 600;
        background-color: #000000;
        border: 2px solid #727272;
        color: #ffffff;
        cursor: pointer;
        font-size: 14px;
    }

    & h3 {
        font-size: 22px;
        font-weight: 600;
        color: transparent;
        background: linear-gradient(90deg, #bd0a0a, #2e2d2d, #003aa7);
        -webkit-background-clip: text;
        width: auto;
    }

    & article {
        display: flex;
        font-size: large;
        align-items: flex-start;
        flex-direction: column;
        gap: 20px;

        & button {
            padding: 5px 15px;
            font-weight: 400;
            background-color: #000000;
            border: 2px solid #727272;
            color: #fff;
            cursor: pointer;
            font-size: 14px;
        }
    }

    & h3 {
        padding: 10px;
    }
  }

  & h2 {
    font-size: 22px;
    font-weight: 600;
    color: transparent;
    background: linear-gradient(90deg, #bd0a0a, #2e2d2d, #003aa7);
    -webkit-background-clip: text;
    width: auto;
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
        width: 100%;
        padding: 15px 10px 10px 10px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
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
    padding: 5px 15px;
    cursor: pointer;
    border: 2px solid #000;

    &:nth-child(1) {
      background-color: #34b600;
      border-color: #000;
      color: #fff;
    }

    &:nth-child(2) {
      background-color: #ffffff;
      border-color: #000;
      color: #000000;
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

const uploadFileToServer = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await fetch("https://server.unitycompany.com.br/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data.url || null;
  } catch (error) {
    console.error("Erro no upload:", error);
    return null;
  }
};

const EditModalArtigo = ({ artigoData, onSave, onCancel }) => {
  const [formValues, setFormValues] = useState({
    ...artigoData,
    sumario: artigoData.sumario || []
  });

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleEditorChange = (name, html) => {
    setFormValues({ ...formValues, [name]: html });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadedUrl = await uploadFileToServer(file);
      if (uploadedUrl) {
        setFormValues({ ...formValues, imagemPrincipal: uploadedUrl });
      }
    }
  };

  const addSumarioItem = () => {
    setFormValues({
      ...formValues,
      sumario: [...formValues.sumario, { id: Date.now().toString(), title: "", content: "" }]
    });
  };

  const updateSumarioItem = (index, field, value) => {
    const newSumario = formValues.sumario.map((item, idx) =>
      idx === index ? { ...item, [field]: value } : item
    );
    setFormValues({ ...formValues, sumario: newSumario });
  };

  const removeSumarioItem = (index) => {
    const newSumario = formValues.sumario.filter((_, idx) => idx !== index);
    setFormValues({ ...formValues, sumario: newSumario });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formValues);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>{formValues.id ? "Editar Artigo" : "Adicionar Artigo"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Título</span>
            <input type="text" name="title" value={formValues.title || ""} onChange={handleFieldChange} />
          </label>
          <label>
            <span>Autor</span>
            <input type="text" name="autor" value={formValues.autor || ""} onChange={handleFieldChange} />
          </label>
          <label>
            <span>Data</span>
            <input type="text" name="data" value={formValues.data || ""} onChange={handleFieldChange} />
          </label>
          <label>
            <span>Slug</span>
            <input type="text" name="slug" value={formValues.slug || ""} onChange={handleFieldChange} />
          </label>
          <label>
            <span>Link</span>
            <input type="text" name="link" value={formValues.link || ""} onChange={handleFieldChange} />
          </label>
          <label>
            <span>Descrição (HTML)</span>
            <MyEditor
              initialHtml={formValues.descricao || ""}
              onChange={(html) => handleEditorChange("descricao", html)}
            />
          </label>
          <label>
            <span>Imagem Principal (URL)</span>
            <input
              type="text"
              name="imagemPrincipal"
              value={formValues.imagemPrincipal || ""}
              onChange={handleFieldChange}
              placeholder="URL da imagem principal"
            />
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {formValues.imagemPrincipal && (
              <button type="button" onClick={() => setFormValues({ ...formValues, imagemPrincipal: "" })}>
                Remover Imagem
              </button>
            )}
          </label>
          <label>
            <span>Bibliografia Principal (HTML)</span>
            <MyEditor
              initialHtml={formValues.bibliografiaPrincipal || ""}
              onChange={(html) => handleEditorChange("bibliografiaPrincipal", html)}
            />
          </label>
          <article>
            <h3>Sumário</h3>
            {formValues.sumario.map((item, index) => (
              <article key={item.id}>
                <label>
                  <span>Título do Tópico</span>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateSumarioItem(index, "title", e.target.value)}
                    placeholder="Título do tópico"
                  />
                </label>
                <label>
                  <span>Conteúdo (HTML)</span>
                  <MyEditor
                    initialHtml={item.content || ""}
                    onChange={(html) => updateSumarioItem(index, "content", html)}
                  />
                </label>
                <button type="button" onClick={() => removeSumarioItem(index)}>
                  Remover Tópico
                </button>
              </article>
            ))}
            <button type="button" onClick={addSumarioItem}>Adicionar Tópico</button>
          </article>
          <Buttons>
            <button type="submit">Salvar</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
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
          <p>Tem certeza que deseja excluir este artigo?</p>
          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <button onClick={onConfirm}>Confirmar</button>
            <button onClick={onCancel}>Cancelar</button>
          </div>
        </ModalExcluir>
      </ModalOverlay>
    );
  };
  

const Artigo = () => {
  const [artigos, setArtigos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingArtigo, setEditingArtigo] = useState(null);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const db = getDatabase("banco4");

  const fetchArtigos = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, "Artigos");
      const snapshot = await getDocs(colRef);
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setArtigos(items);
    } catch (error) {
      console.error("Erro ao buscar artigos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async (id) => {
    try {
    await deleteDoc(doc(db, "Eventos", id));
    setDeleteEventId(null);
    fetchEvents();
    toast.warn("Artigo excluido!");
    } catch (error) {
    console.error("Erro ao excluir evento:", error);
    toast.error("Erro ao excluir o artigo!");
    }
};

  useEffect(() => {
    fetchArtigos();
  }, []);

  const handleEditSave = async (updatedArtigo) => {
    try {
      await updateDoc(doc(db, "Artigos", updatedArtigo.id), updatedArtigo);
      setEditingArtigo(null);
      fetchArtigos();
      toast.success("Artigo atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar artigo:", error);
      toast.error("Erro ao atualizar o artigo");
    }
  };

  const handleAddSave = async (newArtigo) => {
    try {
      await addDoc(collection(db, "Artigos"), newArtigo);
      setIsAdding(false);
      fetchArtigos();
      toast.success("Artigo adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar artigo:", error);
      toast.error("Erro ao adicionar o artigo!");
    }
  };

  return (
    <Content>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <CardGrid>
            {artigos.map((artigo) => (
              <Card key={artigo.id}>
                {artigo.imagemPrincipal && <img src={artigo.imagemPrincipal} alt={artigo.title} />}
                <h1>{artigo.title}</h1>
                <p>Data: {artigo.data}</p>
                <div>
                    <button onClick={() => { setEditingArtigo(artigo); setIsAdding(false); }}>Editar</button>
                    <button onClick={() => setDeleteEventId(artigo.id)}>Excluir</button>
                </div>
              </Card>
            ))}
          </CardGrid>
          <AddButton onClick={() => { setIsAdding(true); setEditingArtigo(null); }}>Adicionar Artigo</AddButton>
        </>
      )}
      {editingArtigo && (
        <EditModalArtigo
          artigoData={editingArtigo}
          onSave={handleEditSave}
          onCancel={() => setEditingArtigo(null)}
        />
      )}
      {isAdding && (
        <EditModalArtigo
          artigoData={{}}
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

export default Artigo;
