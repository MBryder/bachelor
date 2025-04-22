// src/utils/auth.ts
import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    const now = Date.now() / 1000; // in seconds
    console.log("Decoded token expiration:", new Date(decoded.exp * 1000).toISOString(), "Current time:", new Date(now * 1000).toISOString());
    return decoded.exp < now;
  } catch (err) {
    return true; // invalid token = assume expired
  }
};

export const getUsernameFromToken = (token: string): string | null => {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.name || null;
  } catch (err) {
    return null;
  }
};
