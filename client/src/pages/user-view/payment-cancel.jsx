import { Button } from "@/components/ui/button";
import { getOrderDetails } from "@/store/shop/order-slice";
import { CircleX } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function PaymentCancelPage() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const orderId = location.state?.orderId;

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId])

  return (
    <div className="flex flex-col gap-5 justify-center items-center my-10 h-full">
      <CircleX className="size-30 text-red-500" />
      <div className="text-3xl font-extrabold">
        <p>Payment Canceled!</p>
      </div>
      <div>
        <Button onClick={() => navigate('/shop/home')} className="cursor-pointer ">Return Home</Button>
      </div>
    </div>
  )
}

export default PaymentCancelPage;