import { z } from "zod";
import UserSchema from "../../prisma/generated/zod/modelSchema/UserSchema";

export type User = z.infer<typeof UserSchema>;

export interface Session {
  user: User;
}
