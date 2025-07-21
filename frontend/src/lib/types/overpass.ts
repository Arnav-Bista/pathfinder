export interface OverpassNode {
  type: "node";
  id: number;
  lat: number;
  lon: number;
}


export interface OverpassWay {
  type: "way";
  id: number;
  bounds: {
    minlat: number;
    minlon: number;
    maxlat: number;
    maxlon: number;
  },
  nodes: number[],
  geometry: { lat: number; lon: number }[];
  tags: {
    highway: string;
    incline: string;
    name: string,
    oneway?: string;
  }
}

export interface Overpass {
  elements: (OverpassNode | OverpassWay)[]
}

// {
//   "type": "way",
//   "id": 75768325,
//   "bounds": {
//     "minlat": 51.5153629,
//     "minlon": -0.1029706,
//     "maxlat": 51.5154711,
//     "maxlon": -0.1021728
//   },
//   "nodes": [
//     894485188,
//     894485197,
//     894485200,
//     3242293261,
//     894485202
//   ],
//   "geometry": [
//     {
//       "lat": 51.5153629,
//       "lon": -0.1029706
//     },
//     {
//       "lat": 51.5153971,
//       "lon": -0.1027572
//     },
//     {
//       "lat": 51.5154638,
//       "lon": -0.1023113
//     },
//     {
//       "lat": 51.5154711,
//       "lon": -0.1022253
//     },
//     {
//       "lat": 51.5154666,
//       "lon": -0.1021728
//     }
//   ],
//   "tags": {
//     "highway": "service",
//     "incline": "yes",
//     "name": "St George's Court",
//     "not:name": "St Georges's Court",
//     "sidewalk": "left",
//     "surface": "asphalt"
//   }
// }
