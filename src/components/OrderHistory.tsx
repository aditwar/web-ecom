import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components"
import { OrderInformation } from "@/components/OrderInformation"
import React from "react"
import { OrderHistoryEmailProps } from "@/app/type"

OrderHistoryEmail.PreviewProps = {
  orders: [
    {
      id: Math.floor(Math.random() * 1000000),
      createdAt: new Date(),
      pricePaid: 10000,
      verificationId: Math.floor(Math.random() * 1000000).toString(),
      event: {
        title: "Event name",
        slug: "event-name",
        image: "/events/event-image.jpg",
        content: "Some content about the event",
      },
    },
    {
      id: Math.floor(Math.random() * 1000000),
      createdAt: new Date(),
      pricePaid: 2000,
      verificationId: Math.floor(Math.random() * 1000000).toString(),
      event: {
        title: "Event name 2",
        slug: "event-name-2",
        image: "/events/event-2.jpg",
        content: "Some content about the second event",
      },
    },
    {
      id: Math.floor(Math.random() * 1000000),
      createdAt: new Date(),
      pricePaid: 2000,
      verificationId: Math.floor(Math.random() * 1000000).toString(),
      event: {
        title: "Event name 3",
        slug: "event-name-3",
        image: "/events/event-3.jpg",
        content: "Some content about the third event",
      },
    }
  ]
} satisfies OrderHistoryEmailProps

export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
  return (
    <Html>
      <Preview>Order History & Downloads</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Order History</Heading>
            {orders.map((order, index) => (
              <React.Fragment key={order.id}>
                <OrderInformation
                  order={order}
                  event={order.event}
                  verificationId={order.verificationId}
                />
                {index < orders.length - 1 && <Hr />}
              </React.Fragment>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
