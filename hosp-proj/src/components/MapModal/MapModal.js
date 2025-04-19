import React, { useEffect, useRef, useState } from "react";
import "./MapModal.css";

const MapModal = ({ location, onClose }) => {
  const mapRef = useRef(null);
  const watchId = useRef(null);
  const directionsRendererRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const mapInstanceRef = useRef(null); // to use map instance outside
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [estimatedArrivalTime, setEstimatedArrivalTime] = useState(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyDtmK_pvbHYtRBM107iv3CSYKTVhJrhG5M&libraries=places";
      script.async = true;
      script.onload = () => setIsGoogleMapsLoaded(true);
      script.onerror = () => console.error("Failed to load Google Maps script.");
      document.head.appendChild(script);
    };

    loadGoogleMaps();

    return () => {
      const scripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
      scripts.forEach((script) => script.remove());
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !location || !isGoogleMapsLoaded) return;

    const [lat, lng] = location
      .replace("Latitude: ", "")
      .replace("Longitude: ", "")
      .split(", ")
      .map(Number);

    if (navigator.geolocation) {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 15,
        center: { lat, lng },
      });

      mapInstanceRef.current = map;

      directionsServiceRef.current = new window.google.maps.DirectionsService();
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true, // Hide default A/B markers
      });
      directionsRendererRef.current.setMap(map);

      const destination = { lat, lng };

      // Custom marker for destination (patient)
      new window.google.maps.Marker({
        position: destination,
        map,
        title: "Patient Location",
      });

      const calculateRoute = (userLat, userLng) => {
        const request = {
          origin: { lat: userLat, lng: userLng },
          destination: destination,
          travelMode: "DRIVING",
        };

        directionsServiceRef.current.route(request, (result, status) => {
          if (status === "OK") {
            directionsRendererRef.current.setDirections(result);

            const duration = result.routes[0].legs[0].duration.text;
            setEstimatedArrivalTime(duration);
          }
        });
      };

      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const userLatLng = { lat: userLat, lng: userLng };

          // Add or update bike icon marker
          if (userMarkerRef.current) {
            userMarkerRef.current.setPosition(userLatLng);
          } else {
            userMarkerRef.current = new window.google.maps.Marker({
              position: userLatLng,
              map,
              icon: {
                url: "https://maps.gstatic.com/mapfiles/ms2/micons/motorcycling.png", // Bike icon
                scaledSize: new window.google.maps.Size(40, 40),
              },
              title: "You (Ambulance)",
            });
          }

          // Pan map to current position
          mapInstanceRef.current.panTo(userLatLng);

          // Recalculate route
          calculateRoute(userLat, userLng);
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true }
      );
    }

    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    };
  }, [location, isGoogleMapsLoaded]);

  return (
    <div className="map-modal-overlay">
      <div className="map-modal">
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
        <div ref={mapRef} className="map-container" />
        {estimatedArrivalTime && (
          <div className="estimated-arrival-time">
            Estimated Arrival Time: {estimatedArrivalTime}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapModal;
