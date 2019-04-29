import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto');
  ${reset};
  html,body{
    height: 100%;
    width: 100%;
    font-family: 'Roboto', sans-serif;
  }
  a{
      color:inherit;
  }
  #root{
    width: 100%;
  }
  main{
    background-color: #222222;
    height: 100%;
  }
`;
