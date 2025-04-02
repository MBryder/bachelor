import { useState, useEffect } from "react";
import { 
    BsBrush as ArtworkIcon
} from "react-icons/bs";
import { 
    MdHotel as HotelIcon,
    MdOutlinePanorama as ViewpointIcon,
    MdOutlinePermDeviceInformation  as InformationIcon,
    MdMuseum as MuseumIcon,
    MdLocalHotel as MotelIcon,
    MdAttractions as AttractionIcon,
    MdOutdoorGrill as PicnicSiteIcon
} from "react-icons/md";
import { 
    FaHotel as HostelIcon,
    FaImage as GalleryIcon,
    FaBed as GuestHouseIcon,

    FaCampground as CampSiteIcon,
    FaCaravan as CaravanSiteIcon,
    FaMagic as ThemeParkIcon,
    FaBuilding as ApartmentIcon
} from "react-icons/fa";

function Sidebar({ visiblePlaces }: { visiblePlaces: any[] }) {
  const [showSidebar, setShowSidebar] = useState(true);

  const getTourismIcon = (tourismType: string) => {
    switch (tourismType) {
      case "artwork":
        return <ArtworkIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1"/>;
      case "hotel":
        return <HotelIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1"/>;
      case "viewpoint":
        return <ViewpointIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1"/>;
      case "information":
        return <InformationIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1"/>;
      case "museum":
        return <MuseumIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1"/>;
      case "motel":
        return <MotelIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1"/>;
      case "attraction":
        return <AttractionIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1"/>;
      case "hostel":
        return <HostelIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1"/>;
      case "gallery":
        return <GalleryIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1"/>;
      case "guest_house":
        return <GuestHouseIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1"/>;
      case "picnic_site":
        return <PicnicSiteIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1"/>;
      case "camp_site":
        return <CampSiteIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1"/>;
      case "caravan_site":
        return <CaravanSiteIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1"/>;
      case "theme_park":
        return <ThemeParkIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1"/>;
      case "apartment":
        return <ApartmentIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1"/>;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex items-center">
      <div
        className={`transition-all duration-500 ease-in-out ${
          showSidebar ? "transform translate-x-0" : "transform -translate-x-full"
        } h-full w-[300px] bg-background-beige1 shadow-lg`}
      >
        <div className="p-2 h-full overflow-y-auto scrollbar">
          <h1 className="text-xl font-bold border-b-2 border-primary-brown">Visible places</h1>
          <ul className="mt-4 px-2">
            {visiblePlaces.map((place: any) => (
              <li key={place.id} className="pb-2 my-2 border-b border-primary-brown flex items-center">
                <div className="mr-2">{getTourismIcon(place.properties.tourism)}</div>
                <div>
                  <h2 className="font-bold">{place.properties.name}</h2>
                  <p>{place.properties.address}</p>
                </div>
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
