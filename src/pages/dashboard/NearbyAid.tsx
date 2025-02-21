import { useState, useEffect, useCallback } from "react";
import { MapPin, Phone, Clock, Star, MapPinOff, Search, Loader2, Globe, Info, Building2, Stethoscope } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
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
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  specialties?: string[];
  emergency_service?: boolean;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

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

const MapUpdater: React.FC<{ center: { lat: number; lng: number } }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center.lat && center.lng) {
      map.setView([center.lat, center.lng], 13);
    }
  }, [map, center]);

  return null;
};

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

const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance} km`;
};

const FacilityStatusBadge: React.FC<{ isOpen?: boolean }> = ({ isOpen }) => {
  if (isOpen === undefined) return null;
  
  return (
    <Badge variant={isOpen ? "default" : "destructive"}>
      {isOpen ? "Open Now" : "Closed"}
    </Badge>
  );
};

const FacilityTypeIcon: React.FC<{ type: string }> = ({ type }) => {
  const getIcon = () => {
    switch (type.toLowerCase()) {
      case 'hospital':
        return <Building2 className="h-4 w-4" />;
      case 'clinic':
        return <Stethoscope className="h-4 w-4" />;
      case 'pharmacy':
        return <Info className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return getIcon();
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
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"~"hospital|clinic|doctors|dentist"]
            (around:10000,${position.lat},${position.lng});
          way["amenity"~"hospital|clinic|doctors|dentist"]
            (around:10000,${position.lat},${position.lng});
          
          node["shop"~"pharmacy|chemist|medical_supply"]
            (around:10000,${position.lat},${position.lng});
          way["shop"~"pharmacy|chemist|medical_supply"]
            (around:10000,${position.lat},${position.lng});
          
          node["healthcare"=*]
            (around:10000,${position.lat},${position.lng});
          way["healthcare"=*]
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
              (element.lat && element.lon) || 
              (element.center && element.center.lat && element.center.lon)
            )
          )
          .map((element: any) => {
            const address = {
              street: element.tags['addr:street'] || '',
              housenumber: element.tags['addr:housenumber'] || '',
              city: element.tags['addr:city'] || '',
              state: element.tags['addr:state'] || '',
              postcode: element.tags['addr:postcode'] || '',
              country: element.tags['addr:country'] || 'India'
            };

            let facilityType = 'Medical Facility';
            if (element.tags.amenity === 'hospital') facilityType = 'Hospital';
            else if (element.tags.amenity === 'clinic') facilityType = 'Clinic';
            else if (element.tags.amenity === 'doctors') facilityType = 'Doctor\'s Office';
            else if (element.tags.amenity === 'dentist') facilityType = 'Dental Clinic';
            else if (element.tags.shop === 'pharmacy' || element.tags.amenity === 'pharmacy') facilityType = 'Pharmacy';
            else if (element.tags.shop === 'medical_supply') facilityType = 'Medical Store';
            else if (element.tags.healthcare) facilityType = element.tags.healthcare.charAt(0).toUpperCase() + element.tags.healthcare.slice(1);

            const opening_hours = element.tags.opening_hours ? {
              open_now: true,
              hours: element.tags.opening_hours
            } : undefined;

            const specialties = element.tags.healthcare_speciality ? 
              element.tags.healthcare_speciality.split(';').map((s: string) => s.trim()) : 
              [];

            return {
              id: element.id.toString(),
              name: element.tags.name,
              vicinity: `${address.street} ${address.housenumber}`.trim(),
              address: {
                street: `${address.street} ${address.housenumber}`.trim(),
                city: address.city,
                state: address.state,
                postcode: address.postcode,
                country: address.country
              },
              facilityType,
              phone: element.tags.phone || element.tags['contact:phone'],
              website: element.tags.website || element.tags['contact:website'],
              rating: null,
              opening_hours,
              specialties,
              emergency_service: element.tags.emergency === 'yes',
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
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const currentLocationIcon = L.icon({
      iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSIjZGMzNTQ1IiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiIGZpbGw9IiNkYzM1NDUiLz48L3N2Zz4=',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    L.Marker.prototype.options.icon = defaultIcon;
    
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
                  <div className="p-4 max-w-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{facility.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <FacilityTypeIcon type={facility.facilityType} />
                          <p className="text-sm text-blue-600 font-medium">{facility.facilityType}</p>
                        </div>
                      </div>
                      <FacilityStatusBadge isOpen={facility.opening_hours?.open_now} />
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-1 text-gray-500" />
                        <div className="text-sm text-gray-600">
                          <p>{facility.address?.street}</p>
                          <p>{facility.address?.city}, {facility.address?.state}</p>
                          <p>{facility.address?.postcode}, {facility.address?.country}</p>
                        </div>
                      </div>

                      <p className="text-sm text-green-600 font-medium">
                        {formatDistance(calculateDistance(
                          center.lat,
                          center.lng,
                          facility.geometry.location.lat,
                          facility.geometry.location.lng
                        ))} away
                      </p>

                      {facility.opening_hours?.hours && (
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 mt-1 text-gray-500" />
                          <p className="text-sm text-gray-600">{facility.opening_hours.hours}</p>
                        </div>
                      )}

                      {facility.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <a href={`tel:${facility.phone}`} className="text-sm text-blue-500 hover:underline">
                            {facility.phone}
                          </a>
                        </div>
                      )}

                      {facility.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <a
                            href={facility.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}

                      {facility.specialties && facility.specialties.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium mb-1">Specialties:</p>
                          <div className="flex flex-wrap gap-1">
                            {facility.specialties.map((specialty, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {facility.emergency_service && (
                        <Badge variant="destructive" className="mt-2">
                          24/7 Emergency Services
                        </Badge>
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
