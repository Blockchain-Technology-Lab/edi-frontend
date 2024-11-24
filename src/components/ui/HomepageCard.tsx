import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react"

interface HomepageCardProps {
  title: string
  desc: string
  onPress: () => void
}

export function HomepageCard({ title, desc, onPress }: HomepageCardProps) {
  return (
    <Card
      isPressable
      isHoverable
      className="max-w-[400px] border border-default"
      onPress={onPress} // Add the onPress functionality
    >
      <CardHeader>
        <h4 className="font-bold">{title}</h4>
      </CardHeader>
      <CardBody>
        <p>{desc}</p>
      </CardBody>
      <CardFooter>
        <span>Footer Content</span>
      </CardFooter>
    </Card>
  )
}
