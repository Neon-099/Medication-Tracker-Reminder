import { useParams, Link } from 'react-router-dom';
import { useMedications } from '../../context/MedicationContext';

const MedicationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getMedication, getTodayLogs, getMedicationStatus } = useMedications();
  
  const medication = id ? getMedication(id) : null;
  const todayLogs = medication ? getTodayLogs(medication.id) : [];
  const status = medication ? getMedicationStatus(medication) : null;

  if (!medication) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4 text-lg">Medication not found</p>
          <Link to="/medications" className="text-indigo-600 hover:text-indigo-700 font-semibold">
            ← Back to Medications
          </Link>
        </div>
      </div>
    );
  }

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: 'taken' | 'upcoming' | 'missed') => {
    const styles = {
      taken: 'bg-green-100 text-green-700',
      upcoming: 'bg-blue-100 text-blue-700',
      missed: 'bg-amber-100 text-amber-700',
    };

    return (
      <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${styles[status]}`}>
        {status}
      </span>
    );
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      <header className="bg-white/80 backdrop-blur-lg shadow-md border-b border-indigo-100/50 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Link
              to="/medications"
              className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
            <Link
              to={`/medications/${id}/edit`}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 px-5 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Edit
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 border border-indigo-100/50">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{medication.name}</h1>
              <p className="text-xl text-gray-600 mb-3">{medication.dosage}</p>
              <div className="flex items-center gap-3 flex-wrap">
                {status && getStatusBadge(status)}
                {getRiskLevelBadge(medication.riskLevel)}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Schedule</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-gray-700">Time</span>
                  </div>
                  <span className="font-semibold text-gray-800">{formatTime(medication.scheduledTime)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="font-medium text-gray-700">Frequency</span>
                  </div>
                  <span className="font-semibold text-gray-800 capitalize">{medication.frequency} per day</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Dates</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium text-gray-700">Start Date</span>
                  </div>
                  <span className="font-semibold text-gray-800">{formatDate(medication.startDate)}</span>
                </div>
                {medication.endDate && (
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium text-gray-700">End Date</span>
                    </div>
                    <span className="font-semibold text-gray-800">{formatDate(medication.endDate)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {medication.instructions && (
            <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Instructions</h3>
              <p className="text-gray-700">{medication.instructions}</p>
            </div>
          )}

          {/* Today's Logs */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Today's Activity</h3>
            {todayLogs.length > 0 ? (
              <div className="space-y-2">
                {todayLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium text-gray-700">Taken at</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {new Date(log.takenAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-xl text-center text-gray-500">
                No activity recorded for today
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MedicationDetails;