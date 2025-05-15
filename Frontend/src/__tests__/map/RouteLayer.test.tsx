import { render, act } from "@testing-library/react";
import RouteLayer from "../../components/map/RouteLayer";
import * as SelectedPlacesContext from "../../context/SelectedPlacesContext";
import * as SelectedRouteContext from "../../context/SelectedRouteContext";
import { Route } from "../../utils/types";

// Mock maplibre components and hook
jest.mock("@vis.gl/react-maplibre", () => ({
  Source: (props: any) => <div data-testid="source">{props.children}</div>,
  Layer: () => <div data-testid="layer" />,
  useMap: () => ({ current: {} }),
}));

jest.useFakeTimers();

const mockPlace = {
  id: "place1",
  placeId: "place1",
  name: "Test Place",
  latitude: 55.0,
  longitude: 12.0,
};

const mockRoute: Route = {
  id: "route1",
  customName: "Test Route",
  createdAt: new Date().toISOString(),
  waypoints: ["wp1", "wp2"],
  transportationMode: "car",
  DateOfCreation: new Date().toISOString(),
};

describe("RouteLayer", () => {
  const callSubmitMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(SelectedPlacesContext, "useSelectedPlaces").mockReturnValue({
      selectedPlacesList: [mockPlace],
      setSelectedPlacesList: jest.fn(),
    });

    jest.spyOn(SelectedRouteContext, "useSelectedRoute").mockReturnValue({
      selectedRoute: mockRoute,
      setSelectedRoute: jest.fn(),
      transportMode: "car",
      setTransportMode: jest.fn(),
    });
  });

  it("does not render Source and Layer if routeCoordinates less than 2", () => {
    const { container } = render(<RouteLayer routeCoordinates={[]} callSubmit={callSubmitMock} />);
    expect(container.firstChild).toBeNull();
  });

  it("calls callSubmit on mount and when selectedPlacesList or transportMode changes", () => {
    const { rerender } = render(<RouteLayer routeCoordinates={[]} callSubmit={callSubmitMock} />);
    expect(callSubmitMock).toHaveBeenCalledWith("car");

    jest.spyOn(SelectedPlacesContext, "useSelectedPlaces").mockReturnValue({
      selectedPlacesList: [mockPlace],
      setSelectedPlacesList: jest.fn(),
    });

    jest.spyOn(SelectedRouteContext, "useSelectedRoute").mockReturnValue({
      selectedRoute: mockRoute,
      setSelectedRoute: jest.fn(),
      transportMode: "bike",
      setTransportMode: jest.fn(),
    });

    rerender(<RouteLayer routeCoordinates={[]} callSubmit={callSubmitMock} />);
    expect(callSubmitMock).toHaveBeenCalledWith("bike");
  });

  it("renders Source and Layer when animatedCoords has more than 1 point", () => {
    const coords = [{ lng: 1, lat: 1 }, { lng: 2, lat: 2 }];
    const { getByTestId } = render(<RouteLayer routeCoordinates={coords} callSubmit={callSubmitMock} />);
    
    act(() => {
      jest.advanceTimersByTime(6000);
    });

    expect(getByTestId("source")).toBeTruthy();
    expect(getByTestId("layer")).toBeTruthy();
  });
});
