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
    background-color: #000000;
    color: #fff;
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
  gap: 5px;
  padding: 5px 10px 10px 10px;
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
    title: "Sites", 
    icon: (
      <HiMiniSquare3Stack3D />
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
  },

  { 
    title: "Nova Metálica", 
    icon: (
      <img src="https://www.novametalica.com.br/avatar.ico" alt="" />
    ),
    component: <NovaMetalica />
  },
]

const menuMetricas = [
  { 
    title: "Google", 
    icon: (
      <svg id="fi_3128285" enable-background="new 0 0 100 100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g id="_x34_3.Google_Adwords"><path d="m57.193 15.502c-7.021-4.054-15.985-1.653-20.039 5.37l-25.162 43.583c-6.494 11.247 3.912 24.878 16.501 21.504 3.785-1.014 6.948-3.442 8.907-6.835l25.162-43.583c4.045-7.005 1.636-15.994-5.369-20.039z" fill="#fabc04"></path><path d="m88.038 64.455-25.163-43.583c-1.959-3.393-5.123-5.821-8.907-6.835-12.593-3.375-22.991 10.262-16.501 21.504l25.163 43.583c4.053 7.019 13.015 9.425 20.039 5.37 7.004-4.045 9.413-13.034 5.369-20.039z" fill="#3c8bd9"></path><path d="m38.865 67.993c-2.098-7.831-10.134-12.472-17.966-10.373-12.593 3.374-14.78 20.383-3.538 26.874 11.216 6.475 24.897-3.84 21.504-16.501z" fill="#34a852"></path></g></svg>
    ),
    component: <BancoDeDados />
  },

  { 
    title: "Meta", 
    icon: (
      <svg id="fi_6033716" enable-background="new 0 0 512 512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><linearGradient id="SVGID_1_" gradientTransform="matrix(1 0 0 -1 0 514)" gradientUnits="userSpaceOnUse" x1="5.3" x2="506.8" y1="258.1" y2="258.1"><stop offset="0" stop-color="#0064e0"></stop><stop offset=".06176297" stop-color="#006ae5"></stop><stop offset=".2183" stop-color="#007af4"></stop><stop offset=".8106" stop-color="#007df6"></stop><stop offset="1" stop-color="#0080f9"></stop></linearGradient><linearGradient id="SVGID_00000108294422424748979490000015468411590085554596_" gradientTransform="matrix(1 0 0 -1 0 514)" gradientUnits="userSpaceOnUse" x1="49.786" x2="230.719" y1="320.675" y2="133.579"><stop offset="0" stop-color="#0064e0"></stop><stop offset=".0134753" stop-color="#0065e1"></stop><stop offset=".2894" stop-color="#0075f0"></stop><stop offset=".5971" stop-color="#007ff9"></stop><stop offset="1" stop-color="#0082fc"></stop></linearGradient><linearGradient id="SVGID_00000011014187292083061840000001297153340796386228_" gradientTransform="matrix(1 0 0 -1 0 514)" gradientUnits="userSpaceOnUse" x1="110.25" x2="416.1" y1="451.784" y2="121.254"><stop offset="0" stop-color="#0082fb"></stop><stop offset=".02167212" stop-color="#017cf5"></stop><stop offset=".09047851" stop-color="#0471ea"></stop><stop offset=".1872" stop-color="#066ae3"></stop><stop offset=".4561" stop-color="#0668e1"></stop><stop offset=".7462" stop-color="#056ae3"></stop><stop offset=".8847" stop-color="#0472eb"></stop><stop offset=".9742" stop-color="#017cf5"></stop><stop offset="1" stop-color="#0082fb"></stop></linearGradient><linearGradient id="SVGID_00000115496449546236234580000017061870114335014073_" gradientTransform="matrix(1 0 0 -1 0 514)" gradientUnits="userSpaceOnUse" x1="49" x2="262.7" y1="365.75" y2="365.75"><stop offset="0" stop-color="#0064e0"></stop><stop offset=".4218" stop-color="#0069e4"></stop><stop offset=".4332" stop-color="#0069e4"></stop><stop offset="1" stop-color="#0668e1"></stop></linearGradient><linearGradient id="SVGID_00000150100707639943330890000011886544216348691624_" gradientTransform="matrix(1 0 0 -1 0 514)" gradientUnits="userSpaceOnUse" x1="324.016" x2="506.8" y1="149.85" y2="149.85"><stop offset="0" stop-color="#066be3"></stop><stop offset=".3087" stop-color="#0470e9"></stop><stop offset=".559" stop-color="#0279f2"></stop><stop offset="1" stop-color="#0080f9"></stop></linearGradient><path d="m149.4 89.4c-81.6 0-144.1 106.2-144.1 218.5 0 70.3 34 114.7 91 114.7 41 0 70.5-19.3 123-111 0 0 21.9-38.6 36.9-65.2l31.2-52.8c26.5-40.9 48.4-61.3 74.4-61.3 54 0 97.2 79.5 97.2 177.2 0 37.2-12.2 58.8-37.5 58.8-24.2 0-35.8-16-81.8-90l-42.3 36.9c47.9 80.2 74.6 107.4 123 107.4 55.5 0 86.4-45.1 86.4-116.9 0-117.7-63.9-216.5-141.6-216.5-41.1 0-73.3 31-102.4 70.3l-32.3 47.4c-31.9 49-51.3 79.7-51.3 79.7-42.5 66.7-57.2 81.6-80.9 81.6-24.4 0-38.8-21.4-38.8-59.5 0-81.6 40.7-165 89.2-165z" fill="url(#SVGID_1_)"></path><path d="m265.5 196.4-35 10.8c-31.9 49-51.3 79.7-51.3 79.7-42.5 66.7-57.2 81.6-80.9 81.6-24.4 0-38.8-21.4-38.8-59.5 0-81.6 40.7-165 89.2-165l.7-54.5c-81.6-.1-144.1 106.1-144.1 218.4 0 70.3 34 114.7 91 114.7 41 0 70.5-19.3 123-111 0 0 21.9-38.6 36.9-65.2z" fill="url(#SVGID_00000108294422424748979490000015468411590085554596_)"></path><path d="m297.4 315.3c47.9 80.2 74.6 107.3 123 107.3l1.1-54.3c-24.2 0-35.8-15.9-81.8-89.9-38.6-62.8-58.3-94.2-76.9-118.7-40-50.9-73.4-70.3-113.4-70.3l-.7 54.5c26.3 0 48.2 15.2 81.8 63.3 14.1 19.8 43 66.9 66.9 108.1z" fill="url(#SVGID_00000011014187292083061840000001297153340796386228_)"></path><path d="m262.7 159.7c-40-50.9-73.4-70.3-113.5-70.3-39.5 0-74.5 24.9-100.2 63.3l38.6 39.5c16.1-29.1 37.8-48.2 61.1-48.2 26.3 0 48 15 81.6 63.1z" fill="url(#SVGID_00000115496449546236234580000017061870114335014073_)"></path><path d="m324 357.3c32.9 47.9 57.7 65.3 96.4 65.3 55.5 0 86.4-45.1 86.4-116.9l-47.8 3.8c0 37.2-12.2 58.8-37.5 58.8-19.5 0-30.9-10.4-58.8-53.4z" fill="url(#SVGID_00000150100707639943330890000011886544216348691624_)"></path></svg>
    ),
    component: <BancoDeDados />
  },

  { 
    title: "Google & Meta", 
    icon: (
      <svg id="fi_3128287" enable-background="new 0 0 100 100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g id="_x34_4.Google_Search"><path d="m42.237 20.749c11.844 0 21.48 9.638 21.48 21.486v-.88h10.731c-.46-17.074-14.256-30.871-31.332-31.332v10.726z" fill="#e74339"></path><path d="m67.957 55.14h10.753v36.387h-10.753z" fill="#4489f1" transform="matrix(-.707 .707 -.707 -.707 177.043 73.335)"></path><path d="m74.448 41.354h-10.731v.88c-.001 11.846-9.637 21.483-21.482 21.483h.88v10.731c17.074-.46 30.871-14.258 31.332-31.334.008-.293.022-.584.022-.878v-.002-.878h-.021z" fill="#4489f1"></path><path d="m42.235 63.717c-11.844-.001-21.481-9.638-21.482-21.482v.878l-.88.002h-9.85c.462 17.074 14.259 30.87 31.332 31.332.293.008.585.022.88.022h.002.878v-.022-10.73z" fill="#38a856"></path><path d="m20.753 43.113v-.878-.002c0-11.845 9.637-21.483 21.482-21.484h.002.878v-10.727-.022h-.88c-.295 0-.587.014-.88.022-17.075.463-30.871 14.258-31.333 31.332-.008.294-.022.586-.022.881v.88h.022 9.85z" fill="#fabc2d"></path></g></svg>
    ),
    component: <BancoDeDados />
  },
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
                <div>
                  <h2>Métricas e relatórios</h2>
                </div>
                 {menuMetricas.map((option) => (
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
            {renderSelectedComponent()}
          </Option>

          
        </Container>
      </Content>
    </>
  );
};


export default Homepage;
