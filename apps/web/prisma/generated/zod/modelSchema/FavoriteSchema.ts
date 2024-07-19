import { z } from 'zod';
import type { UserWithRelations } from './UserSchema'
import type { UserPartialWithRelations } from './UserSchema'
import type { UserOptionalDefaultsWithRelations } from './UserSchema'
import { UserWithRelationsSchema } from './UserSchema'
import { UserPartialWithRelationsSchema } from './UserSchema'
import { UserOptionalDefaultsWithRelationsSchema } from './UserSchema'

/////////////////////////////////////////
// FAVORITE SCHEMA
/////////////////////////////////////////

export const FavoriteSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  productId: z.string(),
  createdAt: z.coerce.date(),
})

export type Favorite = z.infer<typeof FavoriteSchema>

/////////////////////////////////////////
// FAVORITE PARTIAL SCHEMA
/////////////////////////////////////////

export const FavoritePartialSchema = FavoriteSchema.partial()

export type FavoritePartial = z.infer<typeof FavoritePartialSchema>

/////////////////////////////////////////
// FAVORITE OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const FavoriteOptionalDefaultsSchema = FavoriteSchema.merge(z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
}))

export type FavoriteOptionalDefaults = z.infer<typeof FavoriteOptionalDefaultsSchema>

/////////////////////////////////////////
// FAVORITE RELATION SCHEMA
/////////////////////////////////////////

export type FavoriteRelations = {
  user: UserWithRelations;
};

export type FavoriteWithRelations = z.infer<typeof FavoriteSchema> & FavoriteRelations

export const FavoriteWithRelationsSchema: z.ZodType<FavoriteWithRelations> = FavoriteSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
}))

/////////////////////////////////////////
// FAVORITE OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type FavoriteOptionalDefaultsRelations = {
  user: UserOptionalDefaultsWithRelations;
};

export type FavoriteOptionalDefaultsWithRelations = z.infer<typeof FavoriteOptionalDefaultsSchema> & FavoriteOptionalDefaultsRelations

export const FavoriteOptionalDefaultsWithRelationsSchema: z.ZodType<FavoriteOptionalDefaultsWithRelations> = FavoriteOptionalDefaultsSchema.merge(z.object({
  user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
}))

/////////////////////////////////////////
// FAVORITE PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type FavoritePartialRelations = {
  user?: UserPartialWithRelations;
};

export type FavoritePartialWithRelations = z.infer<typeof FavoritePartialSchema> & FavoritePartialRelations

export const FavoritePartialWithRelationsSchema: z.ZodType<FavoritePartialWithRelations> = FavoritePartialSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
})).partial()

export type FavoriteOptionalDefaultsWithPartialRelations = z.infer<typeof FavoriteOptionalDefaultsSchema> & FavoritePartialRelations

export const FavoriteOptionalDefaultsWithPartialRelationsSchema: z.ZodType<FavoriteOptionalDefaultsWithPartialRelations> = FavoriteOptionalDefaultsSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

export type FavoriteWithPartialRelations = z.infer<typeof FavoriteSchema> & FavoritePartialRelations

export const FavoriteWithPartialRelationsSchema: z.ZodType<FavoriteWithPartialRelations> = FavoriteSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

export default FavoriteSchema;
