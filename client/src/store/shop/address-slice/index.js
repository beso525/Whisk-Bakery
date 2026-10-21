import api from '@/api'
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

const initialState = {
  isLoading: false,
  addressList: []
}

export const addAddress = createAsyncThunk('address/addAddress', 
  async(formData)=> {
    const response = await api.post(
      "/api/shop/address/add",formData)
    return response.data
})

export const getAddress = createAsyncThunk('address/getAddress', 
  async()=> {
    const response = await api.get('/api/shop/address/get')
    return response.data
})

export const editAddress = createAsyncThunk('address/editAddress', 
  async({addressId, formData})=> {
    const response = await api.put(`/api/shop/address/update/${addressId}`, 
      formData
    );
    return response.data
})

export const deleteAddress = createAsyncThunk('address/deleteAddress', 
  async({addressId})=> {
    const response = await api.delete(`/api/shop/address/delete/${addressId}`)
    return response.data
})

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {},
  extraReducers:(builder) => {
    builder
      .addCase(addAddress.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.isLoading = false
        state.addressList = action.payload.data
      })
      .addCase(addAddress.rejected, (state) => {
        state.isLoading = false
        state.addressList = []
      })
      .addCase(getAddress.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAddress.fulfilled, (state, action) => {
        state.isLoading = false
        state.addressList = action.payload.data
      })
      .addCase(getAddress.rejected, (state) => {
        state.isLoading = false
        state.addressList = []
      })
      .addCase(editAddress.pending, (state) => {
        state.isLoading = true
      })
      .addCase(editAddress.fulfilled, (state, action) => {
        state.isLoading = false
        state.addressList = action.payload.data
      })
      .addCase(editAddress.rejected, (state) => {
        state.isLoading = false
        state.addressList = []
      })
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false
        state.addressList = action.payload.data
      })
      .addCase(deleteAddress.rejected, (state) => {
        state.isLoading = false
        state.addressList = []
      })
  }
})

export default addressSlice.reducer;