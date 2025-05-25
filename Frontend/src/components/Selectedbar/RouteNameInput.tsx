import React from "react";

interface Props {
  customName: string;
  setCustomName: (v: string) => void;
  transportMode: string;
  setTransportMode: (v: string) => void;
  dropdownOpen: boolean;
  setDropdownOpen: (v: boolean) => void;
  inputError: boolean;
}

const modes = [
  { mode: "driving", label: "🚗 Driving" },
  { mode: "walking", label: "🚶 Walking" },
  { mode: "cycling", label: "🚴 Cycling" },
  { mode: "e-cycling", label: "⚡🚴 E-Cycling" },
  { mode: "wheelchair", label: "♿ Wheelchair" },
];

const RouteNameInput: React.FC<Props> = ({
  customName,
  setCustomName,
  transportMode,
  setTransportMode,
  dropdownOpen,
  setDropdownOpen,
  inputError,
}) => (
  <div className="flex flex-row gap-2 w-full items-center">
    <input
      type="text"
      placeholder="Route name"
      value={customName}
      onChange={(e) => setCustomName(e.target.value)}
      className={`rounded-xl px-2 py-1 text-primary-brown transition duration-300 ease-in-out w-1/2
      ${inputError ? "border-red-500 ring-2 ring-red-300 animate-shake" : "border border-primary-brown"}`}
    />
    <div className="relative w-1/2">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="border border-primary-brown bg-background-beige2 shadow-custom1 rounded-xl px-4 py-1 text-primary-brown text-heading-4 hover:bg-background-beige1 hover:shadow-custom2 hover:scale-[1.02] active:scale-[0.98] active:shadow-inner transition-all duration-150 ease-in-out w-full"
      >
        {modes.find((m) => m.mode === transportMode)?.label || transportMode}
      </button>
      {dropdownOpen && (
        <ul className="absolute mt-1 w-full rounded-xl border border-primary-brown bg-white shadow-lg z-50">
          {modes.map(({ mode, label }) => (
            <li
              key={mode}
              onClick={() => {
                setTransportMode(mode);
                setDropdownOpen(false);
              }}
              className="px-4 py-2 hover:bg-background-beige1 cursor-pointer text-primary-brown"
            >
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

export default RouteNameInput;
