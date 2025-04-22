export const authFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
  
    const headers = {
      ...(options.headers || {}),
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  
    const res = await fetch(url, { ...options, headers });
  
    // Optional: handle 401 globally
    if (res.status === 401) {
      console.warn('Unauthorized – redirect to login?');
    }
  
    return res;
  };
  