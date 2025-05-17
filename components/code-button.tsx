"use client";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";
import { LayoutDashboard, UserPlus } from "lucide-react";

const CodeButton = () => {
  const { data: session } = useSession();

  return (
    <>
      <Button
        disabled={!session}
        size="lg"
        className="gap-2 bg-primary/90 hover:bg-primary hover:scale-105 transition-all duration-300"
      >
        <LayoutDashboard className="h-4 w-4" />
        <Link href="/dashboard">Dashboard</Link>
      </Button>
      <Button
        disabled={!session}
        size="lg"
        variant="outline"
        className="gap-2 backdrop-blur-sm border-white/20 hover:border-white/40 ml-4 hover:scale-105 transition-all duration-300"
      >
        <UserPlus className="h-4 w-4" />
        <Link href="/editor">Collaborate</Link>
      </Button>
    </>
  );
};

export default CodeButton;
