import EditForm from "@/components/forms/EditForm";

const Page: React.FC<{ params: { id: string } }> = ({ params }) => {
  return (
    <div>
      <h1 className="text-center text-3xl font-bold mb-4">Edit CampGround</h1>
      <EditForm id={params.id} />
    </div>
  );
};

export default Page;
