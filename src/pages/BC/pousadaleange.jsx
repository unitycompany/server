import React, { useState } from "react";
import styled from "styled-components";

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

// Importa os componentes de exemplo para cada coleção
import Event from "../../components/PousadaLeAnge/Event";
import Pacotes from "../../components/PousadaLeAnge/Pacotes";

const PousadaLeAnge = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  return (
    <Container>
      <Top>
        <h1>
          {selectedComponent
            ? `Pousada Le Ange - ${selectedComponent}`
            : "Selecione uma coleção"}
        </h1>
        {selectedComponent && (
          <button onClick={() => setSelectedComponent(null)}>Voltar</button>
        )}
      </Top>

      {!selectedComponent ? (
        <Options>
          <div>
            <img
              src="https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/57be02d8-b8f7-4935-47f6-0109dd2d1e00/public"
              alt="Eventos"
            />
            <article>
              <h1>Eventos</h1>
              <button onClick={() => setSelectedComponent("Eventos")}>
                Selecionar
              </button>
            </article>
          </div>

          <div>
            <img
              src="https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/ac764eeb-76f9-4c41-b07f-73567f68ee00/public"
              alt="Pacotes"
            />
            <article>
              <h1>Pacotes</h1>
              <button onClick={() => setSelectedComponent("Pacotes")}>
                Selecionar
              </button>
            </article>
          </div>
        </Options>
      ) : selectedComponent === "Eventos" ? (
        <Event />
      ) : (
        <Pacotes />
      )}
    </Container>
  );
};

export default PousadaLeAnge;
