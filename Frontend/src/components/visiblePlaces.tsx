import { getTourismIcon } from "../utils/icons";

function Sidebar({ visiblePlaces, fetchPlaces, showSidebar, setShowSidebar }: {
  visiblePlaces: any[];
  fetchPlaces: () => void;
  showSidebar: boolean;
  setShowSidebar: (value: boolean) => void;
}) {
  return (
    <div className="h-full w-full flex items-center py-2">
      <div
        className={`transition-all duration-500 ease-in-out ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } h-full w-[300px] border-1 bg-background-beige1 shadow-lg rounded-4xl m-2 ml-4 flex`}
      >
        <div className="h-full w-full flex flex-col">
          <h1 className="text-heading-1 flex-1 py-2 font-display border-b-2 rounded-t-4xl border-primary-brown text-primary-brown text-center justify-center flex items-center">
            Visible places
          </h1>
          <ul className="px-2 overflow-y-auto flex-[14] scrollbar">
            {visiblePlaces.map((place: any) => (
              <li key={place.id} className="pb-2 my-2 border-b border-primary-brown flex items-center">
                <div className="mr-2">{getTourismIcon(place.properties.tourism)}</div>
                <div>
                  <h2 className="text-primary-brown text-heading-3">{place.properties.name}</h2>
                  <p>{place.properties.vicinity}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="p-4 flex-1 border-t-2 border-primary-brown flex items-center justify-center">
            <button onClick={fetchPlaces} className="border border-primary-brown bg-background-beige2 shadow-custom1 rounded-2xl h-full w-full">
              <p className="text-primary-brown text-heading-4">Fetch Places</p>
            </button>
          </div>
        </div>
      </div>

      <button
        className={`fixed left-0 top-1/2 transform -translate-y-1/2 transition-all duration-500 ease-in-out ${
          showSidebar ? "translate-x-[300px]" : "translate-x-0"
        } bg-primary text-primary-brown text-heading-4 ml-8 px-4 py-2 rounded-lg shadow-lg border border-primary-brown bg-background-beige2`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? "Close" : "Open"}
      </button>
    </div>
  );
}

export default Sidebar;
