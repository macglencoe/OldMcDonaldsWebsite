import { NextResponse } from 'next/server';

import { gazeboSlotLabels, isDateOnly } from '@/lib/gazeboSlotConfig.mjs';
import { getGazeboSeasonForDate } from '@/lib/gazeboSlotConfigServer.mjs';

export const runtime = 'nodejs';

export async function GET(request) {
  const date = request.nextUrl.searchParams.get('date');
  if (!isDateOnly(date)) {
    return NextResponse.json({ error: 'Choose a valid date.' }, { status: 400 });
  }
  try {
    const season = await getGazeboSeasonForDate(date);
    if (!season) {
      return NextResponse.json(
        { error: 'Gazebo rentals are not configured for this date.' },
        { status: 404, headers: { 'Cache-Control': 'no-store' } },
      );
    }
    return NextResponse.json(
      {
        season: {
          id: season.id,
          name: season.season_name,
          startDate: season.start_date,
          endDate: season.end_date,
        },
        slots: gazeboSlotLabels(season),
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    console.error('Gazebo slot lookup failed:', error.message);
    return NextResponse.json({ error: 'Gazebo times are temporarily unavailable.' }, { status: 503 });
  }
}
