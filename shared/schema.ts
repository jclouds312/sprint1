import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const userContexts = pgTable("user_contexts", {
  id: serial("id").primaryKey(),
  phoneNumber: text("phone_number").notNull().unique(),
  currentFlow: text("current_flow").notNull().default("WELCOME"),
  step: text("step").notNull().default("INIT"),
  variables: jsonb("variables").notNull().default({}),
  lastInteraction: timestamp("last_interaction").notNull().defaultNow(),
});

export const insertUserContextSchema = createInsertSchema(userContexts).omit({
  id: true,
  lastInteraction: true,
});

export type InsertUserContext = z.infer<typeof insertUserContextSchema>;
export type UserContextDB = typeof userContexts.$inferSelect;
