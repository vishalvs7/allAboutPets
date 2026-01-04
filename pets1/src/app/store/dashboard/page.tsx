"use client";

import { useAuth } from "../../../lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StoreDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // Redirect if not logged in or not a store
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login");
      } else if (user.role !== "store") {
        if (user.role === "customer") router.push("/profile");
        else if (user.role === "clinic") router.push("/clinic/dashboard");
        else if (user.role === "trainer") router.push("/trainer/dashboard");
        else router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "store") {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Store Dashboard</h1>
              <p className="text-gray-600">
                Welcome, <span className="font-semibold">{user.displayName || "Store Owner"}</span>
              </p>
              <p className="text-sm text-gray-500">Store ID: {user.uid}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/store")}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                View Public Store
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">🏪 Store Dashboard Active</h2>
          <p className="text-gray-700 mb-6">
            You are authenticated as a <strong>Store Owner</strong>. 
            Your store ID: <code className="bg-gray-100 px-2 py-1 rounded">{user.uid}</code>
          </p>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-purple-800 mb-2">Store Account Details:</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Business:</strong> {user.displayName || "Your Store"}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Store Owner</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Product Management</h3>
              <p className="text-sm text-gray-600 mb-3">
                Add and manage pet products (food, toys, accessories)
              </p>
              <button className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded">
                Coming Soon
              </button>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Order Management</h3>
              <p className="text-sm text-gray-600 mb-3">
                View and process customer orders
              </p>
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">
                Coming Soon
              </button>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Inventory Tracking</h3>
              <p className="text-sm text-gray-600 mb-3">
                Monitor stock levels and manage inventory
              </p>
              <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded">
                Coming Soon
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold mb-3">How Products Will Work:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Products you add will be linked to Store ID: <code className="bg-gray-100 px-1">{user.uid}</code></li>
              <li>Public store page will show products from your store only</li>
              <li>Orders will be automatically assigned to your store</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}