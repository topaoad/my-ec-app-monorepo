import * as z from "zod";
import { CompleteUser, RelatedUserModel } from "./index";

export const PurchaseModel = z.object({
  id: z.string(),
  userId: z.string(),
  bookId: z.string(),
  createdAt: z.date(),
});

export interface CompletePurchase extends z.infer<typeof PurchaseModel> {
  user: CompleteUser;
}

/**
 * RelatedPurchaseModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPurchaseModel: z.ZodSchema<CompletePurchase> = z.lazy(() =>
  PurchaseModel.extend({
    user: RelatedUserModel,
  }),
);
