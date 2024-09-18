import "../globals.css";

import BottomBar from "@components/BottomBar";
import { Inter } from "next/font/google";
import Provider from "@components/Provider";
import TopBar from "@components/TopBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chat-Buddy",
  description: "A Next.js 14 Chat App ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-blue-2`}>
        <Provider>
          <TopBar />
          {children}
          <BottomBar />
        </Provider>
      </body>
    </html>
  );
}
