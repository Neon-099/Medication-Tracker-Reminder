import { useMedications } from '../context/MedicationContext'
import { Link } from 'react-router-dom';

const RoundedProgress = () => {
    
    const { getWeeklyAdherence} = useMedications();

    const weeklyAdherence = getWeeklyAdherence();
    
    // Dynamic messaging based on adherence
  const getAdherenceMessage = () => {
    if (weeklyAdherence >= 90) {
      return {
        text: 'Excellent Progress!',
        message: "You're doing great this week!",
        description: 'Keep up the excellent work with your medication schedule. Consistency is key to maintaining your health and achieving your wellness goals.',
        color: 'green'
      };
    } else if (weeklyAdherence >= 70) {
      return {
        text: 'Good Progress!',
        message: "You're on the right track!",
        description: 'You\'re making good progress with your medication schedule. Keep up the consistency to maintain your health goals.',
        color: 'yellow'
      };
    } else {
      return {
        text: 'Let\'s Improve',
        message: 'You can do better!',
        description: 'Try to stay consistent with your medication schedule. Setting reminders can help you stay on track.',
        color: 'amber'
      };
    }
  };

  const adherenceInfo = getAdherenceMessage();

  // Calculate circle progress - using fixed radius for proper calculation
  const radius = 50; // Fixed radius in SVG units
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (weeklyAdherence / 100) * circumference;

  return (
    <section className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-green-100/50 p-6 md:p-8 border border-green-100/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Weekly Adherence</h2>
              <p className="text-sm text-gray-600">Your progress this week</p>
            </div>
            <Link to="/compliance" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center gap-1 group">
              View Details
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-10">
            {/* Progress Ring */}
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex-shrink-0">
              <svg className="transform -rotate-90 w-full h-full drop-shadow-lg" viewBox="0 0 120 120">
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  className="text-gray-100"
                />
                {/* Progress circle */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="url(#gradient)"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={weeklyAdherence >= 90 ? "#10b981" : weeklyAdherence >= 70 ? "#eab308" : "#f59e0b"} />
                    <stop offset="100%" stopColor={weeklyAdherence >= 90 ? "#059669" : weeklyAdherence >= 70 ? "#ca8a04" : "#d97706"} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-bold text-gray-800">{weeklyAdherence}%</span>
                <span className="text-xs text-gray-500 font-medium mt-1">Adherence</span>
              </div>
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                adherenceInfo.color === 'green' ? 'bg-green-50' : 
                adherenceInfo.color === 'yellow' ? 'bg-yellow-50' : 
                'bg-amber-50'
              }`}>
                <svg className={`w-5 h-5 ${
                  adherenceInfo.color === 'green' ? 'text-green-600' : 
                  adherenceInfo.color === 'yellow' ? 'text-yellow-600' : 
                  'text-amber-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {adherenceInfo.color === 'green' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                <p className={`text-base font-semibold ${
                  adherenceInfo.color === 'green' ? 'text-green-700' : 
                  adherenceInfo.color === 'yellow' ? 'text-yellow-700' : 
                  'text-amber-700'
                }`}>
                  {adherenceInfo.text}
                </p>
              </div>
              <p className="text-lg sm:text-xl text-gray-700 mb-3 font-semibold">
                {adherenceInfo.message}
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {adherenceInfo.description}
              </p>
            </div>
          </div>
        </section>
  )
}

export default RoundedProgress;