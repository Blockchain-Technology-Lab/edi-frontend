import "@/styles/globals.css"
import "chartjs-adapter-moment"
import Head from "next/head"
import type { AppProps } from "next/app"
import { ThemeProvider } from "next-themes"
import { Footer, MainLayout, Sidebar } from "@/components"
import ChartjsPluginWatermark from "chartjs-plugin-watermark"
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from "chart.js"

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartjsPluginWatermark
)

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
