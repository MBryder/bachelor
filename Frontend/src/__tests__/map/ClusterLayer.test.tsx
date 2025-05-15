import React from "react";
import { render } from "@testing-library/react";
import ClusterLayer from "../../components/map/ClusterLayer";

const mockOn = jest.fn();
const mockOff = jest.fn();
const mockQueryRenderedFeatures = jest.fn(() => [
  {
    properties: { cluster_id: 1 },
  },
]);
const mockGetClusterExpansionZoom = jest.fn(() => Promise.resolve(14));

const mockMapInstance = {
  on: mockOn,
  off: mockOff,
  queryRenderedFeatures: mockQueryRenderedFeatures,
  getSource: () => ({
    getClusterExpansionZoom: mockGetClusterExpansionZoom,
  }),
};

// Mock the entire @vis.gl/react-maplibre module
jest.mock("@vis.gl/react-maplibre", () => {
  return {
    // Dummy Source component renders a div
    Source: ({ children }: any) => <div>{children}</div>,
    // Dummy Layer component renders null
    Layer: () => null,
    // Mock useMap hook returns map instance inside current
    useMap: () => ({ current: mockMapInstance }),
  };
});

describe("ClusterLayer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing if zoom >= 14", () => {
    const places = [
      { placeId: "p1", latitude: 1, longitude: 2 },
      { placeId: "p2", latitude: 3, longitude: 4 },
    ];
    const { container } = render(
      <ClusterLayer zoom={14} filteredVisiblePlaces={places} />
    );
    expect(container.firstChild).toBeNull();
    expect(mockOn).not.toHaveBeenCalled();
  });

  it("renders Source and Layers when zoom < 14", () => {
    const places = [
      { placeId: "p1", latitude: 1, longitude: 2 },
      { placeId: "p2", latitude: 3, longitude: 4 },
    ];
    const { container } = render(
      <ClusterLayer zoom={13} filteredVisiblePlaces={places} />
    );

    // Source is mocked as a div, so container.firstChild should not be null
    expect(container.firstChild).not.toBeNull();
    expect(mockOn).toHaveBeenCalledWith("click", "clusters", expect.any(Function));
  });
});
