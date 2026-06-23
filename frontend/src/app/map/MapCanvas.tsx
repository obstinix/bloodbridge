'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MUMBAI_CENTER: [number, number] = [19.0144, 72.8479];

function FlyToSelected({ pin }: { pin: any }) {
  const map = useMap();
  useEffect(() => {
    if (pin) map.flyTo([pin.lat, pin.lng], 14, { duration: 1.2 });
  }, [pin, map]);
  return null;
}

export default function MapCanvas({ pins, selectedPin, onPinSelect }: {
  pins: any[];
  selectedPin: any;
  onPinSelect: (pin: any) => void;
}) {
  const getColor = (urgency: string) => {
    if (urgency === 'critical') return '#C41E3A';
    if (urgency === 'urgent') return '#E8821A';
    return '#27AE60';
  };

  return (
    <MapContainer
      center={MUMBAI_CENTER}
      zoom={12}
      style={{ width: '100%', height: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <FlyToSelected pin={selectedPin} />
      {pins.map(pin => (
        <CircleMarker
          key={pin.id}
          center={[pin.lat, pin.lng]}
          radius={pin.urgency === 'critical' ? 14 : 10}
          pathOptions={{
            color: getColor(pin.urgency),
            fillColor: getColor(pin.urgency),
            fillOpacity: selectedPin?.id === pin.id ? 0.9 : 0.6,
            weight: selectedPin?.id === pin.id ? 2 : 1,
          }}
          eventHandlers={{ click: () => onPinSelect(pin) }}
        >
          <Popup>
            <strong style={{ fontFamily: 'sans-serif' }}>{pin.name}</strong><br />
            <span style={{ fontSize: '12px', color: '#888' }}>
              {pin.bloodTypes.join(', ')} · {pin.urgency}
            </span>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
