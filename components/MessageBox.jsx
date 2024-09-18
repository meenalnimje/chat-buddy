// import { useEffect, useState } from "react";

// import { format } from "date-fns";
// import { pusherClient } from "@lib/pusher";

// const MessageBox = ({ message, currentUser, chatId }) => {
//   const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
//   const [editText, setEditText] = useState(message?.text); // State to hold new text
//   const [updatedMessage, setUpdatedMessage] = useState(message?.text);

//   const handleEdit = async (messageId, newText) => {
//     try {
//       const response = await fetch("/api/messages", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           messageId,
//           newText,
//           currentUserId: currentUser._id,
//         }),
//       });
//       if (response.ok) {
//         // The message is updated successfully on the server.
//         // Optionally, you can set `updatedMessage` here as well
//         // But it will be updated automatically via Pusher
//       } else {
//         console.log("response of message Box", response);
//       }
//     } catch (err) {
//       console.log("error from message box", err);
//     } finally {
//       setIsEditing(false);
//     }
//   };

//   useEffect(() => {
//     // Subscribe to the chat channel
//     const channel = pusherClient.subscribe(chatId);

//     // Listen for the 'update-message' event
//     channel.bind("update-message", (data) => {
//       if (data.messageId === message._id) {
//         setUpdatedMessage(data.newText); // Update the message in real-time
//       }
//     });

//     // Cleanup subscription on unmount
//     return () => {
//       channel.unbind_all();
//       pusherClient.unsubscribe(chatId);
//     };
//   }, [chatId, message._id]); // Ensure these dependencies are correct

//   return message?.sender?._id !== currentUser._id ? (
//     <div className="message-box">
//       <img
//         src={message?.sender?.profileImage || "/assets/person.jpg"}
//         alt="profile photo"
//         className="message-profilePhoto"
//       />
//       <div className="message-info">
//         <p className="text-small-bold">
//           {message?.sender?.username} &#160; &#183; &#160;
//           {format(new Date(message?.createdAt), "p")}
//         </p>

//         {message?.text ? (
//           <p className="message-text">{updatedMessage}</p> // Display the updated text
//         ) : (
//           <img src={message?.photo} alt="message" className="message-photo" />
//         )}
//       </div>
//     </div>
//   ) : (
//     <div className="message-box justify-end">
//       <div className="message-info items-end">
//         <p className="text-small-bold">
//           {format(new Date(message?.createdAt), "p")}
//         </p>

//         {isEditing ? (
//           <div>
//             <input
//               type="text"
//               value={editText}
//               onChange={(e) => setEditText(e.target.value)}
//               className="edit-input"
//             />
//             <button
//               onClick={() => handleEdit(message._id, editText)}
//               className="edit-submit-button"
//             >
//               Save
//             </button>
//           </div>
//         ) : (
//           <>
//             <p className="message-text-sender">
//               {updatedMessage}
//               {message?.text !== updatedMessage && (
//                 <span style={{ color: "red" }}> (edited)</span>
//               )}
//             </p>
//             <button onClick={() => setIsEditing(true)} className="edit-button">
//               Edit
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MessageBox;

import { useEffect, useState } from "react";

import { format } from "date-fns";
import { pusherClient } from "@lib/pusher";

const MessageBox = ({ message, currentUser, chatId }) => {
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [editText, setEditText] = useState(message?.text); // State to hold new text
  const [updatedMessage, setUpdatedMessage] = useState(message?.text);
  const [isEdited, setIsEdited] = useState(false); // State to track if the message is edited

  const handleEdit = async (messageId, newText) => {
    try {
      const response = await fetch("/api/messages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId,
          newText,
          currentUserId: currentUser._id,
        }),
      });
      if (response.ok) {
        // Optionally set `isEdited` to false or handle it if needed
      } else {
        console.log("response of message Box", response);
      }
    } catch (err) {
      console.log("error from message box", err);
    } finally {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    // Subscribe to the chat channel
    const channel = pusherClient.subscribe(chatId);

    // Listen for the 'update-message' event
    channel.bind("update-message", (data) => {
      if (data.messageId === message._id) {
        setUpdatedMessage(data.newText); // Update the message in real-time
        setIsEdited(true); // Set the edited status
      }
    });

    // Cleanup subscription on unmount
    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(chatId);
    };
  }, [chatId, message._id]);

  return message?.sender?._id !== currentUser._id ? (
    <div className="message-box">
      <img
        src={message?.sender?.profileImage || "/assets/person.jpg"}
        alt="profile photo"
        className="message-profilePhoto"
      />
      <div className="message-info">
        <p className="text-small-bold">
          {message?.sender?.username} &#160; &#183; &#160;
          {format(new Date(message?.createdAt), "p")}
        </p>

        {message?.text ? (
          <p className="message-text">{updatedMessage}</p> // Display the updated text
        ) : (
          <img src={message?.photo} alt="message" className="message-photo" />
        )}
        {isEdited && <span style={{ color: "red" }}>(edited)</span>}
      </div>
    </div>
  ) : (
    <div className="message-box justify-end">
      <div className="message-info items-end">
        <p className="text-small-bold">
          {format(new Date(message?.createdAt), "p")}
        </p>

        {isEditing ? (
          <div>
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="edit-input"
            />
            <button
              onClick={() => handleEdit(message._id, editText)}
              className="edit-submit-button"
            >
              Save
            </button>
          </div>
        ) : (
          <>
            <p className="message-text-sender bg-green-800 ">
              {updatedMessage}
              {isEdited && <span style={{ color: "red" }}> (edited)</span>}
            </p>
            <button onClick={() => setIsEditing(true)} className="edit-button">
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
