import "bootstrap/dist/css/bootstrap.min.css"
import "@/styles/globals.css"
import "chartjs-adapter-moment"
import Head from "next/head"
import type { AppProps } from "next/app"
import { ThemeProvider } from "next-themes"
import { GoogleAnalytics } from "@next/third-parties/google"
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
      <GoogleAnalytics gaId="G-4H72FE76WD" />
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
