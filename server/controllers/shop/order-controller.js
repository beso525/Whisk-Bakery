const paypal = require('../../helpers/paypal')
const Order = require('../../models/Order')
const Cart = require('../../models/Cart')
const Product = require('../../models/Product')

const createOrder = async(req, res) => {
  try{
    const {
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      updateOrderDate,
      paymentId,
      payerId
    } = req.body;

    const isProduction = process.env.NODE_ENV === 'production';

    const frontEndUrl = isProduction ? "https://whiskbasel.vercel.app" : "http://localhost:5173"

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
    const create_payment_json = {
      intent : 'sale',
      payer : {
        payment_method : 'paypal'
      },
      redirect_urls: {
        return_url : `${frontEndUrl}/shop/paypal-return`,
        cancel_url : `${frontEndUrl}/shop/payment-cancel`,
      },
      transactions : [
        {
          item_list : {
            items : cartItems.map(item => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency : 'CAD',
              quantity: item.quantity
            }))
          },
          amount: {
            currency : 'CAD',
            total: subtotal
          },
          description : 'description'
        }
      ]
    }

    paypal.payment.create(create_payment_json, async(error, paymentInfo) => {
      if (error) {        
        return res.status(500).json({
          success: false,
          message: "Error creating payment"
        })
      } else {
        const newOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          updateOrderDate,
          paymentId,
          payerId
        })

        await newOrder.save();

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === 'approval_url').href;
        res.status(201).json({
          success: true,
          approvalURL,
          orderId: newOrder._id
        })
      }
    })
  }catch(err) {
    res.status(500).json({
      success: false,
      message: "Error occured!"
    })
  }
}

const capturePayment = async(req, res) => {
  try{

    const {paymentId, payerId, orderId} = req.body

    let order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      })
    }

    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId)

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Out of stock ${product.title}`
        })
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId)
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order confirmed'
    })

  } catch(err) {
    res.status(500).json({
      success: false,
      message: "Error occured!"
    })
  }
}

const getAllOrdersByUsers = async(req,res) => {
  try {
    const {userId} = req.params;

    const orders = await Order.find({userId})

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: 'No orders found'
      })
    }

    res.status(200).json({
      success: true,
      data: orders
    })
  } catch(err) {
    res.status(500).json({
      success: false,
      message: "Error occured!"
    })
  }
}

const getAllOrdersByDetails = async(req,res) => {
  try {
    const {id} = req.params;

    const orders = await Order.findById(id)

    if (!orders) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',

      })
    }

    res.status(200).json({
      success: true,
      data: orders
    })
  } catch(err) {
    res.status(500).json({
      success: false,
      message: "Error occured!"
    })
  }
}

module.exports = {createOrder, capturePayment, getAllOrdersByDetails, getAllOrdersByUsers}