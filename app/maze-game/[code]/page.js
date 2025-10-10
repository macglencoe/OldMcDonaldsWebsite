'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { track } from '@vercel/analytics';

export default function MazeCodePage() {
  const { code } = useParams();
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [item, setItem] = useState(null);

  // Load and validate the code
  useEffect(() => {
    if (!code) return;

    fetch('/data/maze-game.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch codes');
        return res.json();
      })
      .then((data) => {
        const entry = data[code];
        if (entry) {
          // record in localStorage under "maze-game"
          try {
            const found = JSON.parse(localStorage.getItem('maze-game') || '[]');
            if (!found.includes(code)) {
              found.push(code);
              localStorage.setItem('maze-game', JSON.stringify(found));
            }
          } catch {
            localStorage.setItem('maze-game', JSON.stringify([code]));
          }
          setItem(entry);
          setStatus('valid');
          track('Found Maze Code', { code });
        } else {
          setStatus('invalid');
        }
      })
      .catch(() => {
        setStatus('invalid');
      });
  }, [code]);

  // After showing the result, wait 4 seconds then redirect
  useEffect(() => {
    if (status === 'loading') return;
    const timer = setTimeout(() => {
      router.replace('/maze-game');
    }, 4000);
    return () => clearTimeout(timer);
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading…</p>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
        <h1 className="text-2xl font-semibold mb-2">Invalid Code</h1>
        <p className="text-lg">
          The code "<code className="font-mono">{code}</code>" isn’t recognized.
        </p>
        <p className="mt-4 text-sm opacity-70">
          Redirecting back in 4 seconds…
        </p>
      </div>
    );
  }

  // status === 'valid'
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">You found: {item.name}</h1>
      <img
        src={item.img}
        alt={item.name}
        className="max-w-xs mb-6 rounded-lg shadow-lg"
      />
      <p className="text-lg mb-4">Great job finding the {item.name} code!</p>
      <p className="text-sm opacity-70">Redirecting back in 4 seconds…</p>
    </div>
  );
}
