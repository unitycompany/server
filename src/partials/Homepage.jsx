import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../../AuthContext";
import AcessoLogins from "../pages/Login&Acessos";
import BancoDeDados from "../pages/BancoDeDados";
import Sites from "../pages/Sites";
import { toast } from "react-toastify";

const Content = styled.div`
  max-height: 100vh;
  overflow: hidden;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  border-bottom: 1px solid #00000020;
  padding: 1% 0%;

  & span {
    font-size: 16px;
    line-height: 100%;
    text-transform: uppercase;
    font-weight: 400;
    opacity: 0.7;
    letter-spacing: 1px;
  }

  & h1 {
    font-size: 32px;
    line-height: 100%;
    font-weight: 600;
    margin-top: -5px;
  }

  & p {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 5px;
    background-color: #00ff2a1f;
  }
`;

const Lista = styled.div`
  border: 1px solid #00000020;
  width: 30%;
  max-width: 350px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  min-height: 80vh;
  gap: 10px;
  padding: 10px 15px;
  position: relative;
  border-top: none;
  border-left: 3px solid #000000;

  & ol {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 5px;
    width: 100%;

    & div {
      margin: 7.5px 0px;
      & h2 {
        font-size: 18px;
        font-weight: 600;
      }
    }

    & article {
      margin: 0 20px;
      width: calc(100% - 20px);
      & li {
        font-size: 14px;
        background-color: #00000010;
      }
    }

    & li {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 7px;
      cursor: pointer;
      padding: 5px 10px;
      font-size: 15px;
      width: 100%;
      border: 1px solid #00000020;
      transition: all 0.1s ease-out;
      &:hover,
      &.active { // Adicione esta parte para ativar o hover fixado
        background-color: #00ff2a1f;
        margin-left: 2px;
      }
      & svg {
        width: 17px;
        height: auto;
      }
    }
  }
`;

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  padding: 0 2.5%;
  gap: 10px;
`;

const Option = styled.div`
  width: 70%;
  height: 100%;
  min-height: 80vh;
  border: 1px solid #00000020;
  border-top: none;
  border-left: 3px solid #000000;
`;

const Autor = styled.div`
  width: 100%;
  border: 1px solid #00000020;
  padding: 10px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  transition: all .1s ease-out;

  &:hover{
    background-color: #00ff2a1f;
    transform: translateY(-3px);
  }

  & span {
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 500;

    & a {
      color: #5aad0d;
      text-decoration: underline;
    }
  }
`

const SuporteTecnico = () => <div>EM DESENVOLVIMENTO</div>;

const menuOptions = [
  { 
    title: "Logins e acessos", 
    icon: (
      <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <g id="user">
          <path d="m24 10a8.38 8.38 0 1 0 8.38 8.38 8.39 8.39 0 0 0 -8.38-8.38zm0 14.76a6.38 6.38 0 1 1 6.38-6.38 6.38 6.38 0 0 1 -6.38 6.38z"></path>
          <path d="m24 3a22 22 0 1 0 22 22 22 22 0 0 0 -22-22zm-9.54 39.56v-5.56a6 6 0 0 1 6-6h7.08a6 6 0 0 1 6 6v5.59c-4.77 3.16-14.22 3.46-19.08-.03zm21.08-1.25v-4.31a8 8 0 0 0 -8-8h-7.08a8 8 0 0 0 -8 8v4.34a20 20 0 1 1 23.08 0z"></path>
        </g>
      </svg>
    ),
    component: <AcessoLogins />
  },
  { 
    title: "Banco de dados", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" id="fi_2405957">
        <g id="database_server" data-name="database server">
          <path d="M59.494,39.735l-1.725-.288a.971.971,0,0,1-.749-.591c-.057-.143-.116-.286-.177-.427a.975.975,0,0,1,.113-.947l1.015-1.421a2.992,2.992,0,0,0-.32-3.866l-1.846-1.846a2.989,2.989,0,0,0-3.8-.355V10c0-5.2-12.88-8-25-8S2,4.8,2,10V54c0,5.2,12.88,8,25,8a71.89,71.89,0,0,0,13.326-1.166A2.984,2.984,0,0,0,42.694,62h2.612a2.991,2.991,0,0,0,2.959-2.507l.287-1.724a.971.971,0,0,1,.591-.748c.144-.057.286-.116.428-.177a.974.974,0,0,1,.947.111l1.421,1.016a2.992,2.992,0,0,0,3.866-.32l1.847-1.846a2.993,2.993,0,0,0,.319-3.866l-1.016-1.421a.977.977,0,0,1-.112-.947q.091-.212.178-.428a.968.968,0,0,1,.749-.59l1.723-.288A2.991,2.991,0,0,0,62,45.306V42.694A2.991,2.991,0,0,0,59.494,39.735ZM50,31.225a.931.931,0,0,1-.43-.069q-.211-.091-.427-.177a.971.971,0,0,1-.591-.748l-.287-1.724c-.007-.042-.023-.08-.032-.121A11.213,11.213,0,0,0,50,27.308ZM27,4c14.25,0,23,3.494,23,6s-8.75,6-23,6S4,12.506,4,10,12.75,4,27,4ZM4,13.287C8.076,16.367,17.756,18,27,18s18.924-1.633,23-4.713V24c0,.832-1.041,1.808-2.808,2.67A2.99,2.99,0,0,0,45.306,26H42.694a2.991,2.991,0,0,0-2.959,2.507l-.287,1.724a.971.971,0,0,1-.591.748c-.144.057-.286.116-.428.177a.974.974,0,0,1-.947-.111l-1.421-1.016a2.989,2.989,0,0,0-3.054-.254C31.091,29.922,29.075,30,27,30,12.75,30,4,26.506,4,24ZM26.539,40.993A74.964,74.964,0,0,1,17,40.354V36.372A76.131,76.131,0,0,0,27,37c1.136,0,2.337-.027,3.644-.079l.4.561a.977.977,0,0,1,.112.947q-.091.212-.178.428a.968.968,0,0,1-.749.59l-1.723.288A2.983,2.983,0,0,0,26.539,40.993ZM4,27.287C8.076,30.367,17.756,32,27,32c1.235,0,2.448-.029,3.623-.079l-.275.274a2.987,2.987,0,0,0-.8,2.763C28.655,34.985,27.809,35,27,35a73.675,73.675,0,0,1-10.85-.769A1,1,0,0,0,15,35.22v6a1,1,0,0,0,.85.988A74.006,74.006,0,0,0,26,42.983v2.323a3.058,3.058,0,0,0,.086.68C12.386,45.838,4,42.451,4,40ZM4,54V43.287C8.076,46.367,17.756,48,27,48c.229,0,.457,0,.686-.008a2.976,2.976,0,0,0,.82.273l1.725.288a.971.971,0,0,1,.749.591c.057.143.116.286.177.427a.939.939,0,0,1,.067.314C29.861,49.956,28.452,50,27,50a73.675,73.675,0,0,1-10.85-.769A1,1,0,0,0,15,50.22v6a1,1,0,0,0,.85.988A74.859,74.859,0,0,0,27,58c1.822,0,3.647-.065,5.4-.181a2.979,2.979,0,0,0,3.664.152l1.423-1.016a.974.974,0,0,1,.947-.111q.211.092.427.177a.971.971,0,0,1,.591.748l.193,1.159A70.283,70.283,0,0,1,27,60C12.75,60,4,56.506,4,54Zm26.349,1.8.118.118A78.275,78.275,0,0,1,17,55.354V51.372A76.131,76.131,0,0,0,27,52c1.029,0,2.036-.023,3.028-.058A2.991,2.991,0,0,0,30.349,55.805ZM60,45.306a1,1,0,0,1-.836.986l-1.724.288a2.977,2.977,0,0,0-2.28,1.829c-.049.124-.1.247-.152.367a2.982,2.982,0,0,0,.32,2.9L56.343,53.1a1,1,0,0,1-.106,1.289l-1.846,1.846a1,1,0,0,1-1.289.107L51.68,55.328a2.981,2.981,0,0,0-2.9-.32c-.122.052-.244.1-.368.151a2.983,2.983,0,0,0-1.83,2.281l-.288,1.725a1,1,0,0,1-.986.835H42.694a1,1,0,0,1-.986-.835L41.42,57.44a2.983,2.983,0,0,0-1.83-2.281c-.124-.049-.246-.1-.366-.151a2.921,2.921,0,0,0-1.161-.238,3,3,0,0,0-1.743.558L34.9,56.344a1,1,0,0,1-1.288-.107l-1.846-1.846a1,1,0,0,1-.106-1.289l1.015-1.422a2.982,2.982,0,0,0,.32-2.9c-.053-.12-.1-.243-.151-.366a2.98,2.98,0,0,0-2.28-1.83l-1.726-.288A1,1,0,0,1,28,45.306V42.694a1,1,0,0,1,.836-.986l1.724-.288a2.977,2.977,0,0,0,2.28-1.829c.049-.124.1-.247.152-.367a2.982,2.982,0,0,0-.32-2.9L31.657,34.9a1,1,0,0,1,.106-1.289l1.846-1.846a1,1,0,0,1,1.289-.107l1.422,1.016a2.974,2.974,0,0,0,2.9.32c.122-.052.244-.1.368-.151a2.983,2.983,0,0,0,1.83-2.281l.288-1.725A1,1,0,0,1,42.694,28h2.612a1,1,0,0,1,.986.835l.288,1.725a2.983,2.983,0,0,0,1.83,2.281c.124.049.246.1.366.151a2.983,2.983,0,0,0,2.9-.32L53.1,31.656a1,1,0,0,1,1.288.107l1.846,1.846a1,1,0,0,1,.106,1.289L55.328,36.32a2.982,2.982,0,0,0-.32,2.9c.053.12.1.243.151.366a2.98,2.98,0,0,0,2.28,1.83l1.726.288a1,1,0,0,1,.835.986Z"></path>
          <path d="M44,35a9,9,0,1,0,9,9A9.01,9.01,0,0,0,44,35Zm0,16a7,7,0,1,1,7-7A7.008,7.008,0,0,1,44,51Z"></path>
          <path d="M15.85,27.208A74.859,74.859,0,0,0,27,28a74.859,74.859,0,0,0,11.15-.792A1,1,0,0,0,39,26.22v-6a1,1,0,0,0-1.15-.989,78.391,78.391,0,0,1-21.7,0A1,1,0,0,0,15,20.22v6A1,1,0,0,0,15.85,27.208ZM17,21.372A76.131,76.131,0,0,0,27,22a76.309,76.309,0,0,0,10-.628v3.982a79.027,79.027,0,0,1-20,0Z"></path>
        </g>
      </svg>
    ),
    component: <BancoDeDados />
  },
  { 
    title: "Suporte técnico", 
    icon: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" id="fi_4539212">
        <path d="m89.714 110.75h-13.114a1.749 1.749 0 0 1 -1.75-1.75v-23.5a8.274 8.274 0 0 0 -8.266-8.265h-5.17a8.274 8.274 0 0 0 -8.265 8.265v23.5a1.75 1.75 0 0 1 -1.75 1.75h-13.172a8.35 8.35 0 0 1 -8.342-8.341v-33.233h-6.576a6.389 6.389 0 0 1 -4.451-10.976l40.662-39.471a6.361 6.361 0 0 1 8.9 0l12.64 12.271a4.843 4.843 0 0 1 4.07-2.223h8.086a4.845 4.845 0 0 1 4.839 4.839v13.884l11.026 10.7a6.388 6.388 0 0 1 -4.449 10.973h-6.577v33.233a8.35 8.35 0 0 1 -8.341 8.344zm-11.362-3.5h11.362a4.847 4.847 0 0 0 4.841-4.841v-34.983a1.749 1.749 0 0 1 1.75-1.75h8.327a2.888 2.888 0 0 0 2.012-4.961l-11.558-11.215a1.75 1.75 0 0 1 -.531-1.256v-14.627a1.341 1.341 0 0 0 -1.339-1.339h-8.086a1.341 1.341 0 0 0 -1.339 1.339v.775a1.75 1.75 0 0 1 -2.969 1.255l-14.84-14.406a2.875 2.875 0 0 0 -4.024 0l-40.658 39.474a2.889 2.889 0 0 0 2.013 4.961h8.326a1.749 1.749 0 0 1 1.75 1.75v34.983a4.847 4.847 0 0 0 4.842 4.841h11.418v-21.75a11.779 11.779 0 0 1 11.765-11.762h5.172a11.779 11.779 0 0 1 11.766 11.762z"></path>
      </svg>
    ),
    component: <SuporteTecnico />
  },
  { 
    title: "Sites", 
    icon: (
      <svg id="fi_3318526" enable-background="new 0 0 508.007 508.007" viewBox="0 0 508.007 508.007" xmlns="http://www.w3.org/2000/svg"><g><path d="m254.004 115.207c-76.531 0-138.795 62.264-138.795 138.796 0 76.531 62.264 138.795 138.795 138.795 76.532 0 138.796-62.264 138.796-138.795 0-76.532-62.264-138.796-138.796-138.796zm0 261.716c-67.778 0-122.92-55.142-122.92-122.92 0-67.779 55.142-122.921 122.92-122.921 67.779 0 122.921 55.142 122.921 122.921-.001 67.779-55.142 122.92-122.921 122.92zm246.065-179.812h-62.479c-3.492-11.268-8.032-22.218-13.554-32.681l44.192-44.191c1.488-1.489 2.325-3.507 2.325-5.613 0-2.105-.836-4.124-2.325-5.613l-69.234-69.234c-3.099-3.098-8.124-3.099-11.226 0l-44.181 44.181c-10.456-5.52-21.41-10.062-32.691-13.555v-62.467c0-4.384-3.554-7.938-7.938-7.938h-97.911c-4.384 0-7.938 3.554-7.938 7.938v62.47c-11.278 3.495-22.232 8.038-32.688 13.555l-44.183-44.184c-3.1-3.098-8.124-3.099-11.226 0l-69.232 69.233c-1.488 1.489-2.325 3.507-2.325 5.613 0 2.105.836 4.124 2.325 5.613l44.184 44.183c-5.52 10.459-10.062 21.411-13.554 32.689h-62.472c-4.384 0-7.938 3.554-7.938 7.938v97.91c0 4.384 3.554 7.938 7.938 7.938h62.478c3.491 11.266 8.032 22.218 13.553 32.681l-44.191 44.191c-3.1 3.101-3.1 8.125 0 11.226l69.233 69.233c3.1 3.099 8.124 3.101 11.226 0l44.181-44.181c10.459 5.52 21.412 10.062 32.691 13.554v62.47c0 4.384 3.554 7.938 7.938 7.938h97.911c4.384 0 7.938-3.554 7.938-7.938v-62.471c11.277-3.494 22.229-8.035 32.688-13.554l44.184 44.184c3.101 3.099 8.125 3.101 11.226 0l69.233-69.233c3.1-3.101 3.1-8.125 0-11.226l-44.184-44.184c5.52-10.458 10.062-21.41 13.554-32.688h62.473c4.384 0 7.938-3.554 7.938-7.938v-97.91c-.001-4.385-3.555-7.939-7.939-7.939zm-7.937 97.91h-60.482c-3.574 0-6.706 2.387-7.654 5.832-3.856 14.018-9.465 27.546-16.673 40.209-1.767 3.107-1.241 7.011 1.286 9.538l42.78 42.781-58.008 58.008-42.781-42.78c-2.526-2.526-6.431-3.053-9.538-1.286-12.665 7.208-26.193 12.818-40.209 16.673-3.445.948-5.832 4.08-5.832 7.654v60.482h-82.036v-60.479c0-3.574-2.387-6.706-5.833-7.654-14.018-3.855-27.547-9.464-40.211-16.672-3.107-1.77-7.01-1.241-9.539 1.285l-42.777 42.777-58.008-58.008 42.787-42.786c2.527-2.528 3.053-6.431 1.286-9.538-7.213-12.677-12.822-26.204-16.672-40.204-.948-3.446-4.08-5.833-7.654-5.833h-60.489v-82.035h60.482c3.574 0 6.706-2.387 7.654-5.832 3.856-14.018 9.465-27.546 16.673-40.21 1.767-3.107 1.241-7.011-1.286-9.539l-42.78-42.779 58.008-58.008 42.779 42.78c2.529 2.527 6.433 3.054 9.539 1.286 12.661-7.207 26.19-12.816 40.209-16.675 3.445-.948 5.832-4.08 5.832-7.653v-60.48h82.036v60.478c0 3.574 2.387 6.706 5.833 7.654 14.023 3.857 27.551 9.467 40.21 16.673 3.11 1.771 7.012 1.242 9.54-1.285l42.776-42.777 58.009 58.008-42.787 42.786c-2.527 2.528-3.053 6.431-1.286 9.538 7.212 12.676 12.821 26.203 16.672 40.204.948 3.446 4.08 5.833 7.654 5.833h60.49zm-269.604-63.175-35.353 22.158 35.353 22.158c3.715 2.328 4.839 7.226 2.51 10.94-1.507 2.405-4.091 3.724-6.733 3.724-1.44 0-2.897-.392-4.207-1.213l-46.084-28.883c-2.317-1.452-3.723-3.992-3.723-6.725 0-2.734 1.406-5.274 3.723-6.725l46.084-28.883c3.715-2.33 8.613-1.205 10.94 2.51 2.329 3.712 1.205 8.611-2.51 10.939zm117.465 15.432c2.317 1.452 3.723 3.992 3.723 6.725 0 2.734-1.406 5.274-3.723 6.725l-46.085 28.883c-1.31.822-2.767 1.213-4.207 1.213-2.643 0-5.227-1.319-6.733-3.724-2.329-3.714-1.204-8.613 2.51-10.94l35.353-22.158-35.353-22.158c-3.715-2.328-4.839-7.226-2.51-10.94 2.328-3.716 7.227-4.84 10.94-2.51zm-70.425-37.492-15.478 91.095c-.658 3.872-4.016 6.609-7.816 6.609-.442 0-.889-.037-1.339-.113-4.322-.734-7.23-4.833-6.496-9.155l15.478-91.095c.734-4.321 4.843-7.227 9.155-6.496 4.322.734 7.23 4.833 6.496 9.155z"></path></g></svg>
    ),
    component: <Sites /> 
  },
  // { 
  //   title: "Controle de usuarios", 
  //   icon: (
  //     <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="fi_4211178"><g id="Layer_1" data-name="Layer 1"><path d="m14.984 12.2c.208-.133 3.03-2.006 3.015-5.2a6.111 6.111 0 0 0 -6-6 6.111 6.111 0 0 0 -5.999 6c-.015 3.193 2.807 5.066 3.015 5.2a10 10 0 0 0 -8.015 9.8 1 1 0 0 0 1 1h20a1 1 0 0 0 1-1 10 10 0 0 0 -8.016-9.8zm-7.984-5.2a5 5 0 1 1 5 5 5.005 5.005 0 0 1 -5-5zm-5 15a9.01 9.01 0 0 1 9-9h2a9.01 9.01 0 0 1 9 9z"></path></g></svg>
  //   ),
  //   component: <Usuarios />
  // }
];

const Homepage = () => {
  const [selectedOption, setSelectedOption] = useState("Logins e acessos");
  const [loadingOption, setLoadingOption] = useState(null);
  const { currentUser } = useAuth();

  const handleOptionClick = (option) => {
    setLoadingOption(option.title);
    setTimeout(() => {
      setSelectedOption(option.title);
      setLoadingOption(null);
    }, 500);
  };

  useEffect(() => {
    toast.success(`${selectedOption} carregado com sucesso!`);
  }, [selectedOption]);

  return (
    <>
      <Content>
        <Title>
          <span>Controle dos sites</span>
          <h1>Painel Administrativo</h1>
          <p>{currentUser?.displayName || currentUser?.email}</p>
        </Title>

        <Container>
          <Lista>
            <ol>
              <div>
                <h2>Gerenciamento</h2>
              </div>
              {menuOptions.map((option) => (
                <li
                  key={option.title}
                  onClick={() => handleOptionClick(option)}
                  className={selectedOption === option.title ? "active" : ""}
                >
                  {option.icon}
                  <span>{option.title}</span>
                </li>
              ))}
            </ol>
            <Autor>
                <span>Desenvolvido por <a href="https://wa.me/24981411940" target="_blank">aleph</a></span>
            </Autor>
          </Lista>

          <Option>
            {menuOptions.find((item) => item.title === selectedOption)?.component}
          </Option>

          
        </Container>
      </Content>
    </>
  );
};


export default Homepage;
