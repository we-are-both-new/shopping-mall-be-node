import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProduct extends Document {
  sku: string;
  name: string;
  size: string[];
  thumbnail: string;
  detailImages: string[];
  category: string[];
  description: string;
  price: number;
  stock: Record<string, any>;
  status?: string;
  isDeleted?: boolean;
}

const productSchema: Schema<IProduct> = new Schema(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    size: { type: [String], required: true },
    thumbnail: { type: String, required: true },
    detailImages: { type: [String] },
    category: { type: [String], required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Object, required: true },
    status: { type: String, default: "active" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.updatedAt;
  delete obj.createdAt;
  return obj;
};

const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
);
export default Product;
