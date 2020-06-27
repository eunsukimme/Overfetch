import React, { Component } from "react";
// import "./css/footer.css";
import styled from "styled-components";

const FooterContainer = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
`;

const Message = styled.div`
  color: white;
  text-align: center;
`;

export class Footer extends Component {
  render() {
    return (
      <FooterContainer className="footer">
        <Message>© Data based on playoverwatch.com</Message>
      </FooterContainer>
    );
  }
}
