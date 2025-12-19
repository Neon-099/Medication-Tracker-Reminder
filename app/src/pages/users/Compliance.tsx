const Compliance = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Compliance & Progress</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Adherence</h2>
            <p className="text-gray-600">Chart will go here</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Overview</h2>
            <p className="text-gray-600">Chart will go here</p>
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-green-800 font-medium">Great job! Keep up the excellent work.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Compliance;