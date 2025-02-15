import { useState, useEffect, useCallback } from "react";
import { MapPin, Phone, Clock, Star, MapPinOff, Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Facility {
  id: string;
  name: string;
  vicinity: string;
  facilityType: string;
  phone?: string;
  website?: string;
  rating?: number;
  opening_hours?: {
    open_now?: boolean;
    hours?: string;
  };
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

// Default center (will be updated with user's location)
const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Center of India

interface LocationDialogProps {
  showLocationDialog: boolean;
  setShowLocationDialog: (show: boolean) => void;
  loading: boolean;
  pincode: string;
  setPincode: (pincode: string) => void;
  getCurrentLocation: () => void;
  handlePincodeSearch: () => void;
}

// Location Dialog Component
const LocationDialog: React.FC<LocationDialogProps> = ({
  showLocationDialog,
  setShowLocationDialog,
  loading,
  pincode,
  setPincode,
  getCurrentLocation,
  handlePincodeSearch,
}) => {
  return (
    <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Location Access</DialogTitle>
          <DialogDescription>
            We need your location to find medical facilities near you.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Button
            onClick={getCurrentLocation}
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="mr-2 h-4 w-4" />
            )}
            Use My Current Location
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Enter Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
            <Button onClick={handlePincodeSearch} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Map Update Component
const MapUpdater: React.FC<{ center: { lat: number; lng: number } }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center.lat && center.lng) {
      map.setView([center.lat, center.lng], 13);
    }
  }, [map, center]);

  return null;
};

// Function to calculate distance between two points
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return Math.round(distance * 10) / 10;
};

// Format distance for display
const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance} km`;
};

const NearbyAid = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [center, setCenter] = useState(defaultCenter);
  const [error, setError] = useState<string | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(true);
  const [pincode, setPincode] = useState("");
  const [searchMode, setSearchMode] = useState<"auto" | "manual">("auto");

  // Function to convert pincode to coordinates using Nominatim
  const getLocationFromPincode = useCallback(async (pincode: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${pincode},India&limit=1`
      );
      const data = await response.json();
      
      if (data && data[0]) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      throw new Error("Invalid pincode");
    } catch (error) {
      throw new Error("Failed to get location from pincode");
    }
  }, []);

  const searchNearbyFacilities = useCallback(async (position: { lat: number; lng: number }) => {
    setLoading(true);
    setError(null);

    try {
      // Enhanced Overpass API query to find more medical facilities
      const query = `
        [out:json][timeout:25];
        (
          // Hospitals and clinics
          node["amenity"~"hospital|clinic|doctors|dentist"]
            (around:10000,${position.lat},${position.lng});
          way["amenity"~"hospital|clinic|doctors|dentist"]
            (around:10000,${position.lat},${position.lng});
          relation["amenity"~"hospital|clinic|doctors|dentist"]
            (around:10000,${position.lat},${position.lng});
          
          // Pharmacies and medical stores
          node["shop"~"pharmacy|chemist|medical_supply"]
            (around:10000,${position.lat},${position.lng});
          way["shop"~"pharmacy|chemist|medical_supply"]
            (around:10000,${position.lat},${position.lng});
          
          // Healthcare facilities
          node["healthcare"~"hospital|clinic|doctor|pharmacy|dentist|physiotherapist|alternative|centre"]
            (around:10000,${position.lat},${position.lng});
          way["healthcare"~"hospital|clinic|doctor|pharmacy|dentist|physiotherapist|alternative|centre"]
            (around:10000,${position.lat},${position.lng});
        );
        out body;
        >;
        out skel qt;
      `;

      const response = await fetch(
        `https://overpass-api.de/api/interpreter`,
        {
          method: 'POST',
          body: query
        }
      );

      const data = await response.json();
      
      if (data && data.elements) {
        const facilitiesData = data.elements
          .filter((element: any) => 
            element.tags && 
            element.tags.name && 
            (
              (element.lat && element.lon) || // For nodes
              (element.center && element.center.lat && element.center.lon) // For ways and relations
            )
          )
          .map((element: any) => {
            // Construct detailed address
            const address = [
              element.tags['addr:street'],
              element.tags['addr:housenumber'],
              element.tags['addr:city'],
              element.tags['addr:district'],
              element.tags['addr:postcode'],
              element.tags['addr:state']
            ]
              .filter(Boolean)
              .join(', ');

            // Determine facility type
            let facilityType = 'Medical Facility';
            if (element.tags.amenity === 'hospital') facilityType = 'Hospital';
            else if (element.tags.amenity === 'clinic') facilityType = 'Clinic';
            else if (element.tags.amenity === 'doctors') facilityType = 'Doctor\'s Office';
            else if (element.tags.amenity === 'dentist') facilityType = 'Dental Clinic';
            else if (element.tags.shop === 'pharmacy' || element.tags.amenity === 'pharmacy') facilityType = 'Pharmacy';
            else if (element.tags.shop === 'medical_supply') facilityType = 'Medical Store';
            else if (element.tags.healthcare) facilityType = element.tags.healthcare.charAt(0).toUpperCase() + element.tags.healthcare.slice(1);

            return {
              id: element.id.toString(),
              name: element.tags.name,
              vicinity: address || element.tags.address || 'Address not available',
              facilityType,
              phone: element.tags.phone || element.tags['contact:phone'],
              website: element.tags.website || element.tags['contact:website'],
              rating: null,
              opening_hours: {
                open_now: element.tags.opening_hours ? true : undefined,
                hours: element.tags.opening_hours
              },
              geometry: {
                location: {
                  lat: element.lat || element.center?.lat,
                  lng: element.lon || element.center?.lon
                }
              }
            };
          });

        setFacilities(facilitiesData);
      }
    } catch (error) {
      setError('Failed to fetch nearby facilities. Please try again.');
    }
    
    setLoading(false);
  }, []);

  const handlePincodeSearch = useCallback(async () => {
    if (!pincode) {
      setError("Please enter a valid pincode");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const position = await getLocationFromPincode(pincode);
      setCenter(position);
      await searchNearbyFacilities(position);
      setShowLocationDialog(false);
    } catch (error) {
      setError("Invalid pincode. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pincode, getLocationFromPincode, searchNearbyFacilities]);

  const getCurrentLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    setLocationDenied(false);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      setCenter(userLocation);
      searchNearbyFacilities(userLocation);
      setShowLocationDialog(false);
    };

    const handleError = (error: GeolocationPositionError) => {
      console.error('Geolocation error:', error);
      setLocationDenied(true);
      setError('Location access was denied. Please enter your pincode instead.');
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, [searchNearbyFacilities]);

  useEffect(() => {
    // Set custom icon for facility markers
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Set custom icon for current location
    const currentLocationIcon = L.icon({
      iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSIjZGMzNTQ1IiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiIGZpbGw9IiNkYzM1NDUiLz48L3N2Zz4=',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    L.Marker.prototype.options.icon = defaultIcon;
    
    // Store the current location icon for use
    (window as any).currentLocationIcon = currentLocationIcon;
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] w-full relative">
      <LocationDialog 
        showLocationDialog={showLocationDialog}
        setShowLocationDialog={setShowLocationDialog}
        loading={loading}
        pincode={pincode}
        setPincode={setPincode}
        getCurrentLocation={getCurrentLocation}
        handlePincodeSearch={handlePincodeSearch}
      />
      
      <div className="h-full w-full">
        <MapContainer
          center={[defaultCenter.lat, defaultCenter.lng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <MapUpdater center={center} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Current Location Marker */}
          {!showLocationDialog && (
            <>
              <Marker
                position={[center.lat, center.lng]}
                icon={(window as any).currentLocationIcon}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">Your Location</h3>
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={[center.lat, center.lng]}
                radius={100}
                pathOptions={{ color: '#dc3545', fillColor: '#dc3545', fillOpacity: 0.1 }}
              />
            </>
          )}
          
          {facilities
            .filter(facility => 
              facility.geometry?.location?.lat && 
              facility.geometry?.location?.lng
            )
            .map((facility) => (
              <Marker
                key={facility.id}
                position={[facility.geometry.location.lat, facility.geometry.location.lng]}
                eventHandlers={{
                  click: () => setSelectedFacility(facility),
                }}
              >
                <Popup>
                  <div className="p-3">
                    <h3 className="font-semibold text-lg">{facility.name}</h3>
                    <p className="text-sm text-blue-600 font-medium mt-1">{facility.facilityType}</p>
                    <p className="text-sm text-gray-600 mt-2">{facility.vicinity}</p>
                    
                    {/* Distance from current location */}
                    <p className="text-sm text-green-600 font-medium mt-2">
                      {formatDistance(calculateDistance(
                        center.lat,
                        center.lng,
                        facility.geometry.location.lat,
                        facility.geometry.location.lng
                      ))} away
                    </p>
                    
                    <div className="mt-2 space-y-1">
                      {facility.phone && (
                        <p className="text-sm flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          <a href={`tel:${facility.phone}`} className="text-blue-500 hover:underline">
                            {facility.phone}
                          </a>
                        </p>
                      )}
                      
                      {facility.website && (
                        <p className="text-sm">
                          <a href={facility.website} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-500 hover:underline">
                            Visit Website
                          </a>
                        </p>
                      )}

                      {facility.opening_hours?.hours && (
                        <p className="text-sm flex items-center">
                          <Clock className="inline-block mr-1 h-4 w-4" />
                          {facility.opening_hours.hours}
                        </p>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>

      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NearbyAid; 