import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  scheduledTime: string;
  status: 'taken' | 'upcoming' | 'missed';
  riskLevel: 'low' | 'medium' | 'high';
}

const Home = () => {
  const [medications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Lisinopril',
      dosage: '10mg',
      scheduledTime: '8:00 AM',
      status: 'taken',
      riskLevel: 'medium',
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500mg',
      scheduledTime: '9:00 AM',
      status: 'upcoming',
      riskLevel: 'low',
    },
    {
      id: '3',
      name: 'Atorvastatin',
      dosage: '20mg',
      scheduledTime: '7:00 AM',
      status: 'missed',
      riskLevel: 'high',
    },
  ]);

  const weeklyAdherence = 87;
  const today = new Date();
  const upcomingCount = medications.filter(m => m.status === 'upcoming').length;
  const missedCount = medications.filter(m => m.status === 'missed').length;

  const getStatusIcon = (status: Medication['status']) => {
    switch (status) {
      case 'taken':
        return (
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'upcoming':
        return (
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'missed':
        return (
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
    }
  };

  const getStatusText = (status: Medication['status']) => {
    switch (status) {
      case 'taken':
        return 'Taken';
      case 'upcoming':
        return 'Upcoming';
      case 'missed':
        return 'Missed';
    }
  };

  const getRiskLevelBadge = (riskLevel: Medication['riskLevel']) => {
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

  const upcomingMedications = medications.filter(med => med.status === 'upcoming');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-700">MedTrack+</h1>
              <p className="text-sm text-gray-600 mt-1">Your medication, safely on track</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-800">
                {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-sm text-gray-500">{today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Quick Status Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100 text-center">
            <p className="text-2xl font-bold text-blue-600">{upcomingCount}</p>
            <p className="text-sm text-gray-600 mt-1">Upcoming</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-green-100 text-center">
            <p className="text-2xl font-bold text-green-600">
              {medications.filter(m => m.status === 'taken').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Taken</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-amber-100 text-center">
            <p className="text-2xl font-bold text-amber-600">{missedCount}</p>
            <p className="text-sm text-gray-600 mt-1">Missed</p>
          </div>
        </div>

        {/* Today's Medication Status - Primary Focus */}
        <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">What do I need to take today?</h2>
            {upcomingCount > 0 && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {upcomingCount} remaining
              </span>
            )}
          </div>
          
          {medications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No medications scheduled for today.</p>
              <Link to="/medications/add" className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
                Add Medication
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {medications.map((medication) => (
                  <div
                    key={medication.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      medication.status === 'taken'
                        ? 'border-green-200 bg-green-50'
                        : medication.status === 'upcoming'
                        ? 'border-blue-200 bg-blue-50 hover:border-blue-300'
                        : 'border-amber-200 bg-amber-50'
                    }`}
                  >
                    {getStatusIcon(medication.status)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800">{medication.name}</h3>
                        <span className={`text-sm font-medium whitespace-nowrap ${
                          medication.status === 'taken' ? 'text-green-600' :
                          medication.status === 'upcoming' ? 'text-blue-600' :
                          'text-amber-600'
                        }`}>
                          {getStatusText(medication.status)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-600 flex-wrap">
                        <span className="text-sm md:text-base font-medium">{medication.dosage}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm md:text-base">{medication.scheduledTime}</span>
                        <span className="text-gray-400">•</span>
                        {getRiskLevelBadge(medication.riskLevel)}
                      </div>
                    </div>

                    {medication.status === 'upcoming' && (
                      <Link
                        to={`/medications/${medication.id}`}
                        className="text-blue-600 hover:text-blue-700"
                        aria-label="View details"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Primary Action Buttons */}
              {upcomingMedications.length > 0 && (
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl text-base md:text-lg transition-colors shadow-md hover:shadow-lg active:scale-95">
                    Mark as Taken
                  </button>
                  <Link
                    to="/medications"
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-4 px-6 rounded-xl text-base md:text-lg transition-colors text-center"
                  >
                    View All Medications
                  </Link>
                </div>
              )}
            </>
          )}
        </section>

        {/* Adherence Summary Section */}
        <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-green-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Weekly Adherence</h2>
            <Link to="/compliance" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View Details →
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            {/* Progress Ring */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0">
              <svg className="transform -rotate-90 w-full h-full">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - weeklyAdherence / 100)}`}
                  className="text-green-500 transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-gray-800">{weeklyAdherence}%</span>
              </div>
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <p className="text-lg sm:text-xl text-gray-700 mb-2 font-medium">
                You're doing great this week!
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                Keep up the excellent work with your medication schedule. Consistency is key to maintaining your health.
              </p>
            </div>
          </div>
        </section>

        {/* Safety & Trust Section */}
        <section className="bg-blue-50 rounded-2xl shadow-md p-5 md:p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">Your Data is Secure</h3>
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                All your medication information is stored securely and encrypted. This app is designed to help you track your medications and does not replace professional medical advice. Always consult with your healthcare provider about your treatment plan.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;