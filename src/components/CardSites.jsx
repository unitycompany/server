import React from "react";
import styled from "styled-components";

const Card = styled.div`
  border: 1px solid red;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;
  max-width: 300px;
  padding: 15px;

  & img {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }

  & h2 {
    font-size: 20px;
    font-weight: 600;
  }

  & a {
    font-size: 16px;
    line-height: 120%;
    color: #008ee0;
    cursor: pointer;
    text-decoration: none;
  }
`;

const CardSite = ({ logo, name, url }) => {
  return (
    <Card>
      <img src={logo} alt={name} />
      <h2>{name} Institucional Fast</h2>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </a>
    </Card>
  );
};

export default CardSite;
