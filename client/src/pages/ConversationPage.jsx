import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getConversationMessages, sendMessage, clearMessages } from "../redux/slices/messageSlice";
import { FaPaperPlane } from "react-icons/fa";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Loader from "../components/Loader";

const ConversationPage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (userId) {
      dispatch(getConversationMessages(userId));
    }
    return () => dispatch(clearMessages());
  }, [dispatch, userId]);

  const conversationMessages = messages[userId] || [];

  const handleSendMessage = () => {
    if (message.trim()) {
      const otherUserId = conversationMessages.length > 0 ? (conversationMessages[0].senderId === user.id ? conversationMessages[0].receiverId : conversationMessages[0].senderId) : null;
      if (otherUserId) {
        dispatch(sendMessage({ receiverId: otherUserId, message })).then(() => {
          dispatch(getConversationMessages(userId));
        });
        setMessage("");
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Conversation</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4 mb-4">
        {conversationMessages.map((msg) => (
          <div key={msg.id} className={`p-4 rounded ${msg.senderId === user.id ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}>
            <p>{msg.content}</p>
            <small>{new Date(msg.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          className="flex-1"
        />
        <Button onClick={handleSendMessage} icon={<FaPaperPlane />}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default ConversationPage;
