import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import { format } from "timeago.js";
import apiRequest from "../../lib/apiRequest";

const Chat = ({ chats }) => {
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();
  const decrease = useNotificationStore((state) => state.decrease);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest("/chats/" + id);
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }
      setChat({ ...res.data, receiver });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");
    if (!text) return;
    
    try {
      const res = await apiRequest.post("/messages/" + chat.id, { text });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };

    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });
    }
    return () => {
      socket.off("getMessage");
    };
  }, [socket, chat]);

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="p-5 border-b border-surface-200">
        <h1 className="font-heading text-xl text-navy-900 font-bold">Messages</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chats?.map((c) => {
          const isUnread = !c.seenBy.includes(currentUser.id) && chat?.id !== c.id;
          return (
            <div
              key={c.id}
              className={`flex items-center p-3.5 rounded-card cursor-pointer transition-all duration-200 border ${
                isUnread
                  ? "bg-accent-50/60 border-accent-200"
                  : "bg-surface-50 hover:bg-surface-100 border-surface-200"
              }`}
              onClick={() => handleOpenChat(c.id, c.receiver)}
            >
              <div className="relative">
                <img
                  src={c.receiver.avatar || "/noavatar.jpg"}
                  alt=""
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-white"
                />
                {isUnread && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-accent-500 rounded-full ring-2 ring-white" />
                )}
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <h3 className="font-body font-semibold text-body-sm text-navy-900 truncate">{c.receiver.username}</h3>
                <p className="font-body text-caption text-navy-400 truncate mt-0.5">{c.lastMessage || "No messages yet"}</p>
              </div>
            </div>
          );
        })}
        {(!chats || chats.length === 0) && (
          <div className="text-center py-12 text-navy-400 font-body text-body-sm">
            No messages yet.
          </div>
        )}
      </div>

      {chat && (
        <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-card shadow-elevated w-full max-w-xl h-[560px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-navy-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={chat.receiver.avatar || "/noavatar.jpg"}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20"
                />
                <span className="font-body font-semibold text-body-sm">{chat.receiver.username}</span>
              </div>
              <button
                onClick={() => setChat(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-navy-300 hover:text-white hover:bg-navy-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-50">
              {chat.messages.map((message) => {
                const isMe = message.userId === currentUser.id;
                return (
                  <div
                    key={message.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-card p-3 shadow-card font-body text-body-sm ${
                        isMe
                          ? "bg-accent-500 text-white rounded-br-none"
                          : "bg-white text-navy-800 border border-surface-200 rounded-bl-none"
                      }`}
                    >
                      <p>{message.text}</p>
                      <span className={`text-[10px] mt-1 block text-right ${isMe ? "text-white/75" : "text-navy-400"}`}>
                        {format(message.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messageEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-surface-200 flex gap-2">
              <input
                name="text"
                className="input-field flex-1 !py-2.5"
                placeholder="Write a message..."
              />
              <button
                type="submit"
                className="btn-primary !py-2.5 !px-5"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;