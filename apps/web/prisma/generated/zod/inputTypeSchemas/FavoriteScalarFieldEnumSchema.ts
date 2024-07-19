import { z } from 'zod';

export const FavoriteScalarFieldEnumSchema = z.enum(['id','userId','productId','createdAt']);

export default FavoriteScalarFieldEnumSchema;
