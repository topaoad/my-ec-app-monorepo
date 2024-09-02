import { z } from "zod";

export const OrderItemScalarFieldEnumSchema = z.enum([
  "id",
  "orderId",
  "productId",
  "quantity",
  "price",
]);

export default OrderItemScalarFieldEnumSchema;
