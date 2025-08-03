'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function BreadCrumbNavigation() {
  const pathname = usePathname();
  
  // Split the pathname into segments (filtering out empty ones)
  const segments = pathname.split('/').filter(Boolean);

  // Only display breadcrumbs if there is more than one segment
  if (segments.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="my-4">
      <ol className="flex items-center justify-center space-x-2 mx-auto w-full md:w-fit md:px-20 flex-wrap" style={{
        backgroundImage: 'radial-gradient(circle at center, var(--accent) -800%, transparent 100%)'
      }}>
        {segments.map((segment, index) => {
          const href = '/' + segments.slice(0, index + 1).join('/');
          const isLast = index === segments.length - 1;

          return (
            <li key={href} className="flex items-center">
              {!isLast ? (
                <Link href={href} className="text-accent hover:underline">
                  {decodeURIComponent(segment)}
                </Link>
              ) : (
                <span className="text-gray-500">{decodeURIComponent(segment)}</span>
              )}
              {!isLast && <span className="mx-2 text-gray-400">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
