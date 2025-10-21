import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Use VITE_API_URL consistently
const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Get initial state from localStorage
const getInitialState = () => {
  try {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    const token = localStorage.getItem("token") || null;
    
    return {
      token,
      user,
      isAuthenticated: !!token,
      loading: false,
      error: null,
    };
  } catch (error) {
    console.error("Error loading auth state from localStorage:", error);
    // Clear corrupted data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return {
      token: null,
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };
  }
};

// Register user
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${API_URL}/api/auth/register`,
        userData,
        config
      );

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed";
      return rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${API_URL}/api/auth/login`,
        userData,
        config
      );

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Login failed";
      return rejectWithValue(message);
    }
  }
);

// Load user
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${API_URL}/api/auth/me`, config);

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to load user";
      
      // Clear invalid token
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      
      return rejectWithValue(message);
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/api/users/profile`,
        userData,
        config
      );

      // Update user in localStorage
      if (data.data) {
        localStorage.setItem("user", JSON.stringify(data.data));
      }

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Profile update failed";
      return rejectWithValue(message);
    }
  }
);

// Logout
export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuth: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
        toast.success("Registration successful!");
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
        toast.success("Login successful!");
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Load User
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.error = null;
        toast.success("Profile updated successfully!");
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        state.error = null;
        toast.success("Logged out successfully!");
      });
  },
});

export const { clearError, resetAuth } = authSlice.actions;

export default authSlice.reducer;