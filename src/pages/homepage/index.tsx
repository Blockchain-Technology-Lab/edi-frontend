import { useRouter } from "next/router" // Import useRouter
import { HomepageCard, HomepageTitleCard } from "@/components"
import {
  faHandshake,
  faCubes,
  faBitcoinSign,
  faNetworkWired,
  faLaptopCode,
  faServer,
  faLayerGroup,
  faEarthAmericas
} from "@fortawesome/free-solid-svg-icons"

export default function HomePage() {
  const router = useRouter() // Create router instance

  const list = [
    {
      title: "Tokenomics",
      url: "/",
      icon: faBitcoinSign,
      github:
        "https://github.com/Blockchain-Technology-Lab/tokenomics-decentralization/",
      desc: "This layer represents the historical decentralisation of block production for various blockchain systems."
    },
    {
      title: "Consensus",
      url: "/consensus",
      icon: faCubes,
      github:
        "https://github.com/Blockchain-Technology-Lab/consensus-decentralization",
      desc: "This layer represents the historical decentralisation of token ownership for various blockchain systems."
    },
    {
      title: "Software",
      url: "/software",
      icon: faLaptopCode,
      github: "",
      desc: "Description of Software Layer"
    },
    {
      title: "Network",
      url: "/network",
      icon: faNetworkWired,
      github: "",
      desc: "Description of Network Layer"
    },
    {
      title: "Hardware",
      url: "/hardware",
      icon: faServer,
      github: "",
      desc: "Description of Hardware Layer"
    },
    {
      title: "Governance",
      url: "/governance",
      icon: faHandshake,
      github: "",
      desc: "Description of Governance Layer"
    },
    {
      title: "API",
      url: "/api",
      icon: faLayerGroup,
      github: "",
      desc: "Description of API Layer"
    },
    {
      title: "Geography",
      url: "/geography",
      icon: faEarthAmericas,
      github: "",
      desc: "Description of Geography Layer"
    }
  ]

  return (
    <>
      <section className="flex flex-col gap-12 mb-8 pb-4">
        <HomepageTitleCard /> {/* Use HomepageCard here */}
        <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
          {list.map((item, index) => (
            <HomepageCard
              key={index}
              title={item.title}
              desc={item.desc}
              icon={item.icon}
              github={item.github}
              onPress={() => router.push(item.url)} // Use onPress for routing
            />
          ))}
        </div>
      </section>
    </>
  )
}
