import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQty } from "@/store/shop/carts-slice";
import { toast } from "sonner";

function CartContent({ cartItem }) {

  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { productList } = useSelector(state => state.shoppingProducts)
  const { cartItems } = useSelector(state => state.shoppingCart)

  function handleDeleteCartItem(getCartItem) {
    dispatch(deleteCartItem({
      productId: getCartItem?.productId
    }))
  }

  function handleUpdateQty(getCartItem, getAction) {

    if (getAction === "increase") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentItem = getCartItems.findIndex(
          item => item.productId === getCartItem?.productId
        )

        const getCurrentProductIndex = productList.findIndex(
          product => product._id === getCartItem?.productId
        )
        const getTotalStock = productList[getCurrentProductIndex].totalStock;

        if (indexOfCurrentItem > -1) {
          const getQty = getCartItems[indexOfCurrentItem].quantity;
          if (getQty + 1 > getTotalStock) {
            toast.error(`Only ${getQty} available`)
            return;
          }
        }
      }
    }

    dispatch(updateCartQty({
      productId: getCartItem?.productId,
      quantity:
        getAction === "increase"
          ? getCartItem?.quantity + 1
          : getCartItem?.quantity - 1,
    }))
      .then((data) => {
        if (data?.payload?.success) {
          toast.success("Cart updated")
        }
      })
  }

  return (
    <div className="flex items-center space-x-4" >
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 border-rounded object-cover" />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem.title}</h3>
        <div className="flex items-center mt-1 gap-2">
          <Button
            variant="outline"
            className="h-8 w-8"
            size="icon"
            onClick={() => handleUpdateQty(cartItem, "decrease")}
            disabled={cartItem.quantity === 1}>
            <Minus className="w-5 h-5" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">
            {cartItem.quantity}
          </span>
          <Button
            variant="outline"
            className="h-8 w-8"
            size="icon"
            onClick={() => handleUpdateQty(cartItem, "increase")}>
            <Plus className="w-5 h-5" />
            <span className="sr-only">Increase</span>
          </Button>

        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          ${(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem.quantity).toFixed(2)
          }
        </p>
        <Button onClick={() => handleDeleteCartItem(cartItem)} variant="outline" size="icon">
          <Trash className="cursor-pointer mt-1" size={20}></Trash>
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  )
}

export default CartContent;