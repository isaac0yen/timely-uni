// client/src/pushNotifications.js
export const subscribeToPushNotifications = async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BGHK5Cnap0xOB0IA6eGh5qmhrzhCYrOGCJPxv1MhJT7MElTcVQUN4IDW6GAw2DskbCQVwU4KS8ahYTATtYZqfdc'
      });

      return subscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
    }
  } else {
    window.location.reload();
    console.log('Push notifications are not supported');
  }
};

export const handlePushNotification = (event) => {
  console.log(event)
  const data = event.data.json();
  return {
    title: data.title,
    body: data.body,
    image: data.image
  };
};