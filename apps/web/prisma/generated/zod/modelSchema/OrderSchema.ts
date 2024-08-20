import { z } from "zod";
import type { UserWithRelations } from "./UserSchema";
import type { UserPartialWithRelations } from "./UserSchema";
import type { UserOptionalDefaultsWithRelations } from "./UserSchema";
import { UserWithRelationsSchema } from "./UserSchema";
import { UserPartialWithRelationsSchema } from "./UserSchema";
import { UserOptionalDefaultsWithRelationsSchema } from "./UserSchema";

/////////////////////////////////////////
// ORDER SCHEMA
/////////////////////////////////////////

export const OrderSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  productId: z.string(),
  quantity: z.number().int(),
  status: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Order = z.infer<typeof OrderSchema>;

/////////////////////////////////////////
// ORDER PARTIAL SCHEMA
/////////////////////////////////////////

export const OrderPartialSchema = OrderSchema.partial();

export type OrderPartial = z.infer<typeof OrderPartialSchema>;

/////////////////////////////////////////
// ORDER OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const OrderOptionalDefaultsSchema = OrderSchema.merge(
  z.object({
    id: z.string().cuid().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  }),
);

export type OrderOptionalDefaults = z.infer<typeof OrderOptionalDefaultsSchema>;

/////////////////////////////////////////
// ORDER RELATION SCHEMA
/////////////////////////////////////////

export type OrderRelations = {
  user: UserWithRelations;
};

export type OrderWithRelations = z.infer<typeof OrderSchema> & OrderRelations;

export const OrderWithRelationsSchema: z.ZodType<OrderWithRelations> =
  OrderSchema.merge(
    z.object({
      user: z.lazy(() => UserWithRelationsSchema),
    }),
  );

/////////////////////////////////////////
// ORDER OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type OrderOptionalDefaultsRelations = {
  user: UserOptionalDefaultsWithRelations;
};

export type OrderOptionalDefaultsWithRelations = z.infer<
  typeof OrderOptionalDefaultsSchema
> &
  OrderOptionalDefaultsRelations;

export const OrderOptionalDefaultsWithRelationsSchema: z.ZodType<OrderOptionalDefaultsWithRelations> =
  OrderOptionalDefaultsSchema.merge(
    z.object({
      user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
    }),
  );

/////////////////////////////////////////
// ORDER PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type OrderPartialRelations = {
  user?: UserPartialWithRelations;
};

export type OrderPartialWithRelations = z.infer<typeof OrderPartialSchema> &
  OrderPartialRelations;

export const OrderPartialWithRelationsSchema: z.ZodType<OrderPartialWithRelations> =
  OrderPartialSchema.merge(
    z.object({
      user: z.lazy(() => UserPartialWithRelationsSchema),
    }),
  ).partial();

export type OrderOptionalDefaultsWithPartialRelations = z.infer<
  typeof OrderOptionalDefaultsSchema
> &
  OrderPartialRelations;

export const OrderOptionalDefaultsWithPartialRelationsSchema: z.ZodType<OrderOptionalDefaultsWithPartialRelations> =
  OrderOptionalDefaultsSchema.merge(
    z
      .object({
        user: z.lazy(() => UserPartialWithRelationsSchema),
      })
      .partial(),
  );

export type OrderWithPartialRelations = z.infer<typeof OrderSchema> &
  OrderPartialRelations;

export const OrderWithPartialRelationsSchema: z.ZodType<OrderWithPartialRelations> =
  OrderSchema.merge(
    z
      .object({
        user: z.lazy(() => UserPartialWithRelationsSchema),
      })
      .partial(),
  );

export default OrderSchema;
