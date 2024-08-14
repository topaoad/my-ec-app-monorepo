import UserSchema from "prisma/generated/zod/modelSchema/UserSchema";
import { z } from "zod";

export type User = z.infer<typeof UserSchema>;

export interface Session {
  user: User;
}
