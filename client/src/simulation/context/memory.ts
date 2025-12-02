// MOCK DATABASE / REDIS
// Simulating the persistence layer
export interface UserContext {
  phoneNumber: string;
  currentFlow: string;
  step: string;
  variables: Record<string, any>;
  lastInteraction: Date;
}

class ContextStore {
  private store: Map<string, UserContext> = new Map();

  async getContext(phoneNumber: string): Promise<UserContext> {
    if (!this.store.has(phoneNumber)) {
      this.store.set(phoneNumber, {
        phoneNumber,
        currentFlow: 'WELCOME',
        step: 'INIT',
        variables: {},
        lastInteraction: new Date()
      });
    }
    return this.store.get(phoneNumber)!;
  }

  async updateContext(phoneNumber: string, updates: Partial<UserContext>): Promise<UserContext> {
    const current = await this.getContext(phoneNumber);
    const updated = { ...current, ...updates, lastInteraction: new Date() };
    this.store.set(phoneNumber, updated);
    return updated;
  }
  
  // For visualization in the UI
  getAll() {
    return Object.fromEntries(this.store);
  }
  
  reset() {
    this.store.clear();
  }
}

export const contextStore = new ContextStore();
