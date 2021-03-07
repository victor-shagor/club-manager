import pool from "../config/modelConfig";

const dropTables = `
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS clubs CASCADE;
DROP TABLE IF EXISTS members CASCADE;
`;

const dropDatabase = async () => {
  await pool.query(dropTables).then(() => {
    console.log("Tables successfully removed from Database");
  });
};

dropDatabase();