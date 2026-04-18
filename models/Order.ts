import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  orderNumber:        string;
  customerName:       string;
  customerPhone?:     string;
  customerEmail?:     string;
  total:              number;
  subtotal:           number;
  deliveryFee:        number;
  couponDiscount:     number;
  status:             "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  paymentMethod:      string;
  razorpayOrderId?:   string;
  razorpayPaymentId?: string;
  items: Array<{
    productId: string;
    name:      string;
    variant:   string;
    price:     number;
    quantity:  number;
    image:     string;
  }>;
  address: {
    name:     string;
    phone:    string;
    line1:    string;
    line2?:   string;
    city:     string;
    state:    string;
    pincode:  string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber:        { type: String, required: true, unique: true },
    customerName:       { type: String, required: true },
    customerPhone:      { type: String },
    customerEmail:      { type: String },
    total:              { type: Number, required: true },
    subtotal:           { type: Number, required: true },
    deliveryFee:        { type: Number, default: 0 },
    couponDiscount:     { type: Number, default: 0 },
    status: {
      type:    String,
      enum:    ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
    },
    paymentMethod:      { type: String, required: true },
    razorpayOrderId:    { type: String },
    razorpayPaymentId:  { type: String },
    items: [
      {
        productId: String,
        name:      String,
        variant:   String,
        price:     Number,
        quantity:  Number,
        image:     String,
      },
    ],
    address: {
      name:    String,
      phone:   String,
      line1:   String,
      line2:   String,
      city:    String,
      state:   String,
      pincode: String,
    },
  },
  { timestamps: true }
);

// Index for fast lookups by status and date (useful for admin orders page)
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ customerPhone: 1 });

export const Order: Model<IOrder> =
  mongoose.models.Order ?? mongoose.model<IOrder>("Order", OrderSchema);