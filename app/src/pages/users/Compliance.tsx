import { useMedications } from '../../context/MedicationContext';

const Compliance = () => {
  const { getWeeklyAdherence, getMonthlyAdherence, getDailyAdherenceData } = useMedications();
  
  const weeklyAdherence = getWeeklyAdherence();
  const monthlyAdherence = getMonthlyAdherence();
  const weeklyData = getDailyAdherenceData(7);
  const monthlyData = getDailyAdherenceData(30);

  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 90) return 'text-green-600';
    if (adherence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAdherenceBgColor = (adherence: number) => {
    if (adherence >= 90) return 'bg-green-500';
    if (adherence >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getAdherenceMessage = (adherence: number) => {
    if (adherence >= 90) return 'Excellent! Keep up the great work.';
    if (adherence >= 70) return 'Good progress! You\'re doing well.';
    return 'Let\'s work on improving your adherence.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Compliance & Progress</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-8">
          {/* Weekly Adherence Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Adherence</h2>
            <div className="space-y-6">
              {/* Overall Weekly Percentage */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div>
                  <p className="text-sm text-gray-600 mb-1">This Week</p>
                  <p className={`text-3xl font-bold ${getAdherenceColor(weeklyAdherence)}`}>
                    {weeklyAdherence}%
                  </p>
                </div>
                <div className="relative w-24 h-24">
                  <svg className="transform -rotate-90 w-full h-full">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="42%"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="42%"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - weeklyAdherence / 100)}`}
                      className={getAdherenceColor(weeklyAdherence)}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Daily Breakdown Chart */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Daily Breakdown (Last 7 Days)</h3>
                <div className="space-y-3">
                  {weeklyData.map((day, index) => {
                    const date = new Date(day.date);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const dayNum = date.getDate();
                    
                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-20 text-sm text-gray-600 font-medium">
                          {dayName} {dayNum}
                        </div>
                        <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                          <div
                            className={`h-full ${getAdherenceBgColor(day.adherence)} transition-all duration-500 rounded-full flex items-center justify-end pr-2`}
                            style={{ width: `${day.adherence}%` }}
                          >
                            {day.adherence > 15 && (
                              <span className="text-xs font-semibold text-white">
                                {day.adherence}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-16 text-xs text-gray-500 text-right">
                          {day.taken}/{day.total}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Overview Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Overview</h2>
            <div className="space-y-6">
              {/* Overall Monthly Percentage */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div>
                  <p className="text-sm text-gray-600 mb-1">This Month</p>
                  <p className={`text-3xl font-bold ${getAdherenceColor(monthlyAdherence)}`}>
                    {monthlyAdherence}%
                  </p>
                </div>
                <div className="relative w-24 h-24">
                  <svg className="transform -rotate-90 w-full h-full">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="42%"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="42%"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - monthlyAdherence / 100)}`}
                      className={getAdherenceColor(monthlyAdherence)}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Monthly Trend Chart */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">30-Day Trend</h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-end justify-between gap-1 h-48">
                    {monthlyData.map((day, index) => {
                      const maxHeight = 100;
                      const height = (day.adherence / 100) * maxHeight;
                      
                      return (
                        <div
                          key={index}
                          className="flex-1 flex flex-col items-center gap-1 group"
                        >
                          <div
                            className={`w-full ${getAdherenceBgColor(day.adherence)} rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer relative`}
                            style={{ height: `${height}%` }}
                            title={`${day.adherence}% - ${day.taken}/${day.total}`}
                          >
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              {day.adherence}%
                            </div>
                          </div>
                          {index % 5 === 0 && (
                            <span className="text-xs text-gray-500 transform -rotate-45 origin-top-left whitespace-nowrap">
                              {new Date(day.date).getDate()}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Encouragement Message */}
          <div className={`rounded-xl p-4 border ${
            weeklyAdherence >= 90 
              ? 'bg-green-50 border-green-200' 
              : weeklyAdherence >= 70 
              ? 'bg-yellow-50 border-yellow-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <p className={`font-medium ${
              weeklyAdherence >= 90 
                ? 'text-green-800' 
                : weeklyAdherence >= 70 
                ? 'text-yellow-800' 
                : 'text-red-800'
            }`}>
              {getAdherenceMessage(weeklyAdherence)}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Compliance;