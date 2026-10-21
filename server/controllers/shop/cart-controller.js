const Cart = require ('../../models/Cart')
const Product = require("../../models/Product")

const addToCart = async(req, res) => {
  try {
    const {productId, quantity} = req.body;
    const userId = req.user.id;
    if (!userId || !productId || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data'
      })
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data'
      })
    }

    let cart = await Cart.findOne({userId});

    if (!cart) {
      cart = new Cart({userId, items: []})
    }

    const findCurrentProductIndex = cart.items.findIndex(item => item.productId.toString() == productId)

    if (findCurrentProductIndex == -1) {
      cart.items.push({productId, quantity})
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    await cart.save();
    res.status(200).json({
      success: true,
      data: cart
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'add to cart server error'
    })
  }
}

const getCart = async(req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "No User ID"
      })
    }

    const cart = await Cart.findOne({userId}).populate({
      path: 'items.productId',
      select : "image title price salePrice"
    })

    if(!cart) {
      return res.status(404).json({
        success: false,
        message: "No cart found"
      })
    }

    const validItems = cart.items.filter(productItem=> productItem.productId)

    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save()
    }

    const populateCart = validItems.map(item=> ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity
    }))

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCart
      }
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'get cart server error'
    })
  }
}

const updateCartQty = async(req, res) => {
  try {
    const {productId, quantity} = req.body;
    const userId = req.user.id;
    if (!userId || !productId || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data'
      })
    }
    
    const cart = await Cart.findOne({userId})
    if(!cart) {
      return res.status(404).json({
        success: false,
        message: "No cart found"
      })
    }

    const findCurrentProductIndex = cart.items.findIndex(item => item.productId.toString() == productId)

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      })
    }

    cart.items[findCurrentProductIndex].quantity = quantity
    await cart.save()

    await cart.populate({
      path: 'items.productId',
      select : "image title price salePrice"
    })

    const populateCart = cart.items.map(item=> ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity
    }))

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCart
      }
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'update cart server error'
    })
  }
}

const deleteCartItem = async(req, res) => {
  try {
    const {productId} = req.params;
    const userId = req.user.id;
    if (!userId || !productId) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }

    const cart = await Cart.findOne({userId}).populate({
      path: "items.productId",
      select: "image title price salePrice"
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      })
    }

    cart.items = cart.items.filter(item => item.productId._id.toString() !== productId);
    
    await cart.save();
    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice"
    });

    const populateCart = cart.items.map(item=> ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity
    }))

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCart
      }
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'delete cart server error'
    })
  }
}

module.exports = {addToCart, updateCartQty, deleteCartItem, getCart}