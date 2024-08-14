import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    lastLogin: Date | null;
  }

  interface Session extends DefaultSession {
    user?: {
      id: string;
      isNewUser: boolean;
      lastLogin?: Date | null;
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isNewUser: boolean;
    lastLogin?: Date | null;
  }
}