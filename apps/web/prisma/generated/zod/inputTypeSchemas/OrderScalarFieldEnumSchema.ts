import { z } from "zod";

export const OrderScalarFieldEnumSchema = z.enum([
  "id",
  "stripeSessionId",
  "userId",
  "totalAmount",
  "status",
  "createdAt",
  "updatedAt",
]);

export default OrderScalarFieldEnumSchema;
