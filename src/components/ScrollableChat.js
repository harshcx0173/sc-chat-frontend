import image from "../images/user.svg";
import React, { useRef, useEffect, useContext, useState } from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/chat";
import { AuthContext } from "../context/context";
import { getApiUrl } from "../utils/apiConfig";
import MediaModal from "./MediaModal";
import VideoThumbnail from "./VideoThumbnail";

const ScrollableChat = ({ messages }) => {
  const { user } = useContext(AuthContext);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderMedia = (message) => {
    if (!message.file) return null;

    const fileUrl = `${getApiUrl()}/file/${message.file.filename}`;

    if (message.file.mimetype.startsWith('image/')) {
      return (
        <div 
          onClick={() => setSelectedMedia(message.file)}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={fileUrl}
            alt="Shared image"
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              borderRadius: "5px",
              marginTop: "5px"
            }}
          />
        </div>
      );
    } else if (message.file.mimetype.startsWith('video/')) {
      return (
        <div style={{ marginTop: "5px" }}>
          <VideoThumbnail
            videoUrl={fileUrl}
            onClick={() => setSelectedMedia(message.file)}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <img
                style={{
                  marginTop: "7px",
                  marginRight: "5px",
                  cursor: "pointer",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                }}
                src={image}
                alt={m.sender.name}
                title={m.sender.name}
              />
            )}
            <div
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 7 : 10,
                borderRadius: "10px",
                padding: "10px 15px",
                maxWidth: "75%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start"
              }}
            >
              {m.message}
              {renderMedia(m)}
            </div>
          </div>
        ))}
      <div ref={messagesEndRef}></div>
      
      <MediaModal
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
        media={selectedMedia}
      />
    </div>
  );
};

export default ScrollableChat;
