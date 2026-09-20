function invalid(message) {
  return Object.assign(new Error(message), { status: 400 });
}

export function ensureSiteSettingsAreConsistent(payload) {
  const opening = new Date(payload.season.opensAt);
  const closing = new Date(payload.season.closesAt);
  if (opening >= closing) {
    throw invalid("Season closing time must be after its opening time");
  }

  try {
    new Intl.DateTimeFormat("en-US", { timeZone: payload.season.timeZone }).format(opening);
  } catch {
    throw invalid("Season time zone must be a valid IANA time zone");
  }

  const seasonStart = payload.season.opensAt.slice(0, 10);
  const seasonEnd = payload.season.closesAt.slice(0, 10);
  if (payload.nightMaze.firstDate < seasonStart || payload.nightMaze.firstDate > seasonEnd) {
    throw invalid("Night Maze first date must fall within the configured season");
  }

  const { opensAt, closesAt, lastAdmissionAt } = payload.nightMaze;
  if (opensAt >= closesAt) {
    throw invalid("Night Maze closing time must be after its opening time");
  }
  if (lastAdmissionAt < opensAt || lastAdmissionAt > closesAt) {
    throw invalid("Night Maze last admission must be between opening and closing");
  }
}
