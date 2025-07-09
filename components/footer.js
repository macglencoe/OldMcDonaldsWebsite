'use client';
import { Compass, FacebookLogo, InstagramLogo, Phone } from 'phosphor-react';
import Link from 'next/link';

const socialLinks = [
  { href: 'https://www.facebook.com', icon: <FacebookLogo size={32} style={{ color: 'var(--background)' }} weight="duotone" /> },
  { href: 'https://www.instagram.com', icon: <InstagramLogo size={32} style={{ color: 'var(--background)' }} weight="duotone" /> },
];

const quickLinks = [
];

const activities = [
];

// === Reusable Components ===

const FooterLinkList = ({ title, icon, links }) => (
  <nav className="flex flex-1 flex-col gap-2 my-4 px-4 hover:[&>h2]:opacity-100">
    <h2 className="flex items-center gap-2 text-lg font-semibold uppercase border-b-4 border-[var(--accent)] opacity-70">
      {icon} {title}
    </h2>
    <ul className="grid grid-flow-col grid-rows-4 gap-y-2 gap-x-6 px-2">
      {links.map(({ href, text }) => (
        <li key={href} className="list-none min-w-max text-[var(--background)] opacity-70 hover:opacity-100">
          <Link href={href}>{text}</Link>
        </li>
      ))}
    </ul>
  </nav>
);

const Footer = () => {
  return (
    <div className="flex flex-col pt-2 bg-[var(--foreground)] text-[var(--background)]">
      <div className="flex flex-wrap justify-evenly">
        {/* Brand & Socials */}
        <div className="flex flex-col items-center justify-evenly text-center gap-4 p-4 flex-1">
          <img src="/logo.png" alt="Old McDonalds Logo" />
          <div className="flex gap-4">
            {socialLinks.map(link => (
              <a key={link.href} href={link.href}>
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-col items-center justify-center p-8 flex-1">
          <h2 className="text-xl font-semibold uppercase opacity-70 hover:opacity-100">Call Us</h2>
          <a
            href="tel:304-839-2330"
            className="flex items-center gap-2 text-[var(--background)] font-semibold border-4 border-[var(--background)] px-4 py-2 mt-2 opacity-70 hover:opacity-100 whitespace-nowrap"
          >
            <Phone size={32} style={{ color: 'var(--background)' }} weight="duotone" /> (304) 839-2330
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-wrap justify-end items-center gap-4 border-t border-[var(--accent)] py-2 px-4">
        <a href="/privacy-policy" className="text-[var(--background)] opacity-70 hover:opacity-100">
          Privacy Policy
        </a>
        <span className="text-[var(--background)] opacity-70">© 2025 Old McDonalds Pumpkin Patch LLC. All Rights Reserved</span>
      </div>
    </div>
  );
};

export default Footer;
