import React from 'react';
import { DottedMap } from './ui/dotted-map';

// Nameserver regions (lat/lng) — New York, Frankfurt, Hyderabad.
const MARKERS = [
  { lat: 40.71, lng: -74.0, size: 0.7, pulse: true },
  { lat: 50.11, lng: 8.68, size: 0.7, pulse: true },
  { lat: 17.38, lng: 78.48, size: 0.7, pulse: true },
];

export default function WorldMap() {
  return (
    <div className="relative mx-auto w-full max-w-7xl py-4">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[90px]" />
      <DottedMap
        width={150}
        height={72}
        mapSamples={5200}
        markers={MARKERS}
        dotColor="currentColor"
        markerColor="#eac53a"
        dotRadius={0.28}
        className="text-white/[0.13]"
      />
    </div>
  );
}
