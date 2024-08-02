import "@/styles/globals.css"
import Head from "next/head"
import type { AppProps } from "next/app"
import { ThemeProvider } from "next-themes"
import { Footer, MainLayout, Sidebar } from "@/components"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>EDI - Tokenomics Layer</title>
      </Head>
      <ThemeProvider attribute="class">
        <MainLayout
          main={<Component {...pageProps} />}
          footer={<Footer />}
          sidebar={<Sidebar />}
        />
      </ThemeProvider>
    </>
  )
}
