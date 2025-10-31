import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../../AuthContext";
import AcessoLogins from "../pages/Login&Acessos";
import BancoDeDados from "../pages/BancoDeDados";
import Sites from "../pages/Sites";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { HiMiniSquare3Stack3D } from "react-icons/hi2";
import { BsBoxes, BsClipboard2Data } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import PousadaLeAnge from "../pages/BC/pousadaleange";
import FastHomes from "../pages/BC/fasthomes";
import NovaMetalica from "../pages/BC/novametalica";
import { MdOutlineAttachMoney } from "react-icons/md";
import Assinaturas from "../pages/Assinaturas";
import { RiArticleLine, RiFilePaper2Line } from "react-icons/ri";


const Content = styled.div`
  max-height: 100vh;
  overflow: hidden;
  width: 100%;
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
    background-color: #000000;
    color: #fff;
  }
`;

const Lista = styled.div`
  border: 1px solid #00000020;
  width: 30%;
  max-width: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  min-height: 100vh;
  gap: 5px;
  padding: 5px 10px 10px 10px;
  position: relative;
  border-top: none;
  border-left: 2px solid #000000;

  & ol {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 5px;
    width: 100%;

    & div {
      margin: 15px 0px 5px 0px;
      & h2 {
        font-size: 16px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7.5px;
      }
    }

    & > aside {
      width: 100%!important;
      height: 1px;
      background: #00000050;
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
      gap: 10px;
      cursor: pointer;
      padding: 5px 10px;
      font-size: 15px;
      width: 100%;
      border: 1px solid #00000020;
      transition: all 0.2s ease-out;
      position: relative;

      &:hover,
      &.active {
        background-color: #000000;
        color: #fff;
        margin-left: 3px;
        width: calc(100% - 3px);

        &::before{
          content: '';
          width: 2px;
          height: 100%;
          position: absolute;
          left: -4px;
          top: 0%;
          background-color: #000000;
        }

        & svg {
          fill: #fff;
        }
      }
      & svg {
        width: 15px;
        height: auto;
      }

      & img {
        width: 20px;
        height: auto;
      }

      & span {
        font-size: 14px;
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
  min-height: 100vh;
  border: 1px solid #00000020;
  border-top: none;
  border-left: 2px solid #000000;
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
      <FaUser />
    ),
    component: <AcessoLogins />
  },

  { 
    title: "Gerenciamento de assinaturas", 
    icon: (
      <MdOutlineAttachMoney />
    ),
    component: <Assinaturas />
  },

  // { 
  //   title: "Banco de dados", 
  //   icon: (
  //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" id="fi_2405957">
  //       <g id="database_server" data-name="database server">
  //         <path d="M59.494,39.735l-1.725-.288a.971.971,0,0,1-.749-.591c-.057-.143-.116-.286-.177-.427a.975.975,0,0,1,.113-.947l1.015-1.421a2.992,2.992,0,0,0-.32-3.866l-1.846-1.846a2.989,2.989,0,0,0-3.8-.355V10c0-5.2-12.88-8-25-8S2,4.8,2,10V54c0,5.2,12.88,8,25,8a71.89,71.89,0,0,0,13.326-1.166A2.984,2.984,0,0,0,42.694,62h2.612a2.991,2.991,0,0,0,2.959-2.507l.287-1.724a.971.971,0,0,1,.591-.748c.144-.057.286-.116.428-.177a.974.974,0,0,1,.947.111l1.421,1.016a2.992,2.992,0,0,0,3.866-.32l1.847-1.846a2.993,2.993,0,0,0,.319-3.866l-1.016-1.421a.977.977,0,0,1-.112-.947q.091-.212.178-.428a.968.968,0,0,1,.749-.59l1.723-.288A2.991,2.991,0,0,0,62,45.306V42.694A2.991,2.991,0,0,0,59.494,39.735ZM50,31.225a.931.931,0,0,1-.43-.069q-.211-.091-.427-.177a.971.971,0,0,1-.591-.748l-.287-1.724c-.007-.042-.023-.08-.032-.121A11.213,11.213,0,0,0,50,27.308ZM27,4c14.25,0,23,3.494,23,6s-8.75,6-23,6S4,12.506,4,10,12.75,4,27,4ZM4,13.287C8.076,16.367,17.756,18,27,18s18.924-1.633,23-4.713V24c0,.832-1.041,1.808-2.808,2.67A2.99,2.99,0,0,0,45.306,26H42.694a2.991,2.991,0,0,0-2.959,2.507l-.287,1.724a.971.971,0,0,1-.591.748c-.144.057-.286.116-.428.177a.974.974,0,0,1-.947-.111l-1.421-1.016a2.989,2.989,0,0,0-3.054-.254C31.091,29.922,29.075,30,27,30,12.75,30,4,26.506,4,24ZM26.539,40.993A74.964,74.964,0,0,1,17,40.354V36.372A76.131,76.131,0,0,0,27,37c1.136,0,2.337-.027,3.644-.079l.4.561a.977.977,0,0,1,.112.947q-.091.212-.178.428a.968.968,0,0,1-.749.59l-1.723.288A2.983,2.983,0,0,0,26.539,40.993ZM4,27.287C8.076,30.367,17.756,32,27,32c1.235,0,2.448-.029,3.623-.079l-.275.274a2.987,2.987,0,0,0-.8,2.763C28.655,34.985,27.809,35,27,35a73.675,73.675,0,0,1-10.85-.769A1,1,0,0,0,15,35.22v6a1,1,0,0,0,.85.988A74.006,74.006,0,0,0,26,42.983v2.323a3.058,3.058,0,0,0,.086.68C12.386,45.838,4,42.451,4,40ZM4,54V43.287C8.076,46.367,17.756,48,27,48c.229,0,.457,0,.686-.008a2.976,2.976,0,0,0,.82.273l1.725.288a.971.971,0,0,1,.749.591c.057.143.116.286.177.427a.939.939,0,0,1,.067.314C29.861,49.956,28.452,50,27,50a73.675,73.675,0,0,1-10.85-.769A1,1,0,0,0,15,50.22v6a1,1,0,0,0,.85.988A74.859,74.859,0,0,0,27,58c1.822,0,3.647-.065,5.4-.181a2.979,2.979,0,0,0,3.664.152l1.423-1.016a.974.974,0,0,1,.947-.111q.211.092.427.177a.971.971,0,0,1,.591.748l.193,1.159A70.283,70.283,0,0,1,27,60C12.75,60,4,56.506,4,54Zm26.349,1.8.118.118A78.275,78.275,0,0,1,17,55.354V51.372A76.131,76.131,0,0,0,27,52c1.029,0,2.036-.023,3.028-.058A2.991,2.991,0,0,0,30.349,55.805ZM60,45.306a1,1,0,0,1-.836.986l-1.724.288a2.977,2.977,0,0,0-2.28,1.829c-.049.124-.1.247-.152.367a2.982,2.982,0,0,0,.32,2.9L56.343,53.1a1,1,0,0,1-.106,1.289l-1.846,1.846a1,1,0,0,1-1.289.107L51.68,55.328a2.981,2.981,0,0,0-2.9-.32c-.122.052-.244.1-.368.151a2.983,2.983,0,0,0-1.83,2.281l-.288,1.725a1,1,0,0,1-.986.835H42.694a1,1,0,0,1-.986-.835L41.42,57.44a2.983,2.983,0,0,0-1.83-2.281c-.124-.049-.246-.1-.366-.151a2.921,2.921,0,0,0-1.161-.238,3,3,0,0,0-1.743.558L34.9,56.344a1,1,0,0,1-1.288-.107l-1.846-1.846a1,1,0,0,1-.106-1.289l1.015-1.422a2.982,2.982,0,0,0,.32-2.9c-.053-.12-.1-.243-.151-.366a2.98,2.98,0,0,0-2.28-1.83l-1.726-.288A1,1,0,0,1,28,45.306V42.694a1,1,0,0,1,.836-.986l1.724-.288a2.977,2.977,0,0,0,2.28-1.829c.049-.124.1-.247.152-.367a2.982,2.982,0,0,0-.32-2.9L31.657,34.9a1,1,0,0,1,.106-1.289l1.846-1.846a1,1,0,0,1,1.289-.107l1.422,1.016a2.974,2.974,0,0,0,2.9.32c.122-.052.244-.1.368-.151a2.983,2.983,0,0,0,1.83-2.281l.288-1.725A1,1,0,0,1,42.694,28h2.612a1,1,0,0,1,.986.835l.288,1.725a2.983,2.983,0,0,0,1.83,2.281c.124.049.246.1.366.151a2.983,2.983,0,0,0,2.9-.32L53.1,31.656a1,1,0,0,1,1.288.107l1.846,1.846a1,1,0,0,1,.106,1.289L55.328,36.32a2.982,2.982,0,0,0-.32,2.9c.053.12.1.243.151.366a2.98,2.98,0,0,0,2.28,1.83l1.726.288a1,1,0,0,1,.835.986Z"></path>
  //         <path d="M44,35a9,9,0,1,0,9,9A9.01,9.01,0,0,0,44,35Zm0,16a7,7,0,1,1,7-7A7.008,7.008,0,0,1,44,51Z"></path>
  //         <path d="M15.85,27.208A74.859,74.859,0,0,0,27,28a74.859,74.859,0,0,0,11.15-.792A1,1,0,0,0,39,26.22v-6a1,1,0,0,0-1.15-.989,78.391,78.391,0,0,1-21.7,0A1,1,0,0,0,15,20.22v6A1,1,0,0,0,15.85,27.208ZM17,21.372A76.131,76.131,0,0,0,27,22a76.309,76.309,0,0,0,10-.628v3.982a79.027,79.027,0,0,1-20,0Z"></path>
  //       </g>
  //     </svg>
  //   ),
  //   component: <BancoDeDados />
  // },

  { 
    title: "Relatório pré-vendas", 
    icon: (
      <RiFilePaper2Line />
    ),
    component: <Sites /> 
  },

  { 
    title: "Blog NM", 
    icon: (
      <img src="https://www.novametalica.com.br/avatar.ico" alt="" />
    ),
    component: <Sites /> 
  },
];

const menuBancoDeDados = [
  { 
    title: "Pousada Le Ange", 
    icon: (
     <img src="https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/eb648853-1763-415e-491c-e162bad01800/public" alt="" />
    ),
    component: <PousadaLeAnge />
  },

  { 
    title: "Fast Homes", 
    icon: (
      <img src="https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/8ce698f2-4801-4660-4282-aac5cbde5200/public" alt="" />
    ),
    component: <FastHomes />
  }
]

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

  // Renderização condicional do componente selecionado
  const renderSelectedComponent = () => {
    // Para FastHomes, passar props de controle de adição
    if (selectedOption === "Pousada Le Ange") return <PousadaLeAnge />;
    if (selectedOption === "Fast Homes") return <FastHomes />;
    if (selectedOption === "Nova Metálica") return <NovaMetalica />;
    // Para as demais opções
    const found = menuOptions.find((item) => item.title === selectedOption);
    if (found) return found.component;
    return null;
  };

  return (
    <>
      <Content>
        {/* <Title>
          <span>Controle dos sites</span>
          <h1>Painel Administrativo</h1>
          <p>{currentUser?.displayName || currentUser?.email}</p>
        </Title> */}

        <Container>
          <Lista>
            <ol>
              <div>
                <h2>Gerenciamento</h2>
              </div>
              {menuOptions.map((option) => (
                <li
                  key={option.title}
                  onClick={() => {
                    if (option.title === "Relatório pré-vendas") {
                      // Abre o relatório em nova aba
                      window.open('https://relatorio.fastsistemasconstrutivos.com.br', '_blank', 'noopener,noreferrer');
                      return;
                    }
                    if (option.title === "Blog NM") {
                      window.open('https://blog.novametalica.com.br/admin', '_blank', 'noopener,noreferrer');
                      return;
                    }
                    handleOptionClick(option);
                  }}
                  className={selectedOption === option.title ? "active" : ""}
                >
                  {option.icon}
                  <span>{option.title}</span>
                </li>
              ))}
              <aside>
              </aside>
              <div>
                <h2>Banco de Dados</h2>
              </div>
                 {menuBancoDeDados.map((option) => (
                <li
                  key={option.title}
                  onClick={() => handleOptionClick(option)}
                  className={selectedOption === option.title ? "active" : ""}
                >
                  {option.icon}
                  <span>{option.title}</span>
                </li>
                ))}
                <aside>
                </aside>
            </ol>
            <Autor>
                <span>Desenvolvido por <a href="https://wa.me/24981411940" target="_blank">aleph</a></span>
            </Autor>
          </Lista>

          <Option>
            {renderSelectedComponent()}
          </Option>

          
        </Container>
      </Content>
    </>
  );
};


export default Homepage;
