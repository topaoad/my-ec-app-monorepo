import { z } from 'zod';
import type { AccountWithRelations } from './AccountSchema'
import type { AccountPartialWithRelations } from './AccountSchema'
import type { AccountOptionalDefaultsWithRelations } from './AccountSchema'
import type { SessionWithRelations } from './SessionSchema'
import type { SessionPartialWithRelations } from './SessionSchema'
import type { SessionOptionalDefaultsWithRelations } from './SessionSchema'
import type { PurchaseWithRelations } from './PurchaseSchema'
import type { PurchasePartialWithRelations } from './PurchaseSchema'
import type { PurchaseOptionalDefaultsWithRelations } from './PurchaseSchema'
import type { FavoriteWithRelations } from './FavoriteSchema'
import type { FavoritePartialWithRelations } from './FavoriteSchema'
import type { FavoriteOptionalDefaultsWithRelations } from './FavoriteSchema'
import type { OrderWithRelations } from './OrderSchema'
import type { OrderPartialWithRelations } from './OrderSchema'
import type { OrderOptionalDefaultsWithRelations } from './OrderSchema'
import { AccountWithRelationsSchema } from './AccountSchema'
import { AccountPartialWithRelationsSchema } from './AccountSchema'
import { AccountOptionalDefaultsWithRelationsSchema } from './AccountSchema'
import { SessionWithRelationsSchema } from './SessionSchema'
import { SessionPartialWithRelationsSchema } from './SessionSchema'
import { SessionOptionalDefaultsWithRelationsSchema } from './SessionSchema'
import { PurchaseWithRelationsSchema } from './PurchaseSchema'
import { PurchasePartialWithRelationsSchema } from './PurchaseSchema'
import { PurchaseOptionalDefaultsWithRelationsSchema } from './PurchaseSchema'
import { FavoriteWithRelationsSchema } from './FavoriteSchema'
import { FavoritePartialWithRelationsSchema } from './FavoriteSchema'
import { FavoriteOptionalDefaultsWithRelationsSchema } from './FavoriteSchema'
import { OrderWithRelationsSchema } from './OrderSchema'
import { OrderPartialWithRelationsSchema } from './OrderSchema'
import { OrderOptionalDefaultsWithRelationsSchema } from './OrderSchema'

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nullish(),
  nickname: z.string().nullish(),
  email: z.string().nullish(),
  emailVerified: z.coerce.date().nullish(),
  image: z.string().nullish(),
  lastLogin: z.coerce.date().nullish(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER PARTIAL SCHEMA
/////////////////////////////////////////

export const UserPartialSchema = UserSchema.partial()

export type UserPartial = z.infer<typeof UserPartialSchema>

/////////////////////////////////////////
// USER OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const UserOptionalDefaultsSchema = UserSchema.merge(z.object({
  id: z.string().cuid().optional(),
}))

export type UserOptionalDefaults = z.infer<typeof UserOptionalDefaultsSchema>

/////////////////////////////////////////
// USER RELATION SCHEMA
/////////////////////////////////////////

export type UserRelations = {
  accounts: AccountWithRelations[];
  sessions: SessionWithRelations[];
  purchases: PurchaseWithRelations[];
  favorites: FavoriteWithRelations[];
  orders: OrderWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  accounts: z.lazy(() => AccountWithRelationsSchema).array(),
  sessions: z.lazy(() => SessionWithRelationsSchema).array(),
  purchases: z.lazy(() => PurchaseWithRelationsSchema).array(),
  favorites: z.lazy(() => FavoriteWithRelationsSchema).array(),
  orders: z.lazy(() => OrderWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// USER OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type UserOptionalDefaultsRelations = {
  accounts: AccountOptionalDefaultsWithRelations[];
  sessions: SessionOptionalDefaultsWithRelations[];
  purchases: PurchaseOptionalDefaultsWithRelations[];
  favorites: FavoriteOptionalDefaultsWithRelations[];
  orders: OrderOptionalDefaultsWithRelations[];
};

export type UserOptionalDefaultsWithRelations = z.infer<typeof UserOptionalDefaultsSchema> & UserOptionalDefaultsRelations

export const UserOptionalDefaultsWithRelationsSchema: z.ZodType<UserOptionalDefaultsWithRelations> = UserOptionalDefaultsSchema.merge(z.object({
  accounts: z.lazy(() => AccountOptionalDefaultsWithRelationsSchema).array(),
  sessions: z.lazy(() => SessionOptionalDefaultsWithRelationsSchema).array(),
  purchases: z.lazy(() => PurchaseOptionalDefaultsWithRelationsSchema).array(),
  favorites: z.lazy(() => FavoriteOptionalDefaultsWithRelationsSchema).array(),
  orders: z.lazy(() => OrderOptionalDefaultsWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// USER PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type UserPartialRelations = {
  accounts?: AccountPartialWithRelations[];
  sessions?: SessionPartialWithRelations[];
  purchases?: PurchasePartialWithRelations[];
  favorites?: FavoritePartialWithRelations[];
  orders?: OrderPartialWithRelations[];
};

export type UserPartialWithRelations = z.infer<typeof UserPartialSchema> & UserPartialRelations

export const UserPartialWithRelationsSchema: z.ZodType<UserPartialWithRelations> = UserPartialSchema.merge(z.object({
  accounts: z.lazy(() => AccountPartialWithRelationsSchema).array(),
  sessions: z.lazy(() => SessionPartialWithRelationsSchema).array(),
  purchases: z.lazy(() => PurchasePartialWithRelationsSchema).array(),
  favorites: z.lazy(() => FavoritePartialWithRelationsSchema).array(),
  orders: z.lazy(() => OrderPartialWithRelationsSchema).array(),
})).partial()

export type UserOptionalDefaultsWithPartialRelations = z.infer<typeof UserOptionalDefaultsSchema> & UserPartialRelations

export const UserOptionalDefaultsWithPartialRelationsSchema: z.ZodType<UserOptionalDefaultsWithPartialRelations> = UserOptionalDefaultsSchema.merge(z.object({
  accounts: z.lazy(() => AccountPartialWithRelationsSchema).array(),
  sessions: z.lazy(() => SessionPartialWithRelationsSchema).array(),
  purchases: z.lazy(() => PurchasePartialWithRelationsSchema).array(),
  favorites: z.lazy(() => FavoritePartialWithRelationsSchema).array(),
  orders: z.lazy(() => OrderPartialWithRelationsSchema).array(),
}).partial())

export type UserWithPartialRelations = z.infer<typeof UserSchema> & UserPartialRelations

export const UserWithPartialRelationsSchema: z.ZodType<UserWithPartialRelations> = UserSchema.merge(z.object({
  accounts: z.lazy(() => AccountPartialWithRelationsSchema).array(),
  sessions: z.lazy(() => SessionPartialWithRelationsSchema).array(),
  purchases: z.lazy(() => PurchasePartialWithRelationsSchema).array(),
  favorites: z.lazy(() => FavoritePartialWithRelationsSchema).array(),
  orders: z.lazy(() => OrderPartialWithRelationsSchema).array(),
}).partial())

export default UserSchema;
