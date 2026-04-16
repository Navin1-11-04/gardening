import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
  key: string;   // e.g. "store"
  value: Record<string, any>;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    key:   { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const Settings: Model<ISettings> =
  mongoose.models.Settings ?? mongoose.model<ISettings>("Settings", SettingsSchema);