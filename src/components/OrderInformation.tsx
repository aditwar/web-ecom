import { formatRupiah } from '@/helper/formatters';
import {
  Button,
  Column,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { OrderInformationProps } from '@/app/type';

const dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });

export function OrderInformation({
  order,
  event,
  pdfUrl,
}: OrderInformationProps & {
  pdfUrl: string;
}) {
  return (
    <>
      <Section className="bg-black text-white p-4 rounded-t-lg">
        <Row>
          <Column>
            <Text className="text-2xl font-bold">
              Event Commerce by adit_war
            </Text>
            <Text className="text-sm">Official Purchase Receipt</Text>
          </Column>
        </Row>
      </Section>

      <Section className="border border-solid border-gray-300 rounded-b-lg p-4">
        <Row>
          <Column>
            <Text className="text-gray-500 text-sm">Order ID</Text>
            <Text className="font-semibold">{order.id}</Text>
          </Column>
          <Column>
            <Text className="text-gray-500 text-sm">Purchased On</Text>
            <Text className="font-semibold">
              {dateFormatter.format(new Date(order.createdAt))}
            </Text>
          </Column>
          <Column>
            <Text className="text-gray-500 text-sm">Price Paid</Text>
            <Text className="font-semibold">
              {formatRupiah(order.pricePaid / 100)}
            </Text>
          </Column>
        </Row>

        <Section className="mt-4">
          <Row className="mt-4">
            <Column>
              <Text className="text-lg font-bold">{event.title}</Text>
              <Text className="text-gray-600">{event.content}</Text>
            </Column>
            <Column align="right">
              <Button
                href={pdfUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Download Here
              </Button>
            </Column>
          </Row>
        </Section>
      </Section>

      <Section className="mt-5 text-center text-gray-500 text-sm">
        <Text>
          Thank you for your purchase. This receipt is automatically generated
          from Event Commerce by adit_war and serves as official proof of
          payment.
        </Text>
        <Text>© {new Date().getFullYear()} Event Commerce, Inc.</Text>
      </Section>
    </>
  );
}
