import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Papa from 'papaparse';
import L from 'leaflet';


const busStopIcon = new L.Icon({
  iconUrl: '/icons/image.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

function TransitMap() {
  const [stops, setStops] = useState([]);

  useEffect(() => {
    fetch('/gtfs/stops.txt')
      .then(res => res.text())
      .then(csv => {
        const parsed = Papa.parse(csv, { header: true });
        const cleanData = parsed.data
          .map(stop => ({
            ...stop,
            stop_lat: parseFloat(stop.stop_lat),
            stop_lon: parseFloat(stop.stop_lon)
          }))
          .filter(stop =>
            !isNaN(stop.stop_lat) &&
            !isNaN(stop.stop_lon) &&
            stop.stop_lat > 38.35 && stop.stop_lat < 38.5 &&
            stop.stop_lon > 26.9 && stop.stop_lon < 27.3
          );

        setStops(cleanData.slice(0, 10));
      });
  }, []);

  return (
    <MapContainer center={[38.4192, 27.1287]} zoom={12} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {stops.map((stop) => (
        <Marker
          key={stop.stop_id}
          position={[stop.stop_lat, stop.stop_lon]}
          icon={busStopIcon}
        >
          <Popup>{stop.stop_name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default TransitMap;
