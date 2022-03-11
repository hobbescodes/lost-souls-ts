import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { RecoilRoot } from "recoil";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <RecoilRoot>
        <MoralisProvider
          appId={process.env.NEXT_PUBLIC_APP_ID || ""}
          serverUrl={process.env.NEXT_PUBLIC_SERVER_URL || ""}
        >
          <Component {...pageProps} />
        </MoralisProvider>
      </RecoilRoot>
    </ThemeProvider>
  );
}

export default MyApp;
