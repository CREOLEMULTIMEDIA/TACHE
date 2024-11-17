import { useEffect } from 'react';

export const useNotifications = () => {
  const requestPermission = async () => {
    if (!('Notification' in window)) {
      console.log('Ce navigateur ne supporte pas les notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  const scheduleNotification = (title: string, time: Date, onNotification: () => void) => {
    const now = new Date();
    const delay = time.getTime() - now.getTime();

    if (delay <= 0) {
      onNotification();
      return;
    }

    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body: 'Il est temps pour votre tâche !',
          icon: '/notification-icon.png'
        });
        onNotification();
      }
    }, delay);
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return { scheduleNotification };
};