import { between, eq, gte, sql, sum } from "drizzle-orm";
import { db, connection } from "./db/connection";
import * as schema from "./db/schema";

async function main() {
  // Get all customers
  const customers = await db.select().from(schema.customers);
  console.log(customers);

  // Get all orders with value for customer
  const customer = await db
    .select()
    .from(schema.customers)
    .where(eq(schema.customers.email, "alice@test.com"))
    .limit(1);

  const sq = db.$with("sq").as(
    db
      .select({
        total:
          // a bit ugly, but works
          sql<number>`sum(${schema.orderItems.quantity} * ${schema.orderItems.unitPrice})`.as(
            "total"
          ),
        orderId: schema.orderItems.orderId,
      })
      .from(schema.orderItems)
      .groupBy(schema.orderItems.orderId)
  );

  const ordersWithTotal = await db
    .with(sq)
    .select()
    .from(schema.orders)
    .leftJoin(sq, eq(schema.orders.id, sq.orderId));

  console.log(ordersWithTotal);

  // get all items for a specific order
  const orderId = 1;
  // query api
  const items = await db.query.orderItems.findFirst({
    where: eq(schema.orderItems.orderId, orderId),
  });
  console.log(items);

  // get total order volume in a timerange
  const start = new Date("2024-09-01").toISOString();
  const end = new Date("2024-09-30").toISOString();

  const total = await db
    .with(sq)
    .select({ total: sum(sq.total) })
    .from(schema.orders)
    .leftJoin(sq, eq(schema.orders.id, sq.orderId))
    .where(between(schema.orders.orderDate, start, end));
  await connection.close();
  console.log("total", total);
}
main();
