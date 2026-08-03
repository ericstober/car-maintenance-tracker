"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/vehicles", label: "Garage" },
  { href: "/maintenance", label: "Upcoming maintenance" },
];

const Header = () => {
  const pathname = usePathname();

  return (
    <header className='border-b border-neutral-200'>
      <div className='mx-auto flex max-w-3xl items-center justify-between px-6 py-4'>
        <Link href='/vehicles' className='font-mono text-sm font-semibold text-neutral-900'>
          garage log
        </Link>
        <nav className='flex gap-6'>
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive ? "text-sm font-medium text-neutral-900" : "text-sm text-neutral-500 hover:text-neutral-800"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;
