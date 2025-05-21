import React from "react";

interface Props {
  shareRouteHandler: () => void;
  shareableLink: string | null;
}

const ShareRouteButton: React.FC<Props> = ({ shareRouteHandler, shareableLink }) => (
  <div className="flex flex-col gap-2 w-full">
    <button
      className="border border-primary-brown rounded-xl w-full py-1 text-primary-brown bg-background-beige2 shadow-custom1 hover:bg-background-beige1 hover:shadow-custom2 hover:scale-[1.02] transition-all duration-150 ease-in-out"
      onClick={shareRouteHandler}
    >
      🔗 Share this route
    </button>
  </div>
);

export default ShareRouteButton;
