import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name"),
});
export type NewCustomer = typeof customers.$inferInsert;
export type Customer = typeof customers.$inferSelect;

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey(),
  customerId: integer("customerId")
    .notNull()
    .references(() => customers.id),
  orderDate: text("orderDate").notNull(),
});

export type NewOrder = typeof orders.$inferInsert;
export type Order = typeof orders.$inferSelect;

export const orderItems = sqliteTable("orderItems", {
  id: integer("id").primaryKey(),
  orderId: integer("orderId")
    .notNull()
    .references(() => orders.id),
  productCode: text("productCode").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unitPrice").notNull(),
});

export type NewOrderItem = typeof orderItems.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
