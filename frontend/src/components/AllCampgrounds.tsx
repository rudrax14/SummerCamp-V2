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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
      {campgrounds.map((campground) => (
        <div
          key={campground._id}
          className="bg-white rounded-lg overflow-hidden shadow-lg"
        >
          <img
            src={campground.thumbnail}
            alt={campground.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800">
              {campground.name}
            </h2>
            <p className="text-gray-600 mt-2">{campground.description}</p>
          </div>
          <button onClick={() => navigateHandler(campground._id)}>View</button>
        </div>
      ))}
    </div>
  );
}

export default AllCampgrounds;
