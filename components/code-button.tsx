'use client'
import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";


const CodeButton = () => {
    const { data: session } = useSession();
    console.log(session)
    return (
      <Button disabled={!session} size="lg">
          <Link href="/editor">Start Coding</Link>
      </Button>
    );
}

export default CodeButton;