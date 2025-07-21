export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ViewPort {
  northeast: Coordinates;
  southwest: Coordinates;
}

export interface Address {
  name: string;
  location: Coordinates;
  viewport: ViewPort;
}

