import { connectToDB } from "@/database/dbConnection";
import { Product } from "@/models/product";

export const DELETE = async (req, { params }) => {
  // Your code here
  const id = params.id;

  try {
    await connectToDB();

    // TODO: Delete product
    await Product.findByIdAndDelete(id);

    return new Response("Product deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Failed to delete product", { status: 500 });
  }
};
