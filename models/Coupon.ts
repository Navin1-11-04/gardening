import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICoupon extends Document {
  code: string;         
  discount: number;   
  active: boolean;
  minOrder?: number; 
  maxUses?: number;     
  usedCount: number;
  expiresAt?: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code:        { type: String, required: true, unique: true, uppercase: true, trim: true },
    discount:    { type: Number, required: true, min: 1, max: 100 },
    active:      { type: Boolean, default: true },
    minOrder:    { type: Number, default: 0 },
    maxUses:     { type: Number, default: 0 }, // 0 = unlimited
    usedCount:   { type: Number, default: 0 },
    expiresAt:   { type: Date },
    description: { type: String },
  },
  { timestamps: true }
);

export const Coupon: Model<ICoupon> =
  mongoose.models.Coupon ?? mongoose.model<ICoupon>("Coupon", CouponSchema);