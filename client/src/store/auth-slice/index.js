import api from "@/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

export const registerUser = createAsyncThunk('/register',
  async(formData) => {
    const res = await api.post('/api/auth/register', formData)
    return res.data;
  }
)

export const loginUser = createAsyncThunk('/login',
  async(formData) => {
    const res = await api.post(`/api/auth/login`, formData)
    return res.data;
  }
)

export const logoutUser = createAsyncThunk('/auth/logout',
  async() => {
    const res = await api.post('/api/auth/logout', {})
    return res.data;
  }
)

export const checkAuth = createAsyncThunk('/auth/checkauth',
  async() => {
    const res = await api.get('/api/auth/check-auth',
      {
        headers: {
          'Cache-Control' : 'no-store, no-cache, must-revalidate, proxy-revalidate',
        }
      }
    )
    return res.data;
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: () => {},
  },
  extraReducers: (builder) => {
      builder
      .addCase(registerUser.pending, (state)=> {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false
      })
      .addCase(loginUser.pending, (state)=> {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = 
          action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false
      })
      .addCase(checkAuth.pending, (state)=> {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = 
          action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
    ;
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
