import React from "react";
import styled from "styled-components";

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="custom-loader" />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  .custom-loader {
    width: 60px;
    height: 60px;
    display: grid;
    border-radius: 50%;
    -webkit-mask: radial-gradient(farthest-side, #0000 40%, #000 41%);
    background:
      linear-gradient(0deg, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 1) 0) center/4px 100%,
      linear-gradient(90deg, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.75) 0) center/100% 4px;
    background-repeat: no-repeat;
    animation: s3 1s infinite steps(12);
  }

  .custom-loader::before,
  .custom-loader::after {
    content: "";
    grid-area: 1/1;
    border-radius: 50%;
    background: inherit;
    opacity: 0.915;
    transform: rotate(30deg);
  }

  .custom-loader::after {
    opacity: 0.83;
    transform: rotate(60deg);
  }

  @keyframes s3 {
    100% {
      transform: rotate(1turn);
    }
  }
`;

export default Loader;
