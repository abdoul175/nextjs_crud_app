import { connectToDB } from "@/database/dbConnection";
import { Product } from "@/models/product";

export const dynamic = "force-dynamic";

export const POST = async (req, res, next) => {
  // Your code here
  const { name, description } = await req.json();

  try {
    await connectToDB();

    // TODO: Insert product into the database
    const newProduct = new Product({ name, description });
    await newProduct.save();

    return new Response(JSON.stringify(newProduct), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new product", { status: 500 });
  }
};
