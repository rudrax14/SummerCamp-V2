import CampgroundForm from "@/components/forms/CampgroundForm";
import React from "react";

function page() {
  return (
    <div>
      <h1 className="text-center text-3xl font-bold mb-4">New CampGround</h1>
      <CampgroundForm />
    </div>
  );
}

export default page;
