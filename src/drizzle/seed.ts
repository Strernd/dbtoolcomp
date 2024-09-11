import { db, connection } from "./db/connection";
import { customers, NewCustomer, orderItems, orders } from "./db/schema";

async function main() {
  const customerData: NewCustomer = {
    name: "Alice",
    email: "alice@test.com",
  };
  // Retruns array - meh, but accurate from SQL perspective
  const customer1 = await db
    .insert(customers)
    .values(customerData)
    .returning()
    .execute();

  const customer2 = await db
    .insert(customers)
    .values({ name: "Bob", email: "bob@test.com" })
    .returning()
    .execute();

  const orderAlice1 = await db
    .insert(orders)
    .values({
      customerId: customer1[0].id,
      orderDate: new Date().toISOString(),
    })
    .returning();
  const orderAlice2 = await db
    .insert(orders)
    .values({
      customerId: customer1[0].id,
      orderDate: new Date().toISOString(),
    })
    .returning();
  const orderBob1 = await db
    .insert(orders)
    .values({
      customerId: customer2[0].id,
      orderDate: new Date().toISOString(),
    })
    .returning();

  await db.insert(orderItems).values({
    orderId: orderAlice1[0].id,
    productCode: "macbook",
    quantity: 2,
    unitPrice: 1999_99,
  });
  await db.insert(orderItems).values({
    orderId: orderAlice1[0].id,
    productCode: "iphone",
    quantity: 1,
    unitPrice: 999_99,
  });

  await db.insert(orderItems).values({
    orderId: orderAlice2[0].id,
    productCode: "ipad",
    quantity: 1,
    unitPrice: 799_99,
  });

  await db.insert(orderItems).values({
    orderId: orderBob1[0].id,
    productCode: "macbook",
    quantity: 1,
    unitPrice: 1999_99,
  });

  await db.insert(orderItems).values({
    orderId: orderBob1[0].id,
    productCode: "iphone",
    quantity: 1,
    unitPrice: 999_99,
  });

  await connection.close();
}
main();
