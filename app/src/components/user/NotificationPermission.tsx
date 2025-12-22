import { useState, useEffect } from 'react';

interface NotificationPermissionProps {
  onPermissionGranted?: () => void;
}

const NotificationPermission = ({ onPermissionGranted }: NotificationPermissionProps) => {
  const [showModal, setShowModal] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      return;
    }

    const checkPermission = () => {
      const permission = Notification.permission;
      setPermissionStatus(permission);

      // Show modal if permission hasn't been requested yet
      if (permission === 'default') {
        // Check if user has dismissed before (stored in localStorage)
        const hasDismissed = localStorage.getItem('notification_permission_dismissed');
        if (!hasDismissed) {
          // Show modal after a short delay for better UX
          setTimeout(() => setShowModal(true), 1000);
        }
      } else if (permission === 'granted' && onPermissionGranted) {
        onPermissionGranted();
      }
    };

    checkPermission();
  }, [onPermissionGranted]);

  const handleAllow = async () => {
    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        setShowModal(false);
        if (onPermissionGranted) {
          onPermissionGranted();
        }
        // Show a test notification
        new Notification('Notifications Enabled', {
          body: 'You will now receive medication reminders!',
          icon: '/vite.svg',
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const handleDismiss = () => {
    setShowModal(false);
    localStorage.setItem('notification_permission_dismissed', 'true');
  };

  if (!showModal || permissionStatus !== 'default') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full border-2 border-blue-200 animate-in fade-in zoom-in duration-200">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Enable Notifications</h2>
          <p className="text-gray-600">
            Get timely reminders for your medications. We'll notify you when it's time to take your medication.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleAllow}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            Allow Notifications
          </button>
          <button
            onClick={handleDismiss}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-xl transition-colors"
          >
            Maybe Later
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          You can change this later in your browser settings
        </p>
      </div>
    </div>
  );
};

export default NotificationPermission;