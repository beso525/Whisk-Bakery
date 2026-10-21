import Address from '@/components/user-view/address';
import img from '../../assets/slideshow1.jpg'
import { useDispatch, useSelector } from 'react-redux';
import CartContent from '@/components/user-view/cart-content';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { createNewOrder } from '@/store/shop/order-slice';
import { toast } from 'sonner';

function UserCheckout() {

  const { cartItems } = useSelector(state => state.shoppingCart)
  const { user } = useSelector(state => state.auth);
  const { approvalURL } = useSelector(state => state.shopOrder)
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false)
  const dispatch = useDispatch();

  const total = cartItems && cartItems.items && cartItems.items.length > 0 ?
    cartItems.items.reduce(
      (accumulator, currentItem) =>
        accumulator +
        (currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price) * currentItem?.quantity
      , 0)
    : 0;

  function handleInitialPaypalPayment() {

    if (currentSelectedAddress === null) {
      toast.warning("Please select an address");
    } else {

      const orderData = {
        cartId: cartItems?._id,
        cartItems: cartItems.items.map(cartItem => ({
          productId: cartItem?.productId,
          title: cartItem?.title,
          image: cartItem?.image,
          price: cartItem?.price,
          salePrice: cartItem?.salePrice,
          quantity: cartItem?.quantity
        })),
        addressInfo: {
          addressId: currentSelectedAddress?._id,
          address: currentSelectedAddress?.address,
          city: currentSelectedAddress?.city,
          postalcode: currentSelectedAddress?.postalcode,
          phone: currentSelectedAddress?.phone,
          notes: currentSelectedAddress?.notes
        },
        orderStatus: 'pending',
        paymentMethod: 'paypal',
        paymentStatus: 'pending',
        totalAmount: total,
        orderDate: new Date(),
        updateOrderDate: new Date(),
        paymentId: '',
        payerId: ''
      }

      dispatch(createNewOrder(orderData)).then((data) => {
        if (data?.payload?.success) {
          setIsPaymentStart(true)
        } else {
          setIsPaymentStart(false)
        }
      });
    }
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  const isCartEmpty = (cartItems.length === 0);

  return (
    <div className="flex flex-col">

      <div className="relative h-[350px] w-full overflow-hidden">
        <img
          src={img}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <h1 className='font-bold text-3xl mt-4'>Checkout</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5'>
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className='flex flex-col gap-4'>
          {
            cartItems && cartItems.items && cartItems.items.length > 0 ?
              cartItems.items.map(item => (
                <CartContent cartItem={item} />
              ))
              : "Cart is empty"
          }
          <div className="mt-8 space-y-4">
            <div className="flex justify-between mx-6">
              <span className="font-bold">Total</span>
              <span className="font-bold">${total}</span>
            </div>
          </div>
          <div>
            <Button
              onClick={handleInitialPaypalPayment}
              disabled={isCartEmpty}
              className="w-full cursor-pointer">
              {
                isPaymentStart ? "Processing payment" : "Checkout with Paypal"
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCheckout;