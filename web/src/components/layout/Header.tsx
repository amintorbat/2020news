import Image from "next/image";
import Link from "next/link";
import { NavMenu } from "./NavMenu";

export function Header() {
  return (
    <header className="border-b border-default bg-background">
      <div className="container h-16 flex items-center gap-8">
        <NavMenu />
        <Image src="/images/logo.png" alt="لوگوی ۲۰۲۰نیوز" width={120} height={40} priority />
      </div>
    </header>
  );
}
