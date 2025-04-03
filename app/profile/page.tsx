"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { motion } from "framer-motion";
interface User {
  name?: string;
  email?: string;
  image?: string;
  location?: string;
  website?: string;
  bio?: string;
  [key: string]: any;
}

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Always call hooks in same order
  const [user, setUser] = useState<User>({});
  const [editMode, setEditMode] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  // Update state when session changes
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
    if (session?.user) {
      const sessionUser = session.user as User;
      console.log(sessionUser);
      setUser({
        name: sessionUser.name || sessionUser.firstName + " " + sessionUser.lastName || "",
        email: sessionUser.email || "",
        image: sessionUser.image,
        location: sessionUser.location || "",
        website: sessionUser.website || "",
        bio: sessionUser.bio || "",
      });
      setAvatarPreview(sessionUser.image || "");
    }
  }, [session, status, router]);

  // Handle text input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Toggle edit mode & reset changes based on session values
  const handleEditToggle = () => {
    if (session?.user) {
      const sessionUser = session.user as User;
      setUser({
        name: sessionUser.name || "",
        email: sessionUser.email || "",
        image: sessionUser.image,
        location: sessionUser.location || "",
        website: sessionUser.website || "",
        bio: sessionUser.bio || "",
      });
      setAvatarPreview(sessionUser.image || "" );
    }
    setEditMode((prev) => !prev);
    setAvatarFile(null);
  };

  // Save changes (simulate API call)
  const handleSave = async () => {
    // Simulate an API call here, then update state
    setUser({ ...user, image: avatarPreview });
    setEditMode(false);
  };

  // Gather any extra fields from session.user that are not in our known list
  const knownFields = ["name", "email", "image", "location", "website", "bio"];
  const extraFields =
    session?.user && typeof session.user === "object"
      ? Object.keys(session.user).filter((key) => !knownFields.includes(key))
      : [];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0F0F0F] to-[#070707] text-white flex flex-col items-center py-10 px-4">
      {(status === "loading" || !session?.user) && (
        <div className="min-h-screen flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                    />
                    {/* Loading... */}
        </div>
      )}

      {status !== "loading" && session?.user && (
        <>
          <h1 className="text-4xl font-bold mb-8 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">
            Profile
          </h1>

          <div className="w-full max-w-3xl rounded-xl shadow-2xl bg-[#1A1A1A]/90 p-8 border border-white relative overflow-hidden">
            {/* Subtle Glow / Gradient Accent */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent rounded-xl pointer-events-none" />

            {!editMode ? (
              <div className="flex flex-col items-center md:flex-row md:items-start gap-8 relative z-10">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <Avatar className="w-32 h-32 ring-4 ring-white ring-offset-2 ring-offset-[#1A1A1A]">
                    <AvatarImage src={user.image} alt="Profile Avatar" />
                    <AvatarFallback className="bg-white text-black">
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* User Details */}
                <div className="flex-1 space-y-5">
                    <div>
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-white text-sm">{user.email}</p>
                    </div>

                    <div className="space-y-4">
                        {user.location && (
                            <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold uppercase">Location:</h3>
                            <p className="text-sm font-light">{user.location}</p>
                            </div>
                        )}

                        {user.website && (
                            <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold uppercase">Website:</h3>
                            <a
                                href={user.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-light hover:underline"
                            >
                                {user.website}
                            </a>
                            </div>
                        )}

                        {user.bio && (
                            <div>
                            <h3 className="text-xs font-bold uppercase mb-1">Bio:</h3>
                            <p className="text-sm font-light">{user.bio}</p>
                            </div>
                        )}
                    </div>


                  <div>
                    <Button
                      variant="default"
                      className="bg-gradient-to-r from-white to-white hover:from-white hover:to-white text-black font-semibold px-6 py-2 rounded-full"
                      onClick={handleEditToggle}
                    >
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative z-10">
                <div className="flex flex-col items-center sm:flex-row gap-6 mb-8">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <Image
                      src={avatarPreview}
                      alt="Avatar Preview"
                      fill
                      className="rounded-full object-cover ring-4 ring-white ring-offset-2 ring-offset-[#1A1A1A]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block mb-1 font-medium">
                      Update Avatar
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="flex bg-[#1A1A1A] text-white file:cursor-pointer file:bg-neutral-500 file:text-white file:border-0 file:px-4 file:mr-4 "
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <Input
                      type="text"
                      name="name"
                      value={user.name || ""}
                      onChange={handleChange}
                      className="bg-[#1A1A1A] text-white"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <Input
                      type="email"
                      name="email"
                      value={user.email || ""}
                      disabled
                      className="bg-[#070707] text-white cursor-not-allowed"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="block mb-1 font-medium">Location</label>
                    <Input
                      type="text"
                      name="location"
                      value={user.location || ""}
                      onChange={handleChange}
                      className="bg-[#1A1A1A] text-white"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Website</label>
                    <Input
                      type="url"
                      name="website"
                      value={user.website || ""}
                      onChange={handleChange}
                      className="bg-[#1A1A1A] text-white"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-1 font-medium">Bio</label>
                  <Textarea
                    name="bio"
                    value={user.bio || ""}
                    onChange={handleChange}
                    className="bg-[#1A1A1A] text-white"
                  />
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button
                    variant="default"
                    className="bg-gradient-to-r from-white to-white text-black font-semibold px-6 py-2 rounded-full"
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    className="border border-white text-white rounded-full px-6 py-2"
                    onClick={handleEditToggle}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
