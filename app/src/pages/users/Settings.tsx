const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Reminder Settings</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Reminder timing</span>
                <input type="time" className="px-3 py-2 border rounded-lg" />
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Accessibility</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Font size</span>
                <select className="px-3 py-2 border rounded-lg">
                  <option>Normal</option>
                  <option>Large</option>
                  <option>Extra Large</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;