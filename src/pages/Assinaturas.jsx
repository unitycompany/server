import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch, FaEdit, FaTrash, FaPlus, FaFileExcel, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { getAssinaturas, addAssinatura, editAssinatura, removeAssinatura } from "./../../firebaseService";
import * as XLSX from 'xlsx';

// Configuração do modal
Modal.setAppElement("#root");

// Styled Components
const Content = styled.div`
  padding: 0 2.5% 2.5% 2.5%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: flex-start;
  gap: 10px;
  width: 100%;
  overflow-y: auto;
  max-height: 80vh;
  position: relative;

  & h1 {
    font-weight: 600;
  }
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #000;
  padding: 5px 0px;
  position: sticky;
  top: 0;
  background-color: #ffffff;
  box-shadow: 0 0 50px rgba(255,255,255, 1);
  z-index: 1;

  & > aside {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  
  & button {
    padding: 5px 15px;
    background-color: #000000;
    border: 2px solid #727272;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;

    &:hover {
      background-color: #00ff2a1f;
      color: #000;
    }
  }
`;

const FilterContainer = styled.div`
  width: auto;
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 10px 0;

  & div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    width: auto;
    height: auto;
    border: 1px solid #00000050;
    padding: 5px;

    & svg {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      opacity: 0.5;
    }

    & input {
      font-size: 12px;
      border: none;
      outline: none;
    }
  }

  & select {
    padding: 5px;
    font-size: 12px;
    border: 1px solid #00000050;
  }
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 2px solid #000;
  border-radius: 0;
  background-color: #fff;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  th, td {
    padding: 6px 16px;
    text-align: left;
    border-right: 1px solid #000;
    border-bottom: 1px solid #000;
    vertical-align: middle;
    
    &:last-child {
      border-right: none;
    }
  }

  th {
    background-color: #f0f0f0;
    font-weight: 700;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: sticky;
    top: 0;
    z-index: 2;
    border-bottom: 2px solid #000;
  }

  td {
    font-size: 14px;
    background-color: #fff;
  }

  tr:nth-child(even) td {
    background-color: #f9f9f9;
  }

  tr:hover td {
    background-color: #e3f2fd;
  }

  .actions {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
  }

  .action-btn {
    padding: 8px;
    border: 1px solid #000;
    border-radius: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    background-color: #fff;
    
    &:hover {
      transform: scale(1.1);
    }

    &.edit {
      color: #1976d2;
      border-color: #1976d2;
      &:hover { 
        background-color: #1976d2; 
        color: #fff;
      }
    }

    &.delete {
      color: #d32f2f;
      border-color: #d32f2f;
      &:hover { 
        background-color: #d32f2f; 
        color: #fff;
      }
    }
  }

  .status-badge {
    padding: 6px 10px;
    border-radius: 0;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    border: 1px solid;
    display: inline-block;
    text-align: center;

    &.ativo {
      background-color: #c8e6c9;
      color: #2e7d32;
      border-color: #4caf50;
    }

    &.inativo {
      background-color: #ffcdd2;
      color: #c62828;
      border-color: #f44336;
    }

    &.suspenso {
      background-color: #fff3e0;
      color: #ef6c00;
      border-color: #ff9800;
    }
  }

  .valor-cell {
    font-weight: 600;
    color: #2e7d32;
  }

  .empresa-cell {
    font-weight: 400;
    color: #1d1d1b;
  }

  .link-cell {
    color: #1976d2;
    text-decoration: underline;
    cursor: pointer;
    
    &:hover {
      color: #0d47a1;
    }
  }
`;

const ModalContent = styled.div`
  background: white;
  width: 600px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  outline: none;
  height: auto;
  max-height: 85vh;
  overflow-y: auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  border-radius: 8px;

  h2 {
    font-size: 20px;
    font-weight: 500;
    width: 100%;
    border-bottom: 1px solid #1d1d1b;
    padding: 0 0 15px 0;
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    color: #1d1d1b;
  }

  .form-section {
    background: #f8f9fa;
    padding: 15px;
    border: 1px solid #e9ecef;

    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #495057;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  .form-row {
    display: flex;
    gap: 15px;
    align-items: flex-end;
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    position: relative;

    &.full-width {
      width: 100%;
    }

    label {
      font-size: 13px;
      font-weight: 500;
      color: #495057;
      display: flex;
      align-items: center;
      gap: 5px;

      .required {
        color: #dc3545;
        font-size: 14px;
      }
    }

    input, select, textarea {
      padding: 12px 15px;
      border: 1px solid #e9ecef;
      font-size: 14px;
      background: white;
      transition: all 0.2s ease;

      &:focus {
        outline: none;
      }

      &:hover {
        border-color: #1d1d1b;
      }

      &::placeholder {
        color: #adb5bd;
        font-style: italic;
      }
    }

    textarea {
      resize: vertical;
      min-height: 80px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .input-help {
      font-size: 11px;
      color: #6c757d;
      margin-top: -3px;
      margin-left: 3px;
      margin-bottom: 10px;
      font-style: italic;
    }
  }

  .checkbox-group {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 10px;
    margin-bottom: 15px;
    border: 1px solid #1d1d1b20;
    background-color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    input[type="checkbox"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
      accent-color: #007bff;
      border: 2px solid #007bff;
      border-radius: 3px;
      appearance: auto;
      -webkit-appearance: checkbox;
      -moz-appearance: checkbox;
    }

    label {
      cursor: pointer;
      margin: 0;
      font-size: 15px;
      font-weight: 400;
      color: #2c3e50;
      position: relative;
      z-index: 1;

      .help-text {
        display: none;
        font-size: 12px;
        font-weight: 400;
        color: #6c757d;
        margin-top: 2px;
        font-style: italic;
      }
    }
  }

  .button-group {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    flex-direction: row-reverse;
    margin-top: 10px;
    padding-top: 20px;
    border-top: 1px solid #e9ecef;

    button {
      padding: 12px 24px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 400;
      transition: all 0.2s ease;
      min-width: 100px;

      &.primary {
        background: #2f8f02;
        color: white;

        &:hover { 
          background: #1d5c00;
          transform: translateY(-1px);
        }

        &:active {
          transform: translateY(0);
        }
      }

      &.secondary {
        background: #6c757d;
        color: white;

        &:hover { 
          background: #545b62;
          transform: translateY(-1px);
        }

        &:active {
          transform: translateY(0);
        }
      }
    }
  }
`;

const StatusSelect = styled.select`
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &:hover {
    border-color: #007bff;
  }

  option {
    font-weight: 600;
    text-transform: uppercase;
    padding: 8px;
  }

  option[value="ativo"] {
    background-color: #c8e6c9;
    color: #2e7d32;
  }

  option[value="inativo"] {
    background-color: #ffcdd2;
    color: #c62828;
  }

  option[value="suspenso"] {
    background-color: #fff3e0;
    color: #ef6c00;
  }

  &[data-status="ativo"] {
    background-color: #c8e6c9;
    color: #2e7d32;
    border-color: #4caf50;
  }

  &[data-status="inativo"] {
    background-color: #ffcdd2;
    color: #c62828;
    border-color: #f44336;
  }

  &[data-status="suspenso"] {
    background-color: #fff3e0;
    color: #ef6c00;
    border-color: #ff9800;
  }
`;

const ModalExcluir = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  width: 100%;
  height: 100%;
  padding: 20px;
  
  h2 {
    font-size: 18px;
    font-weight: 600;
    width: 100%;
    border-bottom: 1px solid #00000020;
    padding: 5px 0 5px 0;
    margin: 0 0 15px 0;
  }
  
  p {
    font-size: 14px;
    padding: 10px 0;
    margin: 0;
    flex: 1;
  }
  
  .button-group {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 10px 0;
    width: 100%;
    
    button {
      padding: 8px 16px;
      cursor: pointer;
      border: 1px solid #000;
      text-transform: uppercase;
      font-size: 13px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      border-radius: 4px;
      transition: all 0.2s ease;
      
      &.delete {
        background-color: #dc3545;
        color: #fff;
        border-color: #dc3545;
        &:hover { background-color: #c82333; }
      }
      
      &.cancel {
        background-color: #6c757d;
        color: #fff;
        border-color: #6c757d;
        &:hover { background-color: #545b62; }
      }
    }
  }
`;

const ResumoFinanceiro = styled.div`
  width: 100%;
  margin: 20px 0;
  padding: 20px 20px 0 20px;
  border: 2px solid #000;
  background-color: #f8f9fa;
  transition: all 0.3s ease;

  h3 {
    margin: 0 0 15px 0;
    font-size: 16px;
    font-weight: 400;
    color: #000;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding-bottom: 10px;
    border-bottom: 1px solid #00000020;
    
    .title-content {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      
      .toggle-button {
        background: none;
        border: none;
        color: #000;
        font-size: 14px;
        cursor: pointer;
        padding: 5px;
        border-radius: 3px;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
          background-color: #00000010;
          color: #007bff;
        }
      }
    }
  }

  .resumo-content {
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    padding-bottom: 20px;
    
    &.collapsed {
      max-height: 0;
      padding-bottom: 0;
      opacity: 0;
      transform: translateY(-10px);
    }
    
    &.expanded {
      max-height: 500px;
      opacity: 1;
      transform: translateY(0);
    }
  }

  .resumo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-top: 15px;
  }

  .resumo-item {
    background: #fff;
    padding: 15px;
    border: 1px solid #000;
    border-radius: 0;
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .label {
      font-size: 12px;
      font-weight: 500;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 5px;
    }

    .valor {
      font-size: 16px;
      font-weight: 500;
      color: #2e7d32;
    }

    .quantidade {
      font-size: 16px;
      color: #1565c0;
      font-weight: 500;
      margin-top: 5px;
    }
  }
`;

const ExportButton = styled.button`
  background: #2e7d32;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;

  &:hover {
    background: #1b5e20;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Nome do banco de dados
const dbName = "default";

const Assinaturas = () => {
  const [assinaturas, setAssinaturas] = useState([]);
  const [reload, setReload] = useState(false);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [assinaturaToDelete, setAssinaturaToDelete] = useState(null);

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [empresaFilter, setEmpresaFilter] = useState("");
  
  // Estado para controlar expansão do resumo financeiro
  const [resumoExpanded, setResumoExpanded] = useState(true);
  
  // Estado para cotação do dólar
  const [cotacaoDolar, setCotacaoDolar] = useState(5.50); // Valor base

  // Estado da nova assinatura
  const [newAssinatura, setNewAssinatura] = useState({
    nome: "",
    mensalidade: "",
    status: "ativo",
    acesso: "https://",
    empresa: "",
    tipoPagamento: "mensal", // mensal ou anual
    moedaInput: "real", // moeda para entrada (real ou dolar)
    valorRelativo: false,
    valorMin: "",
    valorMax: ""
  });

  // Estado de edição
  const [editAssinaturaData, setEditAssinaturaData] = useState({
    id: "",
    nome: "",
    mensalidade: "",
    status: "ativo",
    acesso: "https://",
    empresa: "",
    tipoPagamento: "mensal",
    moedaInput: "real",
    valorRelativo: false,
    valorMin: "",
    valorMax: ""
  });

  // Função para migrar valores em dólar para reais
  const migrarValoresDolarParaReal = useCallback(async (assinaturas) => {
    const assinaturasParaMigrar = [];
    
    assinaturas.forEach(assinatura => {
      if (assinatura.moeda === "dolar") {
        const assinaturaMigrada = {
          ...assinatura,
          moeda: "real" // Remove a referência ao dólar
        };
        
        // Converte mensalidade se existir
        if (assinatura.mensalidade && assinatura.mensalidade !== "") {
          const valorEmReal = converterDolarParaReal(parseFloat(assinatura.mensalidade));
          assinaturaMigrada.mensalidade = valorEmReal.toFixed(2);
        }
        
        // Converte valores mínimo e máximo se existirem
        if (assinatura.valorMin && assinatura.valorMin !== "") {
          const valorMinEmReal = converterDolarParaReal(parseFloat(assinatura.valorMin));
          assinaturaMigrada.valorMin = valorMinEmReal.toFixed(2);
        }
        
        if (assinatura.valorMax && assinatura.valorMax !== "") {
          const valorMaxEmReal = converterDolarParaReal(parseFloat(assinatura.valorMax));
          assinaturaMigrada.valorMax = valorMaxEmReal.toFixed(2);
        }
        
        assinaturasParaMigrar.push(assinaturaMigrada);
      }
    });
    
    // Atualiza as assinaturas que precisam ser migradas
    for (const assinatura of assinaturasParaMigrar) {
      try {
        await editAssinatura(dbName, assinatura.id, assinatura);
        console.log(`Assinatura ${assinatura.nome} migrada de dólar para real`);
      } catch (error) {
        console.error(`Erro ao migrar assinatura ${assinatura.nome}:`, error);
      }
    }
    
    if (assinaturasParaMigrar.length > 0) {
      toast.success(`${assinaturasParaMigrar.length} assinaturas foram convertidas de dólar para real automaticamente!`);
      return true; // Indica que houve migração
    }
    
    return false; // Nenhuma migração necessária
  }, [cotacaoDolar]);

  // Funções CRUD para Assinaturas (importadas do firebaseService)
  const fetchAssinaturas = useCallback(async () => {
    try {
      const data = await getAssinaturas(dbName);
      // Verificação de segurança para garantir que data seja um array
      const assinaturasArray = Array.isArray(data) ? data : [];
      
      // Verificar se há assinaturas em dólar que precisam ser migradas
      const houveMigracao = await migrarValoresDolarParaReal(assinaturasArray);
      
      // Se houve migração, buscar os dados atualizados
      if (houveMigracao) {
        const dadosAtualizados = await getAssinaturas(dbName);
        setAssinaturas(Array.isArray(dadosAtualizados) ? dadosAtualizados : []);
      } else {
        setAssinaturas(assinaturasArray);
      }
    } catch (error) {
      console.error("Erro ao buscar assinaturas:", error);
      setAssinaturas([]);
    }
  }, [migrarValoresDolarParaReal]);

  // Função para buscar cotação do dólar uma vez por dia
  const buscarCotacaoDolar = useCallback(async () => {
    const hoje = new Date().toDateString();
    const cotacaoSalva = localStorage.getItem('cotacaoDolar');
    const dataUltimaAtualizacao = localStorage.getItem('dataCotacao');
    
    if (cotacaoSalva && dataUltimaAtualizacao === hoje) {
      setCotacaoDolar(parseFloat(cotacaoSalva));
      return;
    }

    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      const cotacao = data.rates.BRL;
      
      if (cotacao) {
        setCotacaoDolar(cotacao);
        localStorage.setItem('cotacaoDolar', cotacao.toString());
        localStorage.setItem('dataCotacao', hoje);
      }
    } catch (error) {
      console.warn('Erro ao buscar cotação do dólar, usando valor base:', error);
      // Mantém o valor base de 5.50 se não conseguir buscar
    }
  }, []);

  useEffect(() => {
    buscarCotacaoDolar();
    fetchAssinaturas();
  }, [buscarCotacaoDolar, fetchAssinaturas, reload]);

  // Função para converter dólar para real
  const converterDolarParaReal = (valorDolar) => {
    if (!valorDolar || isNaN(parseFloat(valorDolar))) return 0;
    return parseFloat(valorDolar) * cotacaoDolar;
  };

  // Função para formatar valores monetários automaticamente (apenas em reais)
  const formatarValorInput = (valor, moedaInput = "real") => {
    if (!valor) return "";
    
    // Remove tudo que não é número
    const numeroLimpo = valor.toString().replace(/[^\d]/g, "");
    
    if (!numeroLimpo) return "";
    
    // Converte para centavos
    const numeroEmCentavos = parseInt(numeroLimpo);
    
    // Converte de volta para reais/dólares (para exibição)
    const valorFormatado = (numeroEmCentavos / 100).toFixed(2);
    
    // Formatar com separador de milhares
    const partes = valorFormatado.split(".");
    const inteiro = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const decimal = partes[1];
    
    // Sempre exibe com símbolo da moeda de entrada para que o usuário veja
    const simbolo = moedaInput === "dolar" ? "$ " : "R$ ";
    
    return simbolo + inteiro + "," + decimal;
  };

  // Função para extrair valor numérico da máscara e converter se necessário
  const extrairValorNumerico = (valorMascarado, moedaOriginal = "real") => {
    if (!valorMascarado) return "";
    // Remove símbolos e converte vírgula para ponto
    const numero = valorMascarado
      .replace(/[R$\s.]/g, "")
      .replace(",", ".");
    
    const valorNumerico = parseFloat(numero);
    
    // Se o valor foi digitado em dólar, converte para real
    if (moedaOriginal === "dolar" && !isNaN(valorNumerico)) {
      return converterDolarParaReal(valorNumerico).toFixed(2);
    }
    
    return numero;
  };

  // Função para validar e formatar valor antes de salvar (sempre em reais)
  const validarValor = (valorMascarado, moedaOriginal = "real") => {
    if (!valorMascarado) return "";
    const numeroLimpo = extrairValorNumerico(valorMascarado, moedaOriginal);
    const numeroFloat = parseFloat(numeroLimpo);
    return isNaN(numeroFloat) ? "" : numeroFloat.toFixed(2);
  };

  // Filtrando as assinaturas
  const filteredAssinaturas = (Array.isArray(assinaturas) ? assinaturas : []).filter((assinatura) => {
    // Verificações de segurança para evitar erros
    if (!assinatura || typeof assinatura !== 'object') return false;
    
    const nome = assinatura.nome || "";
    const status = assinatura.status || "";
    const empresa = assinatura.empresa || "";
    
    const matchNome = nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter ? status === statusFilter : true;
    const matchEmpresa = empresaFilter ? empresa === empresaFilter : true;
    
    return matchNome && matchStatus && matchEmpresa;
  });

  const handleAddAssinatura = async () => {
    if (!newAssinatura.nome || !newAssinatura.acesso || !newAssinatura.empresa) {
      toast.error("Preencha nome, empresa e acesso!");
      return;
    }

    // Validação para valores relativos
    if (newAssinatura.valorRelativo && (!newAssinatura.valorMin || !newAssinatura.valorMax)) {
      toast.error("Para variação de custo, preencha o valor mínimo e máximo!");
      return;
    }

    // Formatar valores antes de salvar (todos em reais após conversão)
    const assinaturaFormatada = {
      ...newAssinatura,
      mensalidade: validarValor(newAssinatura.mensalidade, newAssinatura.moedaInput),
      valorMin: validarValor(newAssinatura.valorMin, newAssinatura.moedaInput),
      valorMax: validarValor(newAssinatura.valorMax, newAssinatura.moedaInput)
    };

    // Remove o campo moedaInput antes de salvar (não precisamos salvar isso)
    delete assinaturaFormatada.moedaInput;

    await addAssinatura(dbName, assinaturaFormatada);
    setNewAssinatura({
      nome: "",
      mensalidade: "",
      status: "ativo",
      acesso: "https://",
      empresa: "",
      tipoPagamento: "mensal",
      moedaInput: "real",
      valorRelativo: false,
      valorMin: "",
      valorMax: ""
    });
    setModalAddIsOpen(false);
    toast.success("Assinatura adicionada com sucesso!");
    setReload((prev) => !prev);
  };

  const handleRemoveAssinatura = async () => {
    if (assinaturaToDelete) {
      await removeAssinatura(dbName, assinaturaToDelete);
      setDeleteModal(false);
      toast.warn("Assinatura removida!");
      setReload((prev) => !prev);
    }
  };

  const openEditModal = (assinatura) => {
    // Formatar valores existentes para exibição (todos em reais)
    const mensalidadeFormatada = assinatura.mensalidade ? 
      formatarValorInput(assinatura.mensalidade.toString()) : "";
    const valorMinFormatado = assinatura.valorMin ? 
      formatarValorInput(assinatura.valorMin.toString()) : "";
    const valorMaxFormatado = assinatura.valorMax ? 
      formatarValorInput(assinatura.valorMax.toString()) : "";

    setEditAssinaturaData({
      id: assinatura.id,
      nome: assinatura.nome || "",
      mensalidade: mensalidadeFormatada,
      status: assinatura.status || "ativo",
      acesso: assinatura.acesso || "https://",
      empresa: assinatura.empresa || "",
      tipoPagamento: assinatura.tipoPagamento || "mensal",
      moedaInput: "real", // Sempre real para edição, já que os valores já estão em reais
      valorRelativo: assinatura.valorRelativo || false,
      valorMin: valorMinFormatado,
      valorMax: valorMaxFormatado
    });
    setModalEditIsOpen(true);
  };

  const handleEditAssinatura = async () => {
    const { id, ...dataToUpdate } = editAssinaturaData;
    if (!dataToUpdate.nome || !dataToUpdate.acesso || !dataToUpdate.empresa) {
      toast.error("Preencha nome, empresa e acesso!");
      return;
    }

    // Validação para valores relativos
    if (dataToUpdate.valorRelativo && (!dataToUpdate.valorMin || !dataToUpdate.valorMax)) {
      toast.error("Para variação de custo, preencha o valor mínimo e máximo!");
      return;
    }

    // Formatar valores antes de salvar (conversão se necessário)
    const dataFormatada = {
      ...dataToUpdate,
      mensalidade: validarValor(dataToUpdate.mensalidade, dataToUpdate.moedaInput),
      valorMin: validarValor(dataToUpdate.valorMin, dataToUpdate.moedaInput),
      valorMax: validarValor(dataToUpdate.valorMax, dataToUpdate.moedaInput)
    };

    // Remove o campo moedaInput antes de salvar
    delete dataFormatada.moedaInput;

    await editAssinatura(dbName, id, dataFormatada);
    toast.success("Assinatura atualizada com sucesso!");
    setModalEditIsOpen(false);
    setReload((prev) => !prev);
  };

  const formatarValor = (assinatura) => {
    // Verificações de segurança
    if (!assinatura) return "Não informado";
    
    const simboloMoeda = "R$"; // Sempre em reais agora
    const sufixo = assinatura.tipoPagamento === "anual" ? "/ano" : "/mês";

    if (assinatura.valorRelativo && assinatura.valorMin && assinatura.valorMax) {
      return `${simboloMoeda} ${assinatura.valorMin} - ${assinatura.valorMax} ${sufixo}`;
    }
    
    if (assinatura.mensalidade && assinatura.mensalidade !== "") {
      return `${simboloMoeda} ${assinatura.mensalidade} ${sufixo}`;
    }

    return "Não informado";
  };

  // Função para calcular o valor numérico de uma assinatura
  const calcularValorNumerico = (assinatura) => {
    if (!assinatura) return 0;
    
    let valor = 0;
    
    if (assinatura.valorRelativo && assinatura.valorMin && assinatura.valorMax) {
      // Para valores relativos, usa a média
      valor = (parseFloat(assinatura.valorMin) + parseFloat(assinatura.valorMax)) / 2;
    } else if (assinatura.mensalidade && assinatura.mensalidade !== "") {
      valor = parseFloat(assinatura.mensalidade);
    }
    
    // Converte anual para mensal para padronizar
    if (assinatura.tipoPagamento === "anual") {
      valor = valor / 12;
    }
    
    return isNaN(valor) ? 0 : valor;
  };

  // Função para calcular totais (apenas em reais agora)
  const calcularTotais = () => {
    const assinaturasAtivas = filteredAssinaturas.filter(a => a.status === "ativo");
    
    let totalMensalReal = 0;
    
    assinaturasAtivas.forEach(assinatura => {
      const valor = calcularValorNumerico(assinatura);
      totalMensalReal += valor;
    });
    
    return {
      quantidadeAtivos: assinaturasAtivas.length,
      totalMensalReal,
      totalAnualReal: totalMensalReal * 12
    };
  };

  // Função para exportar para Excel (.xlsx)
  const exportarParaExcel = () => {
    // Preparar informações dos filtros aplicados
    const filtrosAplicados = [];
    
    // Adicionar título dos filtros
    filtrosAplicados.push(["FILTROS APLICADOS NA EXPORTAÇÃO"]);
    filtrosAplicados.push([]); // Linha em branco
    
    // Verificar quais filtros estão ativos
    if (searchTerm && searchTerm.trim() !== "") {
      filtrosAplicados.push(["Busca por Nome:", searchTerm]);
    }
    
    if (statusFilter && statusFilter !== "") {
      const statusNomes = {
        "ativo": "Ativo",
        "inativo": "Inativo", 
        "suspenso": "Suspenso"
      };
      filtrosAplicados.push(["Filtro de Status:", statusNomes[statusFilter] || statusFilter]);
    }
    
    if (empresaFilter && empresaFilter !== "") {
      filtrosAplicados.push(["Filtro de Empresa:", empresaFilter]);
    }
    
    // Se nenhum filtro estiver aplicado
    if (!searchTerm && !statusFilter && !empresaFilter) {
      filtrosAplicados.push(["Nenhum filtro aplicado", "Exibindo todas as assinaturas"]);
    }
    
    filtrosAplicados.push([]); // Linha em branco
    filtrosAplicados.push(["Data da Exportação:", new Date().toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })]);
    
    filtrosAplicados.push([]); // Linha em branco
    filtrosAplicados.push([]); // Linha em branco

    const headers = [
      "Nome",
      "Empresa", 
      "Valor",
      "Status",
      "Acesso",
      "Tipo de Pagamento"
    ];
    
    const dados = filteredAssinaturas.map(assinatura => [
      assinatura.nome || "",
      assinatura.empresa || "",
      formatarValor(assinatura),
      assinatura.status || "",
      assinatura.acesso || "",
      assinatura.tipoPagamento || ""
    ]);
    
    // Combinar filtros + headers + dados
    const dadosCompletos = [...filtrosAplicados, headers, ...dados];
    
    // Criar planilha com todos os dados
    const ws = XLSX.utils.aoa_to_sheet(dadosCompletos);
    
    // Calcular posição do resumo financeiro (considerando as linhas de filtros)
    const filtrosLinhas = filtrosAplicados.length;
    const resumoInicio = filtrosLinhas + dados.length + 4; // +4 para espaço após os dados
    
    // Adicionar resumo financeiro no final
    const totais = calcularTotais();
    
    // Adicionar título do resumo
    XLSX.utils.sheet_add_aoa(ws, [["RESUMO FINANCEIRO"]], { origin: `A${resumoInicio}` });
    
    // Adicionar dados do resumo (apenas em reais)
    const resumoData = [
      ["Assinaturas Ativas", totais.quantidadeAtivos],
      ["Total Mensal (R$)", `R$ ${totais.totalMensalReal.toFixed(2)}`],
      ["Total Anual (R$)", `R$ ${totais.totalAnualReal.toFixed(2)}`]
    ];
    
    XLSX.utils.sheet_add_aoa(ws, resumoData, { origin: `A${resumoInicio + 1}` });
    
    // Aplicar formatação
    const range = XLSX.utils.decode_range(ws['!ref']);
    
    // Formatação do título dos filtros (primeira linha)
    const tituloFiltrosCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
    if (ws[tituloFiltrosCell]) {
      ws[tituloFiltrosCell].s = {
        font: { bold: true, size: 14 },
        fill: { fgColor: { rgb: "FFEB3B" } },
        alignment: { horizontal: "center" }
      };
    }
    
    // Formatação do cabeçalho da tabela (na linha após os filtros)
    const headerRow = filtrosLinhas;
    for (let col = range.s.c; col <= Math.min(range.e.c, headers.length - 1); col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: col });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "EFEFEF" } },
        alignment: { horizontal: "center" }
      };
    }
    
    // Formatação do título do resumo financeiro
    const resumoTituloCell = XLSX.utils.encode_cell({ r: resumoInicio, c: 0 });
    if (ws[resumoTituloCell]) {
      ws[resumoTituloCell].s = {
        font: { bold: true, size: 12 },
        fill: { fgColor: { rgb: "C8E6C9" } }
      };
    }
    
    // Ajustar largura das colunas (sem coluna de moeda)
    const colWidths = [
      { wch: 30 }, // Nome / Filtros
      { wch: 25 }, // Empresa / Valores dos filtros
      { wch: 18 }, // Mensalidade
      { wch: 12 }, // Status
      { wch: 35 }, // Acesso
      { wch: 18 }  // Tipo Pagamento
    ];
    ws['!cols'] = colWidths;
    
    // Criar workbook e adicionar a planilha
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Assinaturas");
    
    // Gerar nome do arquivo com indicação de filtros
    let suffixFiltro = "";
    if (searchTerm || statusFilter || empresaFilter) {
      suffixFiltro = "_filtrado";
    }
    const fileName = `assinaturas${suffixFiltro}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success(`Planilha Excel exportada com sucesso! ${filteredAssinaturas.length} registros exportados.`);
  };

  const totais = calcularTotais();

  return (
    <>
      <Content>
        <Top>
          <h1>Assinaturas</h1>

          <FilterContainer>
            <div>
              <FaSearch />
              <input
                type="text"
                placeholder="Buscar por nome"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos os Status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="suspenso">Suspenso</option>
            </select>
            <select
              value={empresaFilter}
              onChange={(e) => setEmpresaFilter(e.target.value)}
            >
              <option value="">Todas as Empresas</option>
              <option value="Unity">Unity</option>
              <option value="Nova Metálica">Nova Metálica</option>
              <option value="Fast Sistemas Construtivos">Fast Sistemas Construtivos</option>
              <option value="Fast Homes">Fast Homes</option>
              <option value="Pousada Le Ange">Pousada Le Ange</option>
              <option value="Milena">Milena</option>
            </select>
          </FilterContainer>

          <aside>
            <button onClick={() => setModalAddIsOpen(true)}>
              <FaPlus style={{ marginRight: "5px" }} />
              Nova Assinatura
            </button>
          </aside>
        </Top>

        <ResumoFinanceiro>
          <h3 onClick={() => setResumoExpanded(!resumoExpanded)}>
            <div className="title-content">
              <button 
                className="toggle-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setResumoExpanded(!resumoExpanded);
                }}
              >
                {resumoExpanded ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              <span>Resumo Financeiro</span>
            </div>
            <ExportButton onClick={exportarParaExcel}>
              <FaFileExcel />
              Exportar Excel
            </ExportButton>
          </h3>
          
          <div className={`resumo-content ${resumoExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="resumo-grid">
              <div className="resumo-item">
                <div className="label">Assinaturas Ativas</div>
                <div className="quantidade">{totais.quantidadeAtivos} assinaturas</div>
              </div>
              
              <div className="resumo-item">
                <div className="label">Custo Mensal Total</div>
                <div className="valor">R$ {totais.totalMensalReal.toFixed(2)}</div>
              </div>
              
              <div className="resumo-item">
                <div className="label">Custo Anual Total</div>
                <div className="valor">R$ {totais.totalAnualReal.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </ResumoFinanceiro>

        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Empresa</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Acesso</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssinaturas.map((assinatura) => (
                <tr key={assinatura.id}>
                  <td>
                    <strong>{assinatura.nome}</strong>
                  </td>
                  <td className="empresa-cell">{assinatura.empresa || "Não informado"}</td>
                  <td className="valor-cell">{formatarValor(assinatura)}</td>
                  <td>
                    <span className={`status-badge ${assinatura.status}`}>
                      {assinatura.status}
                    </span>
                  </td>
                  <td>
                    {assinatura.acesso && assinatura.acesso !== "https://" ? (
                      <a 
                        href={assinatura.acesso} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="link-cell"
                      >
                        {assinatura.acesso.length > 30 ? 
                          `${assinatura.acesso.substring(0, 30)}...` : 
                          assinatura.acesso
                        }
                      </a>
                    ) : (
                      <span style={{ color: "#999" }}>Link não informado</span>
                    )}
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="action-btn edit"
                        onClick={() => openEditModal(assinatura)}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => {
                          setAssinaturaToDelete(assinatura.id);
                          setDeleteModal(true);
                        }}
                        title="Excluir"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAssinaturas.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#666", fontStyle: "italic" }}>
                    Nenhuma assinatura encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </TableContainer>

        {/* Modal para Adicionar Nova Assinatura */}
        <Modal
          isOpen={modalAddIsOpen}
          onRequestClose={() => setModalAddIsOpen(false)}
          style={{
            overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: "10" },
            content: { margin: "auto", width: "max-content", overflow: "hidden", height: "max-content" },
          }}
        >
          <ModalContent>
            <h2>
              <FaPlus />
              Nova Assinatura
            </h2>

            <div className="form-section">
              <div className="section-title">Informações Básicas</div>
              
              <div className="form-group full-width">
                <label>
                  Nome da Assinatura <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={newAssinatura.nome}
                  onChange={(e) => setNewAssinatura({ ...newAssinatura, nome: e.target.value })}
                  placeholder="Ex: Netflix Premium, Office 365, Adobe Creative Cloud..."
                />
                <div className="input-help">Digite um nome descritivo para identificar a assinatura</div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Empresa <span className="required">*</span>
                  </label>
                  <select
                    value={newAssinatura.empresa}
                    onChange={(e) => setNewAssinatura({ ...newAssinatura, empresa: e.target.value })}
                  >
                    <option value="">Selecione uma empresa</option>
                    <option value="Unity">Unity</option>
                    <option value="Nova Metálica">Nova Metálica</option>
                    <option value="Fast Sistemas Construtivos">Fast Sistemas Construtivos</option>
                    <option value="Fast Homes">Fast Homes</option>
                    <option value="Pousada Le Ange">Pousada Le Ange</option>
                    <option value="Milena">Milena</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <StatusSelect
                    value={newAssinatura.status}
                    data-status={newAssinatura.status}
                    onChange={(e) => setNewAssinatura({ ...newAssinatura, status: e.target.value })}
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                    <option value="suspenso">Suspenso</option>
                  </StatusSelect>
                </div>
              </div>

              <div className="form-group full-width">
                <label>
                  Link de Acesso <span className="required">*</span>
                </label>
                <input
                  type="url"
                  value={newAssinatura.acesso}
                  onChange={(e) => {
                    let value = e.target.value;
                    // Garante que sempre comece com https://
                    if (!value.startsWith("https://")) {
                      if (value.startsWith("http://")) {
                        value = value.replace("http://", "https://");
                      } else if (value && !value.startsWith("https://")) {
                        value = "https://" + value.replace(/^https?:\/\//, "");
                      } else if (!value) {
                        value = "https://";
                      }
                    }
                    setNewAssinatura({ ...newAssinatura, acesso: value });
                  }}
                  placeholder="https://exemplo.com/login"
                />
                <div className="input-help">URL para acessar o serviço ou plataforma</div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-title">Configurações Financeiras</div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo de Pagamento</label>
                  <select
                    value={newAssinatura.tipoPagamento}
                    onChange={(e) => setNewAssinatura({ ...newAssinatura, tipoPagamento: e.target.value })}
                  >
                    <option value="mensal">Mensal</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Moeda de Entrada</label>
                  <select
                    value={newAssinatura.moedaInput}
                    onChange={(e) => {
                      const novaMoeda = e.target.value;
                      // Reformatar valores existentes para a nova moeda
                      const mensalidadeAtualizada = newAssinatura.mensalidade ? 
                        formatarValorInput(extrairValorNumerico(newAssinatura.mensalidade) + "00", novaMoeda) : "";
                      const valorMinAtualizado = newAssinatura.valorMin ? 
                        formatarValorInput(extrairValorNumerico(newAssinatura.valorMin) + "00", novaMoeda) : "";
                      const valorMaxAtualizado = newAssinatura.valorMax ? 
                        formatarValorInput(extrairValorNumerico(newAssinatura.valorMax) + "00", novaMoeda) : "";
                      
                      setNewAssinatura({ 
                        ...newAssinatura, 
                        moedaInput: novaMoeda,
                        mensalidade: mensalidadeAtualizada,
                        valorMin: valorMinAtualizado,
                        valorMax: valorMaxAtualizado
                      });
                    }}
                  >
                    <option value="real">Real (R$)</option>
                    <option value="dolar">Dólar ($)</option>
                  </select>
                  <div className="input-help">
                    {newAssinatura.moedaInput === "dolar" 
                      ? `Valores em dólar serão convertidos para reais (cotação: R$ ${cotacaoDolar.toFixed(2)})`
                      : "Valores serão salvos em reais"
                    }
                  </div>
                </div>
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="valorRelativo"
                  checked={newAssinatura.valorRelativo}
                  onChange={(e) => setNewAssinatura({ ...newAssinatura, valorRelativo: e.target.checked })}
                />
                <label htmlFor="valorRelativo">
                  Variação de custo (faixa de valores)
                  <span className="help-text">Marque se o valor varia entre um mínimo e máximo</span>
                </label>
              </div>

              {newAssinatura.valorRelativo ? (
                <div className="form-row">
                  <div className="form-group">
                    <label>Valor Mínimo</label>
                    <input
                      type="text"
                      value={newAssinatura.valorMin}
                      onChange={(e) => {
                        const valorFormatado = formatarValorInput(e.target.value, newAssinatura.moedaInput);
                        setNewAssinatura({ ...newAssinatura, valorMin: valorFormatado });
                      }}
                      placeholder={newAssinatura.moedaInput === "dolar" ? "$ 0,00" : "R$ 0,00"}
                    />
                  </div>
                  <div className="form-group">
                    <label>Valor Máximo</label>
                    <input
                      type="text"
                      value={newAssinatura.valorMax}
                      onChange={(e) => {
                        const valorFormatado = formatarValorInput(e.target.value, newAssinatura.moedaInput);
                        setNewAssinatura({ ...newAssinatura, valorMax: valorFormatado });
                      }}
                      placeholder={newAssinatura.moedaInput === "dolar" ? "$ 0,00" : "R$ 0,00"}
                    />
                  </div>
                </div>
              ) : (
                <div className="form-group">
                  <label>Valor da Mensalidade</label>
                  <input
                    type="text"
                    value={newAssinatura.mensalidade}
                    onChange={(e) => {
                      const valorFormatado = formatarValorInput(e.target.value, newAssinatura.moedaInput);
                      setNewAssinatura({ ...newAssinatura, mensalidade: valorFormatado });
                    }}
                    placeholder={newAssinatura.moedaInput === "dolar" ? "$ 0,00" : "R$ 0,00"}
                  />
                  <div className="input-help">Valor fixo cobrado por período</div>
                </div>
              )}
            </div>

            <div className="button-group">
              <button 
                className="secondary"
                onClick={() => setModalAddIsOpen(false)}
              >
                Cancelar
              </button>
              <button 
                className="primary"
                onClick={handleAddAssinatura}
              >
                Criar Assinatura
              </button>
            </div>
          </ModalContent>
        </Modal>

        {/* Modal para Editar Assinatura */}
        <Modal
          isOpen={modalEditIsOpen}
          onRequestClose={() => setModalEditIsOpen(false)}
          style={{
            overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: "10" },
            content: { margin: "auto", width: "max-content", overflow: "hidden", height: "max-content" },
          }}
        >
          <ModalContent>
            <h2>
              <FaEdit />
              Editar Assinatura
            </h2>

            <div className="form-section">
              <div className="section-title">Informações Básicas</div>
              
              <div className="form-group full-width">
                <label>
                  Nome da Assinatura <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={editAssinaturaData.nome}
                  onChange={(e) => setEditAssinaturaData({ ...editAssinaturaData, nome: e.target.value })}
                  placeholder="Ex: Netflix Premium, Office 365, Adobe Creative Cloud..."
                />
                <div className="input-help">Digite um nome descritivo para identificar a assinatura</div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Empresa <span className="required">*</span>
                  </label>
                  <select
                    value={editAssinaturaData.empresa}
                    onChange={(e) => setEditAssinaturaData({ ...editAssinaturaData, empresa: e.target.value })}
                  >
                    <option value="">Selecione uma empresa</option>
                    <option value="Unity">Unity</option>
                    <option value="Nova Metálica">Nova Metálica</option>
                    <option value="Fast Sistemas Construtivos">Fast Sistemas Construtivos</option>
                    <option value="Fast Homes">Fast Homes</option>
                    <option value="Pousada Le Ange">Pousada Le Ange</option>
                    <option value="Milena">Milena</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <StatusSelect
                    value={editAssinaturaData.status}
                    data-status={editAssinaturaData.status}
                    onChange={(e) => setEditAssinaturaData({ ...editAssinaturaData, status: e.target.value })}
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                    <option value="suspenso">Suspenso</option>
                  </StatusSelect>
                </div>
              </div>

              <div className="form-group full-width">
                <label>
                  Link de Acesso <span className="required">*</span>
                </label>
                <input
                  type="url"
                  value={editAssinaturaData.acesso}
                  onChange={(e) => {
                    let value = e.target.value;
                    // Garante que sempre comece com https://
                    if (!value.startsWith("https://")) {
                      if (value.startsWith("http://")) {
                        value = value.replace("http://", "https://");
                      } else if (value && !value.startsWith("https://")) {
                        value = "https://" + value.replace(/^https?:\/\//, "");
                      } else if (!value) {
                        value = "https://";
                      }
                    }
                    setEditAssinaturaData({ ...editAssinaturaData, acesso: value });
                  }}
                  placeholder="https://exemplo.com/login"
                />
                <div className="input-help">URL para acessar o serviço ou plataforma</div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-title">Configurações Financeiras</div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo de Pagamento</label>
                  <select
                    value={editAssinaturaData.tipoPagamento}
                    onChange={(e) => setEditAssinaturaData({ ...editAssinaturaData, tipoPagamento: e.target.value })}
                  >
                    <option value="mensal">Mensal</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Moeda de Entrada</label>
                  <select
                    value={editAssinaturaData.moedaInput}
                    onChange={(e) => {
                      const novaMoeda = e.target.value;
                      // Reformatar valores existentes para a nova moeda
                      const mensalidadeAtualizada = editAssinaturaData.mensalidade ? 
                        formatarValorInput(extrairValorNumerico(editAssinaturaData.mensalidade) + "00", novaMoeda) : "";
                      const valorMinAtualizado = editAssinaturaData.valorMin ? 
                        formatarValorInput(extrairValorNumerico(editAssinaturaData.valorMin) + "00", novaMoeda) : "";
                      const valorMaxAtualizado = editAssinaturaData.valorMax ? 
                        formatarValorInput(extrairValorNumerico(editAssinaturaData.valorMax) + "00", novaMoeda) : "";
                      
                      setEditAssinaturaData({ 
                        ...editAssinaturaData, 
                        moedaInput: novaMoeda,
                        mensalidade: mensalidadeAtualizada,
                        valorMin: valorMinAtualizado,
                        valorMax: valorMaxAtualizado
                      });
                    }}
                  >
                    <option value="real">Real (R$)</option>
                    <option value="dolar">Dólar ($)</option>
                  </select>
                  <div className="input-help">
                    {editAssinaturaData.moedaInput === "dolar" 
                      ? `Valores em dólar serão convertidos para reais (cotação: R$ ${cotacaoDolar.toFixed(2)})`
                      : "Valores serão salvos em reais"
                    }
                  </div>
                </div>
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="valorRelativoEdit"
                  checked={editAssinaturaData.valorRelativo}
                  onChange={(e) => setEditAssinaturaData({ ...editAssinaturaData, valorRelativo: e.target.checked })}
                />
                <label htmlFor="valorRelativoEdit">
                  Variação de custo (faixa de valores)
                  <span className="help-text">Marque se o valor varia entre um mínimo e máximo</span>
                </label>
              </div>

              {editAssinaturaData.valorRelativo ? (
                <div className="form-row">
                  <div className="form-group">
                    <label>Valor Mínimo</label>
                    <input
                      type="text"
                      value={editAssinaturaData.valorMin}
                      onChange={(e) => {
                        const valorFormatado = formatarValorInput(e.target.value, editAssinaturaData.moedaInput);
                        setEditAssinaturaData({ ...editAssinaturaData, valorMin: valorFormatado });
                      }}
                      placeholder={editAssinaturaData.moedaInput === "dolar" ? "$ 0,00" : "R$ 0,00"}
                    />
                  </div>
                  <div className="form-group">
                    <label>Valor Máximo</label>
                    <input
                      type="text"
                      value={editAssinaturaData.valorMax}
                      onChange={(e) => {
                        const valorFormatado = formatarValorInput(e.target.value, editAssinaturaData.moedaInput);
                        setEditAssinaturaData({ ...editAssinaturaData, valorMax: valorFormatado });
                      }}
                      placeholder={editAssinaturaData.moedaInput === "dolar" ? "$ 0,00" : "R$ 0,00"}
                    />
                  </div>
                </div>
              ) : (
                <div className="form-group">
                  <label>Valor da Mensalidade</label>
                  <input
                    type="text"
                    value={editAssinaturaData.mensalidade}
                    onChange={(e) => {
                      const valorFormatado = formatarValorInput(e.target.value, editAssinaturaData.moedaInput);
                      setEditAssinaturaData({ ...editAssinaturaData, mensalidade: valorFormatado });
                    }}
                    placeholder={editAssinaturaData.moedaInput === "dolar" ? "$ 0,00" : "R$ 0,00"}
                  />
                  <div className="input-help">Valor fixo cobrado por período</div>
                </div>
              )}
            </div>

            <div className="button-group">
              <button 
                className="secondary"
                onClick={() => setModalEditIsOpen(false)}
              >
                Cancelar
              </button>
              <button 
                className="primary"
                onClick={handleEditAssinatura}
              >
                Atualizar Assinatura
              </button>
            </div>
          </ModalContent>
        </Modal>

        {/* Modal para Exclusão */}
        <Modal
          isOpen={deleteModal}
          onRequestClose={() => setDeleteModal(false)}
          style={{
            overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: "15" },
            content: { 
              margin: "auto", 
              width: "400px", 
              height: "200px",
              overflow: "hidden",
              borderRadius: "0",
              border: "2px solid #000"
            },
          }}
        >
          <ModalExcluir>
            <h2>Confirmar Exclusão</h2>
            <p>Tem certeza que deseja excluir esta assinatura? Esta ação não pode ser desfeita.</p>
            <div className="button-group">
              <button className="delete" onClick={handleRemoveAssinatura}>
                Excluir
              </button>
              <button className="cancel" onClick={() => setDeleteModal(false)}>
                Cancelar
              </button>
            </div>
          </ModalExcluir>
        </Modal>
      </Content>
    </>
  );
};

export default Assinaturas;