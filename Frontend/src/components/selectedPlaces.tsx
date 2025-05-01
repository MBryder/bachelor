import { useState, useEffect } from "react";
import { getTourismIcon } from "../utils/icons";
import { fetchPlaceById } from "../services/placesService";

function Selectedbar({
  selectedPlaces,
  Submit,
  handleChange,
  setSelectedPlacesList,
  visiblePlaces,
}: {
  selectedPlaces: any[];
  setSelectedPlacesList: (places: any[]) => void;
  Submit: () => void;
  handleChange: (value: boolean) => void;
  visiblePlaces: any[];
}) {
  const [checked, setChecked] = useState(false);
  const [customName, setCustomName] = useState("");
  const [routes, setRoutes] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);


  const handleCheckboxChange = () => {
    setChecked(!checked);
    handleChange(checked);
  };

  useEffect(() => {
    Submit(); // Reset checkbox when selectedPlaces changes
  }, [selectedPlaces]);

  const handleRemove = (indexToRemove: number) => {
    const updatedList = selectedPlaces.filter((_, index) => index !== indexToRemove);
    setSelectedPlacesList([...updatedList]); // Force immutability
  };

  const saveRouteHandler = async () => {
    const username = localStorage.getItem("username");
  
    if (!username) {
      alert("No username found in local storage.");
      return;
    }
  
    if (!customName.trim()) {
      alert("Please enter a route name before saving.");
      return;
    }
  
    // Remove the first waypoint if it's the user's location
    const cleanedPlaces = [...selectedPlaces];
    if (cleanedPlaces[0]?.properties?.placeId === "user-location") {
      cleanedPlaces.shift(); // remove first item
    }
  
    const routeData = {
      customName: customName.trim(),
      waypoints: cleanedPlaces.map(place => place.properties.placeId)
    };
  
    try {
      const response = await fetch(`http://localhost:5001/user/${username}/routes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(routeData)
      });
  
      if (!response.ok) {
        const error = await response.text();
        console.error("Failed to save route:", error);
        return;
      }
  
      const data = await response.json();
      console.log("Route saved:", data);
      alert("Route saved successfully!");
      setCustomName(""); // Clear input after save
    } catch (err) {
      console.error("Error saving route:", err);
    }
  };

  const handleMyRoutesClick = async () => {
    const username = localStorage.getItem("username");

    if (!username) {
      alert("Username not found in local storage.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/user/${username}/routes`);
      if (!response.ok) throw new Error("Failed to fetch routes.");
      const data = await response.json();
      setRoutes(data);
      setShowDropdown(prev => !prev); // Toggle visibility
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const handleRouteSelect = async (route: any) => {
    const waypointIds = route.waypoints;

    console.log("Waypoints (placeIds) in selected route:", waypointIds);

    try {
      // Fetch all places in parallel
      const placePromises = waypointIds.map((id: string) => fetchPlaceById(id));
      const fetchedPlaces = await Promise.all(placePromises);

      // Filter out any nulls in case some fetches failed
      const validPlaces = fetchedPlaces.filter((place) => place !== null);

      console.log("Fetched places from backend:", validPlaces);

      // Update selected places list
      setSelectedPlacesList(validPlaces);
      setShowDropdown(false);
    } catch (err) {
      console.error("Error loading places for selected route:", err);
    }
  };

  return (
    <div className="h-5/8 flex items-center py-2 px-2">
      <div className="translate-x-0 h-full w-[300px] border-1 bg-background-beige1 shadow-lg rounded-4xl m-2 ml-4 flex">
        <div className="h-full w-full flex flex-col">
          <h1 className="flex-1 text-heading-1 font-display border-b-2 rounded-t-4xl border-primary-brown text-primary-brown text-center justify-center flex items-center">
            Selected places
          </h1>
          <ul className="px-2 overflow-y-auto h-fit scrollbar flex-[6]">
            {selectedPlaces.map((place: any, index: number) => (
              <li
                key={index}
                className="pb-2 my-2 border-b border-primary-brown flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="mr-2">{getTourismIcon(place.properties.tourism)}</div>
                  <div>
                    <h2 className="text-primary-brown text-heading-4">{place.properties.name}</h2>
                    <p>{place.properties.address}</p>
                  </div>
                </div>
                <button
                  className="ml-2 mr-2 text-sm hover:text-red-600 text-primary-brown"
                  onClick={() => handleRemove(index)}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          <div className="p-2 px-4 flex-1 border-t-2 border-primary-brown flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checked}
                onChange={handleCheckboxChange}
              />
              Use current locations as starting point
            </label>
            <input
              type="text"
              placeholder="Route name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="border border-primary-brown rounded-xl px-2 w-1/2 text-primary-brown"
            />
            <button
              onClick={saveRouteHandler}
              className="border border-primary-brown bg-background-beige2 shadow-custom1 rounded-xl w-1/2"
            >
              <p className="text-primary-brown text-heading-4">Save Route</p>
            </button>
            <div className="relative w-full scrollbar">
              <button
                onClick={handleMyRoutesClick}
                className="border border-primary-brown bg-background-beige2 shadow-custom1 rounded-xl w-full mt-2"
              >
                <p className="text-primary-brown text-heading-4">My Routes</p>
              </button>

              {showDropdown && (
                <div className="absolute left-0 mt-1 w-full bg-white border border-primary-brown rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto scrollbar">
                  <ul>
                    {routes.length > 0 ? (
                      routes.map((route, index) => (
                        <li
                          key={index}
                          onClick={() => handleRouteSelect(route)}
                          className="px-4 py-2 hover:bg-background-beige1 text-primary-brown text-heading-5 cursor-pointer"
                        >
                          {route.customName || `Route ${route.id}`}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-gray-500">No routes found</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Selectedbar;
