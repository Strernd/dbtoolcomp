import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const customer1 = await prisma.customer.create({
    data: { name: "Alice", email: "alice@test.com" },
  });
  console.log(customer1);
  const customer2 = await prisma.customer.create({
    data: { name: "Bob", email: "bot@test.com" },
  });
  console.log(customer2);

  const orderAlice1 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      orderDate: new Date(),
    },
  });
  const orderAlice2 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      orderDate: new Date(),
    },
  });
  const orderBob1 = await prisma.order.create({
    data: {
      customerId: customer2.id,
      orderDate: new Date(),
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: orderAlice1.id,
      productCode: "macbook",
      quantity: 2,
      unitPrice: 1999_99,
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: orderAlice1.id,
      productCode: "iphone",
      quantity: 1,
      unitPrice: 999_99,
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: orderAlice2.id,
      productCode: "ipad",
      quantity: 1,
      unitPrice: 799_99,
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: orderBob1.id,
      productCode: "ipad",
      quantity: 1,
      unitPrice: 799_99,
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: orderBob1.id,
      productCode: "iphone",
      quantity: 1,
      unitPrice: 999_99,
    },
  });

  await prisma.$disconnect();
}

main();
