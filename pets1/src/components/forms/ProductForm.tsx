"use client";

import { useState, FormEvent } from "react";
import { ProductFormSchema, ProductFormData } from "@/lib/types";
import { createStoreProduct, updateStoreProduct } from "@/lib/utils/firestoreQueries";
import { useToast } from "@/components/ui/ToastProvider";

interface ProductFormProps {
  sellerId: string;
  productId?: string;
  initialData?: Partial<ProductFormData>;
  onSuccess?: (productId: string) => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
}

export default function ProductForm({
  sellerId,
  productId,
  initialData,
  onSuccess,
  onCancel,
  mode = "create"
}: ProductFormProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    category: initialData?.category || "food",
    forPetType: initialData?.forPetType || ["dog"],
    petSize: initialData?.petSize || "all",
    lifeStage: initialData?.lifeStage || "all",
    stockQuantity: initialData?.stockQuantity || 0,
    imageUrls: initialData?.imageUrls || "",
    isActive: initialData?.isActive ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === "forPetType") {
      const select = e.target as HTMLSelectElement;
      const selected = Array.from(select.selectedOptions, option => option.value);
      setFormData(prev => ({ ...prev, [name]: selected }));
    } else if (type === "number") {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = ProductFormSchema.parse(formData);
      
      let resultId: string;
      
      if (mode === "edit" && productId) {
        await updateStoreProduct(productId, validatedData);
        resultId = productId;
        showToast("success", "Success", "Product updated successfully");
      } else {
        resultId = await createStoreProduct(sellerId, validatedData);
        showToast("success", "Success", "Product created successfully");
      }

      if (onSuccess) {
        onSuccess(resultId);
      }

    } catch (error: any) {
      console.error("Form submission error:", error);
      showToast("error", "Error", error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          placeholder="e.g., Premium Dog Food"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          placeholder="Describe the product features..."
          required
        />
      </div>

      {/* Category & For Pet Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            required
          >
            <option value="food">Food</option>
            <option value="treats">Treats</option>
            <option value="toys">Toys</option>
            <option value="accessories">Accessories</option>
            <option value="health">Health</option>
            <option value="grooming">Grooming</option>
            <option value="bedding">Bedding</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            For Pet Type *
          </label>
          <select
            name="forPetType"
            value={formData.forPetType}
            onChange={handleChange}
            multiple
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            size={3}
            required
          >
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="bird">Bird</option>
            <option value="small_animal">Small Animal</option>
            <option value="fish">Fish</option>
            <option value="reptile">Reptile</option>
            <option value="all">All Pets</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
        </div>
      </div>

      {/* Pet Size, Life Stage & Stock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pet Size
          </label>
          <select
            name="petSize"
            value={formData.petSize}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="xs">Extra Small</option>
            <option value="s">Small</option>
            <option value="m">Medium</option>
            <option value="l">Large</option>
            <option value="xl">Extra Large</option>
            <option value="all">All Sizes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Life Stage
          </label>
          <select
            name="lifeStage"
            value={formData.lifeStage}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="puppy/kitten">Puppy/Kitten</option>
            <option value="adult">Adult</option>
            <option value="senior">Senior</option>
            <option value="all">All Stages</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock Quantity *
          </label>
          <input
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>
      </div>

      {/* Price & Image URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price ($) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URLs (comma separated)
          </label>
          <input
            type="text"
            name="imageUrls"
            value={formData.imageUrls}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">Enter full URLs separated by commas</p>
        </div>
      </div>

      {/* Active Status */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
        />
        <label className="ml-2 text-sm text-gray-700">
          Active (available for purchase)
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Processing...
            </span>
          ) : mode === "edit" ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </button>
      </div>
    </form>
  );
}