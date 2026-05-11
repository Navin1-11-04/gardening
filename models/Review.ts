import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  productId: string;       // MongoDB ObjectId string or numeric static id
  productName: string;
  name: string;            // reviewer name
  phone?: string;          // optional, for verification
  rating: number;          // 1-5
  comment: string;
  verified: boolean;       // admin can mark as verified buyer
  approved: boolean;       // admin must approve before showing publicly
  ip?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    productId:   { type: String, required: true, index: true },
    productName: { type: String, required: true },
    name:        { type: String, required: true, maxlength: 100 },
    phone:       { type: String },
    rating:      { type: Number, required: true, min: 1, max: 5 },
    comment:     { type: String, required: true, minlength: 10, maxlength: 1000 },
    verified:    { type: Boolean, default: false },
    approved:    { type: Boolean, default: false }, // false = pending, admin approves
    ip:          { type: String },
  },
  { timestamps: true }
);

// Index for fast product page queries
ReviewSchema.index({ productId: 1, approved: 1, createdAt: -1 });

export const Review: Model<IReview> =
  mongoose.models.Review ?? mongoose.model<IReview>("Review", ReviewSchema);