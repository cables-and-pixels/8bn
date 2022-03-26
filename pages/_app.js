import App from "next/app";
import { createGlobalStyle } from "styled-components";
import { config, dom } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;
const GlobalStyles = createGlobalStyle`
    ${dom.css()}
`;

import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles/>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp
