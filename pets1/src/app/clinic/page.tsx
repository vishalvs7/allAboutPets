export default function ClinicPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Pet Clinics</h1>
        <p className="text-gray-600 mb-8">
          Browse veterinary clinics and book appointments for your pets.
          (This will show clinic services from providers)
        </p>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-700">
            Clinic listings will appear here. Each clinic can manage their services in their dashboard.
          </p>
          <div className="mt-4">
            <a 
              href="/auth/joinasservice" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Are you a clinic? Join as service provider →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}