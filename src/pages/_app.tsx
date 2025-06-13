import "bootstrap/dist/css/bootstrap.min.css"
import "@/styles/globals.css"
import "chartjs-adapter-moment"
import Head from "next/head"
import type { AppProps } from "next/app"
import { ThemeProvider } from "next-themes"
import Script from "next/script"
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

//import { NextUIProvider } from "@heroui/react"
import { ScrollProvider } from "@/components"

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
        <title>EDI - Dashboard</title>
      </Head>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=G-4H72FE76WD`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-4H72FE76WD');
        `}
      </Script>
      <ThemeProvider attribute="class">
        <ScrollProvider>
          <MainLayout
            main={<Component {...pageProps} />}
            footer={<Footer />}
            sidebar={<Sidebar />}
          />
        </ScrollProvider>
      </ThemeProvider>
    </>
  )
}
