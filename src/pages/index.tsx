import { Card, Link } from "@/components"

export default function HomePage() {
  return (
    <section className="flex flex-col gap-12">
      <Card title="Takonomics Layer">
        <p>
          These graphs represent the historical decentralisation of token
          ownership for various blockchain systems. Each metric is calculated
          based on the distribution of tokens across the addresses / entities
          that held them in each time period.{" "}
          <Link href="/methodology">Read more...</Link>
        </p>
      </Card>
      <Card title="Options">
        <p>Some fields</p>
      </Card>
      <Card title="Nakamoto coefficient">
        <p>
          The Nakamoto coefficient represents the minimum number of entities
          that collectively control more than 50% of the resources (in this
          case, the majority of circulating tokens at a given point in time).
        </p>
        <p>[CHART]</p>
      </Card>
      <Card title="Gini coefficient">
        <p>
          The Gini coefficient represents the degree of inequality in a
          distribution. Values close to 0 indicate equality (all entities in the
          system control the same amount of assets) and values close to 1
          indicate inequality (one entity holds most or all tokens).
        </p>
        <p>[CHART]</p>
      </Card>
      <Card title="Shannon Entropy">
        <p>
          Shannon entropy (also known as information entropy) represents the
          expected amount of information in a distribution . Typically, a higher
          value of entropy indicates higher decentralization (lower
          predictability).
        </p>
        <p>[CHART]</p>
      </Card>
      <Card title="HHI">
        <p>
          The Herfindahl-Hirschman Index (HHI) is a measure of market
          concentration. It is defined as the sum of the squares of the market
          shares (as whole numbers, e.g. 40 for 40%) of the entities in the
          system. Values close to 0 indicate low concentration (many entities
          hold a similar number of tokens) and values close to 10,000 indicate
          high concentration (one entity controls most or all tokens).
        </p>
        <p>[CHART]</p>
      </Card>
      <Card title="Theil index">
        <p>
          The Theil index captures the lack of diversity, or the redundancy, in
          a population. In practice, it is calculated as the maximum possible
          entropy minus the observed entropy. Values close to 0 indicate
          equality and values towards infinity indicate inequality.
        </p>
        <p>[CHART]</p>
      </Card>
      <Card title="Max power ratio">
        <p>
          The max power ratio represents the share of tokens that are owned by
          the most &quot;powerful&quot; entity, i.e. the wealthiest entity.
        </p>
        <p>[CHART]</p>
      </Card>
      <Card title="τ-decentralization index">
        <p>
          The τ-decentralization index is a generalization of the Nakamoto
          coefficient. It is defined as the minimum number of entities that
          collectively control more than a fraction τ of the total resources (in
          this case more than 66% of the total tokens in circulation).
        </p>
        <p>[CHART]</p>
      </Card>
    </section>
  )
}
