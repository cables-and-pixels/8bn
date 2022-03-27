import App from "next/app";
import { createGlobalStyle } from "styled-components";
import { config, dom } from "@fortawesome/fontawesome-svg-core";

import '../styles/globals.scss';

config.autoAddCss = false;
const GlobalStyles = createGlobalStyle`
    ${dom.css()}
`;

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles/>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
