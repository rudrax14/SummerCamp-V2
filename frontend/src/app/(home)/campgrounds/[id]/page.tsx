import SingleCampground from "@/components/SingleCampground";
import React from "react";

const Page: React.FC<{ params: { id: string } }> = ({ params }) => {
  return (
    <div className="container">
      <SingleCampground id={params.id} />
    </div>
  );
};

export default Page;
