import { useState, useRef } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { alarmSoundService } from '../../services/alarmSound';

const Settings = () => {
  const { settings, updateSettings, updateAlarmSettings, setCustomSound, removeCustomSound } = useSettings();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSound = e.target.value;
    updateAlarmSettings({ sound: selectedSound });
    
    // Show modal when custom is selected
    if (selectedSound === 'custom') {
      setShowCustomModal(true);
    } else {
      setShowCustomModal(false);
    }
  };

  const handleReminderTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ defaultReminderTime: e.target.value });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAlarmSettings({ volume: parseInt(e.target.value) });
  };

  const handleSnoozeDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAlarmSettings({ snoozeDuration: parseInt(e.target.value) });
  };

  const handleRepeatCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAlarmSettings({ repeatCount: parseInt(e.target.value) });
  };

  const handleVibrateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAlarmSettings({ vibrate: e.target.checked });
  };

  const handleTestSound = async () => {
    await alarmSoundService.playAlarm(settings.alarm, 'Test Medication');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(false);
    setIsUploading(true);

    try {
      await setCustomSound(file);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setShowCustomModal(false);
      }, 2000);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload sound');
      setTimeout(() => setUploadError(null), 5000);
    } finally {
      setIsUploading(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveCustomSound = () => {
    removeCustomSound();
    setUploadSuccess(false);
    setShowCustomModal(false);
    updateAlarmSettings({ sound: 'default' });
  };

  const handleCloseModal = () => {
    if (!settings.alarm.customSound) {
      // If no custom sound is set, revert to default
      updateAlarmSettings({ sound: 'default' });
    }
    setShowCustomModal(false);
    setUploadError(null);
    setUploadSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-8">
          {/* Reminder Settings */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Reminder Settings</h2>
            <div className="space-y-4">
              <label className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-gray-700 font-medium">Default reminder time</span>
                <input 
                  type="time" 
                  value={settings.defaultReminderTime}
                  onChange={handleReminderTimeChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </label>
            </div>
          </div>

          {/* Alarm Customization */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Alarm Customization</h2>
            <div className="space-y-4">
              <label className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-gray-700 font-medium">Alarm sound</span>
                <select 
                  value={settings.alarm.sound}
                  onChange={handleFontSizeChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="default">Default</option>
                  <option value="gentle">Gentle</option>
                  <option value="classic">Classic</option>
                  <option value="modern">Modern</option>
                  <option value="nature">Nature</option>
                  <option value="custom">
                    {settings.alarm.customSound ? `Custom (${settings.alarm.customSoundName})` : 'Custom'}
                  </option>
                </select>
              </label>

              <label className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-gray-700 font-medium">
                  Volume: {settings.alarm.volume}%
                </span>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={settings.alarm.volume}
                  onChange={handleVolumeChange}
                  className="w-full sm:w-48"
                />
              </label>

              <label className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-gray-700 font-medium">
                  Snooze duration: {settings.alarm.snoozeDuration} minutes
                </span>
                <input 
                  type="number" 
                  min="5" 
                  max="60" 
                  step="5"
                  value={settings.alarm.snoozeDuration}
                  onChange={handleSnoozeDurationChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-32"
                />
              </label>

              <label className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-gray-700 font-medium">
                  Repeat count: {settings.alarm.repeatCount} times
                </span>
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  value={settings.alarm.repeatCount}
                  onChange={handleRepeatCountChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-32"
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Vibrate</span>
                <input 
                  type="checkbox" 
                  checked={settings.alarm.vibrate}
                  onChange={handleVibrateChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>

              <div className="pt-2">
                <button
                  onClick={handleTestSound}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  🔊 Test Alarm Sound
                </button>
              </div>
            </div>
          </div>

          {/* Accessibility */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Accessibility</h2>
            <div className="space-y-4">
              <label className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-gray-700 font-medium">Font size</span>
                <select 
                  value={settings.fontSize}
                  onChange={(e) => updateSettings({ fontSize: e.target.value as 'normal' | 'large' | 'extra-large' })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="normal">Normal</option>
                  <option value="large">Large</option>
                  <option value="extra-large">Extra Large</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </main>

      {/* Custom Sound Upload Modal */}
      {showCustomModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full border-2 border-blue-200 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Custom Alarm Sound</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isUploading}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {settings.alarm.customSound ? (
              <div className="space-y-4">
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Custom Sound Active</p>
                      <p className="text-sm text-gray-600">{settings.alarm.customSoundName}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Replace Sound
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleRemoveCustomSound}
                    disabled={isUploading}
                    className="px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold rounded-xl transition-colors disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-medium mb-2">Upload Your Custom Alarm Sound</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supported formats: MP3, WAV, OGG, M4A
                  </p>
                  <p className="text-xs text-gray-400">Maximum file size: 5MB</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="custom-sound-upload"
                  disabled={isUploading}
                />

                {isUploading ? (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-blue-700 font-medium">Uploading sound file...</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Choose Audio File
                  </button>
                )}

                {uploadError && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-red-700">{uploadError}</p>
                    </div>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-sm text-green-700 font-medium">Sound uploaded successfully! It's now saved and ready to use.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;