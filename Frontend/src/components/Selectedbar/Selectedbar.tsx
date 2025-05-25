import { useState, useEffect } from "react";
import {
  fetchPlaceById,
  createUserLocationPlace,
} from "../../services/placesService";
import { useSelectedPlaces } from "../../context/SelectedPlacesContext";
import { useSelectedRoute } from "../../context/SelectedRouteContext";
import {
  saveRoute,
  fetchRoutesByUser,
  shareRoute,
} from "../../services/routeService";
import { useUserLocationContext } from "../../context/UserLocationContext";

import SelectedPlaceList from "./SelectedPlaceList";
import RouteNameInput from "./RouteNameInput";
import SaveRouteButton from "./SaveRouteButton";
import MyRoutesDropdown from "./MyRoutesDropdown";
import ShareRouteButton from "./ShareRouteButton";

const Selectedbar = () => {
  const [checked, setChecked] = useState(false);
  const [customName, setCustomName] = useState("");
  const [routes, setRoutes] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [selectedRouteName, setSelectedRouteName] = useState<string | null>(null);
  const { selectedPlacesList, setSelectedPlacesList } = useSelectedPlaces();
  const [newRoute, setNewRoute] = useState(false);
  const { transportMode, setTransportMode, placesOrder, routeCoordinates } = useSelectedRoute();
  const [shareableLink, setShareableLink] = useState<string | null>(null);
  const [locationAvailable, setLocationAvailable] = useState(true);
  const userLocation = useUserLocationContext();

  const handleCheckboxChange = async () => {
    const newChecked = !checked;
    setChecked(newChecked);

    if (newChecked) {
      if (!userLocation) return;

      const { lat, lng } = userLocation;

      try {
        const response = await createUserLocationPlace(lat, lng);

        const alreadyExists = selectedPlacesList.some(
          (p) => p?.placeId === response.placeId
        );

        if (!alreadyExists) {
          setSelectedPlacesList([response, ...selectedPlacesList]);
        }
      } catch (err) {
        console.error("Failed to add user location place:", err);
      }
    } else {
      const updatedList = selectedPlacesList.filter(
        (p) => !p?.placeId?.startsWith("user-location")
      );
      setSelectedPlacesList(updatedList);
    }
  };

  useEffect(() => {
    if (!newRoute) {
      setSelectedRouteName(null);
    }
    setNewRoute(false);
  }, [selectedPlacesList, transportMode]);

  const handleRemove = (indexToRemove: number) => {
    const updatedList = selectedPlacesList.filter(
      (_, index) => index !== indexToRemove
    );
    setSelectedPlacesList([...updatedList]);
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

    if (cleanedPlaces.length <= 1) {
      alert("You need to add at least two places before saving a route.");
      setSaveStatus("idle");
      return;
    }

    const routeData = {
      customName: customName.trim(),
      waypoints: cleanedPlaces.map((place) => place.placeId),
      transportationMode: transportMode,
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
    let name = customName.trim();
    if (!name && !selectedRouteName) {
      setInputError(true);
      setTimeout(() => setInputError(false), 2000);
      return;
    }
    if (!name && selectedRouteName) {
      name = selectedRouteName;
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
      waypoints: cleanedPlaces.map((place) => place.placeId),
      transportationMode: transportMode,
    };

    try {
      const result = await shareRoute(routeData);
      setShareableLink(
        `${window.location.origin}/shared-route/${result.routeId}`
      );
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
      setShowDropdown((prev) => !prev);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const handleRouteSelect = async (route: any) => {
    const waypointIds = route.waypoints;
    setSelectedRouteName(route.customName || `Route ${route.id}`);

    try {
      const placePromises = waypointIds.map((id: string) => fetchPlaceById(id));
      const fetchedPlaces = await Promise.all(placePromises);
      const validPlaces = fetchedPlaces.filter((place) => place !== null);

      setTransportMode(route.transportationMode);
      setNewRoute(true);
      setSelectedPlacesList(validPlaces);
      setShowDropdown(false);
    } catch (err) {
      console.error("Error loading places for selected route:", err);
    }
  };

  const handleSetAsStart = (index: number) => {
    if (index <= 0 || index >= selectedPlacesList.length) return;

    const updatedList = [...selectedPlacesList];
    const [selectedPlace] = updatedList.splice(index, 1);
    updatedList.unshift(selectedPlace);

    setSelectedPlacesList(updatedList);
  };

  useEffect(() => {
    if (!navigator.permissions || !navigator.geolocation) {
      setLocationAvailable(false);
      return;
    }

    navigator.permissions
      .query({ name: "geolocation" as PermissionName })
      .then((result) => {
        if (result.state === "denied") {
          setLocationAvailable(false);
        }

        result.onchange = () => {
          setLocationAvailable(result.state !== "denied");
        };
      })
      .catch(() => {
        setLocationAvailable(false);
      });
  }, []);

  return (
    <div className="h-7/9 flex items-center py-2 px-2">
      <div className="translate-x-0 h-full w-[350px] border bg-background-beige1 shadow-lg rounded-4xl m-2 ml-4 flex">
        <div className="h-full w-full flex flex-col">
          <h1 className=" h-[50px] text-heading-1 font-display border-b-2 rounded-t-4xl border-primary-brown text-primary-brown text-center justify-center flex items-center">
            Selected places
          </h1>
          <SelectedPlaceList
            selectedPlacesList={selectedPlacesList}
            handleSetAsStart={handleSetAsStart}
            handleRemove={handleRemove}
            placesOrder={placesOrder}
            routeCoordinates={routeCoordinates}
          />
          <div className="border-t-1 border-primary-brown flex items-center justify-between">
            <p className="text-primary-brown text-heading-4 px-4">
              total time:{" "}
              {routeCoordinates?.segments?.length
              ? (() => {
                const totalMinutes = Math.round(
                  routeCoordinates.segments.reduce(
                  (total: number, segment: { duration: number }) => total + segment.duration,
                  0
                  ) / 60
                );
                if (totalMinutes >= 60) {
                  const hours = Math.floor(totalMinutes / 60);
                  const minutes = totalMinutes % 60;
                  return `${hours}h${minutes > 0 ? ` ${minutes}min` : ""}`;
                }
                return `${totalMinutes} min`;
                })()
              : "N/A"}
            </p>
            <p className="text-primary-brown text-heading-4 px-4">
              total distance:{" "}
              {routeCoordinates?.segments?.length
              ? `${(
                routeCoordinates.segments.reduce(
                  (total: number, segment: { distance: number }) => total + segment.distance,
                  0
                ) / 1000
                ).toFixed(1)} km`
              : "N/A"}
            </p>
          </div>
          <div className="p-2 px-4 flex-1 border-t-2 border-primary-brown flex flex-col gap-2">
            {/* Checkbox for current location */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checked}
                onChange={handleCheckboxChange}
                disabled={!locationAvailable}
              />
              Include current location
              {!locationAvailable && (
                <button
                  className="text-sm text-red-500 underline ml-2"
                  onClick={() => {
                    alert(
                      "To enable location access:\n\n1. Click the marker icon in the browser's address bar.\n2. Then click allow NextStop to know your location."
                    );
                  }}
                >
                  Allow location
                </button>
              )}
            </label>
            {/* Route name input + mode */}
            <RouteNameInput
              customName={customName}
              setCustomName={setCustomName}
              transportMode={transportMode}
              setTransportMode={setTransportMode}
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
              inputError={inputError}
            />
            {/* Save button */}
            <SaveRouteButton
              saveRouteHandler={saveRouteHandler}
              saveStatus={saveStatus}
            />
            <div className="flex flex-row gap-2">
              <MyRoutesDropdown
                handleMyRoutesClick={handleMyRoutesClick}
                routes={routes}
                showDropdown={showDropdown}
                handleRouteSelect={handleRouteSelect}
                selectedRouteName={selectedRouteName}
              />
              <ShareRouteButton
                shareRouteHandler={shareRouteHandler}
                shareableLink={shareableLink}
              />
            </div>
            {shareableLink && (
              <div>
                <p>Shareable link:</p>
                <div className="w-full bg-background-beige3 mb-2 border border-primary-brown px-2 py-1 flex flex-col overflow-hidden rounded-xl">
                  <p>{shareableLink}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Selectedbar;
