const webpush = require('web-push');
const fs = require('fs');
const path = require('path');


try {

  webpush.setVapidDetails(
    'mailto:bstprogrammer999@gmail.com',
    'BGHK5Cnap0xOB0IA6eGh5qmhrzhCYrOGCJPxv1MhJT7MElTcVQUN4IDW6GAw2DskbCQVwU4KS8ahYTATtYZqfdc',
    'UPJCQaQsy0gfVuJuxM-P2VCOTlCBKNKSeRwbYFhldtA'
  );

  console.log('Web-push initialized successfully');
} catch (error) {
  console.error('Error initializing web-push:', error);
  process.exit(1);
}

const notify = (notification, subscription) => {
  const payload = JSON.stringify({
    title: notification.title,
    body: notification.body
  });

  return webpush.sendNotification(JSON.parse(subscription), payload)
    .then((response) => {
      console.log('Successfully sent notification:', response);
      return response;
    })
    .catch((error) => {
      console.error('Error sending notification:', error);
      throw error;
    });
};

module.exports = notify;

/* // Example usage
const exampleNotification = {
  title: "This is a test notification from Isaac",
  body: "If you like don't see it."
};

const exampleSubscription = `{"endpoint":"https://fcm.googleapis.com/fcm/send/fEt5RcOXrNQ:APA91bE9jmbBXk1dI_QQgyBCpiSVJemN7AaV9ErVCn5-jIdx239sIBuaSIAH8bXOlKWCaJbJpwjU0MA99CzJ3Asg4AP44Arnfw4aVBvurjIsNv2cIpUk_w7JhHLr7-dp-BsGqU5cBvsx","expirationTime":null,"keys":{"p256dh":"BCaAqq_a53a6-0K-57gKZ0qhc6Zy32MgfbqU8i9IYqWsl-nXlaQImskG_5s8Cd8woZIUQdXQktGqm18S2YzeZRM","auth":"kJSKPTJjHi3LZqZNl4RQRg"}}`

notify(exampleNotification, exampleSubscription)
  .then(() => console.log('Notification sent successfully'))
  .catch(error => console.error('Failed to send notification:', error)); */