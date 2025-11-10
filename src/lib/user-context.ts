// Migrated from ff-chat-6880/src/lib/user-context.ts for HMS
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string;
  userPlatformId?: string;
  entityPlatformId?: string;
  employeeEntityId?: string;
}

export class UserContext {
  static getUserFromContext(): User | null {
    // ...logic...
    return null
  }
  static async getCurrentUser(): Promise<User | null> {
    // ...logic...
    return null
  }
}
