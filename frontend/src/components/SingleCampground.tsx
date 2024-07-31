// pages/campground/[id].tsx
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CampgroundMap from "./CampgroundMap";

type Campground = {
  _id: string;
  name: string;
  description: string;
  thumbnail: string;
  price: number;
  location: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  createdAt: string;
  author: {
    name: string;
  };
  reviews: Array<{
    _id: string;
    rating: number;
    text: string;
    author: {
      username: string;
    };
  }>;
};

type SingleCampgroundProps = {
  id: string;
};

const SingleCampground: React.FC<SingleCampgroundProps> = ({ id }) => {
  const [campground, setCampground] = useState<Campground | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/campgrounds/${id}`)
      .then((res) => {
        console.log(res.data);
        setCampground(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load campground data.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!campground) {
    return <div>No campground found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Campground Image and Details */}
        <div>
          <img
            src={campground.thumbnail}
            alt={campground.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <h1 className="text-3xl font-bold mb-2">{campground.name}</h1>
          <p className="text-gray-700 mb-2">{campground.description}</p>
          <p className="text-gray-700 mb-2">
            <strong>Location:</strong> {campground.location}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Price:</strong> ₹{campground.price}/night
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Submitted by:</strong> {campground.author.name}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Created:</strong>{" "}
            {new Date(campground.createdAt).toDateString()}
          </p>
        </div>
        <CampgroundMap
          coordinates={campground.geometry.coordinates}
          title={campground.name}
          location={campground.location}
        />
        {/* Review Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Leave a Review</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700">Rating:</label>
              <select
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                name="rating"
                id="rating"
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Terrible</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Review Text:</label>
              <textarea
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                name="reviewText"
                id="reviewText"
                rows="3"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
            >
              Submit
            </button>
          </form>

          {/* Existing Reviews */}
          <div className="mt-8 space-y-4">
            {campground.reviews.length === 0 ? (
              <p className="text-gray-700">No reviews yet.</p>
            ) : (
              campground.reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-gray-100 p-4 rounded-md shadow-md space-y-2"
                >
                  <p className="text-gray-800 font-semibold">
                    {review.author.username} - {review.rating} stars
                  </p>
                  <p className="text-gray-700">{review.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCampground;
