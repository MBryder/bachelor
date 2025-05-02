import { useMap } from "@vis.gl/react-maplibre";
import { useEffect, useRef, useState } from "react";

interface CustomPopupProps {
  longitude: number;
  latitude: number;
  children: React.ReactNode;
  onClose: () => void;
}

const CustomPopup = ({ longitude, latitude, children, onClose }: CustomPopupProps) => {
  const { current: map } = useMap();
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Update position on map move/zoom
  useEffect(() => {
    if (!map) return;

    const updatePosition = () => {
      const { x, y } = map.project([longitude, latitude]);
      setPosition({ x, y });
    };

    updatePosition();
    map.on("move", updatePosition);
    map.on("zoom", updatePosition);

    return () => {
      map.off("move", updatePosition);
      map.off("zoom", updatePosition);
    };
  }, [map, longitude, latitude]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!position) return null;

  return (
    <div
      className="absolute z-50 transform -translate-x-1/2 -translate-y-full"
      style={{
      left: position.x,
      top: position.y,
      }}
    >
      <div
      ref={popupRef}
      className="relative bg-background-beige1 border border-primary-brown rounded-lg shadow-lg p-4 max-w-xs"
      >
      <button
        className="absolute top-1 right-1 p-1 text-sm text-primary-brown"
        onClick={onClose}
      >
        ✕
      </button>
      {children}
      </div>
    </div>
  );
};

export default CustomPopup;
