"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

function Header() {
    const{user}=useUser();
  return (
    <div className="relative z-[9999] flex items-center justify-between p-4">
      <div className="flex gap-2 items-center">
        <Image
          src="/logo.png"
          alt="logo"
          width={40}
          height={40}
        />
        <h2 className="text-xl font-semibold">
        <span className="text-primary">UIUX </span>  MOCK
        </h2>
      </div>

      <ul className="flex gap-5 items-center text-lg">
        <li className="cursor-pointer hover:text-primary">
          Home
        </li>

        <li className="cursor-pointer hover:text-primary">
          Pricing
        </li>
      </ul>
      {!user? 
      <SignInButton mode="modal">
        <Button>Get Started</Button></SignInButton>
      :
      <UserButton/>
      }
     
    </div>
  );
}

export default Header;