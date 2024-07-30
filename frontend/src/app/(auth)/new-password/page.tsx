import React from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewPasswordForm } from "@/components/forms/NewPasswordForm";

function Page() {
  return (
    <>
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
      </CardHeader>
      <CardContent>
        <NewPasswordForm />
      </CardContent>
    </>
  );
}

export default Page;
