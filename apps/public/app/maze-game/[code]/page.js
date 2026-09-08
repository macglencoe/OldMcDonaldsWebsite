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

  // Invalid codes return to the game automatically. Valid stations remain
  // visible so visitors have time to read their history and phrase word.
  useEffect(() => {
    if (status !== 'invalid') return;
    const timer = setTimeout(() => {
      router.replace('/maze-game');
    }, 4000);
    return () => clearTimeout(timer);
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
        <h1 className="text-2xl font-semibold mb-2">Invalid Code</h1>
        <p className="text-lg">
          The code &quot;<code className="font-mono">{code}</code>&quot; isn&apos;t recognized.
        </p>
        <p className="mt-4 text-sm opacity-70">
          Redirecting back in 4 seconds...
        </p>
      </div>
    );
  }

  // status === 'valid'
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-xl flex-col items-center text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest opacity-70">
          250 Years Maze Challenge
        </p>
        <h1 className="mb-2 text-3xl font-bold">You found the {item.name}!</h1>
        <h2 className="mb-5 text-xl font-semibold">{item.heading}</h2>
        <img
          src={item.img}
          alt={item.name}
          className="mb-6 aspect-square w-full max-w-xs rounded-lg object-cover shadow-lg"
        />
        <p className="mb-6 text-lg leading-relaxed">{item.blurb}</p>

        <div className="mb-6 w-full rounded-lg border border-black/15 bg-accent/20 px-5 py-4">
          <p className="text-sm font-semibold uppercase tracking-wider opacity-70">
            Your phrase word
          </p>
          <p className="mt-1 text-3xl font-bold tracking-wide">{item.phraseWord}</p>
        </div>

        <button
          type="button"
          onClick={() => router.replace('/maze-game')}
          className="rounded bg-accent px-6 py-3 font-semibold !text-white hover:bg-accent/70"
        >
          Continue to Maze Game
        </button>
      </div>
    </main>
  );
}
