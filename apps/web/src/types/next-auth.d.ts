import type { DefaultSession, DefaultUser } from "next-auth/next";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: number;
  }
  interface Session {
    user?: {
      id: number;
    } & DefaultSession["user"];
  }
}
