const mysql = require("mysql2/promise");
require("dotenv/config");
const Logger = require("./Logger");

let _DB;

const mySQLConnect = async () => {
  try {
    _DB = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      namedPlaceholders: true,
      waitForConnections: true,
      connectionLimit: 200,
      maxIdle: 200,
      idleTimeout: 25200000,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });

    const connection = await _DB.getConnection();
    connection.release();

    Logger.info("MySQL Connection pool created successfully.");
    return connection;
  } catch (error) {
    Logger.error("MySQL Database connection failed.", error);
    throw error;
  }
};

const db = {
  async executeQuery(query, params = {}) {
    try {
      const [result] = await _DB.execute(query, params);
      return result;
    } catch (error) {
      Logger.error("Query execution failed", error);
      throw error;
    }
  },

  async insertOne(tableName, data) {
    const query = `INSERT INTO ${tableName} SET ?`;
    const result = await this.executeQuery(query, data);
    return result.insertId;
  },

  async insertMany(tableName, data) {
    const columns = Object.keys(data[0]).join(", ");
    const placeholders = data.map(() => `(${Object.keys(data[0]).map(() => "?").join(", ")})`).join(", ");
    const values = data.flatMap(Object.values);
    const query = `INSERT INTO ${tableName} (${columns}) VALUES ${placeholders}`;
    const result = await this.executeQuery(query, values);
    return result.affectedRows;
  },

  async updateOne(tableName, data, condition) {
    const setClause = Object.keys(data).map(key => `${key} = :${key}`).join(", ");
    const whereClause = condition ? `WHERE ${Object.keys(condition).map(key => `${key} = :w_${key}`).join(" AND ")}` : "";
    const query = `UPDATE ${tableName} SET ${setClause} ${whereClause} LIMIT 1`;
    const params = { ...data, ...Object.fromEntries(Object.entries(condition || {}).map(([k, v]) => [`w_${k}`, v])) };
    const result = await this.executeQuery(query, params);
    return result.affectedRows;
  },

  async updateMany(tableName, data, condition) {
    const setClause = Object.keys(data).map(key => `${key} = :${key}`).join(", ");
    const whereClause = condition ? `WHERE ${Object.keys(condition).map(key => `${key} = :w_${key}`).join(" AND ")}` : "";
    const query = `UPDATE ${tableName} SET ${setClause} ${whereClause}`;
    const params = { ...data, ...Object.fromEntries(Object.entries(condition || {}).map(([k, v]) => [`w_${k}`, v])) };
    const result = await this.executeQuery(query, params);
    return result.affectedRows;
  },

  async deleteOne(tableName, condition) {
    const whereClause = condition ? `WHERE ${Object.keys(condition).map(key => `${key} = :${key}`).join(" AND ")}` : "";
    const query = `DELETE FROM ${tableName} ${whereClause} LIMIT 1`;
    const result = await this.executeQuery(query, condition);
    return result.affectedRows;
  },

  async deleteMany(tableName, condition) {
    const whereClause = condition ? `WHERE ${Object.keys(condition).map(key => `${key} = :${key}`).join(" AND ")}` : "";
    const query = `DELETE FROM ${tableName} ${whereClause}`;
    const result = await this.executeQuery(query, condition);
    return result.affectedRows;
  },

  async findOne(tableName, condition, options = { useIndex: "", columns: "" }) {
    const columns = options.columns || "*";
    const indexClause = options.useIndex ? `USE INDEX (${options.useIndex})` : "";
    const whereClause = condition ? `WHERE ${Object.keys(condition).map(key => `${key} = :${key}`).join(" AND ")}` : "";
    const query = `SELECT ${columns} FROM ${tableName} ${indexClause} ${whereClause} LIMIT 1`;
    const result = await this.executeQuery(query, condition);
    return result[0];
  },

  async findMany(tableName, condition, options = { useIndex: "", columns: "" }) {
    const columns = options.columns || "*";
    const indexClause = options.useIndex ? `USE INDEX (${options.useIndex})` : "";
    const whereClause = condition ? `WHERE ${Object.keys(condition).map(key => `${key} = :${key}`).join(" AND ")}` : "";
    const query = `SELECT ${columns} FROM ${tableName} ${indexClause} ${whereClause}`;
    return await this.executeQuery(query, condition);
  },

  async executeDirect(query, values) {
    return await this.executeQuery(query, values);
  },
};

module.exports = { db, mySQLConnect };