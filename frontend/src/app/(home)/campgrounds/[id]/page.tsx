import SingleCampground from "@/components/SingleCampground";
import React from "react";

const Page: React.FC<{ params: { id: string } }> = ({ params }) => {
  return <SingleCampground id={params.id}/>;
};

export default Page;
