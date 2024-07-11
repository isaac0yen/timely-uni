const fs = require("fs");
const { DateTime } = require("luxon");
const path = require("path");

/**
 * @typedef {Object} LoggerOptions
 * @property {string} [logDir="logs"] - The directory to store the log files.
 * @property {string[]} [levels=["info", "warn", "error"]] - The log levels to be used.
 * @property {Function} [format=defaultFormat] - The function to format the log entries.
 * @property {string} [dateFormat="yyyy-LL-dd"] - The date format for the log file names.
 * @property {number} [maxFiles=30] - The maximum number of log files to keep per level.
 * @property {string} [filePrefix=""] - The prefix to add to the log file names.
 * @property {string} [fileSuffix=""] - The suffix to add to the log file names.
 */

const Logger = {
  /**
   * Initializes the logger with the provided options.
   * @param {LoggerOptions} [options={}] - The logger configuration options.
   */
  init(options = {}) {
    this.logDir = options.logDir || "logs";
    this.levels = options.levels || ["info", "warn", "error"];
    this.format = options.format || this.defaultFormat;
    this.dateFormat = options.dateFormat || "yyyy-LL-dd";
    this.maxFiles = options.maxFiles || 30;
    this.filePrefix = options.filePrefix || "";
    this.fileSuffix = options.fileSuffix || "";
  },

  /**
   * Logs a message with the provided level and content.
   * @param {string} level - The log level.
   * @param {string} message - The log message.
   * @param {any} [content] - The content to be logged.
   */
  log(level, message, content) {
    if (!this.levels.includes(level)) {
      throw new Error(`Invalid log level: ${level}`);
    }

    const logContent =
      typeof content === "object" ? content : { message: this.safeStringify(content) };

    const timestamp = DateTime.now()
      .setZone("Africa/Lagos")
      .toFormat("yyyy-LL-dd HH:mm:ss");

    const stackLine = new Error().stack.split("\n")[3];
    const lineNumber = stackLine.split(":")[1];
    const filePath = stackLine.split("(")[1].split(":")[0];

    const logEntry = this.format(level, message, logContent, timestamp, filePath, lineNumber);

    const logFileName = `${this.filePrefix}${DateTime.now().toFormat(this.dateFormat)}${this.fileSuffix}.log`;
    const logFilePath = path.join(this.logDir, level, logFileName);

    if (!fs.existsSync(path.dirname(logFilePath))) {
      fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
    }

    fs.appendFileSync(logFilePath, logEntry, "utf-8");
    this.rotateLogFiles(level);
  },

  /**
   * Rotates the log files for the specified level.
   * @param {string} level - The log level.
   */
  rotateLogFiles(level) {
    const logLevelDir = path.join(this.logDir, level);
    const files = fs.readdirSync(logLevelDir);

    if (files.length > this.maxFiles) {
      const oldestFile = files.sort()[0];
      const oldestFilePath = path.join(logLevelDir, oldestFile);
      fs.unlinkSync(oldestFilePath);
    }
  },

  /**
   * The default format function for log entries.
   * @param {string} level - The log level.
   * @param {string} message - The log message.
   * @param {any} content - The content to be logged.
   * @param {string} timestamp - The timestamp of the log entry.
   * @param {string} filePath - The file path where the log entry originated.
   * @param {string} lineNumber - The line number where the log entry originated.
   * @returns {string} - The formatted log entry.
   */
  defaultFormat(level, message, content, timestamp, filePath, lineNumber) {
    return `[${level.toUpperCase()}] [${timestamp}] [File: ${filePath} ] [Line: ${lineNumber}]\n${message}\n\n${this.safeStringify(content, 2)}\n\n`;
  },

  /**
   * Safely converts the provided object to a JSON string, handling circular references.
   * @param {any} obj - The object to be stringified.
   * @param {number} [indent=2] - The number of spaces to use for indentation.
   * @returns {string} - The JSON string representation of the object.
   */
  safeStringify(obj, indent = 2) {
    let cache = [];
    const result = JSON.stringify(
      obj,
      (key, value) =>
        typeof value === "object" && value !== null
          ? cache.includes(value)
            ? undefined
            : cache.push(value) && value
          : value,
      indent
    );
    cache = null;
    return result;
  },

  /**
   * Logs an informational message.
   * @param {string} message - The log message.
   * @param {any} [content] - The content to be logged.
   */
  info(message, content) {
    this.log("info", message, content);
    console.log("\x1b[34m", message, "\x1b[0m");
  },

  /**
   * Logs a warning message.
   * @param {string} message - The log message.
   * @param {any} [content] - The content to be logged.
   */
  warn(message, content) {
    this.log("warn", message, content);
    console.log("\x1b[33m", message, "\x1b[0m");
  },

  /**
   * Logs an error message.
   * @param {string} message - The log message.
   * @param {any} [content] - The content to be logged.
   */
  error(message, content) {
    this.log("error", message, content);
    console.log("\x1b[31m", message, content, "\x1b[0m");
  },
};

module.exports = Logger;