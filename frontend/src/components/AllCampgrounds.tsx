"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Define a type for campground data
type Campground = {
  _id: string;
  name: string;
  description: string;
  thumbnail: string;
  price: number;
  location: string;
};

function AllCampgrounds() {
  const [campgrounds, setCampgrounds] = useState<Campground[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/campgrounds")
      .then((res) => {
        console.log(res.data);
        setCampgrounds(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const navigateHandler = (id: string) => {
    router.push(`/campgrounds/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Campgrounds</h1>
      <div className="flex flex-col gap-4">
        {campgrounds.map((campground) => (
          <div
            key={campground._id}
            className="bg-white rounded-lg shadow-md gap-4 overflow-hidden flex"
          >
            <img
              src={campground.thumbnail}
              alt={campground.name}
              className="w-72 object-cover"
            />
            <div className="p-4 flex flex-col justify-between overflow-hidden flex-grow">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{campground.name}</h2>
                <p className="text-gray-600 mt-2">{campground.description}</p>
                <p className="text-sm text-gray-500 mt-1">{campground.location}</p>
              </div>
              <button
                onClick={() => navigateHandler(campground._id)}
                className="mt-4 bg-blue-500 text-white rounded px-4 py-2 self-start"
              >
                View {campground.name}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllCampgrounds;
