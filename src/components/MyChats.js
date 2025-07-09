import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/context";
import axios from "axios";
import GroupChatModal from "./GroupChatModal";
import { getSender } from "../config/chat";
import { toast } from "react-toastify";
import { getApiUrl } from "../utils/apiConfig";

const MyChats = ({ fetchAgain }) => {
  const { user, chats, setChats, selectedChat, setSelectedChat } = useContext(AuthContext);

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  const fetchChats = async () => {
    if (!user?.token) return;
    
    try {
      const { data } = await axios.get(`${getApiUrl()}/chat`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChats(data);
    } catch (error) {
      console.log("Fetch chats error:", error);
      const errorMessage = error.response?.data?.error || error.message || "Failed to fetch chats";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <div
      style={{
        border: "1px solid lightgrey",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "3px",
        width: "31%",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          fontSize: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "5px",
        }}
      >
        <p style={{ marginLeft: "5px" }}>My Chats</p>
        <GroupChatModal>
          <button
            className="btn"
            style={{ width: "165px", padding: "10px 5px" }}
          >
            New Group Chat
          </button>
        </GroupChatModal>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#F8F8F8",
          height: "100%",
          width: "100%",
          borderRadius: "12px",
          overflowY: "hidden",
          padding: "3px",
        }}
      >
        {/* <Stack overflowY="scroll">
            </Stack> */}
        {chats && user ? (
          chats.map((chat) => (
            <div
              onClick={() => setSelectedChat(chat)}
              style={{
                cursor: "pointer",
                backgroundColor:
                  selectedChat === chat ? "rgba(67, 43, 255, 0.8)" : "#E8E8E8",
                color: selectedChat === chat ? "white" : "black",
                paddingLeft: "2em",
                margin: "10px",
                paddingRight: "2em",
                paddingTop: "1em",
                paddingBottom: "1em",
                borderRadius: "1em",
              }}
              key={chat?._id}
            >
              {!chat?.isGroupChat
                ? getSender(user, chat?.users)
                : chat?.chatName}
            </div>
          ))
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            Loading Chats...
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChats;
