
import api from "@/api";
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

const initialState = {
  cartItems : [],
  isLoading: false
}

export const addToCart = createAsyncThunk('cart/addToCart', 
  async({productId, quantity})=> {
    const response = await api.post("/api/shop/cart/add",{
     productId, quantity
    })

    return response.data
})

export const getCart = createAsyncThunk('cart/getCart', 
  async()=> {
    const response = await api.get('/api/shop/cart/get')
    return response.data
})

export const deleteCartItem = createAsyncThunk('cart/deleteCartItem', 
  async(productId)=> {
    const response = 
      await api.delete(`/api/shop/cart/${productId}`)
    return response.data
})

export const updateCartQty = createAsyncThunk('cart/updateCartQty', 
  async({productId, quantity})=> {
    const response = await api.put("/api/shop/cart/update-cart",{
      productId, quantity
    })
    return response.data
})


const shoppingCartSlice = createSlice({
  name: 'shoppingCart',
  initialState,
  reducers: {},
  extraReducers : (builder)=> {
    builder
      .addCase(addToCart.pending, (state) =>{
        state.isLoading = true
      })
      .addCase(addToCart.fulfilled, (state, action) =>{
        state.isLoading = false
        state.cartItems = action.payload.data
      })
      .addCase(addToCart.rejected, (state) =>{
        state.isLoading = false
        state.cartItems = []
      })
      .addCase(getCart.pending, (state) =>{
        state.isLoading = true
      })
      .addCase(getCart.fulfilled, (state, action) =>{
        state.isLoading = false
        state.cartItems = action.payload.data
      })
      .addCase(getCart.rejected, (state) =>{
        state.isLoading = false
        state.cartItems = []
      })
      .addCase(updateCartQty.pending, (state) =>{
        state.isLoading = true
      })
      .addCase(updateCartQty.fulfilled, (state, action) =>{
        state.isLoading = false
        state.cartItems = action.payload.data
      })
      .addCase(updateCartQty.rejected, (state) =>{
        state.isLoading = false
        state.cartItems = []
      })
      .addCase(deleteCartItem.pending, (state) =>{
        state.isLoading = true
      })
      .addCase(deleteCartItem.fulfilled, (state, action) =>{
        state.isLoading = false
        state.cartItems = action.payload.data
      })
      .addCase(deleteCartItem.rejected, (state) =>{
        state.isLoading = false
        state.cartItems = []
      })
  }
})

export default shoppingCartSlice.reducer;
