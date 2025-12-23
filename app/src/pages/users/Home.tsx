import { useState, useEffect, useRef } from 'react';
import { useMedications} from '../../context/MedicationContext';

import { Link, useNavigate } from 'react-router-dom';
import MedicationCard from '../../components/user/MedicationCard';
import RoundedProgress from '../../components/user/RoundedProgress';
import ApiTester from '../../components/ApiTester';

const Home = () => {
  const { getTodayMedications, getMedicationStatus } = useMedications();
  const medications = getTodayMedications();
  const [showTakenModal, setShowTakenModal] = useState(false);
  const [notifiedIds, setNotifiedIds] = useState<string[]>([]);
  const [activeAlert, setActiveAlert] = useState<any>(null);
  const [snoozedReminders, setSnoozedReminders] = useState<{id: string, time: string}[]>([]);
  const [showApiTester, setShowApiTester] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  const today = new Date();
  
  // Separate medications by status
  const upcomingMedications = medications.filter(m => getMedicationStatus(m) === 'upcoming');
  const missedMedications = medications.filter(m => getMedicationStatus(m) === 'missed');
  const takenMedications = medications.filter(m => getMedicationStatus(m) === 'taken');
  
  const upcomingCount = upcomingMedications.length;
  const missedCount = missedMedications.length;
  const takenCount = takenMedications.length;

  // Combine upcoming and missed for display (priority medications)
  const priorityMedications = [...upcomingMedications];

  // Request notification permissions on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // Check for due medications and notify
  useEffect(() => {
    const checkReminders = () => {
      if (activeAlert) return; // Don't trigger if already alerting

      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

      // Check all today's medications for reminders (scheduled or snoozed)
      medications.forEach((med: any) => {
        if (getMedicationStatus(med) === 'taken') return;

        const isScheduledTime = med.time === currentTime && !notifiedIds.includes(med.id);
        const isSnoozedTime = snoozedReminders.some(s => s.id === med.id && s.time === currentTime);

        if (isScheduledTime || isSnoozedTime) {
          // Play alarm sound
          if (!audioRef.current) {
            audioRef.current = new Audio('/alarm.mp3');
            audioRef.current.loop = true;
          }
          audioRef.current.play().catch(e => console.log("Audio play failed:", e));

          // Show system notification
          if (Notification.permission === 'granted') {
            new Notification(`Time to take ${med.name}`, {
              body: `It's time to take your medication!`,
              icon: '/logo192.png'
            });
          }

          setActiveAlert(med);

          if (isScheduledTime) {
            setNotifiedIds(prev => [...prev, med.id]);
          }
          
          // Remove from snoozed list if triggered
          if (isSnoozedTime) {
            setSnoozedReminders(prev => prev.filter(s => !(s.id === med.id && s.time === currentTime)));
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 1000); // Check every second
    return () => clearInterval(interval);
  }, [medications, notifiedIds, snoozedReminders, activeAlert, getMedicationStatus]);

  const handleSnooze = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    if (activeAlert) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 5); // Delay by 5 minutes
      const snoozeTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      
      setSnoozedReminders(prev => [...prev, { id: activeAlert.id, time: snoozeTime }]);
      setActiveAlert(null);
    }
  };

  const handleDismiss = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setActiveAlert(null);
  };

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
          <div 
            className="group bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-green-100/50 border border-green-100/50 text-center hover:shadow-xl hover:shadow-green-200/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            onClick={() => takenCount > 0 && setShowTakenModal(true)}
          >
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Link to="/medications/add" className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95">
                  Add Manually
                </Link>
                <button 
                  onClick={() => navigate('/medications/add', { state: { openScanner: true } })}
                  className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 border-2 border-indigo-100 hover:border-indigo-200 hover:bg-indigo-50 font-semibold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Quick Scan
                </button>
              </div>
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

              {/* Taken Medications Button */}
              {takenMedications.length > 0 && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <button
                    onClick={() => setShowTakenModal(true)}
                    className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl border-2 border-green-200 transition-all hover:shadow-md group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-gray-800">View Taken Medications</h3>
                        <p className="text-sm text-gray-600">{takenMedications.length} medication{takenMedications.length !== 1 ? 's' : ''} completed today</p>
                      </div>
                    </div>
                    <svg 
                      className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
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

        {/* Dev Tools Link */}
        <div className="text-center pb-8">
          <button 
            onClick={() => setShowApiTester(true)}
            className="text-xs text-gray-400 hover:text-indigo-500 underline transition-colors"
          >
            Open Vision API Tester
          </button>
        </div>
      </main>


      {/* Taken Medications Modal */}
      {showTakenModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowTakenModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-green-200 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Taken Medications</h2>
                  <p className="text-sm text-gray-600">{takenMedications.length} medication{takenMedications.length !== 1 ? 's' : ''} completed today</p>
                </div>
              </div>
              <button
                onClick={() => setShowTakenModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            {takenMedications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg font-medium">No medications taken yet today</p>
              </div>
            ) : (
              <div className="space-y-4">
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

            {/* Modal Footer */}
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
          </div>
        </div>
      )}

      {/* Alarm Alert Modal */}
      {activeAlert && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-4 border-indigo-100">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-indigo-100 flex items-center justify-center animate-bounce">
              <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Time to take your meds!</h2>
            <p className="text-xl text-indigo-600 font-semibold mb-8">{activeAlert.name}</p>
            
            <div className="flex flex-col gap-3">
              <button 
                type="button"
                onClick={handleDismiss}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                I've Taken It
              </button>
              <button 
                onClick={handleSnooze}
                className="w-full py-4 bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 rounded-xl font-bold text-lg transition-all"
              >
                Snooze (5 min)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Tester Modal */}
      {showApiTester && <ApiTester onClose={() => setShowApiTester(false)} />}

      {/* Floating Action Button for Quick Scan (Mobile) */}
      <button
        onClick={() => navigate('/medications/add', { state: { openScanner: true } })}
        className="fixed bottom-6 right-6 md:hidden w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-xl flex items-center justify-center z-40 hover:scale-105 active:scale-95 transition-all"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        </svg>
      </button>
    </div>
  );
};

export default Home;