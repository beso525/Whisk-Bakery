import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Table, TableRow, TableHead, TableHeader, TableBody, TableCell } from "../ui/table";
import UserOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByUserId, getOrderDetails } from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

function UserOrders() {

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth)
  const { orderList, orderDetails, resetOrderDetails } = useSelector(state => state.shopOrder)

  useEffect(() => {
    dispatch(getAllOrdersByUserId())
  }, [dispatch, user])

  function handleFetchOrderDetails(getOrderId) {
    dispatch(getOrderDetails(getOrderId))
  }

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true)
  }, [orderDetails])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead><span className="sr-only">Details</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              orderList && orderList.length > 0 ?
                orderList.map(orderItem => (
                  <><TableRow className="font-[noto-sans] text-[18px] text-left">
                    <TableCell>{orderItem._id}</TableCell>
                    <TableCell>{orderItem?.orderDate.split('T')[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 tracking-wider
                          ${orderItem?.orderStatus ==
                            "confirmed" ? "bg-green-500"
                            : orderItem?.orderStatus ==
                              "rejected" ? "bg-red-500" :
                              "bg-black"}`
                        }>
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>${orderItem?.totalAmount}</TableCell>
                    <TableCell>
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false)
                          dispatch(resetOrderDetails())
                        }}>
                        <Button onClick={() => handleFetchOrderDetails(orderItem?._id)}>View Details</Button>
                        <UserOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                  </>
                )) :
                <TableRow>
                  <TableCell colSpan={4}>No orders yet!</TableCell>
                </TableRow>
            }

          </TableBody>
        </Table>
      </CardContent>
    </Card >
  )
}

export default UserOrders;