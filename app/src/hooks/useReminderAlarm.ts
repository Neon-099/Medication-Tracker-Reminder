import { useEffect, useRef } from 'react';
import { useMedications } from '../context/MedicationContext';
import { useSettings } from '../context/SettingsContext';
import { alarmSoundService } from '../services/alarmSound';

export const useReminderAlarm = () => {
  const { getTodayMedications, getMedicationStatus } = useMedications();
  const { settings } = useSettings();
  const checkIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggeredAlarmsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Request notification permission on mount
    alarmSoundService.requestNotificationPermission();

    // Check for medications that need alarms every minute
    const checkAlarms = () => {
      const medications = getTodayMedications();
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      medications.forEach((medication) => {
        const status = getMedicationStatus(medication);
        const [hours, minutes] = medication.scheduledTime.split(':').map(Number);
        const scheduledMinutes = hours * 60 + minutes;
        
        // Create unique alarm key for this medication and time
        const alarmKey = `${medication.id}-${medication.scheduledTime}-${now.toDateString()}`;
        
        // Trigger alarm if:
        // 1. Medication is upcoming (scheduled time is within 1 minute)
        // 2. We haven't already triggered this alarm today
        // 3. Current time matches scheduled time (within 1 minute window)
        if (
          status === 'upcoming' &&
          !triggeredAlarmsRef.current.has(alarmKey) &&
          Math.abs(currentMinutes - scheduledMinutes) <= 1
        ) {
          triggeredAlarmsRef.current.add(alarmKey);
          alarmSoundService.playAlarm(settings.alarm, medication.name);
        }
      });
    };

    // Check immediately
    checkAlarms();

    // Then check every minute
    checkIntervalRef.current = setInterval(checkAlarms, 60000);

    // Cleanup
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [getTodayMedications, getMedicationStatus, settings.alarm]);

  // Reset triggered alarms at midnight
  useEffect(() => {
    const resetAtMidnight = () => {
      triggeredAlarmsRef.current.clear();
    };

    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = midnight.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      resetAtMidnight();
      // Then reset every 24 hours
      setInterval(resetAtMidnight, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);
};