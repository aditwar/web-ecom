import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import db from '@/lib/db';
import { formatNumber, formatRupiah } from '@/helper/formatters';

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaid: true },
    _count: true,
  });
  await wait(2000)
  return {
    amount: (data._sum.pricePaid || 0) / 100,
    numberOfSales: data._count,
  };
}

function wait(duration: number) {
  return new Promise(resolve => setTimeout(resolve, duration))
}

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.author.count(),
    db.order.aggregate({
      _sum: { pricePaid: true },
    }),
  ]);

  const totalPaid = orderData._sum.pricePaid || 0;

  return {
    userCount,
    averageValuePerUser: userCount === 0 ? 0 : totalPaid / userCount / 100,
  };
}

async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    db.event.count({ where: { isAvailable: true } }),
    db.event.count({ where: { isAvailable: false } }),
  ]);

  return { activeCount, inactiveCount };
}

export async function SectionCards() {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
  ]);
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <DashboardCard
        description="Average Value"
        title={formatRupiah(userData.averageValuePerUser)}
        badge={`${formatNumber(userData.userCount)} Customer`}
        footer="Average Value per User"
        footerlow="Based on total sales and user count"
      />
      <DashboardCard
        description="Revenue"
        title={formatRupiah(salesData.amount)}
        badge={`${formatNumber(salesData.numberOfSales)} Orders`}
        footer="Total Omzet"
        footerlow="Meets growth projections"
      />
      <DashboardCard
        description="Active Tickets"
        title={formatNumber(productData.activeCount)}
        badge={`${formatNumber(productData.inactiveCount)} Inactive`}
        footer="Total Tickets"
        footerlow="Acquisition needs attention"
      />
    </div>
  );
}

type DashboardCardProps = {
  description: string;
  title: string;
  badge: string;
  footer: string;
  footerlow: string;
};

function DashboardCard({
  description,
  title,
  badge,
  footer,
  footerlow,
}: DashboardCardProps) {
  return (
    <>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>{description}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {title}
          </CardTitle>
          <CardAction className="absolute right-5 top-[calc(100%-90px)]">
            <Badge variant="outline">
              {badge}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-1 font-medium">
            {footer}
          </div>
          <div className="text-muted-foreground">{footerlow}</div>
        </CardFooter>
      </Card>
    </>
  );
}
