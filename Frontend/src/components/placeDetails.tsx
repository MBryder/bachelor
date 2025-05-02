function PlaceDetails({
  setShowDetails,
  showDetails,
}: {
  setShowDetails: (id: string) => void;
  showDetails: string;
}) {
  return (
    <div className="h-full flex items-center py-2 z-10">
      <div className="h-full w-[300px] border-1 bg-background-beige1 shadow-lg rounded-4xl m-2 ml-4 flex">
        <div className="h-full w-full flex flex-col">
          <h1 className="text-heading-1 flex-1 py-2 font-display border-b-2 rounded-t-4xl border-primary-brown text-primary-brown text-center justify-center flex items-center">
            Place Details
          </h1>

          <div className="flex-1 px-2 overflow-y-auto flex flex-col justify-center items-center text-gray-400">
            {/* Placeholder content or leave empty */}
            <p className="italic">No place selected</p>
          </div>

          <div className="p-4 border-t-2 border-primary-brown flex items-center justify-center">
            <button
              onClick={() => setShowDetails("")}
              className="border border-primary-brown bg-background-beige2 shadow-custom1 rounded-2xl h-full w-full"
            >
              <p className="text-primary-brown text-heading-3">Close</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceDetails;
