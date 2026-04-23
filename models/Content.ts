// models/Content.ts
// Stores all editable page content as key-value JSON documents.
// Each page has one document with key = page slug.

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContent extends Document {
  key:       string;           // e.g. "homepage", "faq", "about", "shipping", "returns"
  label:     string;           // Human-readable label for admin UI
  value:     Record<string, any>; // Arbitrary JSON — structure differs per page
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    key:   { type: String, required: true, unique: true },
    label: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const Content: Model<IContent> =
  mongoose.models.Content ?? mongoose.model<IContent>("Content", ContentSchema);