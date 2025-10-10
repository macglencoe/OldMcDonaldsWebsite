'use client'

import { useEffect, useState } from 'react'

/**
 * Countdown component that counts down to a specified target date.
 * @param {Object} props
 * @param {string | Date} props.targetDate - Target date as a string or Date object.
 */
export default function Countdown({ targetDate, title }) {
  const calculateTimeLeft = () => {
    const now = new Date()
    const target = new Date(targetDate)
    const difference = target - now

    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }

  const formatDisplayDate = (date) => {
    const target = new Date(date)
    return target.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div className='flex flex-col items-center my-10 bg-background/10 rounded-3xl p-4' style={{
        backgroundImage: 'url(/tractorforge.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }}>
        <h2 className='text-4xl text-background font-["Satisfy"]'>{title}: <strong>{formatDisplayDate(targetDate)}</strong></h2>
        <div className="flex gap-4 text-2xl font-mono text-background text-center py-4 w-full justify-around flex-wrap">
          <div className='flex flex-col items-center bg-foreground/60 pt-3 pb-2 rounded-2xl flex-1'>
            <span className='text-4xl font-bold font-["Satisfy"] m-2'>{pad(timeLeft.days)}</span>
            <span className='text-sm font-bold border-t-2 border-background/40 w-full mx-2 pt-2'>Days</span>
          </div>
          <div className='flex flex-col items-center bg-foreground/60 pt-3 pb-2 rounded-2xl flex-1'>
            <span className='text-4xl font-bold font-["Satisfy"] m-2'>{pad(timeLeft.hours)}</span>
            <span className='text-sm font-bold border-t-2 border-background/40 w-full mx-2 pt-2'>Hours</span>
          </div>
          <div className='flex flex-col items-center bg-foreground/60 pt-3 pb-2 rounded-2xl flex-1'>
            <span className='text-4xl font-bold font-["Satisfy"] m-2'>{pad(timeLeft.minutes)}</span>
            <span className='text-sm font-bold border-t-2 border-background/40 w-full mx-2 pt-2'>Minutes</span>
          </div>
          <div className='flex flex-col items-center bg-foreground/60 pt-3 pb-2 rounded-2xl flex-1'>
            <span className='text-4xl font-bold font-["Satisfy"] m-2'>{pad(timeLeft.seconds)}</span>
            <span className='text-sm font-bold border-t-2 border-background/40 w-full mx-2 pt-2'>Seconds</span>
          </div>
        </div>
    </div>
  )
}
