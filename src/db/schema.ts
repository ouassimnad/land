import {
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
  nameFr: text("name_fr").notNull(),
  nameAr: text("name_ar").notNull(),
  descriptionFr: text("description_fr").notNull(),
  descriptionAr: text("description_ar").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  deliveryPrice: numeric("delivery_price", { precision: 10, scale: 2 }),
  discount: integer("discount"),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  colors: jsonb("colors").$type<string[]>().notNull().default([]),
  sizes: jsonb("sizes").$type<string[]>().notNull().default([]),
  category: text("category"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  image: text("image").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type OrderItem = {
  productId: number | null;
  nameAr: string;
  nameFr: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
};

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  productId: integer("product_id"),
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
  deliveryType: varchar("delivery_type", { length: 10 }),
  items: jsonb("items").$type<OrderItem[]>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adminSettings = pgTable("admin_settings", {
  id: integer("id").primaryKey().default(1),
  passwordHash: text("password_hash").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const deliveryPrices = pgTable("delivery_prices", {
  id: serial("id").primaryKey(),
  wilaya: varchar("wilaya", { length: 10 }).notNull().unique(),
  homePrice: numeric("home_price", { precision: 10, scale: 2 }).notNull().default("0"),
  officePrice: numeric("office_price", { precision: 10, scale: 2 }).notNull().default("0"),
});

export const socialSettings = pgTable("social_settings", {
  id: integer("id").primaryKey().default(1),
  instagram: text("instagram").notNull().default(""),
  facebook: text("facebook").notNull().default(""),
  tiktok: text("tiktok").notNull().default(""),
});
