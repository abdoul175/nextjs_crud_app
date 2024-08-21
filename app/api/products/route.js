import { connectToDB } from "@/database/dbConnection";
import { Product } from "@/models/product";

export const GET = async (req, res, next) => {
  // Your code here
  try {
    await connectToDB();

    // TODO: Get all products
    const products = await Product.find({});

    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all products", { status: 500 });
  }
};
