import 'server-only';

import { getDatabase } from '@oldmc/db';

export async function getGazeboSeasonForDate(date) {
  const rows = await getDatabase().query(
    `SELECT id::text, season_name, start_date::text, end_date::text,
       to_char(early_start_time, 'HH24:MI') AS early_start_time,
       to_char(early_end_time, 'HH24:MI') AS early_end_time,
       to_char(late_start_time, 'HH24:MI') AS late_start_time,
       to_char(late_end_time, 'HH24:MI') AS late_end_time
     FROM gazebo_season_config
     WHERE $1::date BETWEEN start_date AND end_date
     LIMIT 1`,
    [date],
  );
  return rows[0] ?? null;
}

export async function getCurrentOrUpcomingGazeboSeason(date) {
  const rows = await getDatabase().query(
    `SELECT id::text, season_name, start_date::text, end_date::text,
       to_char(early_start_time, 'HH24:MI') AS early_start_time,
       to_char(early_end_time, 'HH24:MI') AS early_end_time,
       to_char(late_start_time, 'HH24:MI') AS late_start_time,
       to_char(late_end_time, 'HH24:MI') AS late_end_time
     FROM gazebo_season_config
     WHERE end_date >= $1::date
     ORDER BY CASE WHEN $1::date BETWEEN start_date AND end_date THEN 0 ELSE 1 END,
       start_date
     LIMIT 1`,
    [date],
  );
  return rows[0] ?? null;
}
