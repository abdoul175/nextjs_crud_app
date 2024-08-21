import { connectToDB } from "@/database/dbConnection";
import { Product } from "@/models/product";

export const PUT = async (req, { params }) => {
  // Your code here
  const data = await req.json();
  const { id } = params;

  try {
    await connectToDB();

    // TODO: Update product
    const updatedProduct = await Product.findByIdAndUpdate(id, data, {
      new: true,
    });

    return new Response(JSON.stringify(updatedProduct), { status: 200 });
  } catch (error) {
    return new Response("Failed to update product", { status: 500 });
  }
};
