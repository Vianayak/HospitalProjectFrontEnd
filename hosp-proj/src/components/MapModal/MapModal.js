import React, { useEffect, useRef, useState } from "react";
import "./MapModal.css";

const MapModal = ({ location, onClose }) => {
  const mapRef = useRef(null);
  const watchId = useRef(null);
  const directionsRendererRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [estimatedArrivalTime, setEstimatedArrivalTime] = useState(null);

  const destinationLatLng = useRef(null);

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

    destinationLatLng.current = { lat, lng };

    if (navigator.geolocation) {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 15,
        center: destinationLatLng.current,
      });

      mapInstanceRef.current = map;

      directionsServiceRef.current = new window.google.maps.DirectionsService();
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
      });
      directionsRendererRef.current.setMap(map);

      // Patient marker
      new window.google.maps.Marker({
        position: destinationLatLng.current,
        map,
        title: "Patient Location",
      });

      const calculateRoute = (userLat, userLng) => {
        const request = {
          origin: { lat: userLat, lng: userLng },
          destination: destinationLatLng.current,
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

          // Update user (ambulance) marker
          if (userMarkerRef.current) {
            userMarkerRef.current.setPosition(userLatLng);
          } else {
            userMarkerRef.current = new window.google.maps.Marker({
              position: userLatLng,
              map,
              icon: {
                url: "https://maps.gstatic.com/mapfiles/ms2/micons/motorcycling.png",
                scaledSize: new window.google.maps.Size(40, 40),
              },
              title: "You (Ambulance)",
            });
          }

          mapInstanceRef.current.panTo(userLatLng);

          calculateRoute(userLat, userLng);

          // 🛑 Auto-close if user is close to patient
          const distance = getDistanceInMeters(
            userLatLng.lat,
            userLatLng.lng,
            destinationLatLng.current.lat,
            destinationLatLng.current.lng
          );
          if (distance <= 30) { // 30 meters threshold
            alert("You have reached the patient location!");
            onClose();
          }
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
  }, [location, isGoogleMapsLoaded, onClose]);

  // 🧮 Utility to calculate distance between two lat/lng points
  const getDistanceInMeters = (lat1, lng1, lat2, lng2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371000; // Radius of Earth in meters
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="map-modal-overlay">
      <div className="map-modal">
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
        <button className="reached-btn" onClick={() => {
      alert("Reached patient location!");
      onClose();
    }}>
      Reached?
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
