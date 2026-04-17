import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";

// 1. 작품 테이블 (Artworks) - mm 단위 규격 포함
export const artworks = sqliteTable("artworks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id), // 추가: 작가 ID
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

export const artworksRelations = relations(artworks, ({ one, many }) => ({
  author: one(users, {
    fields: [artworks.userId],
    references: [users.id],
  }),
  subscriptions: many(subscriptions),
  favorites: many(favorites),
}));

// 2. 사용자 테이블 (Users)
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("email_verified", { mode: "timestamp" }),
  image: text("image"),
  password: text("password"),
  role: text("role").default("user").notNull(), // 'user', 'artist', 'admin'
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
  payments: many(payments),
  accounts: many(accounts),
  sessions: many(sessions),
  favorites: many(favorites),
  notifications: many(notifications),
}));

// ... (기존 favorites 테이블 유지)

// 6. 알림 테이블 (Notifications)
export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'payment', 'subscription', 'system', 'favorite'
  message: text("message").notNull(),
  isRead: integer("is_read", { mode: "boolean" }).default(false).notNull(),
  link: text("link"), // 클릭 시 이동할 경로
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// 5. 관심 작품 (Favorites)
export const favorites = sqliteTable("favorites", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  artworkId: text("artwork_id").notNull().references(() => artworks.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  artwork: one(artworks, {
    fields: [favorites.artworkId],
    references: [artworks.id],
  }),
}));

// 6. 알림 테이블 (Notifications)
// ... (기존 코드 유지)

// 7. 리뷰 테이블 (Reviews)
export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  artworkId: text("artwork_id").notNull().references(() => artworks.id),
  rating: integer("rating").default(5).notNull(),
  comment: text("comment"),
  imageUrl: text("image_url"), // AR 체험 스냅샷 연동용
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  artwork: one(artworks, {
    fields: [reviews.artworkId],
    references: [artworks.id],
  }),
}));

// 8. 1:1 메시지 테이블 (Messages)
export const messages = sqliteTable("messages", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  senderId: text("sender_id").notNull().references(() => users.id),
  receiverId: text("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isRead: integer("is_read", { mode: "boolean" }).default(false).notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sentMessages",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receivedMessages",
  }),
}));

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
