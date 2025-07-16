'use client';
import { Compass, FacebookLogo, InstagramLogo, Phone } from 'phosphor-react';
import Link from 'next/link';

const socialLinks = [
  { href: 'https://www.facebook.com/oldmcdonaldspumpkinpatchandcornmaze', icon: <FacebookLogo size={32} style={{ color: 'var(--background)' }} weight="duotone" /> },
  { href: 'https://www.instagram.com/oldmcdonaldspumpkin/', icon: <InstagramLogo size={32} style={{ color: 'var(--background)' }} weight="duotone" /> },
];

const quickLinks = [
  { href: '/visit', text: 'Visit' },
  { href: '/about', text: 'About' },
  { href: '/activities', text: 'Activities' },
  { href: '/faq', text: 'FAQ' },
  { href: '/reservations', text: 'Reservations' },
  { href: '/gallery', text: 'Gallery' },
  { href: '/vendors', text: 'Vendors' },
  { href: '/map', text: 'Map' },
];

const activities = [
  { href: '/activities/pumpkin-patch', text: 'Pumpkin Patch' },
  { href: '/activities/corn-maze', text: 'Corn Maze' },
  { href: '/night-maze', text: 'Night Maze' },
  { href: '/maze-game', text: 'Maze Game' },
  { href: '/activities/hayrides', text: 'Hayrides' },
  { href: '/activities/nature-trails', text: 'Nature Trails' },
  { href: '/activities/flower-fields', text: 'Flower Fields' }
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

        {/* Quick Links */}
        <FooterLinkList
          title="Waypoints"
          icon={<Compass size={32} style={{ color: 'var(--accent)' }} weight="duotone" />}
          links={quickLinks}
        />

        {/* Activities */}
        <FooterLinkList
          title="Things to Do"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--accent)" viewBox="0 0 256 256">
              <path d="M224,160H160L192,32Z" opacity="0.2" />
              <path d="M232,192H200V168h24a8,8,0,0,0,7.76-9.94l-32-128a8,8,0,0,0-15.52,0l-32,128A8,8,0,0,0,160,168h24v24H120V176h8a8,8,0,0,0,0-16h-8V144h8a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16h8v16H40a8,8,0,0,0,0,16h8v16H24a8,8,0,0,0,0,16H232a8,8,0,0,0,0-16ZM192,65l21.75,87h-43.5ZM64,144h40v16H64Zm0,32h40v16H64Zm52-80A28,28,0,1,0,88,68,28,28,0,0,0,116,96Zm0-40a12,12,0,1,1-12,12A12,12,0,0,1,116,56Z" />
            </svg>
          }
          links={activities}
        />

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
        <a href="/attribution" className="text-[var(--background)] opacity-70 hover:opacity-100">
          Attribution
        </a>
        <span className="text-[var(--background)] opacity-70">© 2025 Old McDonalds Pumpkin Patch LLC. All Rights Reserved</span>
      </div>
    </div>
  );
};

export default Footer;
