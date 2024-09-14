const cron = require('node-cron');
const { DateTime } = require("luxon");
const { db } = require("../helpers/Database");
const Logger = require("../helpers/Logger");

// Set the time zone for Lagos, Nigeria
const LAGOS_TIMEZONE = 'Africa/Lagos';

const updateReoccurringEvents = async () => {
  Logger.info('Starting updateReoccurringEvents job');

  const query = `
    UPDATE timetable
    SET date = DATE_ADD(date, INTERVAL 7 DAY)
    WHERE reoccur = TRUE AND date = CURDATE()
  `;

  try {
    const [result] = await db.executeDirect(query);
    Logger.info(`Updated ${result.affectedRows} reoccurring events`);
  } catch (error) {
    Logger.error('Error updating reoccurring events:', error);
  }
};

const reoccurringEventsCronJob = () => {
  Logger.info('Starting reoccurringEventsCronJob');
  
  // Run the job every day at midnight
  cron.schedule('0 0 * * *', async () => {
    Logger.info('Reoccurring events cron job triggered');
    
    try {
      const now = DateTime.now().setZone(LAGOS_TIMEZONE);
      Logger.info(`Current time (Lagos): ${now.toISO()}`);

      await updateReoccurringEvents();
    } catch (error) {
      Logger.error('Error in reoccurring events cron job:', error);
    }
    
    Logger.info('Reoccurring events cron job execution completed');
  });
};

module.exports = reoccurringEventsCronJob;
