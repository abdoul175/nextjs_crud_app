"use client";

import Link from "next/link";
import { z } from "zod";
import { Toaster } from "@/components/ui/toaster";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const formSchema = z.object({
  name: z
    .string()
    .min(5, { message: "The product name must contain at least 5 characters" })
    .max(50),
  description: z
    .string()
    .min(5, {
      message: "The product description must contain at least 5 characters",
    })
    .max(255),
});

const CreateProduct = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values) => {
    setSubmitting(true);
    // TODO: Add product to the database
    console.log("Product created:", values);

    let { name, description } = values;

    name = name.trim();
    description = description.trim();

    if (!name || !description) {
      setSubmitting(false);
      toast({
        description: "Please fill in all required fields.",
        duration: 5000,
      });
      return;
    }

    try {
      const response = await fetch("/api/products/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (response.ok) {
        form.reset();

        toast({
          description: "The product has been successfully added.",
          duration: 5000,
        });

        router.push("/"); // Redirect to the home page after creating the product
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-start mx-2 my-5">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Add New Product</h1>
        </div>

        <div className="w-full pt-5 px-20">
          <div className="flex justify-end mb-2">
            <Link href={"/"}>
              <Button
                className="flex gap-2 items-center font-semibold"
                variant="outline"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height="1em"
                  width="1em"
                >
                  <path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z" />
                </svg>
                Back
              </Button>
            </Link>
          </div>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Product Description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={submitting}
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500"
                >
                  {submitting ? "Save..." : "Save"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default CreateProduct;
