import "server-only";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { z } from "zod";
import { getMongoClient } from "@/lib/db/client";
import { COLLECTIONS } from "@/lib/db/collections";
import { verifyPassword } from "@/lib/auth/password";
import { ROLES, type UserRole } from "@/lib/auth/roles";
import { getEnv } from "@/lib/env";
import { consumeRateLimit } from "@/server/services/rate-limit";

const credentialsSchema = z.object({
  email: z.string().email().transform((v) => v.trim().toLowerCase()),
  password: z.string().min(8).max(128),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(getMongoClient(), {
    databaseName: getEnv().MONGODB_DB,
  }),
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  // Secure cookies follow the public origin. HTTP local and CI hosts stay usable.
  // Auth.js session cookies stay httpOnly with SameSite=Lax. The JWT role is not authorization.
  useSecureCookies: getEnv().APP_URL.startsWith("https://"),
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "Staff credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        try {
          await consumeRateLimit(`login:${parsed.data.email}`, 8, 15 * 60_000);
        } catch (error) {
          if (error instanceof Error && "code" in error && error.code === "RATE_LIMITED") return null;
          throw error;
        }

        const client = await getMongoClient();
        const db = client.db(getEnv().MONGODB_DB);
        const user = await db.collection(COLLECTIONS.users).findOne({
          emailNormalized: parsed.data.email,
          status: "ACTIVE",
        });

        if (!user || typeof user.passwordHash !== "string") return null;

        const valid = await verifyPassword(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        const role = user.role as UserRole;
        if (!ROLES.includes(role)) return null;

        return {
          id: String(user._id),
          email: parsed.data.email,
          name: typeof user.name === "string" ? user.name : parsed.data.email,
          role,
          tokenVersion: typeof user.tokenVersion === "number" ? user.tokenVersion : 0,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        const role = (user as { role?: UserRole }).role;
        if (role && ROLES.includes(role)) token.role = role;
        token.tokenVersion = (user as { tokenVersion?: number }).tokenVersion ?? 0;
        token.sub = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        const role = token.role as UserRole | undefined;
        if (role && ROLES.includes(role)) session.user.role = role;
        session.user.tokenVersion = typeof token.tokenVersion === "number" ? token.tokenVersion : 0;
      }
      return session;
    },
  },
  trustHost: true,
});
