// services/routeService.ts
const API_BASE = "http://localhost:5001";

export const saveRoute = async (username: string, routeData: any) => {
    try {
      const response = await fetch(`${API_BASE}/user/${username}/routes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(routeData)
      });
  
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to save route: ${error}`);
      }
  
      return await response.json();
    } catch (err) {
      console.error("saveRoute failed:", err);
      throw err; // re-throw to let the component handle it
    }
  };

  export const fetchRoutesByUser = async (username: string) => {
    try {
      const response = await fetch(`${API_BASE}/user/${username}/routes`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch routes: ${errorText}`);
      }
  
      return await response.json();
    } catch (err) {
      console.error(`Error in fetchRoutesByUser for ${username}:`, err);
      throw err;
    }
  };
  
  export const shareRoute = async (routeData: any) => {
    const token = localStorage.getItem("token")
    try {
        console.log("Sharing route data:", routeData);
      const response = await fetch(`${API_BASE}/routes/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(routeData)
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save route: ${errorText}`);
      }
    
      return await response.json();
    } catch (err) {
      console.error("saveRoute failed:", err);
      throw err; // re-throw to let the component handle it
    }
  };