import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto');
  ${reset};
  *{
    box-sizing: border-box;
  }
  html,body{
    scroll-behavior: smooth;
    width: 100%;
    font-family: 'Roboto', sans-serif;
  }
`;
