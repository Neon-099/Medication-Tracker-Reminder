import { useMedications } from '../../context/MedicationContext';
import { Link } from 'react-router-dom';

const Alerts = () => {
  const { getTodayMedications, getMedicationStatus, markAsTaken } = useMedications();
  const medications = getTodayMedications();

  // Generate alerts based on medication status
  const alerts = medications
    .map((medication) => {
      const status = getMedicationStatus(medication);
      const [hours, minutes] = medication.scheduledTime.split(':').map(Number);
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);
      const timeStr = scheduledTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });

      if (status === 'missed') {
        return {
          id: medication.id,
          type: 'warning' as const,
          message: `Missed dose: ${medication.name} at ${timeStr}`,
          action: 'Take now',
          medication,
        };
      } else if (status === 'upcoming') {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const scheduledMinutes = hours * 60 + minutes;
        const minutesUntil = scheduledMinutes - currentMinutes;

        if (minutesUntil > 0 && minutesUntil <= 60) {
          return {
            id: medication.id,
            type: 'info' as const,
            message: `Upcoming: ${medication.name} in ${minutesUntil} minute${minutesUntil !== 1 ? 's' : ''}`,
            action: 'View details',
            medication,
          };
        }
      }
      return null;
    })
    .filter((alert): alert is NonNullable<typeof alert> => alert !== null);

  const handleTakeNow = (medicationId: string) => {
    markAsTaken(medicationId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Alerts & Safety</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {alerts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-md border-2 border-green-200 bg-green-50 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">All Clear!</h2>
            <p className="text-gray-600">You have no active alerts at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`bg-white rounded-xl p-5 shadow-md border-2 ${
                  alert.type === 'warning' 
                    ? 'border-amber-200 bg-amber-50' 
                    : 'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    alert.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                  }`}>
                    {alert.type === 'warning' ? (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium mb-1">{alert.message}</p>
                    {alert.medication.instructions && (
                      <p className="text-sm text-gray-600 mt-1">{alert.medication.instructions}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  {alert.type === 'warning' && (
                    <button
                      onClick={() => handleTakeNow(alert.medication.id)}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
                    >
                      {alert.action}
                    </button>
                  )}
                  <Link
                    to={`/medications/${alert.medication.id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
                  >
                    {alert.type === 'info' ? alert.action : 'View Details'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
      </main>
    </div>
  );
};

export default Alerts;