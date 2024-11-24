import { Card, CardBody, CardFooter } from "@nextui-org/react"
//import { Card } from "@/components"
import { useRouter } from "next/router" // Import useRouter
import { HomepageCard, HomepageTitleCard } from "@/components"

export default function HomePage() {
  const router = useRouter() // Create router instance

  const list = [
    {
      title: "Tokenomics",
      url: "/",
      desc: "This layer represents the historical decentralisation of block production for various blockchain systems."
    },
    {
      title: "Consensus",
      url: "/consensus",
      desc: "This layer represents the historical decentralisation of token ownership for various blockchain systems."
    },
    {
      title: "Software",
      url: "/software",
      desc: "Description of Software Layer"
    },
    {
      title: "Network",
      url: "/network",
      desc: "Description of Network Layer"
    },
    {
      title: "Hardware",
      url: "/hardware",
      desc: "Description of Hardware Layer"
    },
    {
      title: "Governance",
      url: "/governance",
      desc: "Description of Governance Layer"
    },
    {
      title: "API",
      url: "/api",
      desc: "Description of API Layer"
    },
    {
      title: "Geography",
      url: "/geography",
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
              onPress={() => router.push(item.url)} // Use onPress for routing
            />
          ))}
        </div>
      </section>
    </>
  )
}
