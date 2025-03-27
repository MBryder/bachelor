import { useState, useEffect, useRef } from "react";

function Sidebar({ visiblePlaces }: { visiblePlaces: any[] }) {
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    console.log("showSidebar", showSidebar);
  }, [showSidebar]);

  return (
    <div className="h-screen flex items-center">
      <div
        className={`transition-all duration-500 ease-in-out ${
          showSidebar ? "transform translate-x-0" : "transform -translate-x-full"
        } h-full w-[300px] bg-background-beige1 shadow-lg`}
      >
        <div className="p-4">
          <h1 className="text-xl font-bold">Visable places</h1>
            <ul>
                {visiblePlaces.map((place : any) => (
                <li key={place.id} className="p-2 shadow rounded-lg my-2">
                    <h2 className="font-bold">{place.properties.name}</h2>
                    <p>{place.address}</p>
                </li>
                ))}
            </ul>
        </div>
      </div>

      <button
        className={`fixed left-0 top-1/2 transform -translate-y-1/2 transition-all duration-500 ease-in-out ${
          showSidebar ? "translate-x-[300px]" : "translate-x-0"
        } bg-primary text-text-dark ml-4 px-4 py-2 rounded-lg shadow-lg bg-background-beige1`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? "Close" : "Open"}
      </button>
    </div>
  );
}

export default Sidebar;
