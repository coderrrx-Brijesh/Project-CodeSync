"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

const ProfileLogo = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      {/* AVATAR TRIGGER BUTTON */}
      <DropdownMenuTrigger asChild>
        <button
          className="
            relative 
            group 
            flex 
            items-center 
            justify-center 
            w-14 h-14
            cursor-pointer
            focus:outline-none
            transition-transform
            duration-300
            ease-out
            hover:scale-105
          "
        >
          {/* --- WHITE RING BEHIND THE AVATAR --- */}
          <div
            className="
              absolute
              inset-0
              z-10
              rounded-full
              border-4 border-white
              scale-90
              group-hover:scale-105
              group-hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]
              transition-all
              duration-300
              ease-out
            "
          />

          {/* --- AVATAR --- */}
          <Avatar
            className="
              w-12 h-12 
              rounded-full 
              ring-2 ring-transparent
              bg-gray-700
              transition-opacity
              duration-300
              hover:opacity-90
            "
          >
            <AvatarImage
              src={session?.user?.image || ""}
              alt="Profile"
            />
            <AvatarFallback className="bg-gray-700 text-white">
              {session?.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      {/* DROPDOWN MENU CONTENT */}
      <DropdownMenuContent
        align="end"
        className="
          w-64
          mt-2
          rounded-xl
          border border-[#444]
          bg-[#111]
          text-white
          shadow-xl
          overflow-hidden
          transform-gpu
          transition-all
          duration-500
          ease-in-out
          data-[state=closed]:scale-95
          data-[state=closed]:opacity-0
          data-[state=open]:scale-100
          data-[state=open]:opacity-100
        "
      >
        {/* USER INFO */}
        <div className="p-4">
          <p className="text-base font-semibold">
            {session?.user?.name || session?.user?.firstName + " " + session?.user?.lastName || "User"}
          </p>
          <p className="text-sm text-gray-400">
            {session?.user?.email}
          </p>
        </div>

        {/* OPTIONAL DIVIDER */}
        <div className="border-t border-[#333]" />

        {/* EDIT PROFILE & SIGN OUT */}
        <DropdownMenuItem
          className="
            px-4 py-3
            hover:bg-zinc-950
            flex
            flex-col
            gap-2
          "
        >
          <Button onClick={() => router.push("/profile")}>Edit Profile</Button>
          <Button variant="outline" onClick={() => signOut()}>
            Sign Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileLogo;
