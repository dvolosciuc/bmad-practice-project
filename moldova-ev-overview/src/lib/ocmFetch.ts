// Overpass API (OpenStreetMap) — free, no key required
// Queries all charging_station nodes within Moldova's bounding box
// Bounding box: south=45.5, west=26.5, north=48.5, east=30.5
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'
const OVERPASS_QUERY = `
[out:json][timeout:25];
(
  node["amenity"="charging_station"](45.5,26.5,48.5,30.5);
  way["amenity"="charging_station"](45.5,26.5,48.5,30.5);
);
out center;
`.trim()

export interface OCMStation {
  lat: number
  lng: number
}

interface OverpassElement {
  type: 'node' | 'way'
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
}

interface OverpassResponse {
  elements: OverpassElement[]
}

export async function fetchOCMStations(): Promise<OCMStation[]> {
  try {
    const res = await fetch(OVERPASS_URL, {
      method: 'POST',
      body: `data=${encodeURIComponent(OVERPASS_QUERY)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    if (!res.ok) return []
    const data: OverpassResponse = await res.json()
    return data.elements
      .map((el) => {
        const lat = el.lat ?? el.center?.lat
        const lng = el.lon ?? el.center?.lon
        return lat != null && lng != null ? { lat, lng } : null
      })
      .filter((s): s is OCMStation => s !== null)
  } catch {
    return []
  }
}
