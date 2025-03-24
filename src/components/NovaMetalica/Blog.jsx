import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { getDatabase } from "../../../firebaseConfig";
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
  max-width: 600px;
  position: relative;
  max-height: 80vh;
  overflow: auto;

  & h2 {
    font-size: 22px;
    font-weight: 600;
    color: transparent;
    background: linear-gradient(90deg, #bd0a0a, #2e2d2d, #003aa7);
    -webkit-background-clip: text;
    width: auto;
    }

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
  margin-top: 10px;
  width: 100%;
  align-items: flex-start!important;
  justify-content: flex-start!important;
  flex-direction: row!important;
  display: flex!important;
  gap: 10px;
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

const EditModalBlog = ({ blogData, onSave, onCancel }) => {
  const [formValues, setFormValues] = useState({ ...blogData });

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleHashtagChange = (e) => {
    const value = e.target.value;
    const hashtags = value.split(",").map(tag => tag.trim());
    setFormValues({ ...formValues, hashtag: hashtags });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadedUrl = await uploadFileToServer(file);
      if (uploadedUrl) {
        setFormValues({ ...formValues, image: uploadedUrl });
      }
    }
  };

  const handleEditorChange = (name, html) => {
    setFormValues({ ...formValues, [name]: html });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formValues);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>{formValues.id ? "Editar Blog" : "Adicionar Blog"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Título</span>
            <input type="text" name="titulo" value={formValues.titulo || ""} onChange={handleFieldChange} />
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
            <span>Descrição (HTML)</span>
            <input
                type="text" name="description" value={formValues.description || ""} onChange={handleFieldChange}
            />
          </label>
          <label>
            <span>Hashtag (separadas por vírgula)</span>
            <input
              type="text"
              name="hashtag"
              value={(formValues.hashtag && formValues.hashtag.join(", ")) || ""}
              onChange={handleHashtagChange}
            />
          </label>
          <label>
            <span>Imagem (URL)</span>
            <input type="text" name="image" value={formValues.image || ""} onChange={handleFieldChange} />
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {formValues.image && (
              <button type="button" onClick={() => setFormValues({ ...formValues, image: "" })}>
                Remover Imagem
              </button>
            )}
          </label>
          <label>
            <span>Link</span>
            <input type="text" name="link" value={formValues.link || ""} onChange={handleFieldChange} />
          </label>
          <label>
            <span>Tópico</span>
            <input type="text" name="topico" value={formValues.topico || ""} onChange={handleFieldChange} />
          </label>
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
          <p>Tem certeza que deseja excluir este blog?</p>
          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <button onClick={onConfirm}>Confirmar</button>
            <button onClick={onCancel}>Cancelar</button>
          </div>
        </ModalExcluir>
      </ModalOverlay>
    );
  };
  

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const db = getDatabase("banco4");

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, "Blog");
      const snapshot = await getDocs(colRef);
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBlogs(items);
    } catch (error) {
      console.error("Erro ao buscar blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

    const handleDeleteConfirm = async (id) => {
        try {
        await deleteDoc(doc(db, "Eventos", id));
        setDeleteEventId(null);
        fetchEvents();
        toast.warn("Blog excluido!");
        } catch (error) {
        console.error("Erro ao excluir evento:", error);
        toast.error("Erro ao excluir o blog");
        }
    };

  const handleEditSave = async (updatedBlog) => {
    try {
      await updateDoc(doc(db, "Blog", updatedBlog.id), updatedBlog);
      setEditingBlog(null);
      fetchBlogs();
      toast.success("Blog atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar blog:", error);
      toast.error("Erro ao atualizar o blog");
    }
  };

  const handleAddSave = async (newBlog) => {
    try {
      await addDoc(collection(db, "Blog"), newBlog);
      setIsAdding(false);
      fetchBlogs();
      toast.success("Blog adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar blog:", error);
      toast.error("Erro ao adicionar o blog");
    }
  };

  return (
    <Content>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <CardGrid>
            {blogs.map((blog) => (
              <Card key={blog.id}>
                {blog.image && <img src={blog.image} alt={blog.titulo} />}
                <h1>{blog.titulo}</h1>
                <p>Data: {blog.data}</p>
                <div>
                    <button onClick={() => { setEditingBlog(blog); setIsAdding(false); }}>Editar</button>
                    <button onClick={() => setDeleteEventId(blog.id)}>Excluir</button>
                </div>
                
              </Card>
            ))}
          </CardGrid>
          <AddButton onClick={() => { setIsAdding(true); setEditingBlog(null); }}>Adicionar Blog</AddButton>
        </>
      )}
      {editingBlog && (
        <EditModalBlog blogData={editingBlog} onSave={handleEditSave} onCancel={() => setEditingBlog(null)} />
      )}
      {isAdding && (
        <EditModalBlog blogData={{}} onSave={handleAddSave} onCancel={() => setIsAdding(false)} />
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

export default Blog;
