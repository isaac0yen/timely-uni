var admin = require("firebase-admin");

var serviceAccount = require("../config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const notify = (title, body, fcm) => {
  const payload = {
    notification: {
      title: title,
      body: body
    },
    token: fcm
  };

  return admin.messaging().send(payload)
    .then((response) => {
      console.log(response)
      return true;
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });
}