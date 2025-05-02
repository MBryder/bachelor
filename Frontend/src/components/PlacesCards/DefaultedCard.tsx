// components/DefaultedCard.tsx
type DefaultedCardProps = {
  place: any;
  onHover: (id: string | null) => void;
  onClick: () => void;
  isHovered: boolean;
  setSelectedPlacesList: (fn: (prev: any[]) => any[]) => void;
  showMoreDetails: string;
};

const DefaultedCard = ({
  place,
  onHover,
  onClick,
  setSelectedPlacesList,
}: DefaultedCardProps) => {
    const formatPlaceName = (name: string) => {
        const words = name.split(" ");
        const hasLongWord = words.some((word) => word.length >= 15);
      
        if (hasLongWord) {
          return name.slice(0, 12) + "...";
        }
      
        return name;
      };

  return (
    <li
      key={place.properties.placeId}
      className="pb-2 py-2 border-b border-primary-brown flex hover:bg-background-beige2 cursor-pointer justify-between"
      onMouseEnter={() => onHover(place.properties.placeId)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      <div className="flex flex-col h-full m-2">
        <h2 className="text-primary-brown text-heading-3 break-words">
          {formatPlaceName(place.properties.name)}
        </h2>
        {place.properties.rating != null && (
          <div className="flex items-center gap-1">
            <p className="text-sm">{place.properties.rating}</p>
            <p className="text-sm text-yellow-500">
              {"★".repeat(Math.round(place.properties.rating))}
              <span className="text-gray-400">
                {"★".repeat(5 - Math.round(place.properties.rating))}
              </span>
            </p>
            <p className="">{`(${place.properties.userRatingsTotal})`}</p>
          </div>
        )}
        <p>{place.properties.vicinity}</p>
      </div>
      <div className="flex flex-col items-center justify-center h-full m-2">
        <div className="w-24 aspect-square overflow-hidden">
          <img
            src={
              place.properties.images?.[0]?.imageUrl ||
              "https://img.freepik.com/premium-vector/travel-copenhagen-icon_408115-1792.jpg?w=826"
            }
            alt={place.properties.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <button
          className="mt-2 w-20 h-6 border border-primary-brown bg-background-beige2 shadow-custom1 rounded-2xl"
          onClick={(e) => {
            e.stopPropagation(); // prevent triggering parent onClick
            setSelectedPlacesList((prevList: any[]) => [...prevList, place]);
          }}
        >
          Add
        </button>
      </div>
    </li>
  );
};

export default DefaultedCard;
