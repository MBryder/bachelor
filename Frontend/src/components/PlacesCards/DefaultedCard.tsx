import React from "react";
import { useAddToList, useRemoveFromList } from "../../helper/updateList";
import { useInList } from "../../helper/inList";

type DefaultedCardProps = {
  place: any;
  onHover: (id: string | null) => void;
  onClick: () => void;
  isHovered: boolean;
};

const DefaultedCard = ({
  place,
  onHover,
  onClick,
}: DefaultedCardProps) => {
  const addToList = useAddToList();
  const removeFromList = useRemoveFromList();
  const inList = useInList();
  
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
      key={place.placeId}
      className="pb-2 py-2 border-b border-primary-brown flex hover:bg-background-beige2 cursor-pointer justify-between"
      onMouseEnter={() => onHover(place.placeId)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      <div className="flex flex-col h-full m-2">
        <h2 className="text-primary-brown text-heading-3 break-words">
          {formatPlaceName(place.name)}
        </h2>
        {place.rating != null && (
          <div className="flex items-center gap-1">
            <p className="text-sm">{place.rating}</p>
            <p className="text-sm text-yellow-500">
              {"★".repeat(Math.round(place.rating))}
              <span className="text-gray-400">
                {"★".repeat(5 - Math.round(place.rating))}
              </span>
            </p>
            <p className="">{`(${place.userRatingsTotal})`}</p>
          </div>
        )}
        <p>{place.vicinity}</p>
      </div>
      <div className="flex flex-col items-center justify-center h-full m-2">
        <div className="w-24 aspect-square overflow-hidden">
          <img
            src={
              place.images?.[0]?.imageUrl ||
              "https://img.freepik.com/premium-vector/travel-copenhagen-icon_408115-1792.jpg?w=826"
            }
            alt={place.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {inList(place.placeId) ? (
          <button
            className="mt-2 w-20 h-6 border border-primary-brown bg-background-beige2 shadow-custom1 rounded-2xl"
            onClick={(e) => {
              e.stopPropagation();
              removeFromList(place.placeId);
            }}
          >
            Remove
          </button>
        ) : (
          <button
            className="mt-2 w-20 h-6 border border-primary-brown bg-background-beige2 shadow-custom1 rounded-2xl"
            onClick={(e) => {
              e.stopPropagation();
              addToList(place);
            }}
          >
            Add
          </button>
        )}
      </div>
    </li>
  );
};

export default DefaultedCard;
