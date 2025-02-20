import { useEffect, useState } from "react";
import { getWeather } from "./services/weatherService";

function Main() {
    const [weather, setWeather] = useState<{ temperature: string, condition: string } | null>(null);

    useEffect(() => {
        getWeather()
            .then((data) => {
                console.log("Setting weather state:", data);
                setWeather(data); // Use as it is, without assuming uppercase keys
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <div>
            <h1>Weather App</h1>
            {weather ? (
                <p>Temperature: {weather.temperature}, Condition: {weather.condition}</p> 
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Main;
