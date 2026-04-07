import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";

// 1. 작품 테이블 (Artworks) - mm 단위 규격 포함
export const artworks = sqliteTable("artworks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  description: text("description"),
  category: text("category").default("Fine Art"),
  priceBuy: real("price_buy").default(0).notNull(),
  priceRental: real("price_rental").default(0).notNull(),
  widthMm: integer("width_mm").default(0).notNull(),  // 작품 가로 (mm)
  heightMm: integer("height_mm").default(0).notNull(), // 작품 세로 (mm)
  imageUrl: text("image_url"),
  modelUrl: text("model_url"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const artworksRelations = relations(artworks, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

// 2. 사용자 테이블 (Users)
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("email_verified", { mode: "timestamp" }),
  image: text("image"),
  password: text("password"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
  payments: many(payments),
  accounts: many(accounts),
  sessions: many(sessions),
}));

// 3. 정기 구독/렌탈 테이블 (Subscriptions)
export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  artworkId: text("artwork_id").notNull().references(() => artworks.id),
  billingKey: text("billing_key").notNull(),
  status: text("status").default("active").notNull(),
  amount: real("amount").notNull(),
  nextPaymentDate: text("next_payment_date").notNull(),
  lastPaymentDate: text("last_payment_date"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  artwork: one(artworks, {
    fields: [subscriptions.artworkId],
    references: [artworks.id],
  }),
}));

// 4. 결제 이력 테이블 (Payments)
export const payments = sqliteTable("payments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  amount: real("amount").notNull(),
  paymentType: text("payment_type").notNull(), // 'buy' or 'rental'
  status: text("status").default("pending").notNull(),
  transactionId: text("transaction_id").unique(),
  merchantUid: text("merchant_uid").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));

// NextAuth 관련 추가 테이블 (Drizzle Adapter 용)
export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  sessionToken: text("sessionToken").notNull().unique(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const verificationTokens = sqliteTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});
