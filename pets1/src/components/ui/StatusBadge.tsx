import React from "react";

type StatusType = 
  | "pending" | "confirmed" | "completed" | "cancelled" | "no_show"
  | "processing" | "shipped" | "delivered" | "refunded"
  | "active" | "inactive";

interface StatusBadgeProps {
  status: StatusType;
  size?: "sm" | "md" | "lg";
}

const statusConfig: Record<StatusType, { label: string; color: string; bgColor: string }> = {
  // Appointment Statuses
  pending: { label: "Pending", color: "text-yellow-800", bgColor: "bg-yellow-100" },
  confirmed: { label: "Confirmed", color: "text-blue-800", bgColor: "bg-blue-100" },
  completed: { label: "Completed", color: "text-green-800", bgColor: "bg-green-100" },
  cancelled: { label: "Cancelled", color: "text-red-800", bgColor: "bg-red-100" },
  no_show: { label: "No Show", color: "text-gray-800", bgColor: "bg-gray-100" },
  
  // Order Statuses
  processing: { label: "Processing", color: "text-purple-800", bgColor: "bg-purple-100" },
  shipped: { label: "Shipped", color: "text-indigo-800", bgColor: "bg-indigo-100" },
  delivered: { label: "Delivered", color: "text-emerald-800", bgColor: "bg-emerald-100" },
  refunded: { label: "Refunded", color: "text-pink-800", bgColor: "bg-pink-100" },
  
  // General Statuses
  active: { label: "Active", color: "text-green-800", bgColor: "bg-green-100" },
  inactive: { label: "Inactive", color: "text-gray-800", bgColor: "bg-gray-100" },
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
};

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.inactive;
  
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${config.bgColor} ${config.color}`}
    >
      {config.label}
    </span>
  );
}