import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  orderNumber:        string;
  customerName:       string;
  customerPhone?:     string;
  customerEmail?:     string;        // ← now consistently stored on all orders
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
    customerEmail:      { type: String },              // ← stored for email notifications
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

// ── Indexes ────────────────────────────────────────────────────────────────────
// Fast lookups by status + date (admin orders page)
OrderSchema.index({ status: 1, createdAt: -1 });
// Fast lookup by phone (track order)
OrderSchema.index({ customerPhone: 1 });
// Fast lookup by email (future: customer account page)
OrderSchema.index({ customerEmail: 1 });
// Fast lookup by order number
OrderSchema.index({ orderNumber: 1 });

export const Order: Model<IOrder> =
  mongoose.models.Order ?? mongoose.model<IOrder>("Order", OrderSchema);