export interface LoginRequest {
  Username: string;
  Password: string;
}

export interface LoginResponse {
  token: string;
}

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch('http://localhost:5001/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Login failed');
  }

  return await response.json();
};

export const validateToken = async (): Promise<boolean> => {
  const token = localStorage.getItem("token");

  if (!token) return false;

  try {
    const response = await fetch("http://localhost:5001/user/validate-token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (err) {
    console.error("Token validation failed:", err);
    return false;
  }
};


