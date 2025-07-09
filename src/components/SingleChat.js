import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getSender } from "../config/chat";
import ScrollableChat from "./ScrollableChat";
import { AuthContext } from "../context/context";
import UpdateGroupChatModel from "./UpdateGroupChatModel";
import io from "socket.io-client";
import emojiIcon from "./smileyEmoji.svg";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { getApiUrl } from "../utils/apiConfig";

let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiBox, setShowEmojiBox] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const { user, notification, setNotification, selectedChat, setSelectedChat } =
    useContext(AuthContext);

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  const fetchMessages = async () => {
    if (!selectedChat) {
      console.log("no selected chat");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${getApiUrl()}/message/${selectedChat._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(data);
      setLoading(false);
      socket.emit("join-chat", selectedChat._id);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (100MB = 100 * 1024 * 1024 bytes)
      if (file.size > 100 * 1024 * 1024) {
        toast.error("File size should be less than 100MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const sendMessage = async (e) => {
    if ((e.key === "Enter" && newMessage) || selectedFile) {
      socket.emit("stop-typing", selectedChat._id);
      try {
        const formData = new FormData();
        formData.append("chatId", selectedChat._id);
        
        if (selectedFile) {
          formData.append("file", selectedFile);
        }
        if (newMessage) {
          formData.append("message", newMessage);
        }

        const { data } = await axios.post(
          `${getApiUrl()}/message`,
          formData,
          {
            headers: {
              "Content-type": "multipart/form-data",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setNewMessage("");
        setSelectedFile(null);
        setShowEmojiBox(false);
        socket.emit("new-message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error sending message");
      }
    }
  };

  useEffect(() => {
    socket = io(getApiUrl());
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop-typing", () => setIsTyping(false));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message-received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // notification
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop-typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat !== undefined ? (
        <>
          <div
            style={{
              fontSize: "20px",
              padding: "10px 15px",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => setSelectedChat(undefined)}
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Back
            </button>
            {!selectedChat.isGroupChat ? (
              <div style={{ fontSize: "25px", marginRight: "10px" }}>
                {getSender(user, selectedChat.users)}
              </div>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "15px",
              backgroundColor: "#E8E8E8",
              width: "100%",
              height: "100%",
              borderRadius: "10px",
              overflowY: "hidden",
            }}
          >
            {loading ? (
              <div
                style={{
                  alignSelf: "center",
                  margin: "auto",
                }}
              >
                Loading...
              </div>
            ) : (
              <div
                className="message"
                style={{ maxHeight: "90%", overflowY: "auto" }}
              >
                <ScrollableChat messages={messages} />
              </div>
            )}
            <div
              style={{
                height: "15%",
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {isTyping && selectedChat.isGroupChat ? (
                <div>{getSender(user, selectedChat.users)} is typing ...</div>
              ) : isTyping ? (
                <div>Typing ...</div>
              ) : (
                <></>
              )}
              <div
                style={{
                  width: "63%",
                  margin:'auto',
                  position: "fixed",
                  bottom: "30px",
                  border: "1px solid white",
                  border:'none',
                  backgroundColor:'white',
                  borderRadius:'10px',
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#E0E0E0",
                }}
              >
                <img
                  src={emojiIcon}
                  alt="emojiIcon"
                  height="20px"
                  width="20px"
                  style={{ filter: "contrast(0.3)", marginRight: "5px", cursor: "pointer" }}
                  onClick={() => setShowEmojiBox(!showEmojiBox)}
                />
                {showEmojiBox && (
                  <div
                    style={{
                      position: "absolute",
                      left: "0",
                      bottom: "45px",
                      zIndex: "1",
                    }}
                  >
                    <Picker
                      data={data}
                      onEmojiSelect={(emoji) =>
                        setNewMessage(newMessage.concat(emoji.native))
                      }
                      set="native"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  style={{
                    cursor: "pointer",
                    padding: "5px",
                    marginRight: "5px",
                  }}
                >
                  📎
                </label>
                {selectedFile && (
                  <span style={{ marginRight: "5px", fontSize: "12px" }}>
                    {selectedFile.name}
                  </span>
                )}
                <input
                  style={{
                    width: "95%",
                    backgroundColor:'white',
                    border: "none",
                    borderRadius: "5px",
                    outline: "none",
                    padding: "10px",
                    fontSize: "16px",
                  }}
                  placeholder="Enter a message.."
                  value={newMessage}
                  onKeyDown={sendMessage}
                  onChange={typingHandler}
                />
                <button
                  onClick={() => sendMessage({ key: "Enter" })}
                  style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    marginLeft: "5px",
                    cursor: "pointer",
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <p
            style={{
              fontSize: "30px",
              paddingBottom: "15px",
            }}
          >
            Click On A User to Start Conversation
          </p>
        </div>
      )}
    </>
  );
};

export default SingleChat;
