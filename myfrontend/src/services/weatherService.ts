import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api/weather"; // Ensure correct URL

export const getWeather = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        console.log("API Response:", response.data); // Debugging log
        return response.data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
};
