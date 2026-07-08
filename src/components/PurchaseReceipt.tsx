import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from '@react-email/components';
import { OrderInformation } from '@/components/OrderInformation';
import { PurchaseReceiptEmailProps } from '@/app/type';

PurchaseReceiptEmail.PreviewProps = {
  event: {
    title: 'Event name',
    content: 'Some content about the event',
    image:
      '/public/events/event-numbers.jpg',
    slug: 'event-name',
  },
  order: {
    id: Math.floor(Math.random() * 1000000),
    createdAt: new Date(),
    pricePaid: 100000,
  },
  pdfUrl: 'https://example.com/invoice.pdf',
} satisfies PurchaseReceiptEmailProps;

export default function PurchaseReceiptEmail({
  order,
  event,
  pdfUrl,
}: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Preview>Download {event.title} and view receipt</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <OrderInformation
              order={order}
              event={event}
              pdfUrl={pdfUrl}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
