const Alerts = () => {
  const alerts = [
    { id: '1', type: 'warning', message: 'Missed dose: Atorvastatin at 7:00 AM', action: 'Take now' },
    { id: '2', type: 'info', message: 'Upcoming: Metformin in 30 minutes', action: 'Set reminder' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Alerts & Safety</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-xl p-5 shadow-md border-2 ${
                alert.type === 'warning' ? 'border-amber-200 bg-amber-50' : 'border-blue-200 bg-blue-50'
              }`}
            >
              <p className="text-gray-800 mb-3">{alert.message}</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors">
                {alert.action}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Alerts;