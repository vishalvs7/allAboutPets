"use client";

import { useAuth } from "../../../lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TrainerDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // Redirect if not logged in or not a trainer
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login");
      } else if (user.role !== "trainer") {
        if (user.role === "customer") router.push("/profile");
        else if (user.role === "clinic") router.push("/clinic/dashboard");
        else if (user.role === "store") router.push("/store/dashboard");
        else router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "trainer") {
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
              <h1 className="text-2xl font-bold text-gray-900">Trainer Dashboard</h1>
              <p className="text-gray-600">
                Welcome, <span className="font-semibold">{user.displayName || "Trainer"}</span>
              </p>
              <p className="text-sm text-gray-500">User ID: {user.uid}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/trainer")}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                View Public Page
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
          <h2 className="text-lg font-semibold mb-4">✅ Trainer Access Granted!</h2>
          <p className="text-gray-700 mb-6">
            You are viewing the <strong>Trainer Dashboard</strong> with real authentication.
            Your trainer ID: <code className="bg-gray-100 px-2 py-1 rounded">{user.uid}</code>
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">Auth Verified:</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Role:</strong> <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Trainer</span></p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Account Type:</strong> Service Provider</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Training Sessions</h3>
              <p className="text-sm text-gray-600 mb-3">
                Create and manage your training sessions (obedience, agility, etc.)
              </p>
              <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded">
                Setup Later
              </button>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Participant Management</h3>
              <p className="text-sm text-gray-600 mb-3">
                View and manage pet owners who booked your sessions
              </p>
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">
                Setup Later
              </button>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Schedule Calendar</h3>
              <p className="text-sm text-gray-600 mb-3">
                Manage your training schedule and availability
              </p>
              <button className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded">
                Setup Later
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> Future session forms will automatically use your Trainer ID. 
              Customers will book sessions linked to <code>{user.uid}</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}