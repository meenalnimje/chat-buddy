// import Chat from "@models/Chat";
// import User from "@models/User";
// import { connectToDB } from "@mongodb";
// import { pusherServer } from "@lib/pusher";

// // api to create a new chat room among members and currId.
// export const POST = async (req) => {
//   try {
//     await connectToDB();

//     const body = await req.json();

//     const { currentUserId, members, isGroup, name, groupPhoto } = body;

//     // Check is chat with user is already present or not
//     const query = isGroup
//       ? { isGroup, name, groupPhoto, members: [currentUserId, ...members] }
//       : {
//           members: { $all: [currentUserId, ...members], $size: 2 },
//           name: members[0].username,
//         };
//     let chat = await Chat.findOne(query);
//     if (!chat) {
//       chat = await new Chat(
//         isGroup ? query : { members: [currentUserId, ...members] }
//       );

//       await chat.save();

//       const updateAllMembers = chat.members.map(async (memberId) => {
//         await User.findByIdAndUpdate(
//           memberId,
//           {
//             $addToSet: { chats: chat._id },
//           },
//           { new: true }
//         );
//       });
//       Promise.all(updateAllMembers);

//       /* Trigger a Pusher event for each member to notify a new chat */
//       chat.members.map(async (member) => {
//         await pusherServer.trigger(member._id.toString(), "new-chat", chat);
//       });
//     }
//     return new Response(JSON.stringify(chat), { status: 200 });
//   } catch (err) {
//     console.error(err);
//     return new Response("Failed to create a new chat", { status: 500 });
//   }
// };

import Chat from "@models/Chat";
import User from "@models/User";
import { connectToDB } from "@mongodb";
import { pusherServer } from "@lib/pusher";

// API to create a new chat room among members and currentUserId.
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
    }

    // No chat exists, create a new one
    chat = new Chat(
      isGroup
        ? { isGroup, name, groupPhoto, members: [currentUserId, ...members] }
        : { isGroup: false, members: [currentUserId, ...members] }
    );

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
