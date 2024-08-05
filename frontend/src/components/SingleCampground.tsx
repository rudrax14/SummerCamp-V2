"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CampgroundMap from "./CampgroundMap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

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
    _id: string;
    name: string;
  };
  reviews: Array<{
    _id: string;
    rating: number;
    content: string;
    userId: {
      _id: string;
      name: string;
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
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const router = useRouter();
  const userId = localStorage.getItem("userID");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/v1/campgrounds/${id}`)
      .then((res) => {
        setCampground(res.data.data);
        setLoading(false);
        setReviewSubmitted(false); // Reset reviewSubmitted state
      })
      .catch((err) => {
        setError("Failed to load campground data.");
        setLoading(false);
      });
  }, [id, reviewSubmitted]);

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5000/api/v1/campgrounds/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        router.push("/campgrounds");
      })
      .catch((err) => {
        setError("Failed to delete campground.");
      });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const rating = formData.get("rating");
    const reviewText = formData.get("reviewText");

    if (!rating || !reviewText) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/v1/review`,
        {
          campgroundId: id,
          rating,
          content: reviewText,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setReviewSubmitted(true); // Set reviewSubmitted to true to trigger useEffect
      alert("Review submitted successfully.");
    } catch (error) {
      alert("Failed to submit review.");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/review/${reviewId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReviewSubmitted(true); // Trigger useEffect to re-fetch data
      alert("Review deleted successfully.");
    } catch (error) {
      alert("Failed to delete review.");
    }
  };

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

          {campground.author._id === userId && (
            <div className="button">
              <Link href={`/campgrounds/${id}/edit`} className="">
                <Button className="bg-green-500 text-white font-bold px-4 py-3 rounded-md hover:bg-green-600">
                  Edit
                </Button>
              </Link>
              <Button
                onClick={handleDelete}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 ml-2"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
        <div>
          <CampgroundMap
            coordinates={campground.geometry.coordinates}
            title={campground.name}
            location={campground.location}
          />
          <div className="reviews">
            <h2 className="text-2xl font-semibold my-4">Leave a Review</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Rating:</label>
                <select
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  name="rating"
                  id="rating"
                  required
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
                  rows={3}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
              >
                Submit
              </button>
            </form>

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
                      {review.userId.name} - {review.rating} stars
                    </p>
                    <p className="text-gray-700">{review.content}</p>
                    {review.userId._id === userId && (
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="bg-red-500 text-white font-bold py-1 px-2 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCampground;
