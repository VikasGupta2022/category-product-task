const Pool = require("pg").Pool;

const pool = new Pool({
  user: "root",
  password: "PFH#23kgrw",
  host: "localhost",
  port: 5432,
  database: "project",
});

module.exports = pool
