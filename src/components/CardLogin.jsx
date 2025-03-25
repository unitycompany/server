import React from "react";
import styled from "styled-components";
import { 
  FaLinkedin, FaInstagram, FaYoutube, FaFacebook, FaBehance, FaCpanel, FaFigma, FaGithub, 
  FaGoogleDrive, FaGoogle, FaLink, FaMailchimp, FaPinterest, FaShopify, FaSpotify, FaTiktok, 
  FaWordpress
} from "react-icons/fa";
import { IoLogoFirebase, IoLogoVercel } from "react-icons/io5";
import { FaMeta } from "react-icons/fa6";
import { SiCloudflare, SiFreepik, SiGoogleads, SiMake, SiSemrush, SiZapier } from "react-icons/si";
import { PiLinktreeLogo } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";

// Mapeamento de empresa => logo
const companyLogos = {
  "Nova Metálica": "https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/40b3886f-6f2c-466e-88f5-6af0faa43a00/public", 
  "Fast Sistemas Construtivos": "https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/ab2d9dea-3941-4e10-9c18-e421dbf99700/public",
  "Fast Homes": "https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/e4c70620-1eb2-4aa5-cc40-cae32ffdec00/public",
  "Pousada Le Ange": "https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/8dca7e66-ce93-48a8-b05b-7c8fd4fc6600/public",
  "Milena": "https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/848a015b-f90f-4079-e0f0-f99e09cde000/public",
  "Unity": "https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/c9f7b8c5-3736-4ac4-0d0b-97bf217b5100/public"
};

const Card = styled.div`
  border: 1px solid #00000030;
  padding: 5px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
  min-width: 250px;
  position: relative;

  & label {
    border: 1px solid #00000020;
    padding: 15px 10px 10px 10px;
    position: relative;

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

    & p {
      font-size: 14px;
      color: #000;
    }
  }

  & div {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    & span {
      font-size: 12px;
    }

    & button {
      width: 50%;
      border: 1px solid #000;
      padding: 5px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.1s ease-in-out;

      &:nth-child(1) {
        background-color: #000;
        color: #fff;
        &:hover {
          background-color: #00ff2a1f;
          color: #000;
        }
      }

      &:nth-child(2) {
        background-color: #fff;
        color: #000;
        &:hover {
          background-color: #ff00001f;
          color: #000;
        }
      }
    }
  }

  & article {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    & span {
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: auto;
      white-space: nowrap;
      gap: 5px;
      font-weight: 600;

      & svg {
        width: 16px;
      }
    }
  }
`;

const CardTitle = styled.h2`
  display: flex;
  align-items: center!important;
  justify-content: center!important;
  gap: 5px;
  flex-direction: row-reverse;

  & span {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & svg {
    font-size: 18px;
  }

  & h1 {
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
  }
`;

const Google = styled.span`
  position: absolute;
  width: max-content;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  top: 5px;
  right: 5px;
  font-size: 14px;
  padding: 3px;
  color: #fff;
  border: 1px solid #00000020;
`;

const Empresa = styled.span`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 5px;
  right: 30px;
  font-size: 8px;
  color: #fff;
  font-weight: 600;
  border: 1px solid #00000020;

  img {
    display: block;
    width: 20px;
    height: auto;
  }
`;

const CardLogin = ({ 
  nomeSite, 
  login, 
  senha, 
  obs, 
  onRemove, 
  onEdit, 
  empresa, 
  googleLogin 
}) => {
  // Mapeia o nome da rede para o respectivo ícone
  const socialIcons = {
    semlogo: <FaLink />,
    linkedin: <FaLinkedin />,
    instagram: <FaInstagram />,
    youtube: <FaYoutube />,
    facebook: <FaFacebook />,
    behance: <FaBehance />,
    cpanel: <FaCpanel />,
    figma: <FaFigma />,
    github: <FaGithub />,
    drive: <FaGoogleDrive />,
    google: <FaGoogle />,
    mailchimp: <FaMailchimp />,
    pinterest: <FaPinterest />,
    shopify: <FaShopify />,
    spotify: <FaSpotify />,
    tiktok: <FaTiktok />,
    wordpress: <FaWordpress />,
    vercel: <IoLogoVercel />,
    meta: <FaMeta />,
    googleads: <SiGoogleads />,
    linktree: <PiLinktreeLogo />,
    zapier: <SiZapier />,
    make: <SiMake />,
    cloudflare: <SiCloudflare />,
    firebase: <IoLogoFirebase />,
    semrush: <SiSemrush />,
    freepik: <SiFreepik />,
  };

  return (
    <Card>
      <CardTitle>
        <h1>{nomeSite}</h1>
        {obs && socialIcons[obs] ? (
          <span title={obs}>{socialIcons[obs]}</span>
        ) : null}
      </CardTitle>
      
      {/* Exibe o ícone do Google se googleLogin for true */}
      {googleLogin && (
        <Google>
          <FcGoogle title="Login com Google" />
        </Google>
      )}

      {/* Exibe a logo da empresa com tooltip */}
      {empresa && companyLogos[empresa] && (
        <Empresa>
          <img src={companyLogos[empresa]} alt={empresa} title={empresa} />
        </Empresa>
      )}

      <label>
        <span>Login</span>
        <p>{login}</p>
      </label>
      <label>
        <span>Senha</span>
        <p>{senha}</p>
      </label>
      <div>
        <button onClick={onEdit}>Editar</button>
        <button onClick={onRemove}>Excluir</button>
      </div>
    </Card>
  );
};

export default CardLogin;
