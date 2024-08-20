import { z } from "zod";

export const PurchaseScalarFieldEnumSchema = z.enum([
  "id",
  "userId",
  "bookId",
  "createdAt",
]);

export default PurchaseScalarFieldEnumSchema;
