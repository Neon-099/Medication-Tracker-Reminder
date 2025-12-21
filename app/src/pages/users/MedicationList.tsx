import { Link } from 'react-router-dom';
import { useMedications } from '../../context/MedicationContext';

const MedicationList = () => {
  const { medications } = useMedications();

  const getRiskLevelBadge = (riskLevel: 'low' | 'medium' | 'high') => {
    const styles = {
      low: 'bg-green-50 text-green-700 border-green-200',
      medium: 'bg-amber-50 text-amber-700 border-amber-200',
      high: 'bg-orange-50 text-orange-700 border-orange-200',
    };

    const labels = {
      low: 'Low Risk',
      medium: 'Medium Risk',
      high: 'High Risk',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[riskLevel]}`}>
        {labels[riskLevel]}
      </span>
    );
  };

  const getStatusBadge = (status: 'active' | 'completed' | 'paused') => {
    const styles = {
      active: 'bg-blue-100 text-blue-700',
      paused: 'bg-gray-100 text-gray-700',
      completed: 'bg-green-100 text-green-700',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      <header className="bg-white/80 backdrop-blur-lg shadow-md border-b border-indigo-100/50 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              All Medications
            </h1>
            <Link
              to="/medications/add"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Medication
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {medications.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium mb-4">No medications added yet.</p>
            <Link
              to="/medications/add"
              className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Add Your First Medication
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {medications.map((med) => (
              <Link
                key={med.id}
                to={`/medications/${med.id}`}
                className="block bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-100/50 hover:border-indigo-200 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{med.name}</h3>
                      {getStatusBadge(med.status)}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="text-gray-600 font-medium">{med.dosage}</p>
                      <span className="text-gray-300">•</span>
                      <p className="text-gray-600">{med.scheduledTime}</p>
                      <span className="text-gray-300">•</span>
                      {getRiskLevelBadge(med.riskLevel)}
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MedicationList;