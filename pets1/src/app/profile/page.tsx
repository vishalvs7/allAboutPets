"use client";

import { useAuth } from "../../lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600">Welcome back, {user.displayName || "Customer"}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Account Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Name</label>
                  <p className="mt-1 text-gray-900">{user.displayName || "Not set"}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-gray-900">{user.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Account Type</label>
                  <p className="mt-1 text-gray-900 capitalize">{user.role}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Member Since</label>
                  <p className="mt-1 text-gray-900">
                    {user.metadata?.creationTime 
                      ? new Date(user.metadata.creationTime).toLocaleDateString()
                      : "Recently"
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* My Bookings */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600">📅</span>
                  </div>
                  <h3 className="text-lg font-semibold">My Bookings</h3>
                </div>
                <p className="text-gray-600 mb-4">View and manage your clinic and trainer appointments</p>
                <button
                  onClick={() => router.push("/bookings")}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  View Bookings
                </button>
              </div>

              {/* My Cart */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600">🛒</span>
                  </div>
                  <h3 className="text-lg font-semibold">Shopping Cart</h3>
                </div>
                <p className="text-gray-600 mb-4">Review items and proceed to checkout</p>
                <button
                  onClick={() => router.push("/cart")}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Go to Cart
                </button>
              </div>

              {/* Find Services */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-green-600">🏥</span>
                  </div>
                  <h3 className="text-lg font-semibold">Find Clinics</h3>
                </div>
                <p className="text-gray-600 mb-4">Book appointments with pet clinics</p>
                <button
                  onClick={() => router.push("/clinic")}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Browse Clinics
                </button>
              </div>

              {/* Find Trainers */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-yellow-600">🐕</span>
                  </div>
                  <h3 className="text-lg font-semibold">Find Trainers</h3>
                </div>
                <p className="text-gray-600 mb-4">Book training sessions for your pets</p>
                <button
                  onClick={() => router.push("/trainer")}
                  className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                >
                  Browse Trainers
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}