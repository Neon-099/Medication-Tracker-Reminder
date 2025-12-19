import { useParams, Link } from 'react-router-dom';

const MedicationDetails = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Medication Details</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lisinopril</h2>
            <p className="text-gray-600">10mg</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Today's Schedule</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span>8:00 AM</span>
                <span className="text-green-600 font-medium">Taken</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Compliance History</h3>
            <p className="text-gray-600">Chart or history will go here</p>
          </div>

          <Link
            to={`/medications/${id}/edit`}
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl text-center transition-colors"
          >
            Edit Medication
          </Link>
        </div>
      </main>
    </div>
  );
};

export default MedicationDetails;