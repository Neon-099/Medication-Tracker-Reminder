import { Link } from 'react-router-dom';

const MedicationList = () => {
  const medications = [
    { id: '1', name: 'Lisinopril', dosage: '10mg', riskLevel: 'medium', status: 'active' },
    { id: '2', name: 'Metformin', dosage: '500mg', riskLevel: 'low', status: 'active' },
    { id: '3', name: 'Atorvastatin', dosage: '20mg', riskLevel: 'high', status: 'active' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">All Medications</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <Link
          to="/medications/add"
          className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl text-center mb-6 transition-colors shadow-md"
        >
          + Add Medication
        </Link>

        <div className="space-y-4">
          {medications.map((med) => (
            <Link
              key={med.id}
              to={`/medications/${med.id}`}
              className="block bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:border-blue-200 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{med.name}</h3>
                  <p className="text-gray-600 mt-1">{med.dosage}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {med.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MedicationList;