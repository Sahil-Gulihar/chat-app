import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MessagesContext, MessagesContextType } from "../context/MessagesContext";

interface Message {
  messageId: string;
  body: string;
  senderId: string;
  timestamp: string;
  // Add other fields as necessary
}

const useLastMessage = (conversationId: string | null) => {
    const [loading, setIsLoading] = useState(false);
    const [lastMessage, setLastMessage] = useState<Message | null>(null);
    const [lastMessageTime, setLastMessageTime] = useState<string | null>(null);
    const { setMessages } = useContext<MessagesContextType | null>(MessagesContext)!;

    const getMessages = async () => {
        if (!conversationId) return;
        setIsLoading(true);
        try {
            const response = await fetch(`/api/messages/${conversationId}`);
            const data = await response.json();
            const messages = data.messages.messages;
            
            // Ensure each message has a timestamp
            const messagesWithTimestamp = messages.map((msg: Message) => ({
                ...msg,
                timestamp: msg.timestamp || new Date().toISOString()
            }));

            setMessages(messagesWithTimestamp);

            if (messagesWithTimestamp && messagesWithTimestamp.length > 0) {
                const lastMsg = messagesWithTimestamp[messagesWithTimestamp.length - 1];
                setLastMessage(lastMsg);
                setLastMessageTime(lastMsg.timestamp);
            } else {
                setLastMessage(null);
                setLastMessageTime(null);
            }
        } catch (error) {
            toast.error("Internal Server Error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (conversationId) {
            getMessages();
        }
    }, [conversationId]);


    return { loading, lastMessage, lastMessageTime };
};

export default useLastMessage;