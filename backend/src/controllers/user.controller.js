import User from "../models/User.js";
import FriendRequest from "../models/FriendsRequest.js";


export async function getRecommendedUsers(req,res){

  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({$and:[
      {_id: {$ne: currentUserId}}, //exclude current user's freinds
      {_id: {$nin: currentUser.friends}},//exclude current user's freinds
      {isOnboarded: true},
    ]});
    res.status(200).json(recommendedUsers);
    
  } catch (error) {
    console.error("Error in getRecommendedUsers controllers",error.message);

    res.status(500).json({message:"Internal server Error"});
    
  }

}

export async function getMyFriends(req,res){

  try {
    const user = await User.findById(req.user.id).select("friends").populate("friends","fullName profilePic nativeLangauge learningLangauge ")

    res.status(200).json(user.friends);
    
  } catch (error) {
    console.error("Error in getMyFrinds controller",error.message)
    res.status(500).json({message: "internal Server Error"})
  }
  
}

export async function sendFreindRequest(req,res){
  try {
    const myId = req.user.id;
    const {id: recipientId}=req.params

    //prevent sending req to yourself 
    if(myId===recipientId) {return res.status(400).json({message: "You can't send freind request to yourslef"})}

    const recipient = await User.findById(recipientId)
    if(!recipient){
      return res.status(400).json({message: "Recipient not found"})
    }

    // check if user is already freinds
    if (recipient.friends.includes(myId)){
       return res.status(400).json({message: "you are already friends with the user"})
    }
    // check if a req is already friends
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId},
        { sender: recipientId, recipient: myId},
      ],

    });
    if(existingRequest){
      return res.status(400).json({message:"A freind request already exsisits between you nd the user"})
    }

    const freindRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    })
    res.status(201).json(freindRequest)


  } catch (error) {
    console.error("Error in sendFreindRequest controller",error.message);
    res.status(500).json({message:"Internal Server Error"});
    
  }
}

export async function acceptFreindRequest(req,res){
  try {
    const {id: requestId} = req.params
    const freindRequest = await FriendRequest.findById(requestId);
    if(!freindRequest){
      return res.status(400).json({message:"Freind request not found"});
    }

    //verify if the current user is the recipient
    if(freindRequest.recipient.toString() !== req.user.id){
       return res.status(403).json({message:"You are not authorized to accept this request"});
    }

    freindRequest.status = "accepted";
    await freindRequest.save();

    //add eachuser to the others's freinds array
    //$addToSet : adds elements to an anrray only i they do not already exist.
    await User.findByIdAndUpdate(freindRequest.sender,{
      $addToSet: { friends: freindRequest.recipient},

    })

      await User.findByIdAndUpdate(freindRequest.recipient,{
      $addToSet: { friends: freindRequest.sender},

    })

    res.status(200).json({message:"Freind request accepted"});
  } catch (error) {
    console.log("Error in acceptFrinedRequest controller", error.message)
    res.status(500).json({message:"Internal Server Error"});
    
  }

}

export async function getFreindRequests(req,res){
  try {
    
  const incomingReqs = await FriendRequest.find({
    recipient : req.user.id,
    status: "pending",

  }).populate("sender","fullName profilePic nativeLangauge learningLangauge ")

  const acceptedReqs = await FriendRequest.find({
    sender: req.user.id,
    status : "accepted",
  }).populate("recipient","fullName profilePic")

  res.status(200).json({incomingReqs,acceptedReqs})
  } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message);
    
  }

}

export async function getOutgoingFreindReqs(req,res){
try {
  const outgoingRequests = await FriendRequest.find({
    sender : req.user.id,
    status: "pending",
  }).populate("recipient","fullName profilePic nativeLangauge learningLanguauge" );
  res.status(200).json(outgoingRequests);
  
} catch (error) {
  console.log("Error in getOutgoingFriendReqs controller", error.message);
  res.status(500).json({message:"Internal Server Error"})
  
}
}
  
