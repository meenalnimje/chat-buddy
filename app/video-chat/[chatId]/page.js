"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation"; // Import useParams to get route params

const DynamicVideoUI = dynamic(
  () => import("../../../components/videocall/Videocallkit"),
  { ssr: false }
);

export default function VideoCall() {
  const { chatId } = useParams(); // Extract chatId from the dynamic route

  return <DynamicVideoUI chatId={chatId} />; // Pass chatId as a prop to Videocallkit
}
