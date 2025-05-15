import { render } from "@testing-library/react";
import MarkersLayer from "../../components/map/MarkersLayer";
import PopupMarker from "../../components/popUpMarker";

// Properly mock PopupMarker as a default export ES module
jest.mock("../../components/popUpMarker", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="popup-marker" />),
}));

describe("MarkersLayer", () => {
  const baseProps = {
    zoom: 15,
    visiblePlaces: [
      { placeId: "v1", longitude: 0, latitude: 0 },
      { placeId: "v2", longitude: 0, latitude: 0 },
    ],
    selectedPlacesList: [{ placeId: "s1", longitude: 0, latitude: 0 }, { placeId: "v2", longitude: 0, latitude: 0 }],
    setShowMoreDetails: jest.fn(),
    openPopupPlaceId: null,
    setOpenPopupPlaceId: jest.fn(),
  };

  it("renders null if zoom < 14", () => {
    const { container } = render(<MarkersLayer {...baseProps} zoom={13} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders PopupMarkers for combined places with correct colors", () => {
    render(<MarkersLayer {...baseProps} />);
    // PopupMarker should be called 3 times: s1, v2, and v1

    expect(PopupMarker).toHaveBeenCalledTimes(3);

    const calls = (PopupMarker as jest.Mock).mock.calls;

    // Extract color prop from each call
    const colors = calls.map(call => call[0].color);

    // Selected places get color "#11b30e"
    expect(colors).toContain("#11b30e");
    // Not selected places get color "red"
    expect(colors).toContain("red");
  });
});
