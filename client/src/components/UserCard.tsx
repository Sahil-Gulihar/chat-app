import { useContext } from "react";
import { ConversationContext, ConversationContextType } from "../context/ConversationContext";
import { useSocketContext } from "../context/SocketContext";
import useLastMessage from "../hooks/useLastMessage"; // Update the import to useLastMessage

type UserDetailsProps = {
  userDetails: {
    email: string,
    firstname: string,
    lastname: string,
    id: string,
    profilePic: string,
    username: string
  }
}

const UserCard = ({ userDetails }: UserDetailsProps): React.JSX.Element => {
  const { selectedConversation, setSelectedConversation } = useContext<ConversationContextType | null>(ConversationContext)!;
  const isSelected = selectedConversation?.id === userDetails.id;
  const { onlineUsers } = useSocketContext() as { onlineUsers: string[] };
  const isOnline = onlineUsers.includes(userDetails.id);

  // Fetch the last message for this user's conversation
  const { lastMessage } = useLastMessage(userDetails.id);

  return (
    <main 
      onClick={() => setSelectedConversation(userDetails)} 
      className={`${isSelected ? "bg-gray-200" : ""} p-2 w-72 font-0 flex border border-gray-500 rounded-lg justify-between cursor-default hover:bg-gray-200`}
    >
      <div className="left flex gap-2 ">
        <div className="profile relative">
          {isOnline && (
            <div className="bg-green-600 h-2 w-2 rounded-full absolute left-1 top-1"></div>
          )}
          {!isOnline && (
            <div className="bg-gray-400 h-2 w-2 rounded-full absolute left-1 top-1"></div>
          )}
          <img 
            className="w-14 h-14 border border-gray-400 rounded-full box-border" 
            src={userDetails.profilePic} 
            alt="avatar" 
          />
        </div>
        <div className="text text-[#353535] flex flex-col justify-center gap-2">
          <h3 className="text-sm font-semibold">{userDetails.firstname}</h3>
          <div className="text-sm">
            {lastMessage ? lastMessage.body : "No messages yet"}
          </div>
        </div>
      </div>
    </main>
  );
}

export default UserCard;
