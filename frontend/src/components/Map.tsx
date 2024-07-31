// components/HomepageMap.tsx
"use client";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import { initializeMap } from "@/util/mapboxUtils";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

const HomepageMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = initializeMap(
      mapContainerRef.current,
      [78.9629, 20.5937],
      "mapbox://styles/mapbox/light-v10",
      3
    );

    map.on("load", () => {
      map.resize();
    });

    fetch("http://localhost:5000/api/v1/campgrounds")
      .then((response) => response.json())
      .then(({ data }) => {
        const features = data.map((campground: any) => ({
          type: "Feature",
          geometry: campground.geometry,
          properties: {
            name: campground.name,
            description: campground.description,
            price: campground.price,
          },
        }));

        map.on("load", () => {
          map.addSource("campgrounds", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features,
            },
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50,
          });

          map.addLayer({
            id: "clusters",
            type: "circle",
            source: "campgrounds",
            filter: ["has", "point_count"],
            paint: {
              "circle-color": [
                "step",
                ["get", "point_count"],
                "#00BCD4",
                10,
                "#2196F3",
                30,
                "#3F51B5",
              ],
              "circle-radius": [
                "step",
                ["get", "point_count"],
                15,
                10,
                20,
                30,
                25,
              ],
            },
          });

          map.addLayer({
            id: "cluster-count",
            type: "symbol",
            source: "campgrounds",
            filter: ["has", "point_count"],
            layout: {
              "text-field": "{point_count_abbreviated}",
              "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 12,
            },
          });

          map.addLayer({
            id: "unclustered-point",
            type: "circle",
            source: "campgrounds",
            filter: ["!", ["has", "point_count"]],
            paint: {
              "circle-color": "#11b4da",
              "circle-radius": 4,
              "circle-stroke-width": 1,
              "circle-stroke-color": "#fff",
            },
          });

          map.on("click", "unclustered-point", (e) => {
            const { properties, geometry } = e.features[0];
            new mapboxgl.Popup()
              .setLngLat(geometry.coordinates)
              .setHTML(
                `<strong>${properties?.name}</strong><br><p>${properties?.description}</p><p>Price: ${properties?.price}</p>`
              )
              .addTo(map);
          });

          map.on("click", "clusters", (e) => {
            const features = map.queryRenderedFeatures(e.point, {
              layers: ["clusters"],
            });
            const clusterId = features[0].properties.cluster_id;
            map
              .getSource("campgrounds")
              .getClusterExpansionZoom(clusterId, (err, zoom) => {
                if (err) return;
                map.easeTo({
                  center: features[0].geometry.coordinates,
                  zoom,
                });
              });
          });

          map.on("mouseenter", "clusters", () => {
            map.getCanvas().style.cursor = "pointer";
          });

          map.on("mouseleave", "clusters", () => {
            map.getCanvas().style.cursor = "";
          });
        });
      });

    return () => map.remove();
  }, []);

  return <div ref={mapContainerRef} className="w-[1100px] h-[500px]" />;
};

export default HomepageMap;
