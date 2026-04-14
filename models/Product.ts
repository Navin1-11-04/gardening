import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IHowToUseStep {
  step: string;
  title: string;
  desc: string;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  nameTa?: string;
  subtitle?: string;
  subtitleTa?: string;
  slug: string;
  description: string;
  highlights: string[];
  howToUse: IHowToUseStep[];
  price: number;
  originalPrice?: number;
  badge?: string;
  categoryId: Types.ObjectId;
  category?: { name: string; slug: string };
  images: string[];       // Cloudinary URLs
  rating: number;
  reviews: number;
  weights: string[];
  sku: string;
  stock: number;
  inStock: boolean;
  active: boolean;
  deliveryDays: string;
  createdAt: Date;
  updatedAt: Date;
}

const HowToUseSchema = new Schema<IHowToUseStep>(
  {
    step: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    nameTa: { type: String },
    subtitle: { type: String },
    subtitleTa: { type: String },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    howToUse: [HowToUseSchema],
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    badge: { type: String },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    images: [{ type: String }],
    rating: { type: Number, default: 5 },
    reviews: { type: Number, default: 0 },
    weights: [{ type: String }],
    sku: { type: String, required: true, unique: true },
    stock: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
    deliveryDays: { type: String, default: "2–4" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for category
ProductSchema.virtual("categoryData", {
  ref: "Category",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true,
});

export const Product: Model<IProduct> =
  mongoose.models.Product ?? mongoose.model<IProduct>("Product", ProductSchema);