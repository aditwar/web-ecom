import * as fs from 'fs';
import * as path from 'path';
import db from '../src/lib/db';

async function main() {
  // Fetch all orders
  const orders = await db.order.findMany({
    select: { createdAt: true, pricePaid: true },
    orderBy: { createdAt: 'asc' },
  });

  // Group by day
  const grouped: Record<string, number> = {};
  for (const order of orders) {
    const date = order.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
    grouped[date] = (grouped[date] || 0) + order.pricePaid / 100; // convert cents to currency
  }

  // Convert to array
  const result = Object.entries(grouped).map(([date, total]) => ({
    date,
    total,
  }));

  // Write to /public/data.json
  const filePath = path.join(process.cwd(), 'public', 'data.json');
  fs.writeFileSync(filePath, JSON.stringify(result, null, 2));

  console.log(`✅ data.json generated with ${result.length} entries`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
