"use client";

import { useState } from "react";
import { X, Loader2, Plus, Trash2, Image as ImageIcon, ExternalLink } from "lucide-react";

interface ProductFormModalProps {
  product?: any;
  categories: any[];
  onClose: () => void;
  onSave: () => void;
}

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

  // Parse existing images from JSON string or use defaults
  const parseImages = (): string[] => {
    if (!product?.images) return [""];
    try {
      const parsed = JSON.parse(product.images);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [""];
    } catch {
      return [""];
    }
  };

  const [highlights, setHighlights] = useState<string[]>(
    product?.highlights ? JSON.parse(product.highlights) : [""],
  );
  const [weights, setWeights] = useState<string[]>(
    product?.weights ? JSON.parse(product.weights) : [""],
  );
  const [imageUrls, setImageUrls] = useState<string[]>(parseImages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreviewIdx, setImagePreviewIdx] = useState<number | null>(null);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Image URL handlers
  const handleImageUrlChange = (index: number, value: string) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };
  const handleAddImageUrl = () => setImageUrls([...imageUrls, ""]);
  const handleRemoveImageUrl = (index: number) => {
    if (imageUrls.length <= 1) { setImageUrls([""]); return; }
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  // Highlight handlers
  const handleHighlightChange = (index: number, value: string) => {
    const n = [...highlights]; n[index] = value; setHighlights(n);
  };
  const handleAddHighlight = () => setHighlights([...highlights, ""]);
  const handleRemoveHighlight = (index: number) =>
    setHighlights(highlights.filter((_, i) => i !== index));

  // Weight handlers
  const handleWeightChange = (index: number, value: string) => {
    const n = [...weights]; n[index] = value; setWeights(n);
  };
  const handleAddWeight = () => setWeights([...weights, ""]);
  const handleRemoveWeight = (index: number) =>
    setWeights(weights.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const validImages = imageUrls.filter((u) => u.trim());
    if (validImages.length === 0) {
      setError("Please add at least one product image URL.");
      setLoading(false);
      return;
    }

    try {
      const method = product ? "PUT" : "POST";
      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";

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
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="name" placeholder="Product Name (English)" value={formData.name}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
                required
              />
              <input type="text" name="nameTa" placeholder="Product Name (Tamil)" value={formData.nameTa}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
              />
              <input type="text" name="subtitle" placeholder="Subtitle" value={formData.subtitle}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
              />
              <select name="categoryId" value={formData.categoryId} onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <textarea name="description" placeholder="Product Description" value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
              rows={3} required
            />
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Pricing & Stock</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" name="price" placeholder="Price (₹)" value={formData.price}
                onChange={handleChange} step="0.01"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
                required
              />
              <input type="number" name="originalPrice" placeholder="Original Price (optional)" value={formData.originalPrice}
                onChange={handleChange} step="0.01"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
              />
              <input type="text" name="sku" placeholder="SKU" value={formData.sku}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
                required
              />
              <input type="number" name="stock" placeholder="Stock Quantity" value={formData.stock}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select name="badge" value={formData.badge} onChange={handleChange}
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
                <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="w-4 h-4" />
                <span className="text-sm text-gray-700">Active (visible in shop)</span>
              </label>
            </div>
          </div>

          {/* Product Images — NEW section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ImageIcon size={16} className="text-[#3d6b35]" />
              <h3 className="font-semibold text-gray-700">Product Images</h3>
            </div>
            <p className="text-xs text-gray-500">
              Paste direct image URLs (Unsplash, Pinimg, etc.). First image is the main product photo.
            </p>
            {imageUrls.map((url, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder={`Image ${idx + 1} URL (https://...)`}
                      value={url}
                      onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35] text-sm"
                    />
                    {url.trim() && (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition shrink-0"
                        title="Preview image"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                    {imageUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImageUrl(idx)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  {/* Inline preview */}
                  {url.trim() && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
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
              </div>
            ))}
            {imageUrls.length < 5 && (
              <button
                type="button"
                onClick={handleAddImageUrl}
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
            {highlights.map((highlight, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Highlight ${idx + 1}`}
                  value={highlight}
                  onChange={(e) => handleHighlightChange(idx, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
                />
                {highlights.length > 1 && (
                  <button type="button" onClick={() => handleRemoveHighlight(idx)}
                    className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddHighlight}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#3d6b35] hover:bg-green-50 rounded-lg transition">
              <Plus className="w-4 h-4" />
              Add Highlight
            </button>
          </div>

          {/* Weight Options */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Weight / Size Options</h3>
            {weights.map((weight, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`e.g. "1 pack (50 seeds)"`}
                  value={weight}
                  onChange={(e) => handleWeightChange(idx, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
                />
                {weights.length > 1 && (
                  <button type="button" onClick={() => handleRemoveWeight(idx)}
                    className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddWeight}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#3d6b35] hover:bg-green-50 rounded-lg transition">
              <Plus className="w-4 h-4" />
              Add Weight Option
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="px-4 py-2 bg-[#3d6b35] hover:bg-[#2a4620] text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center gap-2">
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
            ) : product ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}