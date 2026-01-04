"use client";

import { useState } from "react";
import { useAuth } from "../../../lib/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ProviderType = "clinic" | "trainer" | "store";

export default function JoinAsServicePage() {
  const [providerType, setProviderType] = useState<ProviderType | "">("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signupAsProvider, user } = useAuth();
  const router = useRouter();

  // If user is already logged in, redirect
  if (user) {
    router.push(user.role === "customer" ? "/profile" : "/");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!providerType) {
      setError("Please select a service type");
      return;
    }

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const providerData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        isActive: true,
      };

      await signupAsProvider(
        formData.email,
        formData.password,
        formData.name,
        providerType,
        providerData
      );
      // Will redirect automatically
    } catch (err: any) {
      setError(err.message || "Failed to create provider account");
      setLoading(false);
    }
  };

  const getProviderLabel = (type: ProviderType) => {
    switch (type) {
      case "clinic": return "Pet Clinic";
      case "trainer": return "Pet Trainer";
      case "store": return "Pet Store";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Join as Service Provider
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Choose your service type and register
        </p>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {/* Service Type Selection */}
        {!providerType ? (
          <div className="space-y-4">
            <button
              onClick={() => setProviderType("clinic")}
              className="w-full p-6 bg-white border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🏥</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Pet Clinic</h3>
                  <p className="text-sm text-gray-600">Offer veterinary services</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setProviderType("trainer")}
              className="w-full p-6 bg-white border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🐕</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Pet Trainer</h3>
                  <p className="text-sm text-gray-600">Offer training sessions</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setProviderType("store")}
              className="w-full p-6 bg-white border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🛒</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Pet Store</h3>
                  <p className="text-sm text-gray-600">Sell pet products</p>
                </div>
              </div>
            </button>
            
            <div className="text-center pt-4">
              <Link href="/auth/signup" className="text-blue-600 hover:text-blue-800">
                ← Sign up as customer instead
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <button
              onClick={() => setProviderType("")}
              className="text-blue-600 hover:text-blue-800 mb-4 text-sm"
            >
              ← Choose different service
            </button>
            
            <h2 className="text-xl font-bold mb-6">
              Register as {getProviderLabel(providerType)}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your business name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="contact@yourbusiness.com"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="At least 6 characters"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main St, City, State"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Registering..." : `Register as ${getProviderLabel(providerType)}`}
              </button>
            </form>
          </div>
        )}
        
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}