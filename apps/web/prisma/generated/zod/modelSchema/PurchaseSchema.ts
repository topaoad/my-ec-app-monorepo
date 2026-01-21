import { z } from "zod";
import {
  UserWithRelationsSchema,
  UserPartialWithRelationsSchema,
  UserOptionalDefaultsWithRelationsSchema,
} from "./UserSchema";
import type {
  UserWithRelations,
  UserPartialWithRelations,
  UserOptionalDefaultsWithRelations,
} from "./UserSchema";

/////////////////////////////////////////
// PURCHASE SCHEMA
/////////////////////////////////////////

export const PurchaseSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  bookId: z.string(),
  createdAt: z.coerce.date(),
});

export type Purchase = z.infer<typeof PurchaseSchema>;

/////////////////////////////////////////
// PURCHASE PARTIAL SCHEMA
/////////////////////////////////////////

export const PurchasePartialSchema = PurchaseSchema.partial();

export type PurchasePartial = z.infer<typeof PurchasePartialSchema>;

/////////////////////////////////////////
// PURCHASE OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const PurchaseOptionalDefaultsSchema = PurchaseSchema.merge(
  z.object({
    id: z.string().cuid().optional(),
    createdAt: z.coerce.date().optional(),
  }),
);

export type PurchaseOptionalDefaults = z.infer<
  typeof PurchaseOptionalDefaultsSchema
>;

/////////////////////////////////////////
// PURCHASE RELATION SCHEMA
/////////////////////////////////////////

export type PurchaseRelations = {
  user: UserWithRelations;
};

export type PurchaseWithRelations = z.infer<typeof PurchaseSchema> &
  PurchaseRelations;

export const PurchaseWithRelationsSchema: z.ZodType<PurchaseWithRelations> =
  PurchaseSchema.merge(
    z.object({
      user: z.lazy(() => UserWithRelationsSchema),
    }),
  );

/////////////////////////////////////////
// PURCHASE OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type PurchaseOptionalDefaultsRelations = {
  user: UserOptionalDefaultsWithRelations;
};

export type PurchaseOptionalDefaultsWithRelations = z.infer<
  typeof PurchaseOptionalDefaultsSchema
> &
  PurchaseOptionalDefaultsRelations;

export const PurchaseOptionalDefaultsWithRelationsSchema: z.ZodType<PurchaseOptionalDefaultsWithRelations> =
  PurchaseOptionalDefaultsSchema.merge(
    z.object({
      user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
    }),
  );

/////////////////////////////////////////
// PURCHASE PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type PurchasePartialRelations = {
  user?: UserPartialWithRelations;
};

export type PurchasePartialWithRelations = z.infer<
  typeof PurchasePartialSchema
> &
  PurchasePartialRelations;

export const PurchasePartialWithRelationsSchema: z.ZodType<PurchasePartialWithRelations> =
  PurchasePartialSchema.merge(
    z.object({
      user: z.lazy(() => UserPartialWithRelationsSchema),
    }),
  ).partial();

export type PurchaseOptionalDefaultsWithPartialRelations = z.infer<
  typeof PurchaseOptionalDefaultsSchema
> &
  PurchasePartialRelations;

export const PurchaseOptionalDefaultsWithPartialRelationsSchema: z.ZodType<PurchaseOptionalDefaultsWithPartialRelations> =
  PurchaseOptionalDefaultsSchema.merge(
    z
      .object({
        user: z.lazy(() => UserPartialWithRelationsSchema),
      })
      .partial(),
  );

export type PurchaseWithPartialRelations = z.infer<typeof PurchaseSchema> &
  PurchasePartialRelations;

export const PurchaseWithPartialRelationsSchema: z.ZodType<PurchaseWithPartialRelations> =
  PurchaseSchema.merge(
    z
      .object({
        user: z.lazy(() => UserPartialWithRelationsSchema),
      })
      .partial(),
  );

export default PurchaseSchema;
