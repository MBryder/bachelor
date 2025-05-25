import axios from "axios";
import { API_BASE } from "./api";
import { Route } from "../utils/types";

// Types for login
export interface LoginRequest {
  Username: string;
  Password: string;
}
export interface LoginResponse {
  token: string;
}

// ----- LOGIN -----
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE}/user/login`,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "Login failed";
    throw new Error(msg);
  }
};

// ----- TOKEN VALIDATION -----
export const validateToken = async (): Promise<boolean> => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const response = await axios.get(`${API_BASE}/user/validate-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.status === 200;
  } catch (err) {
    console.error("Token validation failed:", err);
    return false;
  }
};

// ----- SAVED ROUTES -----
export const getSavedRoutes = async (username: string): Promise<Route[]> => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_BASE}/user/${username}/routes`, {
      headers: {
        "Content-Type": "application/json",
        Accept:
          "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch saved routes:", error);
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch saved routes"
    );
  }
};

// ----- DELETE ROUTE -----
export const deleteRoute = async (username: string, routeId: string) => {
  const token = localStorage.getItem("token");
  try {
    await axios.delete(`${API_BASE}/user/${username}/routes/${routeId}`, {
      headers: {
        "Content-Type": "application/json",
        Accept:
          "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
    });
    return true;
  } catch (error: any) {
    console.error("Failed to delete route:", error);
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to delete route"
    );
  }
};

// ----- CHANGE PASSWORD -----
export const changePassword = async (
  username: string,
  currentPassword: string,
  newPassword: string
) => {
  const token = localStorage.getItem("token");
  try {
    await axios.put(
      `${API_BASE}/user/change-password`,
      {
        username,
        currentPassword,
        newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept:
            "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return true;
  } catch (error: any) {
    console.error("Failed to change password:", error);
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to change password"
    );
  }
};

// ----- DELETE ACCOUNT -----
export const deleteAccount = async (username: string) => {
  const token = localStorage.getItem("token");
  try {
    await axios.delete(`${API_BASE}/user/${username}`, {
      headers: {
        "Content-Type": "application/json",
        Accept:
          "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
    });
    return true;
  } catch (error: any) {
    console.error("Failed to delete account:", error);
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to delete account"
    );
  }
};
