"use client";
import {useSession} from "next-auth/react";

export default function Home() {
    const { data: session, status } = useSession();
    return (
    <main className="text-center">
      <h1 className="text-4xl">Home</h1>
      <h3 className="text-xl">Welcome 🙂 {session?.user?.email}</h3>
    </main>
  )
}
