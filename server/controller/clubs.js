import pool from "../config/modelConfig";
import Helper from "../helpers/helper";


export const createClub = async (req, res) => {
  const { email } = req.decoded;
  const { name } = req.body;
  const checkClub = await pool.query("SELECT * FROM clubs WHERE name = $1 ", [
    name
  ]);
  if (checkClub.rows[0]) {
    return res.status(409).json({
      status: 409,
      error: "Club name already exist, kindly provide another name"
    });
  }
  const createNewClub = await pool.query(
    "INSERT INTO clubs (admin, name) VALUES ($1, $2) RETURNING *",
    [email, name]
  );
  const { id, name: clubName, email:admin } = createNewClub.rows[0];
  const data = {
    id,
    name: clubName,
    admin
  };
  return res.status(201).json({
    status: 201,
    data
  });
};

export const getClubs = async (req, res) => {
    const { email } = req.decoded;
    const clubIDs = await pool.query("SELECT club_id FROM members WHERE email = $1 ", [
        email
      ]);
    const id = clubIDs.rows.length ? clubIDs.rows.map(res=> res.club_id).join() : 0
    const clubs = await pool.query(`SELECT * FROM clubs WHERE id IN (${id}) OR admin=$1`,[email]);
      return res.status(200).json({
        status: 200,
        data: clubs.rows
      }); 
}

export const getClubMembers = async (req, res) => {
    const { email } = req.decoded;
    const { club_id } = req.params;

    if(!Helper.isValidNumber(club_id)){
      return res.status(401).json({
        status: 400,
        error: 'Please provide a valid club_id'
      });
    }
    const getClub = await pool.query("SELECT admin FROM clubs WHERE id = $1 ", [
        club_id
      ]);
    if(!getClub.rows[0].admin || getClub.rows[0].admin !== email){
        return res.status(401).json({
            status: 401,
            error: 'only admin can view club members'
          });
    }
    const clubMembers = await pool.query(`SELECT members.id, members.email, clubs.name
        FROM members
        INNER JOIN clubs ON members.club_id = ${club_id}`);
      return res.status(200).json({
        status: 200,
        data:clubMembers.rows
      }); 
}

export const sentInvite = async (req, res) => {
    const { email, club_name } = req.body;
    const { email:senderEmail } = req.decoded;
    const { club_id } = req.params;

    if(!Helper.isValidNumber(club_id)){
      return res.status(401).json({
        status: 400,
        error: 'Please provide a valid club_id'
      });
    }
    const checkClub = await pool.query("SELECT * FROM members WHERE email = $1 AND club_id=$2", [
      email, club_id
    ]);
    if (checkClub.rows[0]) {
      return res.status(409).json({
        status: 409,
        error: `${email} is already a member of ${club_name}`
      });
    }
    const sendEmail = await Helper.generateInvitationEmail(senderEmail, email, club_name, club_id)
        return res.status(200).json({
            status: 200,
            message: `Email sent succesfully`
          });
  };
  
  export const addMember = async (req, res) => {
    const { email, club_id, club_name } = req.query;
    const checkUser = await pool.query("SELECT * FROM users WHERE email = $1 ", [
        email
      ]);
      if (!checkUser.rows[0]) {
        return res.status(400).json({
          status: 400,
          error: "User is not registered, Kindly register platform to join this club"
        });
      }
    const addNewMember = await pool.query(
      "INSERT INTO members (email, club_id, club_name) VALUES ($1, $2, $3) RETURNING *",
      [email, club_id, club_name]
    );
    const { id, email: memberEmail, club_id:clubID, club_name:clubName } = addNewMember.rows[0];
    const data = {
      id,
      email: memberEmail,
      club_id:clubID,
      club_name:clubName,
    };
    return res.status(201).json({
      status: 201,
      data
    });
  }

  export const deleteClubMember = async (req, res) => {
    const { email } = req.decoded;
    const { club_id } = req.params;
    const { member } = req.query;

    if(!Helper.isValidNumber(club_id)){
      return res.status(401).json({
        status: 400,
        error: 'Please provide a valid club_id'
      });
    }
    const getClub = await pool.query("SELECT admin FROM clubs WHERE id = $1 ", [
        club_id
      ]);
    if(!getClub.rows[0] || getClub.rows[0].admin !== email){
        return res.status(401).json({
            status: 401,
            error: 'only admin can delete club members'
          });
    }
    const removeMember = await pool.query("DELETE FROM members WHERE club_id=$1 AND email=$2", [
        club_id, member
      ]);
      return res.status(200).json({
        status: 200,
        message: 'Member deleted successfully'
      }); 
}