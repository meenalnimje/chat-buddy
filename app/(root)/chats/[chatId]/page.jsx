"use client";

import { useEffect, useState } from "react";

import ChatDetails from "@components/ChatDetails";
import ChatList from "@components/ChatList";
import { pusherClient } from "@lib/pusher"; // Import your existing pusherClient
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

const ChatPage = () => {
  const { chatId } = useParams();

  const { data: session } = useSession();
  const currentUser = session?.user;

  const [updatedMessage, setUpdatedMessage] = useState(null); // To track real-time updates

  // Function to mark messages as seen
  const seenMessages = async () => {
    try {
      await fetch(`/api/chats/${chatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUserId: currentUser._id,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Initialize Pusher client and listen for message updates
  useEffect(() => {
    if (currentUser && chatId) {
      // Mark messages as seen when the chat page is loaded
      seenMessages();

      // Subscribe to the Pusher channel for this user (currentUser._id)
      const channel = pusherClient.subscribe(currentUser._id.toString());

      // Listen for real-time message update events
      channel.bind("update-message", (data) => {
        if (data.chatId === chatId) {
          // If the message belongs to the current chat, update the UI
          setUpdatedMessage(data);
        }
      });

      // Clean up the Pusher subscription when the component is unmounted
      return () => {
        pusherClient.unsubscribe(currentUser._id.toString());
      };
    }
  }, [currentUser, chatId]);

  return (
    <div className="main-container">
      <div className="w-1/3 max-lg:hidden">
        <ChatList currentChatId={chatId} />
      </div>
      <div className="w-2/3 max-lg:w-full">
        <ChatDetails chatId={chatId} updatedMessage={updatedMessage} />
      </div>
    </div>
  );
};

export default ChatPage;
