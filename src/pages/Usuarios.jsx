// import React, { useState, useEffect } from "react";
// import styled from "styled-components";
// import CardUser from "../components/CardUser";
// import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
// import { getDatabase } from "../../../firebaseConfig";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Content = styled.div`
//   padding: 2.5%;
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   justify-content: center;
//   gap: 10px;
//   width: 100%;
//   overflow-y: auto;
// `;

// const Top = styled.div`
//   width: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   border-bottom: 1px solid #00000050;
//   padding: 10px 0;

//   & button {
//     padding: 5px 15px;
//     background-color: #000000;
//     border: 2px solid #727272;
//     color: #fff;
//     cursor: pointer;
//     font-size: 14px;
//     transition: all 0.2s ease;

//     &:hover {
//       background-color: #ffffff;
//       border-color: #000;
//       color: #000;
//     }
//   }
// `;

// const Container = styled.div`
//   display: flex;
//   align-items: flex-start;
//   justify-content: flex-start;
//   width: 100%;
//   gap: 10px;
//   flex-wrap: wrap;
// `;

// const ModalOverlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background: rgba(0, 0, 0, 0.5);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 1000;
// `;

// const ModalContent = styled.div`
//   background: #fff;
//   padding: 30px;
//   width: 90%;
//   max-width: 600px;
//   position: relative;
//   max-height: 80vh;
//   overflow: auto;

//   & form {
//     display: flex;
//     flex-direction: column;
//     gap: 20px;
//     margin-top: 20px;
    
//     & label {
//       display: flex;
//       flex-direction: column;
//       font-size: 14px;
      
//       & span {
//         margin-bottom: 5px;
//         font-weight: 600;
//       }
      
//       & input {
//         padding: 8px;
//         font-size: 14px;
//       }
//     }
//   }
// `;

// const Buttons = styled.div`
//   display: flex;
//   gap: 10px;

//   & button {
//     padding: 5px 15px;
//     background-color: #000;
//     border: 2px solid #727272;
//     color: #fff;
//     cursor: pointer;
//     font-size: 14px;
//   }
// `;

// const AddButton = styled.button`
//   margin-top: 20px;
//   padding: 5px 15px;
//   background-color: #34b600;
//   border: 2px solid #000000;
//   color: #fff;
//   cursor: pointer;
//   font-size: 16px;
// `;

// const UserModal = ({ userData, onSave, onCancel }) => {
//   const [formValues, setFormValues] = useState({
//     nome: userData?.nome || "",
//     login: userData?.login || "",
//     senha: userData?.senha || "",
//     id: userData?.id || null
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(formValues);
//   };

//   return (
//     <ModalOverlay>
//       <ModalContent>
//         <h2>{formValues.id ? "Editar Usuário" : "Adicionar Usuário"}</h2>
//         <form onSubmit={handleSubmit}>
//           <label>
//             <span>Nome:</span>
//             <input
//               type="text"
//               name="nome"
//               value={formValues.nome}
//               onChange={handleChange}
//               placeholder="Nome do usuário"
//             />
//           </label>
//           <label>
//             <span>Login:</span>
//             <input
//               type="text"
//               name="login"
//               value={formValues.login}
//               onChange={handleChange}
//               placeholder="Email ou login"
//             />
//           </label>
//           <label>
//             <span>Senha:</span>
//             <input
//               type="password"
//               name="senha"
//               value={formValues.senha}
//               onChange={handleChange}
//               placeholder="Senha"
//             />
//           </label>
//           <Buttons>
//             <button type="submit">Salvar</button>
//             <button type="button" onClick={onCancel}>Cancelar</button>
//           </Buttons>
//         </form>
//       </ModalContent>
//     </ModalOverlay>
//   );
// };

// const ConfirmDeleteModal = ({ onConfirm, onCancel }) => {
//   return (
//     <ModalOverlay>
//       <ModalContent>
//         <h2>Confirmar Exclusão</h2>
//         <p>Tem certeza que deseja excluir este usuário?</p>
//         <Buttons>
//           <button onClick={onConfirm}>Confirmar</button>
//           <button onClick={onCancel}>Cancelar</button>
//         </Buttons>
//       </ModalContent>
//     </ModalOverlay>
//   );
// };

// const Usuarios = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isAdding, setIsAdding] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [deleteUserId, setDeleteUserId] = useState(null);

//   const db = getDatabase("default");

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const colRef = collection(db, "Usuarios");
//       const snapshot = await getDocs(colRef);
//       const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setUsers(items);
//     } catch (error) {
//       console.error("Erro ao buscar usuários:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleAddSave = async (newUser) => {
//     try {
//       await addDoc(collection(db, "Usuarios"), newUser);
//       setIsAdding(false);
//       fetchUsers();
//       toast.success("Usuário adicionado com sucesso!");
//     } catch (error) {
//       console.error("Erro ao adicionar usuário:", error);
//       toast.error("Erro ao adicionar usuário!");
//     }
//   };

//   const handleEditSave = async (updatedUser) => {
//     try {
//       await updateDoc(doc(db, "Usuarios", updatedUser.id), updatedUser);
//       setEditingUser(null);
//       fetchUsers();
//       toast.success("Usuário atualizado com sucesso!");
//     } catch (error) {
//       console.error("Erro ao atualizar usuário:", error);
//       toast.error("Erro ao atualizar usuário!");
//     }
//   };

//   const handleDeleteConfirm = async () => {
//     try {
//       await deleteDoc(doc(db, "Usuarios", deleteUserId));
//       setDeleteUserId(null);
//       fetchUsers();
//       toast.warn("Usuário excluído com sucesso!");
//     } catch (error) {
//       console.error("Erro ao excluir usuário:", error);
//       toast.error("Erro ao excluir usuário!");
//     }
//   };

//   return (
//     <Content>
//       <Top>
//         <h1>Controle de Usuários</h1>
//         <button onClick={() => {
//           setIsAdding(true);
//           setEditingUser(null);
//         }}>
//           Adicionar novo usuário
//         </button>
//       </Top>
//       {loading ? (
//         <p>Carregando...</p>
//       ) : (
//         <Container>
//           {users.map((user) => (
//             <CardUser
//               key={user.id}
//               nome={user.nome}
//               login={user.login}
//               senha={user.senha}
//               onEdit={() => {
//                 setEditingUser(user);
//                 setIsAdding(false);
//               }}
//               onDelete={() => setDeleteUserId(user.id)}
//             />
//           ))}
//         </Container>
//       )}
//       {isAdding && (
//         <UserModal
//           userData={{}}
//           onSave={handleAddSave}
//           onCancel={() => setIsAdding(false)}
//         />
//       )}
//       {editingUser && (
//         <UserModal
//           userData={editingUser}
//           onSave={handleEditSave}
//           onCancel={() => setEditingUser(null)}
//         />
//       )}
//       {deleteUserId && (
//         <ConfirmDeleteModal
//           onConfirm={handleDeleteConfirm}
//           onCancel={() => setDeleteUserId(null)}
//         />
//       )}
//     </Content>
//   );
// };

// export default Usuarios;
