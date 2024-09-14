const cron = require('node-cron');
const { DateTime } = require("luxon");
const { db } = require("../helpers/Database");
const notify = require("../helpers/Notify");
const Logger = require("../helpers/Logger");

// Set the time zone for Lagos, Nigeria
const LAGOS_TIMEZONE = 'Africa/Lagos';

const getTimetables = async (start, end) => {
  const query = `
    SELECT t.*, c.department, c.level, c.name AS course_name, r.name AS room_name
    FROM timetable t
    JOIN course c ON t.course = c.id
    LEFT JOIN room r ON t.room = r.id
    WHERE t.date = CURDATE()
    AND t.time_start BETWEEN ? AND ?
  `;
  return db.executeDirect(query, [start, end]);
};

const getUsers = async (departmentId, level, courseId) => {
  const query = `
    SELECT DISTINCT u.id, u.fcm_token, u.role
    FROM users u
    LEFT JOIN user_department ud ON u.id = ud.user_id
    LEFT JOIN carry_over co ON u.id = co.user_id
    WHERE (
      (ud.department_id = ? AND u.level = ? AND u.role = 'student')
      OR (ud.department_id = ? AND u.role = 'lecturer')
      OR (co.course_id = ?)
    )
    AND u.status = 'ACTIVE'
    AND u.fcm_token IS NOT NULL
  `;
  return db.executeDirect(query, [departmentId, level, departmentId, courseId]);
};

const processTimetable = async (timetable, minutesBeforeEvent) => {
  if (!timetable.department || !timetable.level) {
    Logger.info(`Skipping timetable ${timetable.id} due to missing department or level`);
    return;
  }

  const [users] = await getUsers(timetable.department, timetable.level, timetable.course);
  if (users.length === 0) {
    Logger.info(`No users with FCM tokens found for timetable ${timetable.id}`);
    return;
  }

  const message = {
    title: "Upcoming Class Reminder",
    body: `You have a class for ${timetable.course_name} starting in ${minutesBeforeEvent} minutes in ${timetable.room_name || 'Unspecified Room'}`
  };

  Logger.info(`Users for timetable ${timetable.id}:`, users);

  const fcmTokens = users.map(user => user.fcm_token).filter(Boolean);
  if (fcmTokens.length === 0) {
     Logger.info(`No valid FCM tokens found for timetable ${timetable.id}`);
    return;
  }

  for (const user of users) {
    if (user.fcm_token) {
      try {
        await notify(message, user.fcm_token);
        console.log(`Notified ${user.role} ${user.id} about timetable ${timetable.id} (${minutesBeforeEvent} minutes before)`);
      } catch (error) {
         Logger.error(`Error sending notification to ${user.role} ${user.id} for timetable ${timetable.id}:`, error);
      }
    }
  }
   Logger.info(`Notified ${fcmTokens.length} users about timetable ${timetable.id} (${minutesBeforeEvent} minutes before)`);
};

const timetableCronJob = () => {
  Logger.info('Starting timetableCronJob');
  cron.schedule('* * * * *', async () => {
     Logger.info('Cron job triggered');
    try {
      const now = DateTime.now().setZone(LAGOS_TIMEZONE);
      const fiveMinutesLater = now.plus({ minutes: 5 });
      const thirtyMinutesLater = now.plus({ minutes: 30 });
      Logger.info(`Current time (Lagos): ${now.toISO()}, Five minutes later: ${fiveMinutesLater.toISO()}, Thirty minutes later: ${thirtyMinutesLater.toISO()}`);

      const [timetables] = await getTimetables(
        now.toSQL({ includeOffset: false }),
        thirtyMinutesLater.toSQL({ includeOffset: false })
      );
       Logger.info(`Found ${timetables.length} timetables`);

      for (const timetable of timetables) {
        const eventTime = DateTime.fromSQL(timetable.time_start, { zone: LAGOS_TIMEZONE });
        const minutesUntilEvent = eventTime.diff(now, 'minutes').minutes;

        if (Math.abs(minutesUntilEvent - 30) < 0.5) {
          await processTimetable(timetable, 30);
        } else if (Math.abs(minutesUntilEvent - 5) < 0.5) {
          await processTimetable(timetable, 5);
        }
      }
    } catch (error) {
       Logger.error('Error in timetable cron job:', error);
    }
    Logger.info('Cron job execution completed');
  });
};

module.exports = timetableCronJob;