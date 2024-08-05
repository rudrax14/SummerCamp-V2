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
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

// Extract the type of the form data from the schema
type FormData = z.infer<typeof formSchema>;

export function LoginForm() {
  const router = useRouter(); // Use useRouter hook for navigation
  // Use the useForm hook from react-hook-form with defaultValues
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "", // Set initial value to an empty string
      password: "", // Set initial value to an empty string
    },
  });

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        data
      );
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userID", response.data.user._id);
      toast.success("Login successful");
      router.push("/campgrounds"); // Redirect to campgrounds page using router
    } catch (error) {
      console.error(error); // Handle login error
      toast.error("Login failed");
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
          <FormField
            control={form.control}
            name="password"
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
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-blue-600">
              Forgot password ?
            </Link>
          </div>
          <Button type="submit" className="w-full bg-green-600">
            Login
          </Button>
        </form>
      </Form>
    </>
  );
}
