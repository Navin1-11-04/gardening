"use client";

import { useState, useRef } from "react";
import {
  X,
  Loader2,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
} from "lucide-react";

interface ProductFormModalProps {
  product?: any;
  categories: any[];
  onClose: () => void;
  onSave: () => void;
}

type ImageEntry = {
  url: string;          // final Cloudinary URL (or preview before upload)
  uploading: boolean;
  error?: string;
};

export default function ProductFormModal({
  product,
  categories,
  onClose,
  onSave,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    nameTa: product?.nameTa || "",
    subtitle: product?.subtitle || "",
    description: product?.description || "",
    categoryId: product?.categoryId || "",
    price: product?.price || "",
    originalPrice: product?.originalPrice || "",
    sku: product?.sku || "",
    stock: product?.stock || "",
    badge: product?.badge || "",
    active: product?.active ?? true,
  });

  // Parse existing images
  const parseImages = (): ImageEntry[] => {
    const imgs: string[] = Array.isArray(product?.images)
      ? product.images
      : [];
    if (imgs.length === 0) return [{ url: "", uploading: false }];
    return imgs.map((url) => ({ url, uploading: false }));
  };

  const [images, setImages] = useState<ImageEntry[]>(parseImages);
  const [highlights, setHighlights] = useState<string[]>(
    product?.highlights?.length ? product.highlights : [""]
  );
  const [weights, setWeights] = useState<string[]>(
    product?.weights?.length ? product.weights : [""]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Toggle between URL input and file upload per image slot
  const [inputMode, setInputMode] = useState<("url" | "file")[]>(
    parseImages().map(() => "url")
  );

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Image handlers ──────────────────────────────────────────────────────────

  const updateImage = (index: number, patch: Partial<ImageEntry>) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, ...patch } : img))
    );
  };

  const handleUrlChange = (index: number, value: string) => {
    updateImage(index, { url: value, error: undefined });
  };

  const handleFileChange = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      updateImage(index, { url: base64, uploading: true, error: undefined });

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source: base64 }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        updateImage(index, { url: data.url, uploading: false });
      } catch (err: any) {
        updateImage(index, {
          uploading: false,
          error: err.message || "Upload failed",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const addImageSlot = () => {
    setImages((prev) => [...prev, { url: "", uploading: false }]);
    setInputMode((prev) => [...prev, "url"]);
  };

  const removeImageSlot = (index: number) => {
    if (images.length <= 1) {
      setImages([{ url: "", uploading: false }]);
      setInputMode(["url"]);
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
    setInputMode((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleMode = (index: number) => {
    setInputMode((prev) =>
      prev.map((m, i) => (i === index ? (m === "url" ? "file" : "url") : m))
    );
  };

  // ── Field handlers ─────────────────────────────────────────────────────────

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleHighlightChange = (i: number, v: string) =>
    setHighlights((prev) => prev.map((h, idx) => (idx === i ? v : h)));
  const addHighlight = () => setHighlights((prev) => [...prev, ""]);
  const removeHighlight = (i: number) =>
    setHighlights((prev) => prev.filter((_, idx) => idx !== i));

  const handleWeightChange = (i: number, v: string) =>
    setWeights((prev) => prev.map((w, idx) => (idx === i ? v : w)));
  const addWeight = () => setWeights((prev) => [...prev, ""]);
  const removeWeight = (i: number) =>
    setWeights((prev) => prev.filter((_, idx) => idx !== i));

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check no images still uploading
    if (images.some((img) => img.uploading)) {
      setError("Please wait for all images to finish uploading.");
      return;
    }

    const validImages = images.map((img) => img.url).filter((u) => u.trim());
    if (validImages.length === 0) {
      setError("Please add at least one product image.");
      return;
    }

    setLoading(true);
    try {
      const method = product ? "PUT" : "POST";
      const url = product
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: validImages,
          highlights: highlights.filter((h) => h.trim()),
          weights: weights.filter((w) => w.trim()),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to save product");
        return;
      }

      onSave();
      onClose();
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name (English)"
                value={formData.name}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
                required
              />
              <input
                type="text"
                name="nameTa"
                placeholder="Product Name (Tamil)"
                value={formData.nameTa}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
              />
              <input
                type="text"
                name="subtitle"
                placeholder="Subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
              />
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id ?? cat.id} value={cat._id ?? cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              name="description"
              placeholder="Product Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
              rows={3}
              required
            />
          </div>

          {/* Pricing & Stock */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Pricing & Stock</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="price"
                placeholder="Price (₹)"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
                required
              />
              <input
                type="number"
                name="originalPrice"
                placeholder="Original Price (optional)"
                value={formData.originalPrice}
                onChange={handleChange}
                step="0.01"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
              />
              <input
                type="text"
                name="sku"
                placeholder="SKU"
                value={formData.sku}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
                required
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock Quantity"
                value={formData.stock}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
              >
                <option value="">No Badge</option>
                <option value="Best Seller">Best Seller</option>
                <option value="New">New</option>
                <option value="Sale">Sale</option>
                <option value="Organic">Organic</option>
                <option value="Popular">Popular</option>
              </select>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">
                  Active (visible in shop)
                </span>
              </label>
            </div>
          </div>

          {/* Product Images — Cloudinary */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ImageIcon size={16} className="text-[#3d6b35]" />
              <h3 className="font-semibold text-gray-700">Product Images</h3>
              <span className="text-xs text-gray-400 ml-1">
                (uploaded to Cloudinary)
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Upload image files or paste direct URLs. First image is the main
              product photo.
            </p>

            {images.map((img, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-3 space-y-2">
                {/* Mode toggle */}
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => toggleMode(idx)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition ${
                      inputMode[idx] === "file"
                        ? "bg-[#3d6b35] text-white border-[#3d6b35]"
                        : "bg-white text-gray-600 border-gray-300 hover:border-[#3d6b35]"
                    }`}
                  >
                    <Upload size={12} />
                    Upload file
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleMode(idx)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition ${
                      inputMode[idx] === "url"
                        ? "bg-[#3d6b35] text-white border-[#3d6b35]"
                        : "bg-white text-gray-600 border-gray-300 hover:border-[#3d6b35]"
                    }`}
                  >
                    <LinkIcon size={12} />
                    Paste URL
                  </button>
                </div>

                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    {inputMode[idx] === "file" ? (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          ref={(el) => {
                            fileInputRefs.current[idx] = el;
                          }}
                          onChange={(e) => handleFileChange(idx, e)}
                          className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#eef5ea] file:text-[#3d6b35] file:font-semibold hover:file:bg-[#3d6b35] hover:file:text-white file:transition-colors cursor-pointer"
                        />
                        {img.uploading && (
                          <p className="text-xs text-[#3d6b35] mt-1 flex items-center gap-1">
                            <Loader2 size={12} className="animate-spin" />
                            Uploading to Cloudinary…
                          </p>
                        )}
                      </>
                    ) : (
                      <input
                        type="url"
                        placeholder={`Image ${idx + 1} URL (https://...)`}
                        value={img.url.startsWith("data:") ? "" : img.url}
                        onChange={(e) => handleUrlChange(idx, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35] text-sm"
                      />
                    )}
                    {img.error && (
                      <p className="text-xs text-red-500 mt-1">{img.error}</p>
                    )}
                  </div>

                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageSlot(idx)}
                      className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition shrink-0 mt-0.5"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Preview */}
                {img.url && !img.uploading && (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    {idx === 0 && (
                      <span className="absolute top-0.5 left-0.5 bg-[#3d6b35] text-white text-[8px] font-bold px-1 py-0.5 rounded">
                        Main
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}

            {images.length < 5 && (
              <button
                type="button"
                onClick={addImageSlot}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#3d6b35] hover:bg-green-50 rounded-lg transition"
              >
                <Plus className="w-4 h-4" />
                Add Another Image
              </button>
            )}
          </div>

          {/* Highlights */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Highlights</h3>
            {highlights.map((h, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Highlight ${idx + 1}`}
                  value={h}
                  onChange={(e) => handleHighlightChange(idx, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
                />
                {highlights.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeHighlight(idx)}
                    className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addHighlight}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#3d6b35] hover:bg-green-50 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Add Highlight
            </button>
          </div>

          {/* Weight Options */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Weight / Size Options</h3>
            {weights.map((w, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`e.g. "1 pack (50 seeds)"`}
                  value={w}
                  onChange={(e) => handleWeightChange(idx, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
                />
                {weights.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeWeight(idx)}
                    className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addWeight}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#3d6b35] hover:bg-green-50 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Add Weight Option
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || images.some((img) => img.uploading)}
            className="px-4 py-2 bg-[#3d6b35] hover:bg-[#2a4620] text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving…
              </>
            ) : product ? (
              "Update Product"
            ) : (
              "Create Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}