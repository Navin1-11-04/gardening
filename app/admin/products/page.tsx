"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Filter, AlertCircle, RefreshCw } from "lucide-react";
import ProductFormModal from "./_components/ProductFormModal";

// ── Fix: MongoDB returns string IDs, not numbers ──────────────────────────────
interface Product {
  id: string;           // ← was `number`, now `string` (MongoDB ObjectId)
  name: string;
  nameTa?: string;
  subtitle?: string;
  price: number;
  stock: number;
  category: { name: string; slug: string } | null;
  categoryId: string;
  badge?: string;
  active: boolean;
  images: string[];
  highlights: string[];
  weights: string[];
  sku: string;
  description: string;
}

interface Category {
  _id: string;
  id: string;
  name: string;
  slug: string;
}

export default function AdminProductsPage() {
  const [products,         setProducts]         = useState<Product[]>([]);
  const [categories,       setCategories]       = useState<Category[]>([]);
  const [loading,          setLoading]          = useState(true);
  const [error,            setError]            = useState("");
  const [showModal,        setShowModal]        = useState(false);
  const [editingProduct,   setEditingProduct]   = useState<Product | null>(null);
  const [searchQuery,      setSearchQuery]      = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [deletingId,       setDeletingId]       = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed to load");
      setProducts(await res.json());
    } catch {
      setError("Could not load products. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) setCategories(await res.json());
    } catch {}
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveProduct = () => {
    fetchProducts();
    setShowModal(false);
    setEditingProduct(null);
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.nameTa ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const catName = p.category?.name ?? "";
    const matchesCat = selectedCategory === "all" || catName === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1e3d18]">Products</h2>
          <p className="text-sm text-[#7a9e6a] mt-0.5">
            {loading ? "Loading…" : `${products.length} products in store`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 px-3 py-2 border border-[#dce8d4] bg-white rounded-xl text-[#3d6b35] hover:bg-[#f0f4ed] transition-colors text-sm font-semibold"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => { setEditingProduct(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-[#3d6b35] hover:bg-[#2d5228] text-white rounded-xl font-semibold text-sm transition-colors"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ab890]" />
          <input
            type="text"
            placeholder="Search by name, Tamil name, or SKU…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-[#7a9e6a]" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id ?? cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
          <AlertCircle size={16} className="shrink-0" />
          {error}
          <button onClick={fetchProducts} className="ml-auto underline font-semibold">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#dce8d4] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw size={24} className="animate-spin text-[#3d6b35] mx-auto mb-3" />
            <p className="text-[#7a9e6a] text-sm">Loading products…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle size={32} className="text-[#b0c8a0] mx-auto mb-3" />
            <p className="text-[#7a9e6a] font-semibold">No products found</p>
            <p className="text-sm text-[#9ab890] mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f0f4ed] border-b border-[#dce8d4]">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#5a8a50] uppercase tracking-wider">Product</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#5a8a50] uppercase tracking-wider">Category</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#5a8a50] uppercase tracking-wider">Price</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#5a8a50] uppercase tracking-wider">Stock</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#5a8a50] uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-[#5a8a50] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4ed]">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-[#fafcf8] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-[#e8e0d0] shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          {product.nameTa && (
                            <p className="text-xs text-[#5a8a50] font-semibold truncate">{product.nameTa}</p>
                          )}
                          <p className="text-sm font-bold text-[#1e3d18] truncate max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-[#9ab890] font-mono">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#5a8a50]">
                      {product.category?.name ?? <span className="text-[#c0392b] text-xs">Uncategorized</span>}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-[#1e3d18]">₹{product.price.toLocaleString("en-IN")}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        product.stock > 10
                          ? "bg-green-100 text-green-700"
                          : product.stock > 0
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                      }`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        product.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}>
                        {product.active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={deletingId === product.id}
                          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors disabled:opacity-40"
                          title="Delete product"
                        >
                          {deletingId === product.id
                            ? <RefreshCw size={15} className="animate-spin" />
                            : <Trash2 size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 bg-[#f0f4ed] border-t border-[#dce8d4] text-xs text-[#7a9e6a]">
            Showing {filtered.length} of {products.length} products
          </div>
        )}
      </div>

      {showModal && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => { setShowModal(false); setEditingProduct(null); }}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}