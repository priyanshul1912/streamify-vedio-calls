import { useState } from 'react';
import { useParams } from 'react-router'
import useAuthUsers from '../hooks/useAuthUsers.js';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api.js';
import { useEffect } from 'react';
import ChatLoader from '../componenets/ChatLoader';
import CallButton from '../componenets/CallButton';
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";


import { StreamChat } from 'stream-chat';
import { toast } from 'react-hot-toast';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;



const ChatPage = () => {
  const {id: targetUserId} = useParams()

  const [chatClient,setChatClient] = useState(null);
  const [channel,setChannel] = useState(null);
  const [loading,setLoading] = useState(true);

  const {authUser} = useAuthUsers();

  const {data:tokenData} = useQuery({
    queryKey:["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser //this will ensure that the query runs only when authUser is available
  
  })

  useEffect(() => { 
    const initChat = async () => {
      if(!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat...")
        


        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser({
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        },
        tokenData.token);
        
        
        const channelId = [authUser._id,targetUserId].sort().join("-");
        const currChannel = client.channel("messaging",channelId,{
          members:[authUser._id,targetUserId],
        })
        await currChannel.watch();
        setChatClient(client);
        setChannel(currChannel);
        setLoading(false);
        console.log("Stream chat initialized successfully.");


      } catch (error) {
        console.error("Error initializing stream chat:",error);
        toast.error("Failed to initialize chat. Please try again later.");
        
      } finally{
         setLoading(false);
      }
    };
    initChat();
  },[tokenData,authUser,targetUserId]);


if(loading || !chatClient || !channel) return <ChatLoader />
const handleVideoCall = () => {
  if(channel){
    const callUrl = `${window.location.origin}/call/${channel.id}`;

    channel.sendMessage({
      text: `📞 Video Call Invitation: Click to join ${callUrl}`,
    })

    toast.success("Video call link sent successfully!");

  }
  
}


  return (
    <div className='h-[93vh]'>
      <Chat client={chatClient} >
        <Channel channel={channel}>
          <div className='w-full relative'>
            <CallButton handleVideoCall ={handleVideoCall} />

            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>

          </div>
          <Thread />
         </Channel>
      </Chat>

    </div>
  )
}


export default ChatPage