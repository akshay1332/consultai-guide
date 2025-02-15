import { useState, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow, Libraries } from "@react-google-maps/api";
import { Loader2, MapPin, Phone, Clock, Star, MapPinOff, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Import Google Maps types
declare global {
  interface Window {
    google: typeof google;
  }
}

interface Facility {
  id: string;
  name: string;
  vicinity: string;
  rating?: number;
  opening_hours?: {
    open_now?: boolean;
  };
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const libraries: Libraries = ["places"];

// Default center (will be updated with user's location)
const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Center of India

const NearbyAid = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [center, setCenter] = useState(defaultCenter);
  const [error, setError] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(true);
  const [pincode, setPincode] = useState("");
  const [searchMode, setSearchMode] = useState<"auto" | "manual">("auto");
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Function to convert pincode to coordinates
  const getLocationFromPincode = useCallback(async (pincode: string) => {
    if (!isMapLoaded) return;
    
    try {
      const geocoder = new google.maps.Geocoder();
      const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode(
          { address: pincode + ", India" },
          (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results) {
              resolve(results);
            } else {
              reject(new Error("Geocoding failed"));
            }
          }
        );
      });

      if (result[0]) {
        const location = result[0].geometry.location;
        return new google.maps.LatLng(location.lat(), location.lng());
      }
      throw new Error("Invalid pincode");
    } catch (error) {
      throw new Error("Failed to get location from pincode");
    }
  }, [isMapLoaded]);

  const searchNearbyFacilities = useCallback((position: google.maps.LatLng) => {
    if (!map || !isMapLoaded) return;

    setLoading(true);
    setError(null);

    const service = new google.maps.places.PlacesService(map);
    const request: google.maps.places.PlaceSearchRequest = {
      location: position,
      radius: 10000, // 10km radius
      type: "hospital",
      keyword: 'medical hospital clinic pharmacy doctor healthcare'
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        console.log('Found facilities:', results.length);
        
        const validResults = results.filter(place => 
          place.place_id && 
          place.name && 
          place.geometry?.location &&
          place.vicinity
        );

        setFacilities(validResults.map(place => ({
          id: place.place_id!,
          name: place.name!,
          vicinity: place.vicinity!,
          rating: place.rating,
          opening_hours: {
            open_now: place.opening_hours?.open_now
          },
          geometry: {
            location: {
              lat: place.geometry!.location!.lat(),
              lng: place.geometry!.location!.lng()
            }
          }
        })));
      } else {
        console.error('Places search failed:', status);
        let errorMessage = 'Failed to find nearby facilities. ';
        
        switch (status) {
          case google.maps.places.PlacesServiceStatus.ZERO_RESULTS:
            errorMessage = 'No medical facilities found in this area. Try a different location.';
            break;
          case google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT:
            errorMessage = 'Too many searches. Please try again in a moment.';
            break;
          case google.maps.places.PlacesServiceStatus.REQUEST_DENIED:
            errorMessage = 'Places API request was denied. Please check your API key.';
            break;
          default:
            errorMessage = 'An error occurred while searching for facilities. Please try again.';
        }
        
        setError(errorMessage);
      }
      setLoading(false);
    });
  }, [map, isMapLoaded]);

  const handlePincodeSearch = useCallback(async () => {
    if (!pincode || !isMapLoaded) {
      setError("Please enter a valid pincode");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const position = await getLocationFromPincode(pincode);
      setCenter({ lat: position.lat(), lng: position.lng() });
      map?.panTo(position);
      searchNearbyFacilities(position);
      setShowLocationDialog(false);
    } catch (error) {
      setError("Invalid pincode. Please try again.");
      setLoading(false);
    }
  }, [pincode, map, getLocationFromPincode, searchNearbyFacilities, isMapLoaded]);

  const getCurrentLocation = useCallback(() => {
    if (!isMapLoaded) return;

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
      if (map) {
        const latLng = new google.maps.LatLng(userLocation.lat, userLocation.lng);
        searchNearbyFacilities(latLng);
        map.panTo(userLocation);
      }
      setShowLocationDialog(false);
    };

    const handleError = (error: GeolocationPositionError) => {
      console.error('Geolocation error:', error);
      setLocationDenied(true);
      setLoading(false);
      setSearchMode("manual");
      
      let errorMessage = 'Unable to get your location. ';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += 'Please enter your pincode manually.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage += 'Please enter your pincode manually.';
          break;
        case error.TIMEOUT:
          errorMessage += 'Please try again or enter your pincode manually.';
          break;
        default:
          errorMessage += 'Please enter your pincode manually.';
      }
      setError(errorMessage);
    };

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, [map, searchNearbyFacilities, isMapLoaded]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    setIsMapLoaded(true);
  }, []);

  // Location Dialog Component
  const LocationDialog = () => (
    <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Find Medical Facilities Near You</DialogTitle>
          <DialogDescription>
            Allow location access or enter your pincode to find nearby medical facilities.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {searchMode === "auto" ? (
            <div className="flex flex-col gap-3">
              <Button 
                onClick={getCurrentLocation}
                className="w-full"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Share My Location
              </Button>
              <p className="text-sm text-center text-gray-500">or</p>
              <Button
                variant="outline"
                onClick={() => setSearchMode("manual")}
              >
                Enter Pincode Manually
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handlePincodeSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => setSearchMode("auto")}
              >
                Use My Location Instead
              </Button>
            </div>
          )}
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-600">Loading nearby medical facilities...</p>
        </div>
      </div>
    );
  }

  if (locationDenied) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <LocationDialog />
      </div>
    );
  }

  return (
    <>
      <LocationDialog />
      <div className="h-full w-full grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Facilities List */}
        <div className="md:col-span-1 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Nearby Facilities</h2>
            <p className="text-sm text-gray-500">Find medical help near you</p>
            <div className="flex flex-col gap-2 mt-2">
              {searchMode === "manual" ? (
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handlePincodeSearch}
                    variant="outline"
                    size="sm"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={getCurrentLocation}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Update Location
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchMode(searchMode === "auto" ? "manual" : "auto")}
              >
                {searchMode === "auto" ? "Enter Pincode Instead" : "Use My Location"}
              </Button>
              {facilities.length > 0 && (
                <p className="text-sm text-gray-600 text-center">
                  Found {facilities.length} medical facilities nearby
                </p>
              )}
            </div>
          </div>
          
          <div className="overflow-y-auto h-[calc(100vh-12rem)]">
            <AnimatePresence>
              {facilities.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No medical facilities found nearby. Try updating your location or increasing the search radius.
                </div>
              ) : (
                facilities.map((facility) => (
                  <motion.div
                    key={facility.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={cn(
                      "p-4 border-b border-gray-100 cursor-pointer",
                      "hover:bg-gray-50 transition-colors duration-200",
                      selectedFacility?.id === facility.id && "bg-gray-50"
                    )}
                    onClick={() => {
                      setSelectedFacility(facility);
                      map?.panTo(facility.geometry.location);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {facility.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {facility.vicinity}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-2">
                          {facility.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-sm text-gray-600">
                                {facility.rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                          
                          {facility.opening_hours && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {facility.opening_hours.open_now ? "Open" : "Closed"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Map */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-md overflow-hidden relative h-[calc(100vh-6rem)]">
          <LoadScript 
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            libraries={libraries}
            onError={(error) => {
              console.error('Google Maps loading error:', error);
              setError(
                'Failed to load Google Maps. Please make sure you have a valid API key with billing enabled.'
              );
            }}
            loadingElement={
              <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-gray-600">Loading Google Maps...</p>
                </div>
              </div>
            }
          >
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={13}
              onLoad={onMapLoad}
              onUnmount={() => {
                setMap(null);
                setIsMapLoaded(false);
              }}
              options={{
                styles: [
                  {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }],
                  },
                ],
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
                gestureHandling: "greedy"
              }}
            >
              {isMapLoaded && (
                <>
                  {/* User's location marker */}
                  <Marker
                    position={center}
                    icon={{
                      url: "data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='8' fill='%234F46E5' fill-opacity='0.2'/%3E%3Ccircle cx='12' cy='12' r='4' fill='%234F46E5'/%3E%3C/svg%3E",
                      scaledSize: new google.maps.Size(24, 24),
                    }}
                  />

                  {/* Facility markers */}
                  {facilities.map((facility) => (
                    <Marker
                      key={facility.id}
                      position={facility.geometry.location}
                      onClick={() => setSelectedFacility(facility)}
                      icon={{
                        url: "data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z' fill='%23059669'/%3E%3Cpath d='M12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' fill='white'/%3E%3C/svg%3E",
                        scaledSize: new google.maps.Size(32, 32),
                        anchor: new google.maps.Point(16, 32),
                      }}
                    />
                  ))}

                  {/* Info Window */}
                  {selectedFacility && (
                    <InfoWindow
                      position={selectedFacility.geometry.location}
                      onCloseClick={() => setSelectedFacility(null)}
                    >
                      <div className="p-2 max-w-xs">
                        <h3 className="font-medium text-gray-900">
                          {selectedFacility.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {selectedFacility.vicinity}
                        </p>
                        
                        {selectedFacility.rating && (
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm text-gray-600">
                              {selectedFacility.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </InfoWindow>
                  )}
                </>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </>
  );
};

export default NearbyAid; 