import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Content = styled.div`
  border: 1px solid #00000050;
  width: 100%;
  max-width: 250px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
  padding: 15px;
  position: relative;
  overflow: hidden;

  & img {
    width: auto;
    right: 0px;
    bottom: 0px;
    height: 30px;
    object-fit: contain;
    position: absolute;
    z-index: -1;
    border: 1px solid #00000050;
    padding: 5px;
    border-bottom: 0;
    border-right: 0;
  }

  & h2 {
    font-size: 20px;
    font-weight: 600;
    color: transparent;
    background: linear-gradient(90deg, #bd0a0a, #2e2d2d, #003aa7);
    -webkit-background-clip: text;
  }

  & button {
    padding: 5px 15px;
    background-color: #000000;
    border: 2px solid #727272;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
  }
`;

const SelectBC = ({ image, nome, background, onClick }) => {
    const handleClick = () => {
      if (onClick) onClick();
    };
  
    return (
      <Content onClick={handleClick} background={background}>
        <img src={image} alt={nome} />
        <h2>{nome}</h2>
        <button onClick={handleClick}>Selecionar</button>
      </Content>
    );
  };
  
  export default SelectBC;