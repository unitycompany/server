import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Content = styled.div`
  border: 1px solid #00000030;
  border-left-color: #00ff2a1f;
  border-left-width: 3px;
  width: 100%;
  min-width: 250px;
  height: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 5px 5px 5px 10px;
  position: relative;
  overflow: hidden;
  transition: all .1s ease-out;

  &:hover {
    background-color: #00000010;
  }

  & h2 {
    font-size: 18px;
    font-weight: 400;
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
        <h2>{nome}</h2>
        <button onClick={handleClick}>Selecionar</button>
      </Content>
    );
  };
  
  export default SelectBC;