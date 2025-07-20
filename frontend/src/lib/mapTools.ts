import type { Coordinates, ViewPort } from "./types";

export function getCenterCoordinate(coordinates: Coordinates[]): Coordinates {
  // Default to the Center of London
  if (!coordinates || coordinates.length === 0) {
    return {
      lat: 51.505,
      lng: -0.09
    }
  }

  const center: Coordinates = {
    lat: 0,
    lng: 0
  }
  coordinates.forEach((coordinate) => {
    center.lat += coordinate.lat;
    center.lng += coordinate.lng;
  });

  center.lat /= coordinates.length;
  center.lng /= coordinates.length;

  return center;
}

// The anti meridian line *will* cause problems since the coordinates will change signs when crossing
// BUT since that's like in the middle of the Pacific Ocean and separates Alaska and Russia, 
// Not going to complicate this logic ;)
export function calculateViewPort(viewports: ViewPort[]): ViewPort {
  if (!viewports || viewports.length === 0) {
    return {
      northeast: {
        lat: 51.0,
        lng: -0.08,
      },
      southwest: {
        lat: 51.1,
        lng: -0.1
      }
    }
  }

  const result: ViewPort = {
    northeast: {
      lat: Number.NEGATIVE_INFINITY,
      lng: Number.NEGATIVE_INFINITY,
    },
    southwest: {
      lat: Number.POSITIVE_INFINITY,
      lng: Number.POSITIVE_INFINITY,
    }
  };

  viewports.forEach((viewport) => {
    result.northeast.lat = Math.max(result.northeast.lat, viewport.northeast.lat);
    result.northeast.lng = Math.max(result.northeast.lng, viewport.northeast.lng);

    result.southwest.lat = Math.min(result.southwest.lat, viewport.southwest.lat);
    result.southwest.lng = Math.min(result.southwest.lng, viewport.southwest.lng);
  });

  const boxSize = [
    result.northeast.lat - result.southwest.lat,
    result.northeast.lng - result.southwest.lng
  ]

  const latIncrease = boxSize[0] * 0.1;
  const lngIncrease = boxSize[1] * 0.1;

  result.northeast.lat += latIncrease;
  result.northeast.lng += lngIncrease;

  result.southwest.lat -= latIncrease;
  result.southwest.lng -= lngIncrease;

  return result;
}
