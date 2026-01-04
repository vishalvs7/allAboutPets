"use client";

import { useState, FormEvent } from "react";
import { ServiceFormSchema, ServiceFormData } from "@/lib/types";
import { createClinicService, updateClinicService } from "@/lib/utils/firestoreQueries";
import { useToast } from "@/components/ui/ToastProvider";

interface ServiceFormProps {
  clinicId: string;
  serviceId?: string;
  initialData?: Partial<ServiceFormData>;
  onSuccess?: (serviceId: string) => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
}

export default function ServiceForm({
  clinicId,
  serviceId,
  initialData,
  onSuccess,
  onCancel,
  mode = "create"
}: ServiceFormProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    serviceType: initialData?.serviceType || "vaccination",
    suitableFor: initialData?.suitableFor || ["dog"],
    ageRange: initialData?.ageRange || "adult",
    duration: initialData?.duration || 30,
    price: initialData?.price || 0,
    isActive: initialData?.isActive ?? true,
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === "suitableFor") {
      const select = e.target as HTMLSelectElement;
      const selected = Array.from(select.selectedOptions, option => option.value);
      setFormData(prev => ({ ...prev, [name]: selected }));
    } else if (type === "number") {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate with Zod
      const validatedData = ServiceFormSchema.parse(formData);
      
      let resultId: string;
      
      if (mode === "edit" && serviceId) {
        // Update existing service
        await updateClinicService(serviceId, validatedData);
        resultId = serviceId;
        showToast("success", "Success", "Service updated successfully");
      } else {
        // Create new service
        resultId = await createClinicService(clinicId, validatedData);
        showToast("success", "Success", "Service created successfully");
      }

      // Call success callback
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
      {/* Service Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Rabies Vaccination"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe the service..."
          required
        />
      </div>

      {/* Service Type & Suitable For */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Type *
          </label>
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="vaccination">Vaccination</option>
            <option value="checkup">Checkup</option>
            <option value="surgery">Surgery</option>
            <option value="dental">Dental</option>
            <option value="grooming">Grooming</option>
            <option value="emergency">Emergency</option>
            <option value="diagnostic">Diagnostic</option>
            <option value="wellness">Wellness</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Suitable For *
          </label>
          <select
            name="suitableFor"
            value={formData.suitableFor}
            onChange={handleChange}
            multiple
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            size={3}
            required
          >
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="bird">Bird</option>
            <option value="small_animal">Small Animal</option>
            <option value="reptile">Reptile</option>
            <option value="all">All Pets</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
        </div>
      </div>

      {/* Age Range, Duration & Price */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age Range
          </label>
          <select
            name="ageRange"
            value={formData.ageRange}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="puppy/kitten">Puppy/Kitten</option>
            <option value="adult">Adult</option>
            <option value="senior">Senior</option>
            <option value="all">All Ages</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (minutes) *
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="15"
            max="240"
            step="5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      {/* Active Status */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
        />
        <label className="ml-2 text-sm text-gray-700">
          Active (available for booking)
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
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Processing...
            </span>
          ) : mode === "edit" ? (
            "Update Service"
          ) : (
            "Create Service"
          )}
        </button>
      </div>
    </form>
  );
}