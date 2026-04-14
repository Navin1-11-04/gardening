import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: number;
  subtotal: number;
  deliveryFee: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  paymentMethod: string;
  items: Array<{
    productId: string;
    name: string;
    variant: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  address: {
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String },
    total: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
    },
    paymentMethod: { type: String, required: true },
    items: [
      {
        productId: String,
        name: String,
        variant: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    address: {
      name: String,
      phone: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
    },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> =
  mongoose.models.Order ?? mongoose.model<IOrder>("Order", OrderSchema);