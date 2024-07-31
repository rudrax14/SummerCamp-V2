// utils/mapboxUtils.ts
import mapboxgl from "mapbox-gl";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
export const initializeMap = (
    container: HTMLElement,
    coordinates: [number, number],
    style: string = "mapbox://styles/mapbox/streets-v11",
    zoom: number = 10
) => {
    const map = new mapboxgl.Map({
        container,
        style,
        center: coordinates,
        zoom,
    });

    map.addControl(new mapboxgl.NavigationControl());
    return map;
};
