// models/Guide.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGuideSection {
  id: string;
  heading: string;
  content: string[];
  tip?: string;
  image?: string;
  imageAlt?: string;
  list?: string[];
}

export interface IGuide extends Document {
  slug: string;
  title: string;
  excerpt: string;
  category: string;          // e.g. "beginners", "vegetables"
  tag?: string;              // e.g. "Most Popular"
  readTime: number;
  date: string;              // display date e.g. "12 Mar 2025"
  author: string;
  authorRole: string;
  heroImage: string;
  intro: string;
  sections: IGuideSection[];
  relatedSlugs: string[];
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SectionSchema = new Schema<IGuideSection>(
  {
    id:       { type: String, required: true },
    heading:  { type: String, required: true },
    content:  [{ type: String }],
    tip:      { type: String },
    image:    { type: String },
    imageAlt: { type: String },
    list:     [{ type: String }],
  },
  { _id: false }
);

const GuideSchema = new Schema<IGuide>(
  {
    slug:        { type: String, required: true, unique: true },
    title:       { type: String, required: true },
    excerpt:     { type: String, required: true },
    category:    { type: String, required: true },
    tag:         { type: String },
    readTime:    { type: Number, default: 5 },
    date:        { type: String, required: true },
    author:      { type: String, default: "Rajan M." },
    authorRole:  { type: String, default: "Horticulture Advisor, Kavin Organics" },
    heroImage:   { type: String, required: true },
    intro:       { type: String, required: true },
    sections:    [SectionSchema],
    relatedSlugs:[{ type: String }],
    featured:    { type: Boolean, default: false },
    active:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

GuideSchema.index({ slug: 1 });
GuideSchema.index({ category: 1, active: 1 });

export const Guide: Model<IGuide> =
  mongoose.models.Guide ?? mongoose.model<IGuide>("Guide", GuideSchema);