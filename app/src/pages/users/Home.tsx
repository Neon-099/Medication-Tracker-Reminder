import { useState } from 'react';
import { useMedications} from '../../context/MedicationContext';
import { Link } from 'react-router-dom';
import MedicationCard from '../../components/user/MedicationCard';
import RoundedProgress from '../../components/user/RoundedProgress';

const Home = () => {
  const { getWeeklyAdherence ,getTodayMedications, getMedicationStatus } = useMedications();
  const medications = getTodayMedications();
  const [showTaken, setShowTaken] = useState(false);

  const weeklyAdherence = getWeeklyAdherence();
  const today = new Date();
  
  // Separate medications by status
  const upcomingMedications = medications.filter(m => getMedicationStatus(m) === 'upcoming');
  const missedMedications = medications.filter(m => getMedicationStatus(m) === 'missed');
  const takenMedications = medications.filter(m => getMedicationStatus(m) === 'taken');
  
  const upcomingCount = upcomingMedications.length;
  const missedCount = missedMedications.length;
  const takenCount = takenMedications.length;

  // Combine upcoming and missed for display (priority medications)
  const priorityMedications = [...upcomingMedications, ...missedMedications];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-md border-b border-indigo-100/50 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  MedTrack+
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">Your medication, safely on track</p>
              </div>
            </div>
            <div className="text-right bg-gradient-to-br from-indigo-50 to-blue-50 px-4 py-2.5 rounded-xl border border-indigo-100">
              <p className="text-base font-semibold text-gray-800">
                {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-sm text-gray-600 font-medium">{today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Quick Status Summary */}
        <div className="grid grid-cols-3 gap-5">
          <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-blue-100/50 border border-blue-100/50 text-center hover:shadow-xl hover:shadow-blue-200/50 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-1">{upcomingCount}</p>
            <p className="text-sm font-medium text-gray-600">Upcoming</p>
          </div>
          <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-green-100/50 border border-green-100/50 text-center hover:shadow-xl hover:shadow-green-200/50 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-1">{takenCount}</p>
            <p className="text-sm font-medium text-gray-600">Taken</p>
          </div>
          <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-amber-100/50 border border-amber-100/50 text-center hover:shadow-xl hover:shadow-amber-200/50 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-amber-600 mb-1">{missedCount}</p>
            <p className="text-sm font-medium text-gray-600">Missed</p>
          </div>
        </div>

        {/* Today's Medication Status - Primary Focus */}
        <section className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-indigo-100/50 p-6 md:p-8 border border-indigo-100/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Today's Medications</h2>
              <p className="text-sm text-gray-600">What do you need to take today?</p>
            </div>
            {upcomingCount > 0 && (
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg shadow-blue-200/50">
                {upcomingCount} remaining
              </span>
            )}
          </div>
          
          {medications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium mb-2">No medications scheduled for today.</p>
              <Link to="/medications/add" className="mt-4 inline-block bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95">
                Add Medication
              </Link>
            </div>
          ) : (
            <>
              {/* Priority Medications (Upcoming & Missed) */}
              {priorityMedications.length > 0 && (
                <div className="space-y-4 mb-6">
                  {priorityMedications.map((medication) => {
                    const status = getMedicationStatus(medication);
                    return (
                      <MedicationCard
                        key={medication.id}
                        id={medication.id} 
                        medication={medication}
                        status={status} 
                      />
                    );
                  })}
                </div>
              )}

              {/* Taken Medications Section (Collapsible) */}
              {takenMedications.length > 0 && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <button
                    onClick={() => setShowTaken(!showTaken)}
                    className="flex items-center justify-between w-full mb-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Taken Medications</h3>
                        <p className="text-sm text-gray-600">{takenMedications.length} medication{takenMedications.length !== 1 ? 's' : ''} completed today</p>
                      </div>
                    </div>
                    <svg 
                      className={`w-5 h-5 text-gray-600 transition-transform ${showTaken ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showTaken && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      {takenMedications.map((medication) => (
                        <MedicationCard
                          key={medication.id}
                          id={medication.id} 
                          medication={medication}
                          status="taken" 
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Primary Action Buttons */}
              {priorityMedications.length > 0 && (
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/medications"
                    className="flex-1 bg-white hover:bg-gray-50 text-indigo-700 font-bold py-4 px-6 rounded-xl text-base md:text-lg transition-all shadow-md hover:shadow-lg border-2 border-indigo-200 text-center flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    View All Medications
                  </Link>
                </div>
              )}
            </>
          )}
        </section>

        {/* Adherence Summary Section */}
        <RoundedProgress />

        {/* Safety & Trust Section */}
        <section className="bg-gradient-to-br from-indigo-50/80 to-blue-50/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-7 border border-indigo-100/50">
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Your Data is Secure</h3>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
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