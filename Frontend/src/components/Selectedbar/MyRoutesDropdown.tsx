import React from "react";

interface Route {
  id: string;
  customName?: string;
  dateOfCreation: string;
  transportationMode: string;
  waypoints: string[];
}

interface Props {
  handleMyRoutesClick: () => void;
  routes: Route[];
  showDropdown: boolean;
  handleRouteSelect: (route: Route) => void;
  selectedRouteName: string | null;
}

const formatMode = (mode: string) => {
  const icons: Record<string, string> = {
    driving: "🚗 Driving",
    walking: "🚶 Walking",
    cycling: "🚴 Cycling",
    "e-cycling": "⚡🚴 E-Cycling",
    wheelchair: "♿ Wheelchair",
  };
  return icons[mode] || mode;
};

const MyRoutesDropdown: React.FC<Props> = ({
  handleMyRoutesClick,
  routes,
  showDropdown,
  handleRouteSelect,
  selectedRouteName,
}) => (
  <div className="relative w-full scrollbar">
    <button
      onClick={handleMyRoutesClick}
      className="border border-primary-brown bg-background-beige2 shadow-custom1 rounded-xl w-full gap-2 py-1 hover:bg-background-beige1 hover:shadow-custom2 hover:scale-[1.02] active:scale-[0.98] active:shadow-inner transition-all duration-150 ease-in-out"
    >
      <p className="text-primary-brown text-heading-4">
        {selectedRouteName
          ? `📍 ${selectedRouteName}`
          : "My Routes"}
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
);

export default MyRoutesDropdown;
