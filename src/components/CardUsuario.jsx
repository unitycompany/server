import React from "react";
import styled from "styled-components";

const Card = styled.div`
  border: 1px solid #00000050;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  & h2 {
    font-size: 18px;
    font-weight: 600;
  }

  & article {
    display: flex;
    flex-direction: column;
    gap: 10px;

    & label {
      position: relative;
      padding: 10px 15px;
      border: 1px solid #00000030;

      & span {
        position: absolute;
        top: -12px;
        left: 5px;
        background-color: #fff;
        padding: 2px 5px;
        font-size: 12px;
        font-weight: 600;
      }

      & p {
        font-size: 14px;
      }
    }
  }

  & div {
    display: flex;
    gap: 5px;

    & button {
      padding: 5px 10px;
      border: 2px solid #000;
      cursor: pointer;
      font-size: 14px;

      &:first-child {
        background-color: #353535;
        color: #fff;
      }
    }
  }
`;

const CardUser = ({ nome, login, senha, onEdit, onDelete }) => {
  return (
    <Card>
      <h2>{nome}</h2>
      <article>
        <label>
          <span>Login</span>
          <p>{login}</p>
        </label>
        <label>
          <span>Senha</span>
          <p>{senha}</p>
        </label>
      </article>
      <div>
        <button onClick={onEdit}>Editar</button>
        <button onClick={onDelete}>Excluir</button>
      </div>
    </Card>
  );
};

export default CardUser;
