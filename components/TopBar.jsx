"use client";

import { signOut, useSession } from "next-auth/react";

import Link from "next/link";
import { Logout } from "@mui/icons-material";
import React from "react";
import { usePathname } from "next/navigation";

const TopBar = () => {
  const pathname = usePathname();

  const handleLogout = async () => {
    signOut({ callbackUrl: "/" });
  };

  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="topbar">
      <Link href="/chats">
        <img src="/assets/logo.png" alt="logo" className="logo" />
      </Link>

      <div className="menu">
        <Link
          href="/chats"
          className={`${
            pathname === "/chats" ? "text-white" : ""
          } text-heading4-bold`}
        >
          Chats
        </Link>
        <Link
          href="/ai-chat"
          className={`${
            pathname === "/ai-chat" ? "text-white" : ""
          } text-heading4-bold`}
        >
          Chat with AI
        </Link>
        <Link
          href="/contacts"
          className={`${
            pathname === "/contacts" ? "text-white" : ""
          } text-heading4-bold`}
        >
          Contacts
        </Link>

        <Logout
          sx={{ color: "#737373", cursor: "pointer" }}
          onClick={handleLogout}
        />

        <Link href="/profile">
          <img
            src={user?.profileImage || "/assets/person.jpg"}
            alt="profile"
            className="profilePhoto"
          />
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
