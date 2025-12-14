import Link from "next/link";
import Image from "next/image";
import { NavMenu } from "./NavMenu";

export function Header() {
  return (
    <header className="border-b border-default bg-background">
      <div className="container h-16 flex items-center justify-between">
        <Image src="/logo.png" alt="Logo" width={120} height={40} />

        <NavMenu />
      </div>
    </header>
  );
}
