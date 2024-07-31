import Link from "next/link";
import React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="">
      <nav className="flex sticky top-0 bg-slate-800 z-20 text-white h-12">
        <ul className="flex gap-4 justify-between w-full items-center px-4">
          <div className="flex gap-4 items-center">
            <Link href={"/"} className="text-xl">
              SummerCamp
            </Link>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/campgrounds">Campgrounds</Link>
            </li>
            <li>
              <Link href="/campgrounds/new">New Campgrounds</Link>
            </li>
          </div>
          <div className="flex gap-4 items-center">
            <li>
              <Link href="/">Logout</Link>
            </li>
          </div>
        </ul>
      </nav>
      <div className="items-center justify-center flex min-h-screen w-full">
        {children}
      </div>
    </main>
  );
};

export default Layout;
