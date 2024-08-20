import { z } from "zod";

export const OrderScalarFieldEnumSchema = z.enum([
  "id",
  "userId",
  "productId",
  "quantity",
  "status",
  "createdAt",
  "updatedAt",
]);

export default OrderScalarFieldEnumSchema;
