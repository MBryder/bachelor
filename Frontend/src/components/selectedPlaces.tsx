import { useState, useEffect } from "react";
import { getTourismIcon } from "../utils/icons";
import { fetchPlaceById } from "../services/placesService";
import { useSelectedPlaces } from "../context/SelectedPlacesContext";
import { useSelectedRoute } from "../context/SelectedRouteContext";
import { saveRoute, fetchRoutesByUser, shareRoute } from "../services/routeService";
import { place } from "../utils/types";

function Selectedbar({
  handleChange,
}: {
  handleChange: (value: boolean) => void;
  visiblePlaces: place[];
}) {
  const [checked, setChecked] = useState(false);
  const [customName, setCustomName] = useState("");
  const [routes, setRoutes] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputError, setInputError] = useState(false); // til errors, når saveroute smider en error som fx. når user ikke giver rute et navn. 
  const [dropdownOpen, setDropdownOpen] = useState(false); // til dropdown menu til "mode of transportation". 
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle"); // til at improve "Save route" button. 
  const [selectedRouteName, setSelectedRouteName] = useState<string | null>(null); // til at vise navn på valgt route fra DB fra users konto. 
  const {selectedPlacesList, setSelectedPlacesList } = useSelectedPlaces(); // til at vise de steder som er valgt i selectedPlaces.
  const [newRoute, setNewRoute] = useState(false);
  const { transportMode, setTransportMode } = useSelectedRoute();
  const [ shareableLink , setShareableLink ] = useState<string | null>(null);

  const handleCheckboxChange = () => {
    setChecked(!checked);
    handleChange(checked);
  };

  useEffect(() => {
    if (!newRoute){
      setSelectedRouteName(null);
    }
    setNewRoute(false);
  }, [selectedPlacesList, transportMode]);

  const handleRemove = (indexToRemove: number) => {
    const updatedList = selectedPlacesList.filter((_, index) => index !== indexToRemove);
    setSelectedPlacesList([...updatedList]); // Force immutability
  };

  const saveRouteHandler = async () => {
    const username = localStorage.getItem("username");
  
    if (!username) {
      alert("No username found in local storage.");
      return;
    }
  
    if (!customName.trim()) {
      setInputError(true);
      setTimeout(() => setInputError(false), 2000);
      return;
    }
  
    const cleanedPlaces = [...selectedPlacesList];
    if (cleanedPlaces[0]?.placeId === "user-location") {
      cleanedPlaces.shift();
    }
  
    if (cleanedPlaces.length <= 1) {
      alert("You need to add at least two places before saving a route.");
      setSaveStatus("idle");
      return;
    }
  
    const routeData = {
      customName: customName.trim(),
      waypoints: cleanedPlaces.map(place => place.placeId),
      transportationMode: transportMode
    };
  
    try {
      setSaveStatus("saving");
      await saveRoute(username, routeData);
      setSelectedRouteName(customName.trim());
      setCustomName("");
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 1500);
    } catch (err) {
      console.error("Error saving route:", err);
      setSaveStatus("idle");
    }
  };

  const shareRouteHandler = async () => {
    let name = customName.trim()
    console.log("Selected route name:", selectedRouteName)
    if (!name && !selectedRouteName) {
      setInputError(true);
      setTimeout(() => setInputError(false), 2000);
      return;
    }
    if(!name && selectedRouteName) {
      name = selectedRouteName;
      console.log("Name from selected route:", name); 
    }
  
    const cleanedPlaces = [...selectedPlacesList];
    if (cleanedPlaces[0]?.placeId === "user-location") {
      cleanedPlaces.shift();
    }
  
    if (cleanedPlaces.length <= 1) {
      alert("You need to add at least two places before sharing a route.");
      setSaveStatus("idle");
      return;
    }
  
    const routeData = {
      customName: name,
      waypoints: cleanedPlaces.map(place => place.placeId),
      transportationMode: transportMode
    };
  
    try {
      const result = await shareRoute(routeData);
      console.log(result.routeId)
      setShareableLink(`${window.location.origin}/shared-route/${result.routeId}`);
      setTimeout(() => setSaveStatus("idle"), 1500);
      
    } catch (err) {
      console.error("Error saving route:", err);
      setSaveStatus("idle");
    }
  };
  
  const handleMyRoutesClick = async () => {
    const username = localStorage.getItem("username");
  
    if (!username) {
      alert("Username not found in local storage.");
      return;
    }
  
    try {
      const data = await fetchRoutesByUser(username);
      setRoutes(data);
      setShowDropdown(prev => !prev);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const handleRouteSelect = async (route: any) => {
    const waypointIds = route.waypoints;
    setSelectedRouteName(route.customName || `Route ${route.id}`);

    try {
      console.log("Fetching places for route:", waypointIds);
      const placePromises = waypointIds.map((id: string) => fetchPlaceById(id));
      const fetchedPlaces = await Promise.all(placePromises);
      const validPlaces = fetchedPlaces.filter((place) => place !== null);

      setTransportMode(route.transportationMode); // already handled
      setNewRoute(true);
      setSelectedPlacesList(validPlaces);
      setShowDropdown(false);
    } catch (err) {
      console.error("Error loading places for selected route:", err);
    }
  };

  const formatMode = (mode: string) => {
    const icons: Record<string, string> = {
      driving: "🚗 Driving",
      walking: "🚶 Walking",
      cycling: "🚴 Cycling",
      "e-cycling": "⚡🚴 E-Cycling",
      wheelchair: "♿ Wheelchair"
    };
    return icons[mode] || mode;
  };

  const handleSetAsStart = (index: number) => {
    if (index <= 0 || index >= selectedPlacesList.length) return;

    const updatedList = [...selectedPlacesList];
    const [selectedPlace] = updatedList.splice(index, 1);
    updatedList.unshift(selectedPlace);

    setSelectedPlacesList(updatedList);
  };

  return (
    <div className="h-5/8 flex items-center py-2 px-2">
      <div className="translate-x-0 h-full w-[300px] border-1 bg-background-beige1 shadow-lg rounded-4xl m-2 ml-4 flex">
        <div className="h-full w-full flex flex-col">
          <h1 className="flex-1 text-heading-1 font-display border-b-2 rounded-t-4xl border-primary-brown text-primary-brown text-center justify-center flex items-center">
            Selected places
          </h1>
          <ul className="px-2 overflow-y-auto h-fit scrollbar flex-[6]">
            {selectedPlacesList.map((place: any, index: number) => (
              <li
                key={index}
                className={`pb-2 my-2 border-b flex items-center justify-between border-primary-brown`}
              >
                <div className="flex items-center justify-between w-full -ml-1">
                  <div className="flex items-center">
                    <div className="mr-2">{getTourismIcon(place.tourism)}</div>
                    <div>
                      <h2 className="text-primary-brown text-heading-4">
                        {place.name}
                        {index === 0 && (
                          <span className="text-xs text-primary-brown/60 ml-1 italic">
                            (starting place)
                          </span>
                        )}
                      </h2>
                      <p>{place.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {index !== 0 && (
                      <button
                        onClick={() => handleSetAsStart(index)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Set as start
                      </button>
                    )}
                    <button
                      className="text-sm hover:text-red-600 text-primary-brown self-end"
                      onClick={() => handleRemove(index)}
                    >
                      X
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="p-2 px-4 flex-1 border-t-2 border-primary-brown flex flex-col gap-2">
            {/* 1. Checkbox */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checked}
                onChange={handleCheckboxChange}
              />
              Use current locations as starting point
            </label>

            {/* 2. Route name input and mode of transportation!*/}
            <div className="flex flex-row gap-2 w-full items-center">
              <input
                type="text"
                placeholder="Route name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className={`rounded-xl px-2 py-1 w-1/2 text-primary-brown transition duration-300 ease-in-out
    ${inputError ? 'border-red-500 ring-2 ring-red-300 animate-shake' : 'border border-primary-brown'}`}
              />
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="border border-primary-brown bg-background-beige2 shadow-custom1 rounded-xl px-4 py-1 min-w-[130px] text-primary-brown text-heading-4 hover:bg-background-beige1 hover:shadow-custom2 hover:scale-[1.02] 
    active:scale-[0.98] active:shadow-inner transition-all duration-150 ease-in-out"
                >
                  {transportMode}
                </button>
                {dropdownOpen && (
                  <ul className="absolute mt-1 w-full rounded-xl border border-primary-brown bg-white shadow-lg z-50">
                    {["driving 🚗", "walking 🚶", "cycling 🚲", "e-cycling 🚲⚡", "wheelchair ♿"].map((mode) => (
                      <li
                        key={mode}
                        onClick={() => {
                          setTransportMode(mode);
                          setDropdownOpen(false);
                        }}
                        className="px-4 py-2 hover:bg-background-beige1 cursor-pointer text-primary-brown"
                      >
                        {mode}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* 4. Save Route */}
            <button
              onClick={saveRouteHandler}
              disabled={saveStatus === "saving"}
              className={`border border-primary-brown rounded-xl w-full py-1
                      flex items-center justify-center gap-2
                      shadow-custom1 hover:bg-background-beige1 hover:shadow-custom2 hover:scale-[1.02]
                      active:scale-[0.98] active:shadow-inner
                      transition-all duration-300 ease-in-out
                      ${saveStatus === "saved" ? "bg-green-200" : "bg-background-beige2"}
                      ${saveStatus === "saving" ? "opacity-50 cursor-wait" : ""}
                    `}
            >
              {saveStatus === "saving" && (
                <span className="animate-spin h-4 w-4 border-2 border-primary-brown border-t-transparent rounded-full" />
              )}
              <p className="text-primary-brown text-heading-4">
                {saveStatus === "saved" ? "✔ Saved!" : "Save route"}
              </p>
            </button>

            {/* 5. My Routes dropdown */}
            <div className="flex flex-row gap-2">
              <div className="relative w-full scrollbar">
                <button
                  onClick={handleMyRoutesClick}
                  className="border border-primary-brown bg-background-beige2 shadow-custom1 rounded-xl w-full gap-2 py-1 hover:bg-background-beige1 hover:shadow-custom2 hover:scale-[1.02] 
                    active:scale-[0.98] active:shadow-inner 
                    transition-all duration-150 ease-in-out"
                >
                  <p className="text-primary-brown text-heading-4">
                    {selectedRouteName ? `📍 ${selectedRouteName}` : "My Routes"}
                  </p>
                </button>

                {showDropdown && (
                  <div className="absolute left-0 mt-1 w-[175%] bg-white border border-primary-brown rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto scrollbar">
                    <ul>
                      {routes.length > 0 ? (
                        routes.map((route, index) => (
                          <li
                            key={index}
                            onClick={() => handleRouteSelect(route)}
                            className="px-4 py-2 hover:bg-background-beige1 text-primary-brown text-heading-5 cursor-pointer"
                          >
                            <div className="font-semibold">
                              {route.customName || `Route ${route.id}`}
                            </div>
                            <div className="text-sm text-primary-brown/70">
                              Created: {new Date(route.dateOfCreation).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-primary-brown/70">
                              Transportation: {formatMode(route.transportationMode)}
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-gray-500">No routes found</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <button
                className="border border-primary-brown rounded-xl w-full py-1 text-primary-brown bg-background-beige2 shadow-custom1 hover:bg-background-beige1 hover:shadow-custom2 hover:scale-[1.02] transition-all duration-150 ease-in-out"
                onClick={shareRouteHandler}
              >
                🔗 Share this route
              </button>
            </div>

            {shareableLink && (
              <div>
                <p>Shareable link:</p>
                <div className="w-full bg-background-beige3 mb-2 border border-primary-brown px-2 py-1 flex flew-col overflow-hidden rounded-xl">
                  <p>{shareableLink}</p>
                </div>
              </div>
              
              
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Selectedbar;
