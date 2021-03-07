import express from "express";
import { createClub, getClubs, getClubMembers, addMember, deleteClubMember, sentInvite} from "../controller/clubs";
import { clubValidate } from "../middleware/userValidation";
import Auth from '../middleware/auth'

const clubRouter = express.Router();
const {verifyToken} = Auth

clubRouter.route("/api/clubs").post(verifyToken, clubValidate, createClub);
clubRouter.route("/api/clubs").get(verifyToken, getClubs);
clubRouter.route("/api/clubs/member").post(addMember);
clubRouter.route("/api/clubs/invitation:club_id").post(verifyToken, sentInvite);
clubRouter.route("/api/clubs/member/:club_id").get(verifyToken, getClubMembers);
clubRouter.route("/api/clubs/member/:club_id").delete(verifyToken, deleteClubMember);

export default clubRouter;