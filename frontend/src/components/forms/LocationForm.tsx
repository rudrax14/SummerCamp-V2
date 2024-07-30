"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CampgroundForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    location: "",
    description: "",
    thumbnail: null,
    geometry: null,
    uploading: false,
  });

  const setFormField = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

  const fetchCoordinates = async (query: string): Promise<void> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
      );
      const data = await response.json();

      if (data.features.length > 0) {
        const { center } = data.features[0];
        setFormField("geometry", {
          type: "Point",
          coordinates: [center[0], center[1]], // [longitude, latitude]
        });
      } else {
        setFormField("geometry", null);
        console.error("Location not found");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      setFormField("geometry", null);
    }
  };

  useEffect(() => {
    if (formData.location) {
      fetchCoordinates(formData.location);
    }
  }, [formData.location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormField("uploading", true);
    console.log(formData);
    try {
      await axios.post("http://localhost:5000/api/v1/campgrounds", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include Bearer token in headers
        },
      });

      toast.success("Campground data submitted successfully.");
    } catch (error) {
      console.error("Error submitting campground data:", error);
      toast.error("Failed to submit campground data");
    } finally {
      setFormField("uploading", false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Name:
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormField("name", e.target.value)}
            className="block w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </label>
        <label className="block">
          Price:
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormField("price", e.target.value)}
            className="block w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </label>
        <label className="block">
          Location:
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormField("location", e.target.value)}
            className="block w-full mt-1 p-2 border border-gray-300 rounded"
          />
        </label>
        <label className="block">
          Thumbnail:
          <input
            type="file"
            onChange={(e) => setFormField("thumbnail", e.target.files?.[0])}
            className="block w-full mt-1 p-2 border border-gray-300 rounded"
          />
        </label>
        <label className="block">
          Description:
          <textarea
            value={formData.description}
            onChange={(e) => setFormField("description", e.target.value)}
            className="block w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={formData.uploading}
        >
          {formData.uploading ? "Submitting..." : "Submit Campground"}
        </button>
      </form>
    </div>
  );
};

export default CampgroundForm;
