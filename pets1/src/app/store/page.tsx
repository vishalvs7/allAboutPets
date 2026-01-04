export default function StorePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Pet Store</h1>
        <p className="text-gray-600 mb-8">
          Shop for pet food, toys, accessories, and supplies.
        </p>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-700">
            Store products will appear here. Store owners manage their inventory in their dashboard.
          </p>
          <div className="mt-4">
            <a 
              href="/auth/joinasservice" 
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Are you a store? Join as service provider →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}