// components/CampgroundMap.tsx
"use client";
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { initializeMap } from "@/util/mapboxUtils";

type MapboxProps = {
  coordinates: [number, number];
  title: string;
  location: string;
};

const CampgroundMap: React.FC<MapboxProps> = ({
  coordinates,
  title,
  location,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
console.log("coordinates", coordinates);
    if (!mapContainerRef.current) return;

    const map = initializeMap(
      mapContainerRef.current,
      coordinates,
      "mapbox://styles/mapbox/outdoors-v10"
    );

    new mapboxgl.Marker()
      .setLngLat(coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h3>${title}</h3><p>${location}</p>`
        )
      )
      .addTo(map);

    return () => map.remove();
  }, [coordinates, title, location]);

  return (
    <div
      ref={mapContainerRef}
      className="container h-80 w-full overflow-hidden rounded-lg"
    />
  );
};

export default CampgroundMap;
