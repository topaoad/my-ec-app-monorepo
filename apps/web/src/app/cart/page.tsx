import { getProducts } from "@/app/libs/microcms";
import CartBody from "../../components/cart/CartBody";

const CartPage = async () => {
  const products = await getProducts();

  return (
    <div>
      <CartBody products={products} />
    </div>
  );
};

export default CartPage;
