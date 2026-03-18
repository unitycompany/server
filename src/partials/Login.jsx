import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { createUserProfile } from "../../firebaseService";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";

// =================== ANIMATIONS ===================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;



// =================== LAYOUT ===================
const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
  font-family: "Montserrat", sans-serif;
`;

const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #ffffff;

  @media (max-width: 900px) {
    padding: 1.5rem;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 900px) {
    display: none;
  }
`;

const RightBgImage = styled.div`
  position: absolute;
  inset: 0;
  background-image: url('/public/bg-home.jpg');
  background-size: cover;
  background-position: center;
  z-index: 0;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.0) 100%);
  }
`;


const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 0.75rem;
  z-index: 2;
  text-align: left;
  padding: 3rem;
  width: 100%;
`;

const RightTitle = styled.h2`
  font-size: 1.85rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.25;
  max-width: 400px;
  letter-spacing: -0.5px;
`;

const RightDesc = styled.p`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  max-width: 400px;
  line-height: 1.6;
`;



// =================== FORM AREA ===================
const FormWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  animation: ${fadeIn} 0.35s ease-out;
`;

const Logo = styled.div`
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  gap: 10px;

  & img {
    width: 36px;
    height: auto;
  }

  & span {
    font-size: 0.95rem;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.3px;
  }
`;

const FormHeading = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
`;

const FormDesc = styled.p`
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 500;
  color: #475569;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.88rem;
  background: #ffffff;
  color: #0f172a;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  outline: none;
  transition: all 0.2s ease;
  font-family: "Montserrat", sans-serif;

  &::placeholder {
    color: #cbd5e1;
  }

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:hover:not(:focus) {
    border-color: #cbd5e1;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s;

  &:hover {
    color: #475569;
  }
`;

const InlineRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: -4px;
`;

const ForgotLink = styled.span`
  font-size: 0.78rem;
  font-weight: 500;
  color: #3b82f6;
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: #2563eb;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.85rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
  background: #0f172a;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Montserrat", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 0.5rem;

  &:hover {
    background: #1e293b;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0.75rem 0;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }

  & span {
    font-size: 0.75rem;
    color: #94a3b8;
    white-space: nowrap;
  }
`;

const BottomText = styled.p`
  text-align: center;
  font-size: 0.82rem;
  color: #94a3b8;
  margin-top: 1.5rem;

  & span {
    color: #3b82f6;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.15s;

    &:hover {
      color: #2563eb;
    }
  }
`;

const BackLink = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.15s;
  margin-bottom: 1.5rem;

  &:hover {
    color: #0f172a;
  }
`;

const PasswordHint = styled.p`
  font-size: 0.72rem;
  color: #94a3b8;
  margin-top: -4px;
`;

const SuccessBox = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;

  & p {
    color: #16a34a;
    font-size: 0.85rem;
    font-weight: 500;
  }

  & span {
    color: #4ade80;
    font-size: 0.78rem;
    display: block;
    margin-top: 6px;
  }
`;

const NameRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

// =================== VIEWS ===================

const LoginView = ({ onSwitch, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("lastLogin", Date.now());
      toast.success("Login realizado com sucesso!");
      onLoginSuccess(cred.user);
    } catch {
      toast.error("E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper key="login">
      <Logo><img src="/public/logo-unity-company.svg" alt="Unity Company" /><span>Unity Company</span></Logo>
      <FormHeading>Bem-vindo de volta!</FormHeading>
      <FormDesc>
        Entre com suas credenciais para acessar o painel administrativo.
      </FormDesc>
      <Form onSubmit={handleLogin}>
        <FieldGroup>
          <Label>E-mail</Label>
          <Input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </FieldGroup>
        <FieldGroup>
          <Label>Senha</Label>
          <InputWrapper>
            <Input
              type={showPw ? "text" : "password"}
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{ paddingRight: "3rem" }}
            />
            <PasswordToggle type="button" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
              {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </PasswordToggle>
          </InputWrapper>
        </FieldGroup>
        <InlineRow>
          <ForgotLink onClick={() => onSwitch("forgot")}>Esqueceu a senha?</ForgotLink>
        </InlineRow>
        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
          {!loading && <FiArrowRight size={16} />}
        </SubmitButton>
      </Form>
      <BottomText>
        Não tem uma conta? <span onClick={() => onSwitch("register")}>Criar agora</span>
      </BottomText>
    </FormWrapper>
  );
};

const RegisterView = ({ onSwitch, onLoginSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPw) {
      toast.error("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await createUserProfile(cred.user.uid, {
        nome: name,
        email,
        role: "franqueado",
        permissions: [],
      });
      localStorage.setItem("lastLogin", Date.now());
      toast.success("Conta criada com sucesso!");
      onLoginSuccess(cred.user);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Este e-mail já está em uso.");
      } else {
        toast.error("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper key="register">
      <Logo><img src="/public/logo-unity-company.svg" alt="Unity Company" /><span>Unity Company</span></Logo>
      <FormHeading>Criar conta</FormHeading>
      <FormDesc>
        Preencha seus dados para criar sua conta no painel.
      </FormDesc>
      <Form onSubmit={handleRegister}>
        <FieldGroup>
          <Label>Nome completo</Label>
          <Input
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </FieldGroup>
        <FieldGroup>
          <Label>E-mail</Label>
          <Input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </FieldGroup>
        <FieldGroup>
          <Label>Senha</Label>
          <InputWrapper>
            <Input
              type={showPw ? "text" : "password"}
              placeholder="Crie uma senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              style={{ paddingRight: "3rem" }}
            />
            <PasswordToggle type="button" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
              {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </PasswordToggle>
          </InputWrapper>
          <PasswordHint>Mínimo de 6 caracteres</PasswordHint>
        </FieldGroup>
        <FieldGroup>
          <Label>Confirmar senha</Label>
          <Input
            type={showPw ? "text" : "password"}
            placeholder="Repita a senha"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            required
            autoComplete="new-password"
          />
        </FieldGroup>
        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar conta"}
          {!loading && <FiArrowRight size={16} />}
        </SubmitButton>
      </Form>
      <BottomText>
        Já tem uma conta? <span onClick={() => onSwitch("login")}>Entrar</span>
      </BottomText>
    </FormWrapper>
  );
};

const ForgotView = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      toast.success("E-mail de redefinição enviado!");
    } catch {
      toast.error("Não foi possível enviar. Verifique o e-mail.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper key="forgot">
      <Logo><img src="/public/logo-unity-company.svg" alt="Unity Company" /><span>Unity Company</span></Logo>
      <BackLink onClick={() => onSwitch("login")}>
        ← Voltar ao login
      </BackLink>
      <FormHeading>Esqueceu a senha?</FormHeading>
      <FormDesc>
        Informe seu e-mail e enviaremos um link para redefinir sua senha.
      </FormDesc>
      {sent ? (
        <SuccessBox>
          <p>Link enviado com sucesso!</p>
          <span>Verifique sua caixa de entrada e spam.</span>
        </SuccessBox>
      ) : (
        <Form onSubmit={handleReset}>
          <FieldGroup>
            <Label>E-mail</Label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </FieldGroup>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar link de redefinição"}
          </SubmitButton>
        </Form>
      )}
    </FormWrapper>
  );
};

// =================== MAIN COMPONENT ===================

const Login = ({ onLoginSuccess }) => {
  const [view, setView] = useState("login");

  const renderView = () => {
    switch (view) {
      case "register":
        return <RegisterView onSwitch={setView} onLoginSuccess={onLoginSuccess} />;
      case "forgot":
        return <ForgotView onSwitch={setView} />;
      default:
        return <LoginView onSwitch={setView} onLoginSuccess={onLoginSuccess} />;
    }
  };

  return (
    <PageWrapper>
      <LeftPanel>
        {renderView()}
      </LeftPanel>

      <RightPanel>
        <RightBgImage />
        <RightContent>
          <RightTitle>
            Transforme ideias em resultados extraordinários.
          </RightTitle>
          <RightDesc>
            O sucesso é construído um passo de cada vez. Acesse suas ferramentas e faça acontecer.
          </RightDesc>
        </RightContent>
      </RightPanel>
    </PageWrapper>
  );
};

export default Login;