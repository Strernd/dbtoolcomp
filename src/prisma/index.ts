import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Get all customers
  const customers = await prisma.customer.findMany();
  console.log("Customers");
  customers.forEach((x) => console.log(`${x.id} ${x.name} ${x.email}`));

  // Get all orders with value for customer
  const customer = await prisma.customer.findUnique({
    where: { email: "alice@test.com" },
  });
  console.log(customer);
  const orders = await prisma.order.findMany({
    include: { orderItems: true },
    where: { customerId: customer!.id },
  });

  const mapped = orders.map((x) => ({
    ...x,
    // want to acutally do this in the query
    total: x.orderItems.reduce((acc, y) => acc + y.quantity * y.unitPrice, 0),
  }));
  console.log(mapped);

  await prisma.$disconnect();

  // get all items for a specific order
  const orderId = 1;
  const items = await prisma.orderItem.findMany({
    where: { orderId },
  });
  console.log(items);

  // get total order volume in a timerange
  const start = new Date("2024-09-01");
  const end = new Date("2024-09-30");
  const total = await prisma.orderItem.aggregate({
    where: { order: { orderDate: { gte: start, lte: end } } },
    _sum: { quantity: true, unitPrice: true },
  });
  // We can't multiply quantity with the unit price here in the query
  console.log(total);
}

main();
