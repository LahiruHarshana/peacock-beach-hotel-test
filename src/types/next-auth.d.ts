import { type UserRole } from "@/lib/auth/roles";

declare module "next-auth" {
  interface User {
    role?: UserRole;
    tokenVersion?: number;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role?: UserRole;
      tokenVersion?: number;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: UserRole;
    tokenVersion?: number;
  }
}
