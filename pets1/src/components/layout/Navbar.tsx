"use client";

import { useAuth } from "../../lib/context/AuthContext";
import Link from "next/link";

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              🐾 Pet Platform
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/store" className="text-gray-500 hover:text-gray-700">
                Store
              </Link>
              <Link href="/clinic" className="text-gray-500 hover:text-gray-700">
                Clinics
              </Link>
              <Link href="/trainer" className="text-gray-500 hover:text-gray-700">
                Trainers
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  Hi, {user.displayName || user.email}
                </span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
                  {user.role}
                </span>
                <button
                  onClick={() => {
                    if (user.role === 'customer') {
                      window.location.href = '/profile';
                    } else {
                      window.location.href = `/${user.role}/dashboard`;
                    }
                  }}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}