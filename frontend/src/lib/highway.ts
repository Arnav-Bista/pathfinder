import { calculateDistance } from "./mapTools";
import type { GraphNode } from "./types/graphs";
import type { ViewPort } from "./types/maps";
import type { Overpass } from "./types/overpass";

// Betraying Type Safety with this one
function processOverpassResults(data: Overpass) {
  const nodes = new Map<number, GraphNode>;
  const elements = data.elements;
  elements.filter(elements => elements.type === 'node')
    .forEach(node => nodes.set(
      node.id,
      {
        id: node.id,
        lat: node.lat,
        lng: node.lon,
        edges: []
      }
    ));

  elements.filter(elements => elements.type === "way")
    .forEach((way) => {
      for (let i = 0; i < way.nodes.length - 1; i++) {
        const from = nodes.get(way.nodes[i]);
        const to = nodes.get(way.nodes[i + 1]);

        if (!from || !to) {
          continue;
        }

        from.edges.push({
          to: to.id,
          weight: calculateDistance(from.lat, from.lng, to.lat, to.lng),
        });
      }
    });

  return nodes;
}

export async function getWays(bounds: ViewPort): Promise<Overpass> {
  const query = `
    [out:json][timeout:60];
    (
      way["highway"]
        (${bounds.southwest.lat},${bounds.southwest.lng},${bounds.northeast.lat},${bounds.northeast.lng});
    );
    (._;>;);
    out geom;
  `;

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: `data=${encodeURIComponent(query)}`
  });
  const result = await response.json();
  return result as Overpass;
}
