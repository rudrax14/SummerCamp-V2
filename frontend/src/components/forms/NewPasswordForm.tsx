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
import { useEffect, useState } from "react";

// Define the schema for the form using zod
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  OTP: z.string().min(6, { message: "OTP must be 6 characters." }),
  newPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

// Extract the type of the form data from the schema
type FormData = z.infer<typeof formSchema>;

export function NewPasswordForm() {
  const router = useRouter(); // Use useRouter hook for navigation
  const [email, setEmail] = useState<string>("");

  // Retrieve email from local storage
  useEffect(() => {
    const storedEmail = localStorage.getItem("email") || "";
    setEmail(storedEmail);
  }, []);

  // Use the useForm hook from react-hook-form with defaultValues
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
      OTP: "",
      newPassword: "",
    },
  });

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/reset-password",
        data
      );
      console.log(response.data);
      router.push("/login"); // Redirect to login page using router
    } catch (error) {
      console.error(error); // Handle submission error
    }
  };

  return (
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
                  {...field}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    field.onChange(e);
                  }}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="OTP"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OTP</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  maxLength={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-green-600">
          Confirm
        </Button>
      </form>
    </Form>
  );
}
