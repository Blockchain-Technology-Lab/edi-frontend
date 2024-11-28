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
  faEarthAmericas,
  faHome
} from "@fortawesome/free-solid-svg-icons"

export default function HomePage() {
  const router = useRouter() // Create router instance

  const list = [
    {
      title: "Tokenomics",
      url: "/tokenomics",
      icon: faBitcoinSign,
      github:
        "https://github.com/Blockchain-Technology-Lab/tokenomics-decentralization/",
      desc: "This layer describes the decentralisation of token ownership over time.",
      disabled: false
    },
    {
      title: "Consensus",
      url: "/consensus",
      icon: faCubes,
      github:
        "https://github.com/Blockchain-Technology-Lab/consensus-decentralization",
      desc: "This layer describes the decentralisation of block production over time.",
      disabled: false
    },
    {
      title: "Software",
      url: "/software",
      icon: faLaptopCode,
      github: "",
      desc: "This layer describes the decentralisation of the development of full node software projects over time.",
      disabled: false
    },
    {
      title: "Network (Coming Soon)",
      url: "/",
      icon: faHome,
      github: "",
      desc: "We plan to publish the network layer soon. ", // "This layer describes the decentralisation of the network of full-nodes over time."
      disabled: true
    }
    /*
    {
      title: "Network",
      url: "/network",
      icon: faNetworkWired,
      github: "",
      desc: "This layer describes the decentralisation of the network of full-nodes over time."
    },
    {
      title: "Hardware",
      url: "/hardware",
      icon: faServer,
      github: "",
      desc: "This layer describes the decentralisation of hardware components over time."
    },
    {
      title: "Governance",
      url: "/governance",
      icon: faHandshake,
      github: "",
      desc: "This layer describes the decentralisation of decision-making power over tim"
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
    */
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
              disabled={item.disabled}
            />
          ))}
        </div>
      </section>
    </>
  )
}
