import { useState, useEffect, useRef } from 'react';
import { useMedications } from '../../context/MedicationContext';
import { useSettings } from '../../context/SettingsContext';
import { alarmSoundService } from '../../services/alarmSound';

const AlarmNotification = () => {
  const { getTodayMedications, getMedicationStatus, markAsTaken } = useMedications();
  const { settings } = useSettings();
  const [activeAlarm, setActiveAlarm] = useState<{
    medication: any;
    id: string;
  } | null>(null);

  const [snoozedReminders, setSnoozedReminders] = useState<{id: string, time: string}[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);


  useEffect(() => {

    const checkForAlarms = () => {
      const medications = getTodayMedications();
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      for (const medication of medications) {
        const status = getMedicationStatus(medication);

        const [hours, minutes] = medication.scheduledTime.split(':').map(Number);
        const scheduledMinutes = hours * 60 + minutes;
        const medicationId = medication.id;

        const isSnoozed = snoozedReminders.some(snooze => snooze.id === medicationId);

        if(isSnoozed){
            continue;
        }
        // Show notification if scheduled time is now (within 1 minute)
        if (
          status === 'upcoming' &&
          Math.abs(currentMinutes - scheduledMinutes) <= 1 &&
          activeAlarm?.id !== medication.id

        ) {
          setActiveAlarm({ medication, id: medication.id });
          alarmSoundService.playAlarm(settings.alarm, medication.name);
          break; // Only show one alarm at a time
        }
      }

    };

    // Check every 30 seconds
    const interval = setInterval(checkForAlarms, 30000);
    checkForAlarms(); // Check immediately

      return () => clearInterval(interval);
  }, [getTodayMedications, getMedicationStatus, settings.alarm, activeAlarm]);

  const handleSnooze = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    if (activeAlarm) {
      const now = new Date();
        now.setMinutes(now.getMinutes() + settings.alarm.snoozeDuration); // Delay by 5 minutes
      // const snoozeTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      
        setSnoozedReminders(prev => [...prev, { id: activeAlarm.id, time: now.toString() }]);
        alarmSoundService.stop();
        setActiveAlarm(null);
    }
  };

  const handleTakeNow = () => {
    if (activeAlarm) {
      markAsTaken(activeAlarm.medication.id);
      alarmSoundService.stop();
      setActiveAlarm(null);
    }
  };

  if (!activeAlarm) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-4 border-blue-500 animate-pulse">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center animate-bounce">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Medication Reminder</h2>
          <p className="text-lg text-gray-600 mb-1">
            Time to take <span className="font-semibold text-blue-600">{activeAlarm.medication.name}</span>
          </p>
          <p className="text-sm text-gray-500">
            {activeAlarm.medication.dosage} {activeAlarm.medication.dosage.includes('mg') ? '' : 'mg'}
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSnooze}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Snoozes ({settings.alarm.snoozeDuration}m)
          </button>
          <button
            onClick={handleTakeNow}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            Take Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlarmNotification;

const AlarmNotify = () => {
  
  const handleDismiss = () => {

  }

  const handleSnooze = () => {

  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-4 border-indigo-100">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-indigo-100 flex items-center justify-center animate-bounce">
              <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Time to take your meds!</h2>
            {/* <p className="text-xl text-indigo-600 font-semibold mb-8">{activeAlert.name}</p> */}
            
            <div className="flex flex-col gap-3">
              <button 
                type="button"
                onClick={handleDismiss}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                I've Taken It
              </button>
              <button 
                type="button"
                onClick={handleSnooze}
                className="w-full py-4 bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 rounded-xl font-bold text-lg transition-all"
              >
                Snooze (5 min)
              </button>
            </div>
          </div>
        </div>
  )
} 