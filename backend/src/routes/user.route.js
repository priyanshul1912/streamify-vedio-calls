import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { getRecommendedUsers,getMyFriends,sendFreindRequest,acceptFreindRequest,getFreindRequests,getOutgoingFreindReqs } from '../controllers/user.controller.js';

const router = express.Router();

//apply auth middleware to all routes 

router.use(protectRoute);

router.get("/",getRecommendedUsers)

router.get("/friends",getMyFriends)

router.post("/friend-request/:id",sendFreindRequest)
router.put("/friend-request/:id/accept",acceptFreindRequest)

router.get("/friend-requests",getFreindRequests)
router.get("/outgoing-friend-requests",getOutgoingFreindReqs)


export default  router;