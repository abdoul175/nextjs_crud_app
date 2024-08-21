import { connectToDB } from "@/database/dbConnection";
import { Product } from "@/models/product";

export const GET = async (req, { params }) => {
  // Your code here
  const id = params.id;
  try {
    await connectToDB();

    // TODO: Get one product
    const product = await Product.findById(id);
    if (!product) {
      return new Response("Product not found", { status: 404 });
    }

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch product", { status: 500 });
  }
};
