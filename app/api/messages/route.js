import Chat from "@models/Chat";
import Message from "@models/Message";
import User from "@models/User";
import { connectToDB } from "@mongodb";
import { pusherServer } from "@lib/pusher";

export const POST = async (req) => {
  try {
    await connectToDB();

    const body = await req.json();

    const { chatId, currentUserId, text, photo } = body;

    const currentUser = await User.findById(currentUserId);

    const newMessage = await Message.create({
      chat: chatId,
      sender: currentUser,
      text,
      photo,
      seenBy: currentUserId,
    });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { messages: newMessage._id },
        $set: { lastMessageAt: newMessage.createdAt },
      },
      { new: true }
    )
      .populate({
        path: "messages",
        model: Message,
        populate: { path: "sender seenBy", model: "User" },
      })
      .populate({
        path: "members",
        model: "User",
      })
      .exec();

    /* Trigger a Pusher event for a specific chat about the new message */
    await pusherServer.trigger(chatId, "new-message", newMessage);

    /* Triggers a Pusher event for each member of the chat about the chat update with the latest message */
    const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];
    updatedChat.members.forEach(async (member) => {
      try {
        await pusherServer.trigger(member._id.toString(), "update-chat", {
          id: chatId,
          messages: [lastMessage],
        });
      } catch (err) {
        console.error(`Failed to trigger update-chat event`);
      }
    });

    return new Response(JSON.stringify(newMessage), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to create new message", { status: 500 });
  }
};

// export const PUT = async (req) => {
//   try {
//     await connectToDB();

//     const { messageId, newText, currentUserId } = await req.json();

//     // Find the message by its ID
//     const message = await Message.findById(messageId);

//     if (!message) {
//       return new Response("Message not found", { status: 404 });
//     }

//     // Update the text of the message
//     message.text = newText;
//     await message.save();

//     // Fetch updated chat and populate necessary fields
//     const updatedChat = await Chat.findById(message.chat)
//       .populate({
//         path: "messages",
//         model: Message,
//         populate: { path: "sender seenBy", model: "User" },
//       })
//       .populate({
//         path: "members",
//         model: "User",
//       })
//       .exec();

//     // Trigger Pusher to update all chat members in real-time
//     await pusherServer.trigger(message.chat.toString(), "update-message", {
//       messageId: messageId,
//       newText: newText,
//       chatId: message.chat,
//     });

//     // Optionally, you can also trigger a chat update event for all members
//     updatedChat.members.forEach(async (member) => {
//       try {
//         await pusherServer.trigger(member._id.toString(), "update-chat", {
//           id: message.chat,
//           messages: updatedChat.messages,
//         });
//       } catch (err) {
//         console.error(`Failed to trigger update-chat event`, err);
//       }
//     });

//     return new Response(JSON.stringify(message), { status: 200 });
//   } catch (err) {
//     console.error(err);
//     return new Response("Failed to edit message", { status: 500 });
//   }
// };

export const PUT = async (req) => {
  try {
    await connectToDB();

    const { messageId, newText, currentUserId } = await req.json();

    // Find the message by its ID
    const message = await Message.findById(messageId);

    if (!message) {
      return new Response("Message not found", { status: 404 });
    }

    // Update the text of the message
    message.text = newText;
    await message.save();

    // Fetch updated chat and populate necessary fields
    const updatedChat = await Chat.findById(message.chat)
      .populate({
        path: "messages",
        model: Message,
        populate: { path: "sender seenBy", model: "User" },
      })
      .populate({
        path: "members",
        model: "User",
      })
      .exec();

    // Trigger Pusher to update all chat members in real-time
    await pusherServer.trigger(message.chat.toString(), "update-message", {
      messageId: messageId,
      newText: newText,
      chatId: message.chat,
    });

    // Optionally, you can also trigger a chat update event for all members
    const chatUpdatePayload = {
      chatId: message.chat,
      lastMessage: {
        _id: messageId,
        text: newText,
        sender: message.sender,
        timestamp: message.timestamp,
      },
    };

    updatedChat.members.forEach(async (member) => {
      try {
        await pusherServer.trigger(
          member._id.toString(),
          "update-chat",
          chatUpdatePayload
        );
      } catch (err) {
        console.error(`Failed to trigger update-chat event`, err);
      }
    });

    return new Response(JSON.stringify(message), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to edit message", { status: 500 });
  }
};
