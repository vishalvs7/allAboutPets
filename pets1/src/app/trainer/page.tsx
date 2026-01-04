export default function TrainerPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Pet Trainers</h1>
        <p className="text-gray-600 mb-8">
          Find professional trainers for your pets. Book obedience, agility, and behavior sessions.
        </p>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-700">
            Trainer sessions will appear here. Trainers manage their offerings in their dashboard.
          </p>
          <div className="mt-4">
            <a 
              href="/auth/joinasservice" 
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Are you a trainer? Join as service provider →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}