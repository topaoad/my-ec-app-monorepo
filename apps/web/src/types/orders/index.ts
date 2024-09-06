import { OrderItem } from "@prisma/client";
import { z } from "zod";
import OrderSchema from "../../../prisma/generated/zod/modelSchema/OrderSchema";
import { User } from "../../../prisma/generated/zod/modelSchema/UserSchema";

export type CustomOrderRelations = {
  user: User;
  items: OrderItem[];
};

export type CustomOrderWithRelations = z.infer<typeof OrderSchema> &
  CustomOrderRelations;
