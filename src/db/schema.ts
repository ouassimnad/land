import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  oldPrice: numeric("old_price", { precision: 10, scale: 2 }),
  description: text("description").notNull(),
  image: text("image").notNull(),
  colors: jsonb("colors").$type<string[]>().notNull().default([]),
  sizes: jsonb("sizes").$type<string[]>().notNull().default([]),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: varchar("customer_name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  wilaya: varchar("wilaya", { length: 120 }).notNull(),
  commune: varchar("commune", { length: 120 }).notNull(),
  address: text("address").notNull(),
  quantity: integer("quantity").notNull().default(1),
  color: varchar("color", { length: 40 }).notNull(),
  size: varchar("size", { length: 20 }).notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  deliveryPrice: numeric("delivery_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 30 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adminSettings = pgTable("admin_settings", {
  id: integer("id").primaryKey().default(1),
  passwordHash: text("password_hash").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
