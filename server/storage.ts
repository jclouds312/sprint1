import { type User, type InsertUser, type UserContextDB, userContexts } from "@shared/schema";
import { randomUUID } from "crypto";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, sql } from "drizzle-orm";

const connectionString = process.env.DATABASE_URL!;
const client = neon(connectionString);
const db = drizzle(client);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getOrCreateContext(phoneNumber: string): Promise<UserContextDB>;
  updateContext(phoneNumber: string, updates: Partial<Omit<UserContextDB, 'id' | 'phoneNumber'>>): Promise<UserContextDB>;
  getAllContexts(): Promise<UserContextDB[]>;
  resetAllContexts(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getOrCreateContext(phoneNumber: string): Promise<UserContextDB> {
    const existing = await db.select().from(userContexts).where(eq(userContexts.phoneNumber, phoneNumber)).limit(1);
    
    if (existing.length > 0) {
      return existing[0];
    }

    const newContext = await db.insert(userContexts).values({
      phoneNumber,
      currentFlow: 'WELCOME',
      step: 'INIT',
      variables: {},
    }).returning();

    return newContext[0];
  }

  async updateContext(phoneNumber: string, updates: Partial<Omit<UserContextDB, 'id' | 'phoneNumber'>>): Promise<UserContextDB> {
    const updated = await db.update(userContexts)
      .set({
        ...updates,
        lastInteraction: new Date(),
      })
      .where(eq(userContexts.phoneNumber, phoneNumber))
      .returning();

    return updated[0];
  }

  async getAllContexts(): Promise<UserContextDB[]> {
    return db.select().from(userContexts);
  }

  async resetAllContexts(): Promise<void> {
    await db.delete(userContexts);
  }
}

export const storage = new DatabaseStorage();
