
import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getCart } from "@/store/shop/carts-slice";
import { toast } from "sonner";
import { useEffect } from "react";
import { Badge } from "../ui/badge";

function ProductDetailsDialog({ open, setOpen, productDetails }) {

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth)
  const handleBtnDisabled = productDetails?.data?.totalStock === 0;
  const { cartItems } = useSelector(state => state.shoppingCart)

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (!user?.id) {
      toast.error("Please log in to add items to your cart");
      return;
    }

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(item => item.productId === getCurrentProductId)
      if (indexOfCurrentItem > -1) {
        const getQty = getCartItems[indexOfCurrentItem].quantity;
        if (getQty + 1 > getTotalStock) {
          toast.error(`Only ${getQty} available`)
          return;
        }
      }
    }

    dispatch(addToCart({
      productId: getCurrentProductId, quantity: 1
    }))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(getCart(user?.id))
          toast.success("Item added to cart")
        }
      })
  }

  useEffect(() => {
    return () => {
      setOpen(false)
    }
  }, [setOpen])

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90v2] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relate overflow-hidden rounded-lg">
          <img
            src={productDetails?.data?.image}
            alt={productDetails?.data?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
          {
            productDetails?.data?.salePrice > 0
              ? <Badge className="absolute top-15 left-15 bg-red-500 hover:bg-red-600">Sale</Badge>
              : productDetails?.data?.totalStock < 5 && productDetails?.data?.totalStock > 0
                ? <Badge className="absolute top-15 left-15 bg-red-500 hover:bg-red-600">{productDetails?.data?.totalStock} left!</Badge>
                : productDetails?.data?.totalStock === 0
                  ? <Badge className="absolute top-15 left-15 bg-red-500 hover:bg-red-600">Out of stock</Badge>
                  :
                  null

          }
        </div>
        <div>
          <div>
            <DialogTitle className="text-3xl font-extrabold">
              {productDetails?.data?.title}
            </DialogTitle>
            <p className="text-muted-foreground text-xl mb-5 mt-4">{productDetails?.data?.description}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className={`${productDetails?.data?.salePrice > 0 ? "line-through" : ""} text-3xl font-bold text-primary`}>
              ${productDetails?.data?.price}
            </p>

            {
              productDetails?.data?.salePrice > 0 ? (
                <p className="text-2xl font-bold text-muted-foreground">
                  ${productDetails?.data?.salePrice}
                </p>
              ) : ""
            }
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-primary" />
              <span className="text-muted-foreground">(4.5)</span>
            </div>
          </div>
          <div className="my-5" >
            <Button className="w-full" disabled={handleBtnDisabled} onClick={() => handleAddToCart(productDetails?.data._id, productDetails?.data.totalStock)}>
              {handleBtnDisabled ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold my-4">
              Reviews
            </h2>
            <div className="grid gap-6">
              <div className="flex gap-4">
                <Avatar className="w-10 h-10 border">
                  <AvatarFallback>
                    F
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <h3>
                      Freja
                    </h3>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <StarIcon className="w-5 h-5 fill-primary" />
                    <StarIcon className="w-5 h-5 fill-primary" />
                    <StarIcon className="w-5 h-5 fill-primary" />
                    <StarIcon className="w-5 h-5 fill-primary" />
                    <StarIcon className="w-5 h-5 fill-primary" />
                  </div>
                  <p className="text-muted-foreground">User Review</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <Input placeholder="Write a review" />
              <Button>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent >
    </Dialog >
  )
}

export default ProductDetailsDialog;