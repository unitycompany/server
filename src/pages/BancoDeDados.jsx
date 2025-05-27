import React, { useState } from "react";
import styled from "styled-components";
import SelectBC from "../components/SelectBC";

// Importe os componentes que serão renderizados para cada opção
import PousadaLeAnge from "./BC/pousadaleange";
import FastHomes from "./BC/fasthomes";
import NovaMetalica from "./BC/novametalica";

const Content = styled.div`
  padding: 2.5%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
  width: 100%;
  overflow-y: auto;

  & h1 {
    font-weight: 600;
  }
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #00000050;
  padding: 10px 0;

  & button {
    padding: 5px 15px;
    background-color: #000000;
    border: 2px solid #727272;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
  }
`;

const Center = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  height: auto;
  gap: 10px;
`;

const OptionContainer = styled.div`
  margin-top: 20px;
  width: 100%;
`;

const BancoDeDados = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isAddingFastHome, setIsAddingFastHome] = useState(false);

  const options = [
    {
      key: "pousada",
      nome: "Pousada Le Ange",
      image:
        "https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/d3fbafba-3dfe-4924-e857-b45059def500/public",
      background:
        "https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/74bff9be-8742-4468-e032-4cf79abe5300/public",
      component: <PousadaLeAnge />,
    },
    {
      key: "fasthomes",
      nome: "Fast Homes",
      image:
        "https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/43559069-41c7-4c75-ce90-1623e0a7a300/public",
      background:
        "https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/5493a461-fb61-43ac-8edb-b734ca35fc00/public",
      component: <FastHomes />,
    },
    {
      key: "novaMetalica",
      nome: "Nova Metálica",
      image:
        "https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/ac74b2e2-0302-4630-03ad-095ea787a100/public",
      background:
        "https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/8ac1e6f6-d87e-438e-9c4d-ab5124e8c300/public",
      component: <NovaMetalica />,
    },
  ];

  return (
    <Content>
      <Top>
        <h1>Banco de dados</h1>
        <div style={{ display: "flex", gap: 8 }}>
          {selectedComponent && (
            <button onClick={() => setSelectedComponent(null)}>Voltar</button>
          )}
        </div>
      </Top>
      {selectedComponent ? (
        <OptionContainer>
          {selectedComponent.type && selectedComponent.type.name === "FastHomes" && isAddingFastHome ? (
            React.cloneElement(selectedComponent, { isAdding: isAddingFastHome, setIsAdding: setIsAddingFastHome })
          ) : (
            selectedComponent
          )}
        </OptionContainer>
      ) : (
        <Center>
          {options.map((option) => (
            <SelectBC
              key={option.key}
              image={option.image}
              nome={option.nome}
              background={option.background}
              onClick={() => setSelectedComponent(option.component)}
            />
          ))}
        </Center>
      )}
    </Content>
  );
};

export default BancoDeDados;
