import { Card, CardBody, CardFooter } from "@nextui-org/react"
//import { Card } from "@/components"
import { useRouter } from "next/router" // Import useRouter

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
        <Card title="EDI Dashboard">
          <p className="px-6 py-4">
            These layers represent the historical decentralisation of various
            blockchain implementations.
          </p>
        </Card>
      </section>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {list.map((item, index) => (
          <Card
            shadow="sm"
            key={index}
            isPressable
            onPress={() => router.push(item.url)}
            className="mb-2 mr-2"
          >
            <CardBody className="overflow-visible p-4 h-32 mb-8">
              <p className="text-left">{item.desc}</p>{" "}
              {/* Display the description */}
            </CardBody>
            <CardFooter className="text-small justify-between">
              <b>{item.title}</b>
              <p className="text-default-500"></p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  )
}
