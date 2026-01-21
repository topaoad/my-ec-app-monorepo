import { z } from "zod";
import {
  OrderWithRelationsSchema,
  OrderPartialWithRelationsSchema,
  OrderOptionalDefaultsWithRelationsSchema,
} from "./OrderSchema";
import type {
  OrderWithRelations,
  OrderPartialWithRelations,
  OrderOptionalDefaultsWithRelations,
} from "./OrderSchema";

/////////////////////////////////////////
// ORDER ITEM SCHEMA
/////////////////////////////////////////

export const OrderItemSchema = z.object({
  id: z.string().cuid(),
  orderId: z.string(),
  productId: z.string(),
  quantity: z.number().int(),
  price: z.number().int(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;

/////////////////////////////////////////
// ORDER ITEM PARTIAL SCHEMA
/////////////////////////////////////////

export const OrderItemPartialSchema = OrderItemSchema.partial();

export type OrderItemPartial = z.infer<typeof OrderItemPartialSchema>;

/////////////////////////////////////////
// ORDER ITEM OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const OrderItemOptionalDefaultsSchema = OrderItemSchema.merge(
  z.object({
    id: z.string().cuid().optional(),
  }),
);

export type OrderItemOptionalDefaults = z.infer<
  typeof OrderItemOptionalDefaultsSchema
>;

/////////////////////////////////////////
// ORDER ITEM RELATION SCHEMA
/////////////////////////////////////////

export type OrderItemRelations = {
  order: OrderWithRelations;
};

export type OrderItemWithRelations = z.infer<typeof OrderItemSchema> &
  OrderItemRelations;

export const OrderItemWithRelationsSchema: z.ZodType<OrderItemWithRelations> =
  OrderItemSchema.merge(
    z.object({
      order: z.lazy(() => OrderWithRelationsSchema),
    }),
  );

/////////////////////////////////////////
// ORDER ITEM OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type OrderItemOptionalDefaultsRelations = {
  order: OrderOptionalDefaultsWithRelations;
};

export type OrderItemOptionalDefaultsWithRelations = z.infer<
  typeof OrderItemOptionalDefaultsSchema
> &
  OrderItemOptionalDefaultsRelations;

export const OrderItemOptionalDefaultsWithRelationsSchema: z.ZodType<OrderItemOptionalDefaultsWithRelations> =
  OrderItemOptionalDefaultsSchema.merge(
    z.object({
      order: z.lazy(() => OrderOptionalDefaultsWithRelationsSchema),
    }),
  );

/////////////////////////////////////////
// ORDER ITEM PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type OrderItemPartialRelations = {
  order?: OrderPartialWithRelations;
};

export type OrderItemPartialWithRelations = z.infer<
  typeof OrderItemPartialSchema
> &
  OrderItemPartialRelations;

export const OrderItemPartialWithRelationsSchema: z.ZodType<OrderItemPartialWithRelations> =
  OrderItemPartialSchema.merge(
    z.object({
      order: z.lazy(() => OrderPartialWithRelationsSchema),
    }),
  ).partial();

export type OrderItemOptionalDefaultsWithPartialRelations = z.infer<
  typeof OrderItemOptionalDefaultsSchema
> &
  OrderItemPartialRelations;

export const OrderItemOptionalDefaultsWithPartialRelationsSchema: z.ZodType<OrderItemOptionalDefaultsWithPartialRelations> =
  OrderItemOptionalDefaultsSchema.merge(
    z
      .object({
        order: z.lazy(() => OrderPartialWithRelationsSchema),
      })
      .partial(),
  );

export type OrderItemWithPartialRelations = z.infer<typeof OrderItemSchema> &
  OrderItemPartialRelations;

export const OrderItemWithPartialRelationsSchema: z.ZodType<OrderItemWithPartialRelations> =
  OrderItemSchema.merge(
    z
      .object({
        order: z.lazy(() => OrderPartialWithRelationsSchema),
      })
      .partial(),
  );

export default OrderItemSchema;
