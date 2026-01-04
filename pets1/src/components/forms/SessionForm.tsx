"use client";

import { useState, FormEvent } from "react";
import { SessionFormSchema, SessionFormData } from "@/lib/types";
import { createTrainingSession, updateTrainingSession } from "@/lib/utils/firestoreQueries";
import { useToast } from "@/components/ui/ToastProvider";

interface SessionFormProps {
  trainerId: string;
  sessionId?: string;
  initialData?: Partial<SessionFormData>;
  onSuccess?: (sessionId: string) => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
}

export default function SessionForm({
  trainerId,
  sessionId,
  initialData,
  onSuccess,
  onCancel,
  mode = "create"
}: SessionFormProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Format date for input
  const formatDateForInput = (date?: string | Date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState<SessionFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    sessionType: initialData?.sessionType || "obedience",
    suitableFor: initialData?.suitableFor || ["dog"],
    skillLevel: initialData?.skillLevel || "beginner",
    duration: initialData?.duration || 60,
    maxParticipants: initialData?.maxParticipants || 10,
    price: initialData?.price || 0,
    sessionDate: initialData?.sessionDate || formatDateForInput(new Date()),
    location: initialData?.location || "",
    isActive: initialData?.isActive ?? true,
  });

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = SessionFormSchema.parse(formData);
      
      let resultId: string;
      
      if (mode === "edit" && sessionId) {
        await updateTrainingSession(sessionId, validatedData);
        resultId = sessionId;
        showToast("success", "Success", "Session updated successfully");
      } else {
        resultId = await createTrainingSession(trainerId, validatedData);
        showToast("success", "Success", "Session created successfully");
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
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Session Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          placeholder="e.g., Puppy Obedience Class"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          placeholder="Describe what pets will learn..."
          required
        />
      </div>

      {/* Session Type & Suitable For */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Session Type *
          </label>
          <select
            name="sessionType"
            value={formData.sessionType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          >
            <option value="obedience">Obedience Training</option>
            <option value="agility">Agility Training</option>
            <option value="behavior">Behavior Correction</option>
            <option value="puppy">Puppy Training</option>
            <option value="service_dog">Service Dog Training</option>
            <option value="therapy_dog">Therapy Dog Training</option>
            <option value="socialization">Socialization Class</option>
            <option value="advanced">Advanced Training</option>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            size={2}
            required
          >
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Skill Level, Duration & Max Participants */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skill Level
          </label>
          <select
            name="skillLevel"
            value={formData.skillLevel}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="all">All Levels</option>
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
            min="30"
            max="180"
            step="15"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Participants *
          </label>
          <input
            type="number"
            name="maxParticipants"
            value={formData.maxParticipants}
            onChange={handleChange}
            min="1"
            max="20"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
      </div>

      {/* Price, Date & Location */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Session Date & Time *
          </label>
          <input
            type="datetime-local"
            name="sessionDate"
            value={formData.sessionDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., Main Training Hall"
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
          className="h-4 w-4 text-green-600 rounded focus:ring-green-500 border-gray-300"
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
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Processing...
            </span>
          ) : mode === "edit" ? (
            "Update Session"
          ) : (
            "Create Session"
          )}
        </button>
      </div>
    </form>
  );
}