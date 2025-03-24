import React, { useState } from "react";
import styled from "styled-components";
import Artigo from "../../components/NovaMetalica/Artigo";
import Blog from "../../components/NovaMetalica/Blog";

const Container = styled.div`
  overflow-y: auto;
  height: auto;
  max-height: 65vh;
  padding: 5px;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #00000050;
  padding: 10px 0;
  margin-bottom: 10px;

  & h1 {
    font-weight: 600;
  }

  & button {
    padding: 5px 15px;
    background-color: #000;
    border: 2px solid #727272;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
  }
`;

const Options = styled.div`
  & div {
    padding: 10px 0;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 20px;
    border-bottom: 1px solid #00000050;

    & img {
      width: 400px;
      border: 1px solid #00000050;
    }

    & article {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 10px;

      & h1 {
        font-size: 20px;
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

    }

    
  }
`;

const NovaMetalica = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  return (
    <Container>
      <Top>
        <h1>
          {selectedComponent
            ? `Nova Metálica - ${selectedComponent}`
            : "Selecione uma coleção"}
        </h1>
        {selectedComponent && (
          <button onClick={() => setSelectedComponent(null)}>Voltar</button>
        )}
      </Top>
      {!selectedComponent ? (
        <Options>
          <div>
            <img src="https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/1e89e475-4dd8-43bb-8bc9-a9c286189600/public" alt="Artigos" />
            <article>
                <h1>Artigos</h1>
                <button onClick={() => setSelectedComponent("Artigos")}>Selecionar</button>
            </article>
          </div>
          <div>
            <img src="https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/4e424ada-cd36-4fa1-2684-8a321c1b9a00/public" alt="Blog" />
            <article>
                <h1>Blog</h1>
                <button onClick={() => setSelectedComponent("Blog")}>Selecionar</button>
            </article>
          </div>
        </Options>
      ) : selectedComponent === "Artigos" ? (
        <Artigo />
      ) : selectedComponent === "Blog" ? (
        <Blog />
      ) : null}
    </Container>
  );
};

export default NovaMetalica;
