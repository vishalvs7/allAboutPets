"use client";

import { useAuth } from "../lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // If user is logged in, show welcome message
  useEffect(() => {
    if (user && !loading) {
      console.log("User logged in:", user.email, "Role:", user.role);
    }
  }, [user, loading]);

  const handleQuickLogin = async (role: string) => {
    // This is for testing only - in production, use real auth
    alert(`In production, this would redirect to /auth/login\nFor testing: Sign up as ${role} first`);
    router.push(`/auth/${role === 'customer' ? 'signup' : 'joinasservice'}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">🐾 Pet SaaS Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/store" 
                className="px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 rounded-md hover:bg-purple-100"
              >
                Store
              </a>
              <a 
                href="/clinic" 
                className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
              >
                Clinics
              </a>
              <a 
                href="/trainer" 
                className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100"
              >
                Trainers
              </a>
              {user ? (
                <button
                  onClick={() => router.push(user.role === 'customer' ? '/profile' : `/${user.role}/dashboard`)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Go to {user.role === 'customer' ? 'Profile' : 'Dashboard'}
                </button>
              ) : (
                <a 
                  href="/auth/login" 
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Login
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            All-in-One Platform for
            <span className="block text-blue-600">Pet Businesses</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Manage your pet clinic, training sessions, and store products in one seamless platform.
            Built for modern pet care businesses.
          </p>
          
          {/* Auth Testing Section */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🔐 Auth Flow Testing</h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : user ? (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Logged In Successfully!</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs capitalize">{user.role}</span></p>
                    <p><strong>User ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-xs">{user.uid}</code></p>
                    <p><strong>Name:</strong> {user.displayName || "Not set"}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => router.push(user.role === 'customer' ? '/profile' : `/${user.role}/dashboard`)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Go to {user.role === 'customer' ? 'Profile' : `${user.role} Dashboard`}
                  </button>
                  <button
                    onClick={() => router.push('/auth/login')}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
                  >
                    Switch Account
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-gray-600">
                  Test the authentication flow by signing up with different roles:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => handleQuickLogin('customer')}
                    className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-100 transition-all"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">👤</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">Customer</h3>
                      <p className="text-sm text-gray-600 mt-1">Pet Owner</p>
                      <p className="text-xs text-blue-600 mt-2">→ Goes to Profile</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickLogin('clinic')}
                    className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-100 transition-all"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">🏥</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">Clinic</h3>
                      <p className="text-sm text-gray-600 mt-1">Veterinary Services</p>
                      <p className="text-xs text-blue-600 mt-2">→ Clinic Dashboard</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickLogin('trainer')}
                    className="p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-100 transition-all"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">🐕</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">Trainer</h3>
                      <p className="text-sm text-gray-600 mt-1">Pet Training</p>
                      <p className="text-xs text-green-600 mt-2">→ Trainer Dashboard</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickLogin('store')}
                    className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-100 transition-all"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">🛒</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">Store</h3>
                      <p className="text-sm text-gray-600 mt-1">Pet Products</p>
                      <p className="text-xs text-purple-600 mt-2">→ Store Dashboard</p>
                    </div>
                  </button>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <a 
                      href="/auth/login" 
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-center"
                    >
                      Existing User? Login
                    </a>
                    <a 
                      href="/auth/signup" 
                      className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium text-center"
                    >
                      Sign Up as Customer
                    </a>
                    <a 
                      href="/auth/joinasservice" 
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-center"
                    >
                      Join as Service Provider
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dashboard Cards */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Clinic Card */}
            <a href="/clinic/dashboard" className="group">
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-blue-100">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                  <span className="text-2xl">🏥</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Clinic Dashboard</h3>
                <p className="text-gray-600 mb-4">
                  Manage veterinary services and appointments (Clinic role only)
                </p>
                <div className="mt-6">
                  <span className="text-blue-600 font-medium group-hover:text-blue-700">
                    Go to Clinic Dashboard →
                  </span>
                </div>
              </div>
            </a>

            {/* Trainer Card */}
            <a href="/trainer/dashboard" className="group">
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-green-100">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                  <span className="text-2xl">🐕</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Trainer Dashboard</h3>
                <p className="text-gray-600 mb-4">
                  Manage training sessions and participants (Trainer role only)
                </p>
                <div className="mt-6">
                  <span className="text-green-600 font-medium group-hover:text-green-700">
                    Go to Trainer Dashboard →
                  </span>
                </div>
              </div>
            </a>

            {/* Store Card */}
            <a href="/store/dashboard" className="group">
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-purple-100">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                  <span className="text-2xl">🛒</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Store Dashboard</h3>
                <p className="text-gray-600 mb-4">
                  Manage products and orders (Store role only)
                </p>
                <div className="mt-6">
                  <span className="text-purple-600 font-medium group-hover:text-purple-700">
                    Go to Store Dashboard →
                  </span>
                </div>
              </div>
            </a>
          </div>

          {/* Testing Instructions */}
          <div className="mt-16 p-6 bg-blue-50 rounded-xl border border-blue-200 max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">🧪 Testing Instructions</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                <p className="text-blue-700">Click any role button above to sign up</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                <p className="text-blue-700">After signup, you'll be redirected to the correct dashboard</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                <p className="text-blue-700">Logout and try another role to test all flows</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                <p className="text-blue-700">Check browser console (F12) for auth debug logs</p>
              </div>
            </div>
          </div>

          {/* Current Auth Status */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg max-w-3xl mx-auto">
            <h4 className="font-medium text-gray-700 mb-2">Current Auth Status:</h4>
            <div className="flex items-center justify-between">
              <div>
                {loading ? (
                  <span className="text-yellow-600">🔄 Checking authentication...</span>
                ) : user ? (
                  <span className="text-green-600">✅ Logged in as {user.email} ({user.role})</span>
                ) : (
                  <span className="text-gray-600">🔒 Not logged in</span>
                )}
              </div>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Refresh Status
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              Pet SaaS Platform • Auth Testing Demo
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="/clinic" className="text-sm text-gray-500 hover:text-gray-700">Clinics</a>
              <a href="/trainer" className="text-sm text-gray-500 hover:text-gray-700">Trainers</a>
              <a href="/store" className="text-sm text-gray-500 hover:text-gray-700">Store</a>
              <a href="/profile" className="text-sm text-gray-500 hover:text-gray-700">Profile</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}