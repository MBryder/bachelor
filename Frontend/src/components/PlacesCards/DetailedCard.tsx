type DetailedCardProps = {
  place: any;
  setSelectedPlacesList: (fn: (prev: any[]) => any[]) => void;
  setShowMoreDetails: (id: string) => void;
};

const DetailedCard = ({
  place,
  setSelectedPlacesList,
  setShowMoreDetails,
}: DetailedCardProps) => {
  const { name, rating, userRatingsTotal, images, details } =
    place.properties;

  const imageUrl =
    images?.[0]?.imageUrl ||
    "https://img.freepik.com/premium-vector/travel-copenhagen-icon_408115-1792.jpg?w=826";

  const description =
    details?.editorialOverview || "No description available.";
  const phone = details.formattedPhoneNumber;
  const website = details.website;
  const mapUrl = details.url;
  const weekdayText = details.weekdayText;

  return (
    <li className="p-4 mb-2 border-b-2 border-primary-brown flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h2 className="text-heading-2 text-primary-brown">{name}</h2>
        <button
          onClick={() => setShowMoreDetails("")}
          className="text-lg px-2 rounded hover:bg-red-100"
        >
          X
        </button>
      </div>

      <div className="w-full aspect-video rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-600 italic">{description}</p>
        <p className="text-sm text-gray-800">{details.formattedAddress}</p>

        {rating && (
          <div className="flex items-center gap-1">
            <p className="text-sm">{rating}</p>
            <p className="text-sm text-yellow-500">
              {"★".repeat(Math.round(rating))}
              <span className="text-gray-300">
                {"★".repeat(5 - Math.round(rating))}
              </span>
            </p>
            <p className="text-sm">{`(${userRatingsTotal})`}</p>
          </div>
        )}

        {phone && (
          <p className="text-sm">
            {"Phone: "}
            <a href={`tel:${phone}`} className="text-blue-600 underline">
              {phone}
            </a>
          </p>
        )}

        {website || mapUrl ? (
          <p className="text-sm">
            🌐 Website:{" "}
            <a
              href={website || mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-words"
            >
              {(() => {
                try {
                  const host = new URL(website || mapUrl).hostname;
                  return host.replace(/^www\./, "");
                } catch {
                  return website || "View on Google Maps";
                }
              })()}
            </a>
          </p>
        ) : null}

        {weekdayText && weekdayText.length > 0 && (
          <div>
            <p className="text-sm pl-2 font-semibold text-primary-brown">
              Opening hours:
            </p>
            <ul className="pl-4 list-disc text-sm text-gray-700">
              {weekdayText.map((day: string, index: number) => (
                <li key={index}>{day}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        onClick={() =>
          setSelectedPlacesList((prevList: any[]) => [...prevList, place])
        }
        className="mt-4 w-full py-2 border border-primary-brown bg-background-beige1 shadow-custom1 rounded-xl text-primary-brown"
      >
        + Add to list
      </button>
    </li>
  );
};

export default DetailedCard;
