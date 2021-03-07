import pool from "../config/modelConfig";

const createTables = `
  CREATE TABLE IF NOT EXISTS users (
   id SERIAL PRIMARY KEY,
   email VARCHAR,
   password VARCHAR,
   created_at TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS clubs (
   id SERIAL PRIMARY KEY,
   admin VARCHAR,
   name VARCHAR,
   created_at TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS members (
   id SERIAL PRIMARY KEY,
   email VARCHAR,
   club_id INT,
   club_name VARCHAR,
   created_at TIMESTAMP,
   FOREIGN KEY (club_id) REFERENCES clubs(id)
  );
`;
const createDatabaseTables = async () => {
  await pool.query(createTables).then(() => {
    console.log("Tables successfully created");
  });
};

createDatabaseTables();