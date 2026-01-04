"use client";

import { useAuth } from "../../../lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClinicDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // Redirect if not logged in or not a clinic
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login");
      } else if (user.role !== "clinic") {
        // Redirect based on role
        if (user.role === "customer") router.push("/profile");
        else if (user.role === "trainer") router.push("/trainer/dashboard");
        else if (user.role === "store") router.push("/store/dashboard");
        else router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "clinic") {
    return null; // Will redirect
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
              <h1 className="text-2xl font-bold text-gray-900">Clinic Dashboard</h1>
              <p className="text-gray-600">
                Welcome, <span className="font-semibold">{user.displayName || "Clinic"}</span>
              </p>
              <p className="text-sm text-gray-500">User ID: {user.uid}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/clinic")}
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
          <h2 className="text-lg font-semibold mb-4">🎉 Authentication Success!</h2>
          <p className="text-gray-700 mb-6">
            You have successfully accessed the <strong>Clinic Dashboard</strong>.
            Your user ID is being used instead of mock IDs.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Auth Information:</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> <span className="capitalize">{user.role}</span></p>
              <p><strong>User ID:</strong> {user.uid}</p>
              <p><strong>Display Name:</strong> {user.displayName || "Not set"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Manage Services</h3>
              <p className="text-sm text-gray-600 mb-3">
                Create and edit your clinic services (vaccinations, grooming, etc.)
              </p>
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">
                Coming Soon
              </button>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">View Appointments</h3>
              <p className="text-sm text-gray-600 mb-3">
                See upcoming appointments booked by customers
              </p>
              <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded">
                Coming Soon
              </button>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Dashboard Settings</h3>
              <p className="text-sm text-gray-600 mb-3">
                Configure your clinic profile and preferences
              </p>
              <button className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded">
                Coming Soon
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold mb-3">Next Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Service forms will use your User ID: <code className="bg-gray-100 px-1">{user.uid}</code></li>
              <li>Appointments will be linked to your clinic ID automatically</li>
              <li>Public page at <code>/clinic</code> will show your services</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}