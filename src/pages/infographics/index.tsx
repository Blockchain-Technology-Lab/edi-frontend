import { Card, InfographicsImages } from "@/components"

const Infographics = () => {
  return (
    <section className="flex flex-col gap-12">
      <Card title="Infographics" titleAs="h1" titleAppearance="xl">
        <p>
          The Edinburgh Decentralisation Index (EDI) offers a detailed framework
          to measure blockchain decentralisation across multiple dimensions like
          consensus, tokenomics, and software. Check out these visuals for more
          insights!{" "}
        </p>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <InfographicsImages />
        </div>
      </Card>
    </section>
  )
}

export default Infographics
