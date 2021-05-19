import "../styles/globals.css";

import { init_i18n } from "../lib/i18n";

import { AppProps } from "next/app";
import { isServer } from "../lib/isServer";

if (!isServer) {
  init_i18n();
}

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
