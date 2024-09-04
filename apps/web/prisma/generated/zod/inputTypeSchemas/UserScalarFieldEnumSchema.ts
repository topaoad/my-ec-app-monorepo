import { z } from "zod";

export const UserScalarFieldEnumSchema = z.enum([
  "id",
  "name",
  "nickname",
  "email",
  "emailVerified",
  "image",
  "lastLogin",
  "stripeCustomerId",
]);

export default UserScalarFieldEnumSchema;
