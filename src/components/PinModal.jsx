import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FiLock, FiShield, FiAlertCircle } from "react-icons/fi";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.2s ease;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  width: 360px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  animation: ${slideUp} 0.3s ease;
`;

const IconContainer = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${p => p.$error ? "#fef2f2" : "#f0f0ff"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.$error ? "#dc2626" : "#4f46e5"};
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
  text-align: center;
`;

const Description = styled.p`
  font-size: 13px;
  color: #94a3b8;
  text-align: center;
  margin: 0;
  line-height: 1.5;
`;

const PinInputContainer = styled.div`
  display: flex;
  gap: 10px;
  animation: ${p => p.$shake ? shake : "none"} 0.4s ease;
`;

const PinDigit = styled.input`
  width: 52px;
  min-width: 52px;
  max-width: 52px;
  height: 58px;
  border: 2px solid ${p => p.$error ? "#fca5a5" : p.$filled ? "#4f46e5" : "#e2e8f0"};
  border-radius: 12px;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  font-family: "Montserrat", monospace;
  outline: none;
  transition: all 0.2s ease;
  color: #0f172a;
  -webkit-text-security: disc;
  box-sizing: border-box;
  padding: 0;
  background: #fff;
  flex-shrink: 0;

  &:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  &::placeholder {
    color: #cbd5e1;
  }
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: none;
  background: #0f172a;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;

  &:hover { background: #1e293b; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.15s;

  &:hover { color: #0f172a; }
`;

/**
 * PinModal — Modal para inserir PIN de 4 dígitos
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onSubmit - recebe o PIN digitado
 * @param {function} props.onCancel - chamado ao cancelar
 * @param {string} props.title - título personalizado
 * @param {string} props.description - descrição personalizada
 * @param {boolean} props.showCancel - mostra botão cancelar
 */
const PinModal = ({ isOpen, onSubmit, onCancel, title, description, showCancel = true }) => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (isOpen) {
      setPin(["", "", "", ""]);
      setError("");
      setTimeout(() => inputRefs[0].current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError("");

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pasted.length === 4) {
      const newPin = pasted.split("");
      setPin(newPin);
      inputRefs[3].current?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullPin = pin.join("");
    if (fullPin.length !== 4) {
      setError("Digite os 4 dígitos do PIN.");
      return;
    }
    const result = await onSubmit(fullPin);
    if (result === false) {
      setError("PIN incorreto. Tente novamente.");
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      setPin(["", "", "", ""]);
      setTimeout(() => inputRefs[0].current?.focus(), 100);
    }
  };

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && showCancel && onCancel?.()}>
      <Card>
        <IconContainer $error={!!error}>
          {error ? <FiAlertCircle size={26} /> : <FiLock size={26} />}
        </IconContainer>
        <Title>{title || "Verificação de PIN"}</Title>
        <Description>
          {description || "Digite seu PIN de 4 dígitos para acessar esta informação."}
        </Description>
        <PinInputContainer $shake={shaking}>
          {pin.map((digit, i) => (
            <PinDigit
              key={i}
              ref={inputRefs[i]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              $filled={!!digit}
              $error={!!error}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              autoComplete="off"
            />
          ))}
        </PinInputContainer>
        {error && <ErrorText><FiAlertCircle size={12} /> {error}</ErrorText>}
        <ActionButton onClick={handleSubmit} disabled={pin.join("").length !== 4}>
          Verificar PIN
        </ActionButton>
        {showCancel && <CancelButton onClick={onCancel}>Cancelar</CancelButton>}
      </Card>
    </Overlay>
  );
};

/**
 * PinSetup — Modal para CRIAR PIN de 4 dígitos (com confirmação)
 */
export const PinSetup = ({ isOpen, onComplete, userEmail }) => {
  const [step, setStep] = useState(1); // 1 = criar, 2 = confirmar
  const [pin1, setPin1] = useState(["", "", "", ""]);
  const [pin2, setPin2] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);
  const refs1 = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const refs2 = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPin1(["", "", "", ""]);
      setPin2(["", "", "", ""]);
      setError("");
      setTimeout(() => refs1[0].current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const activePin = step === 1 ? pin1 : pin2;
  const setActivePin = step === 1 ? setPin1 : setPin2;
  const activeRefs = step === 1 ? refs1 : refs2;

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newPin = [...activePin];
    newPin[index] = value;
    setActivePin(newPin);
    setError("");

    if (value && index < 3) {
      activeRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !activePin[index] && index > 0) {
      activeRefs[index - 1].current?.focus();
    }
    if (e.key === "Enter") {
      handleNext();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pasted.length === 4) {
      setActivePin(pasted.split(""));
      activeRefs[3].current?.focus();
    }
  };

  const handleNext = () => {
    const fullPin = activePin.join("");
    if (fullPin.length !== 4) {
      setError("Digite os 4 dígitos.");
      return;
    }

    if (step === 1) {
      setStep(2);
      setPin2(["", "", "", ""]);
      setTimeout(() => refs2[0].current?.focus(), 100);
    } else {
      if (pin1.join("") !== pin2.join("")) {
        setError("Os PINs não coincidem. Tente novamente.");
        setShaking(true);
        setTimeout(() => setShaking(false), 400);
        setStep(1);
        setPin1(["", "", "", ""]);
        setPin2(["", "", "", ""]);
        setTimeout(() => refs1[0].current?.focus(), 100);
        return;
      }
      onComplete(fullPin);
    }
  };

  return (
    <Overlay>
      <Card>
        <IconContainer>
          <FiShield size={26} />
        </IconContainer>
        <Title>{step === 1 ? "Criar PIN de Segurança" : "Confirme seu PIN"}</Title>
        <Description>
          {step === 1
            ? "Crie um PIN de 4 dígitos para proteger informações sensíveis. Memorize-o bem — se esquecer, precisará solicitar a um administrador."
            : "Digite novamente o PIN para confirmar."
          }
        </Description>
        {userEmail && (
          <Description style={{ fontSize: "11px", color: "#64748b", fontWeight: 500 }}>
            Conta: {userEmail}
          </Description>
        )}
        <PinInputContainer $shake={shaking}>
          {activePin.map((digit, i) => (
            <PinDigit
              key={`${step}-${i}`}
              ref={activeRefs[i]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              $filled={!!digit}
              $error={!!error}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              autoComplete="off"
            />
          ))}
        </PinInputContainer>
        {error && <ErrorText><FiAlertCircle size={12} /> {error}</ErrorText>}
        <ActionButton onClick={handleNext} disabled={activePin.join("").length !== 4}>
          {step === 1 ? "Próximo" : "Confirmar PIN"}
        </ActionButton>
        <Description style={{ fontSize: "11px", color: "#f59e0b", fontWeight: 500 }}>
          ⚠️ Guarde seu PIN! Se esquecer, apenas um administrador poderá resetá-lo.
        </Description>
      </Card>
    </Overlay>
  );
};

export default PinModal;
