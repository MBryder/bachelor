import { JSX } from "react";

import {
    MdHotel as HotelIcon,
    MdOutlinePanorama as ViewpointIcon,
    MdOutlinePermDeviceInformation as InformationIcon,
    MdMuseum as MuseumIcon,
    MdLocalHotel as MotelIcon,
    MdAttractions as AttractionIcon,
    MdOutdoorGrill as PicnicSiteIcon,
    MdBrush as ArtworkIcon,
  } from "react-icons/md";
  
  import {
    FaHotel as HostelIcon,
    FaImage as GalleryIcon,
    FaBed as GuestHouseIcon,
    FaCampground as CampSiteIcon,
    FaCaravan as CaravanSiteIcon,
    FaMagic as ThemeParkIcon,
    FaBuilding as ApartmentIcon,
  } from "react-icons/fa";
  
  export const tourismIcons: Record<string, JSX.Element> = {
    artwork: <ArtworkIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1" />,
    hotel: <HotelIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1" />,
    viewpoint: <ViewpointIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1" />,
    information: <InformationIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1" />,
    museum: <MuseumIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1" />,
    motel: <MotelIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1" />,
    attraction: <AttractionIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1" />,
    hostel: <HostelIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1" />,
    gallery: <GalleryIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1" />,
    guest_house: <GuestHouseIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1" />,
    picnic_site: <PicnicSiteIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1" />,
    camp_site: <CampSiteIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1" />,
    caravan_site: <CaravanSiteIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1" />,
    theme_park: <ThemeParkIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1" />,
    apartment: <ApartmentIcon className="h-10 text-primary-brown w-10 rounded-full border-2 border-primary-brown p-1" />,
  };
  
  export const getTourismIcon = (tourismType: string) => tourismIcons[tourismType] || null;
  