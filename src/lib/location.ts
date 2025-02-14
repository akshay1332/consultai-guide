interface Location {
  latitude: number;
  longitude: number;
}

interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  boundingbox: string[];
}

interface Facility {
  name: string;
  address: string;
  distance: string;
  open_now?: boolean;
  rating?: number;
  place_id?: string;
}

export async function reverseGeocode(location: Location): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'ConsultAI Medical Assistant',
        },
      }
    );
    const data: NominatimResult = await response.json();
    return data.display_name;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return 'Location not found';
  }
}

export async function findNearbyFacilities(
  location: Location,
  type: "pharmacy" | "clinic" | "hospital",
  radius: number = 5000
): Promise<Facility[]> {
  const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
  
  if (!GOOGLE_PLACES_API_KEY) {
    return [
      {
        name: `Sample ${type}`,
        address: "123 Medical St",
        distance: "0.5 km",
        open_now: true,
      },
    ];
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=${radius}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    return data.results.map((place: any) => ({
      name: place.name,
      address: place.vicinity,
      distance: `${(place.distance / 1000).toFixed(1)} km`,
      open_now: place.opening_hours?.open_now ?? null,
      rating: place.rating,
      place_id: place.place_id,
    }));
  } catch (error) {
    console.error("Error finding nearby facilities:", error);
    return [
      {
        name: `Sample ${type}`,
        address: "123 Medical St",
        distance: "0.5 km",
        open_now: true,
      },
    ];
  }
}

// Haversine formula to calculate distance between two points
function calculateDistance(
  location1: Location,
  location2: Location
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(location2.latitude - location1.latitude);
  const dLon = toRad(location2.longitude - location1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(location1.latitude)) *
      Math.cos(toRad(location2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Function to generate a static map URL using OpenStreetMap
export function getStaticMapUrl(
  location: Location,
  zoom: number = 15,
  width: number = 600,
  height: number = 400
): string {
  return `https://www.openstreetmap.org/export/embed.html?bbox=${
    location.longitude - 0.01
  },${location.latitude - 0.01},${location.longitude + 0.01},${
    location.latitude + 0.01
  }&layer=mapnik&marker=${location.latitude},${location.longitude}`;
} 