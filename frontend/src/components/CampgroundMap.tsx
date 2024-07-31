// components/CampgroundMap.tsx
"use client";
import React, { useEffect, useRef } from "react";
import mapboxgl, { Marker, Popup } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface CampgroundMapProps {
  coordinates: [number, number];
  title: string;
  location: string;
}

const CampgroundMap: React.FC<CampgroundMapProps> = ({
  coordinates,
  title,
  location,
}) => {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: coordinates,
      zoom: 10,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    const popup = new Popup({ closeButton: false, anchor: "left" }).setHTML(
      `<div class="popup">${title} <br/>${location}</div>`
    );

    new Marker().setLngLat(coordinates).setPopup(popup).addTo(map.current);

    map.current.on("load", () => {
      map.current?.resize();
    });

    return () => {
      map.current?.remove();
    };
  }, [coordinates, title, location]);

  return <div className="map-container h-64" ref={mapContainerRef} />;
};

export default CampgroundMap;
