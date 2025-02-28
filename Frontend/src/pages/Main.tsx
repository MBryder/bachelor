import { useEffect, useState } from "react";
import { getWeather } from "../services/weatherService";

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
            <h1 className="text-display-1 font-display">Display 1</h1>
            <h2 className="text-heading-1">Heading 1</h2>
            <h3 className="text-heading-2">Heading 2</h3>
            <h4 className="text-heading-3">Heading 3</h4>
            <p className="text-paragraph-1">This is a paragraph with paragraph-1 style.</p>
            <button className="bg-primary-dark text-white px-4 py-2 text-button rounded-lg shadow-custom1">
                Click Me
            </button>
        </div>
        
    );
}

export default Main;
