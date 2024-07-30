import Link from "next/link";
import React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="">
      <nav className="flex sticky top-0 bg-slate-800 text-white h-12">
        <ul className="flex gap-4 justify-between w-full items-center px-4">
          <div className="flex gap-4 items-center">
            <Link href={"/"} className="text-xl">
              SummerCamp
            </Link>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/">Camps</Link>
            </li>
          </div>
          <div className="flex gap-4 items-center">
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/register">Register</Link>
            </li>
          </div>
        </ul>
      </nav>
      <div className="items-center justify-center flex min-h-screen w-full">
        <Card>
          <Image
            src="https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80"
            alt="Login background"
            className="card-img-top"
            width={363}
            height={205}
          />
          {children}
        </Card>
      </div>
    </main>
  );
};

export default Layout;
