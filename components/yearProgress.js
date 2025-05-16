'use client';

import { useEffect, useState } from 'react';

export default function YearProgressBar({ highlightStart, highlightEnd }) {
  const [simulatedDate, setSimulatedDate] = useState(() => new Date());
  const [yearProgress, setYearProgress] = useState(0);
  const [highlightRange, setHighlightRange] = useState({ start: 0, end: 0 });

  useEffect(() => {
    const updateProgress = () => {
      const startOfYear = new Date(simulatedDate.getFullYear(), 0, 1);
      const endOfYear = new Date(simulatedDate.getFullYear() + 1, 0, 1);

      const yearElapsed = simulatedDate - startOfYear;
      const yearDuration = endOfYear - startOfYear;
      const progressPercent = (yearElapsed / yearDuration) * 100;
      setYearProgress(progressPercent);

      if (highlightStart && highlightEnd) {
        const startDate = new Date(highlightStart);
        const endDate   = new Date(highlightEnd);

        const startPct = ((startDate - startOfYear) / yearDuration) * 100;
        const endPct   = ((endDate   - startOfYear) / yearDuration) * 100;

        setHighlightRange({
          start: Math.max(0, Math.min(100, startPct)),
          end:   Math.max(0, Math.min(100, endPct)),
        });
      }
    };

    updateProgress();
  }, [highlightStart, highlightEnd, simulatedDate]);

  return (
    <div className="relative w-full">
      <div className='relative w-full h-6 bg-background overflow-hidden'>
          {/* Highlighted Range */}
          {highlightStart && highlightEnd && (
            <div
              className="absolute top-0 h-full bg-accent border-y-3 border-background"
              style={{
                left:  `${highlightRange.start}%`,
                width: `${highlightRange.end - highlightRange.start}%`,
              }}
            >
            </div>
          )}
    
          {/* Year Progress */}
          <div
            className="h-full bg-foreground border-3 border-background"
            style={{ width: `${yearProgress}%`, zIndex: 3 }}
          />
      </div>

      {/* Current-Point Circle */}
      <div
        className="absolute top-0 w-6 h-full bg-foreground border-3 border-background rounded-full"
        style={{
          backgroundColor: simulatedDate >= new Date(highlightStart) && simulatedDate <= new Date(highlightEnd) ? 'var(--accent)' : 'var(--foreground)',
          left:      `${yearProgress}%`,
          transform: 'translateX(-50%)',
          zIndex:    3,
        }}
      />

      {/* Current-Point Label*/}
      <span
        className="absolute top-0  h-full text-sm font-bold text-background text-nowrap flex flex-col items-center justify-center bg-foreground w-fit px-2 py-1 text-[0.8rem] sm:text-base"
        style={{
          left:      `${yearProgress}%`,
          top:    '-100%',
          transform: 'translateX(-50%)',
          zIndex:    2,
        }}
      >
        {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(simulatedDate)}
      </span>

      {/* Season-Start Label */}
      <span
        className="absolute top-0 h-fit text-sm font-bold text-foreground items-center justify-center bg-background w-fit px-2 py-1 border-l-3 border-accent text-[0.8rem] sm:text-base"
        style={{
          left:      `${highlightRange.start}%`,
          top:       '100%',
          transform: 'translateY(-3px)',
          zIndex:    2,
        }}
      >
        Pumpkin Season
      </span>
    </div>
  );
}
