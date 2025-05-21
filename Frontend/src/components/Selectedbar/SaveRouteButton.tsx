import React from "react";

interface Props {
  saveRouteHandler: () => void;
  saveStatus: "idle" | "saving" | "saved";
}

const SaveRouteButton: React.FC<Props> = ({ saveRouteHandler, saveStatus }) => (
  <button
    onClick={saveRouteHandler}
    disabled={saveStatus === "saving"}
    className={`border border-primary-brown rounded-xl w-full py-1
        flex items-center justify-center gap-2
        shadow-custom1 hover:bg-background-beige1 hover:shadow-custom2 hover:scale-[1.02]
        active:scale-[0.98] active:shadow-inner
        transition-all duration-300 ease-in-out
        ${saveStatus === "saved" ? "bg-green-200" : "bg-background-beige2"}
        ${saveStatus === "saving" ? "opacity-50 cursor-wait" : ""}
      `}
  >
    {saveStatus === "saving" && (
      <span className="animate-spin h-4 w-4 border-2 border-primary-brown border-t-transparent rounded-full" />
    )}
    <p className="text-primary-brown text-heading-4">
      {saveStatus === "saved" ? "✔ Saved!" : "Save route"}
    </p>
  </button>
);

export default SaveRouteButton;
