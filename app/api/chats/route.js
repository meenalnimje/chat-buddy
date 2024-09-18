import Chat from "@models/Chat";
import User from "@models/User";
import { connectToDB } from "@mongodb";
import { pusherServer } from "@lib/pusher";

// API to create a new chat room among members and currentUserId.
// export const POST = async (req) => {
//   try {
//     await connectToDB();

//     const body = await req.json();
//     const { currentUserId, members, isGroup, name, groupPhoto } = body;

//     let chat;

//     if (!isGroup && members.length === 1) {
//       // For one-on-one chat, check if there is already a chat between the two users
//       chat = await Chat.findOne({
//         isGroup: false,
//         members: { $all: [currentUserId, members[0]], $size: 2 },
//       });

//       if (chat) {
//         // Chat already exists between these two users, return it
//         return new Response(JSON.stringify(chat), { status: 200 });
//       }
//     }

//     // No chat exists, create a new one
//     chat = new Chat(
//       isGroup
//         ? { isGroup, name, groupPhoto, members: [currentUserId, ...members] }
//         : { isGroup: false,members: [currentUserId, ...members] }
//     );

//     await chat.save();

//     // Update all members to include this chat
//     const updateAllMembers = chat.members.map(async (memberId) => {
//       await User.findByIdAndUpdate(
//         memberId,
//         {
//           $addToSet: { chats: chat._id },
//         },
//         { new: true }
//       );
//     });
//     await Promise.all(updateAllMembers);

//     // Trigger a Pusher event for each member to notify them of a new chat
//     const triggerPromises = chat.members.map(async (member) => {
//       await pusherServer.trigger(member._id.toString(), "new-chat", chat);
//     });
//     await Promise.all(triggerPromises);

//     return new Response(JSON.stringify(chat), { status: 200 });
//   } catch (err) {
//     console.error(err);
//     return new Response("Failed to create a new chat", { status: 500 });
//   }
// };

export const POST = async (req) => {
  try {
    await connectToDB();

    const body = await req.json();
    const { currentUserId, members, isGroup, name, groupPhoto } = body;

    let chat;

    if (!isGroup && members.length === 1) {
      // For one-on-one chat, check if there is already a chat between the two users
      chat = await Chat.findOne({
        isGroup: false,
        members: { $all: [currentUserId, members[0]], $size: 2 },
      });

      if (chat) {
        // Chat already exists between these two users, return it
        return new Response(JSON.stringify(chat), { status: 200 });
      }

      // Fetch user details to generate the name field for one-on-one chat
      const currentUser = await User.findById(currentUserId);
      const otherUser = await User.findById(members[0]);

      const chatName = `${otherUser.username}`;

      // Create new one-on-one chat
      chat = new Chat({
        isGroup: false,
        name: chatName, // Set the name as a combination of the usernames
        members: [currentUserId, ...members],
      });
    } else {
      // Create a group chat
      chat = new Chat({
        isGroup,
        name,
        groupPhoto,
        members: [currentUserId, ...members],
      });
    }

    await chat.save();

    // Update all members to include this chat
    const updateAllMembers = chat.members.map(async (memberId) => {
      await User.findByIdAndUpdate(
        memberId,
        {
          $addToSet: { chats: chat._id },
        },
        { new: true }
      );
    });
    await Promise.all(updateAllMembers);

    // Trigger a Pusher event for each member to notify them of a new chat
    const triggerPromises = chat.members.map(async (member) => {
      await pusherServer.trigger(member._id.toString(), "new-chat", chat);
    });
    await Promise.all(triggerPromises);

    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to create a new chat", { status: 500 });
  }
};
