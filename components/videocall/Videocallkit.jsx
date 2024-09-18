import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useRouter } from "next/navigation";

export default function Videocallkit({ chatId }) {
  const router = useRouter();
  const myMeeting = async (element) => {
    const appId = +process.env.NEXT_PUBLIC_ZEGO_APP_ID;
    const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;
    // kittioken to create the meeting instance
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      chatId,
      Date.now().toString(),
      "jwdijiw"
    );
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    const baseurl = window.location.origin;
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "personal link",
          url: `${baseurl}/video-chat/${chatId}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
    });
  };
  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
}
