import pool from "../config/modelConfig";
import Helper from "../helpers/helper";


export const signup = async (req, res) => {
  const { email, password } = req.body;
  const hashpassword = Helper.hashPassword(password);
  const checkUser = await pool.query("SELECT * FROM users WHERE email = $1 ", [
    email
  ]);
  if (checkUser.rows[0]) {
    return res.status(409).json({
      status: 409,
      error: "Email already exist, kindly procced to signin"
    });
  }
  const createNewUser = await pool.query(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
    [email, hashpassword]
  );
  const { id, email: newEmail } = createNewUser.rows[0];
  const data = {
    id,
    newEmail,
    token: Helper.generateToken(id, newEmail)
  };
  return res.status(201).json({
    status: 201,
    data
  });
};

export const signin = (req, res) => {
  const { email, password } = req.body;
  pool.query(
    "SELECT * FROM users WHERE email = $1 ",
    [email],
    (error, result) => {
      if (
        !result.rows[0] ||
        !Helper.comparePassword(result.rows[0].password, password)
      ) {
        return res.status(400).json({
          status: 400,
          error: "Email or password is incorrect"
        });
      }
      const { id, email} = result.rows[0];
      const data = {
        id,
        email,
        token: Helper.generateToken(id, email)
      };
      return res.status(200).json({
        status: 200,
        data
      });
    }
  );
};