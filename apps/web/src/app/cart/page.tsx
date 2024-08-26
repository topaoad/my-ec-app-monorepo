import { listProducts } from "@/app/libs/microcms";
import CartBody from "../../components/cart/CartBody";

const CartPage = async () => {
  const { contents: products } = await listProducts();

  return (
    <div>
      <CartBody products={products} />
    </div>
  );
};

export default CartPage;
