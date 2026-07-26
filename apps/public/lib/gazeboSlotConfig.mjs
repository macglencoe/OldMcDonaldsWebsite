export const DEFAULT_GAZEBO_SLOT_CONFIG = Object.freeze({
  early_start_time: '13:00',
  early_end_time: '15:00',
  late_start_time: '16:00',
  late_end_time: '18:00',
});

export function isDateOnly(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function formatGazeboTime(value) {
  const match = String(value ?? '').match(/^(\d{2}):(\d{2})/);
  if (!match) return '';
  const date = new Date(2000, 0, 1, Number(match[1]), Number(match[2]));
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function gazeboSlotLabels(config = DEFAULT_GAZEBO_SLOT_CONFIG) {
  return Object.freeze({
    early: `${formatGazeboTime(config.early_start_time)} – ${formatGazeboTime(config.early_end_time)}`,
    late: `${formatGazeboTime(config.late_start_time)} – ${formatGazeboTime(config.late_end_time)}`,
    either: 'Either works',
  });
}

export function snapshotGazeboSlotConfig(season) {
  return {
    seasonId: String(season.id),
    seasonName: season.season_name,
    earlyStartTime: season.early_start_time,
    earlyEndTime: season.early_end_time,
    lateStartTime: season.late_start_time,
    lateEndTime: season.late_end_time,
  };
}

export function labelsFromSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return gazeboSlotLabels();
  return gazeboSlotLabels({
    early_start_time: snapshot.earlyStartTime,
    early_end_time: snapshot.earlyEndTime,
    late_start_time: snapshot.lateStartTime,
    late_end_time: snapshot.lateEndTime,
  });
}
