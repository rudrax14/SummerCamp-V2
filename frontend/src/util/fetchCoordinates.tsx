const fetchCoordinates = async (query: string): Promise<void> => {
  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
    );
    const data = await response.json();

    if (data.features.length > 0) {
      const { center } = data.features[0];
      return (
        "geometry",
        {
          type: "Point",
          coordinates: [center[0], center[1]],
        }
      );
    } else {
      return "geometry", null;
      console.error("Location not found");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    setFormField("geometry", null);
  }
};
