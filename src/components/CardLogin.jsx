import React, { useState } from "react";
import styled from "styled-components";
import { editLogin } from "./../../firebaseService";

const Card = styled.div`
    border: 1px solid #00000050;
    padding: 15px;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    gap: 15px;
    min-width: 250px;

    & h1 {
        font-size: 18px;
        font-weight: 800;
        text-transform: uppercase;
        color: transparent;
        background: linear-gradient(90deg, #bd0a0a, #2e2d2d, #003aa7);
        -webkit-background-clip: text;
    }

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
            transition: all .2s ease-in-out;

            &:nth-child(1){
                background-color: #000;
                color: #fff;
            }

            &:nth-child(2){
                background-color: #fff;
                color: #000;
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
`

const CardLogin = ({ id, nomeSite, login, senha, obs, onRemove }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedLogin, setUpdatedLogin] = useState({ login, senha });

    const handleSave = async () => {
        await editLogin("default", id, updatedLogin);
        setIsEditing(false);
    };

    return (
        <Card>
            <div>
                <h1>{nomeSite}</h1>
                <span>{obs}</span>
            </div>
            <label>
                <span>Login</span>
                {isEditing ? (
                    <input
                        type="text"
                        value={updatedLogin.login}
                        onChange={(e) => setUpdatedLogin({ ...updatedLogin, login: e.target.value })}
                    />
                ) : (
                    <p>{login}</p>
                )}
            </label>
            <label>
                <span>Senha</span>
                {isEditing ? (
                    <input
                        type="text"
                        value={updatedLogin.senha}
                        onChange={(e) => setUpdatedLogin({ ...updatedLogin, senha: e.target.value })}
                    />
                ) : (
                    <p>{senha}</p>
                )}
            </label>
            <div>
                {isEditing ? (
                    <button onClick={handleSave}>Salvar</button>
                ) : (
                    <button onClick={() => setIsEditing(true)}>Editar</button>
                )}
                <button onClick={onRemove}>Remover</button>
            </div>
        </Card>
    );
};

export default CardLogin;