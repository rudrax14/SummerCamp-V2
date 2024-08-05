"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function EditForm({ id }: { id: string }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    location: "",
    description: "",
    thumbnail: "",
    geometry: null,
    uploading: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const setFormField = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchCoordinates = async (query: string): Promise<void> => {
    const MAPBOX_ACCESS_TOKEN =
      process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
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

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/campgrounds/${id}`)
      .then((res) => {
        const campground = res.data.data;
        setFormData({
          name: campground.name,
          price: campground.price,
          location: campground.location,
          description: campground.description,
          thumbnail: campground.thumbnail,
          geometry: campground.geometry,
          uploading: false,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load campground data.");
        setLoading(false);
      });
  }, [id]);

  const uploadHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("No file selected for upload");
      return;
    }

    const formDataImage = new FormData();
    formDataImage.append("thumbnail", selectedFile);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/upload",
        formDataImage,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const thumbnailUrl = res.data.imageUrl;
      if (thumbnailUrl) {
        setFormField("thumbnail", thumbnailUrl);
        toast.success("Thumbnail uploaded successfully.");
      } else {
        throw new Error("URL not found in response");
      }
    } catch (err) {
      console.error("Error uploading thumbnail:", err);
      toast.error("Failed to upload thumbnail");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.uploading) {
      toast.error("Please wait for the thumbnail to upload.");
      return;
    }

    if (!formData.thumbnail) {
      toast.error("Please upload a thumbnail before submitting.");
      return;
    }

    setFormField("uploading", true);
    try {
      await axios.put(
        `http://localhost:5000/api/v1/campgrounds/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Campground data updated successfully.");
    } catch (error) {
      console.error("Error updating campground data:", error);
      toast.error("Failed to update campground data");
    } finally {
      setFormField("uploading", false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
          {formData.thumbnail && (
            <div className="mb-4">
              <img
                src={formData.thumbnail}
                alt="Current thumbnail"
                className="w-72 object-cover"
              />
              <p className="text-sm">Current thumbnail</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="block w-full mt-1 p-2 border border-gray-300 rounded"
          />
        </label>
        <button
          type="button"
          onClick={uploadHandler}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={!selectedFile} // Disable if no file is selected
        >
          Upload Thumbnail
        </button>
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
}

export default EditForm;
