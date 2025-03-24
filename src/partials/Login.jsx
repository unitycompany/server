// Login.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { toast } from "react-toastify";

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #121212;
`;

const LoginForm = styled.form`
  background-color: #1e1e1e;
  padding: 2rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
`;

const Label = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-family: sans-serif;
`;

const Input = styled.input`
  padding: 0.5rem 0.75rem;
  width: 240px;
  font-size: 14px;
  background-color: #171616;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  outline: none;
  transition: 0.2s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const Button = styled.button`
  padding: 0.5rem;
  background-color: #2563eb;
  color: white;
  font-weight: bold;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('lastLogin', Date.now());
      toast.success("Login realizado com sucesso!");
      onLoginSuccess(userCredential.user);
    } catch (error) {
      toast.error("Erro ao fazer login: " + error.message);
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleLogin}>
        <Label>Email</Label>
        <Input type="email" placeholder="Digite seu e-mail..." value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        
        <Label>Senha</Label>
        <Input type="password" placeholder="Digite sua senha..." value={password}
          onChange={(e) => setPassword(e.target.value)} required />

        <Button type="submit">Entrar</Button>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;