// pages/index.js

import Map from "@/components/Map";

export default function page() {
  return (
    <div>
      <div className="flex justify-center mt-10">
        <Map />
      </div>
      <h1 className="text-3xl font-bold text-center mt-10">All Campgrounds</h1>
      {/* Other content */}
    </div>
  );
}
