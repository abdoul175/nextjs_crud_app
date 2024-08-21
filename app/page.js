"use client";

import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose, DialogOverlay } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function Home() {
  const { toast } = useToast();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [idProduct, setIdProduct] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    setLoading(true);
    getAllProducts();
  }, []);

  const getAllProducts = async () => {
    // Get all products
    // Replace this with your actual API call
    const response = await fetch("/api/products");
    const data = await response.json();

    setProducts(data);
    setLoading(false);
  };

  const ProductInfo = async (id) => {
    console.log(id);
    form.setValue("name", "");
    form.setValue("description", "");

    try {
      const response = await fetch(`/api/products/${id}/edit`, {
        method: "GET",
      });

      if (response.ok) {
        const product = await response.json();
        setIdProduct(id);
        form.setValue("name", product.name);
        form.setValue("description", product.description);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (values) => {
    // TODO: Update product from the database
    let { name, description } = values;

    name = name.trim();
    description = description.trim();

    if (!name || !description) {
      toast({
        description: "Please fill in all required fields.",
        duration: 5000,
      });
      return;
    }

    try {
      const response = await fetch(`/api/products/${idProduct}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (response.ok) {
        const updatedProducts = products.map((product) =>
          product._id === idProduct
            ? { ...product, name, description }
            : product
        );
        setProducts(updatedProducts);

        form.reset();

        toast({
          description: "The product has been successfully updated.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = async (id) => {
    // TODO: Delete product from the database
    try {
      const response = await fetch(`/api/products/${id}/delete`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          description: "The product has been successfully deleted.",
          duration: 5000,
        });

        const updatedProducts = products.filter(
          (product) => product._id !== id
        );
        setProducts(updatedProducts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchProduct = (key) => {
    if (!key) {
      getAllProducts();
    }
    // TODO: Search for products by name in the database
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(key.toLowerCase())
    );
    setProducts(filteredProducts);
  };

  return (
    <div className="flex flex-col items-center justify-start mx-2 my-5">
      <div className="flex-1">
        <h1 className="text-3xl font-bold">List of products</h1>
      </div>

      <div className="w-full pt-5 px-20">
        <div className="flex justify-end">
          <Link href={"/products/add"}>
            <Button className="flex gap-2 items-center font-semibold">
              <svg
                viewBox="0 0 1024 1024"
                fill="currentColor"
                height="1em"
                width="1em"
              >
                <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z" />
                <path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z" />
              </svg>
              Add product
            </Button>
          </Link>
        </div>
        <div className="max-w-full my-5">
          <Input
            onChange={(e) => searchProduct(e.target.value)}
            placeholder="Type a product name to search for ..."
          />
        </div>
        <div className="mt-3">
          <Table>
            {loading && <TableCaption>Loading...</TableCaption>}
            {!loading && !(products.length > 0) && (
              <TableCaption>No products</TableCaption>
            )}
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products &&
                products.length > 0 &&
                products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => ProductInfo(product._id)}
                            className="font-semibold mr-2"
                            variant="secondary"
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                            <DialogDescription>
                              Make changes to your product here. Click save when
                              you're done.
                            </DialogDescription>
                          </DialogHeader>
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
                                      <Input
                                        placeholder="Product name"
                                        {...field}
                                      />
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
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button type="submit" variant="secondary">
                                    Save
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="font-semibold"
                            variant="destructive"
                          >
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Delete Product</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this product
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button
                                onClick={() => deleteProduct(product._id)}
                                variant="secondary"
                              >
                                Confirm
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* <div className="my-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div> */}
      <Toaster />
    </div>
  );
}
