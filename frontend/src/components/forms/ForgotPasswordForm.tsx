"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

// Define the schema for the form using zod
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

// Extract the type of the form data from the schema
type FormData = z.infer<typeof formSchema>;

export function ForgotPasswordForm() {
  const router = useRouter(); // Use useRouter hook for navigation
  // Use the useForm hook from react-hook-form with defaultValues
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "", // Set initial value to an empty string
    },
  });

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      // Store the email in local storage

      const response = await axios.post(
        "http://localhost:5000/api/v1/request-password-reset",
        data
      );
      console.log(response.data);
      localStorage.setItem("email", data.email);
      toast.success("OTP sent to your email. Please check your inbox.");
      router.push("/new-password");
    } catch (error) {
      console.error(error); // Handle submission error
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-green-600">
            SEND OTP
          </Button>
        </form>
      </Form>
    </>
  );
}
