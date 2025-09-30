export const HAYRIDE_WAGONS = [
  { id: "wagon-green", color: "green", capacity: 20, label: "Green Wagon" },
  { id: "wagon-blue", color: "blue", capacity: 16, label: "Blue Wagon" },
  { id: "wagon-red", color: "red", capacity: 22, label: "Red Wagon" },
  { id: "wagon-white", color: "white", capacity: 18, label: "White Wagon"}
];

export const HAYRIDE_WAGON_LOOKUP = Object.fromEntries(
  HAYRIDE_WAGONS.map((wagon) => [wagon.id, wagon])
);

export function getWagonDefaults(wagonId) {
  const defaults = HAYRIDE_WAGON_LOOKUP[wagonId];
  if (!defaults) {
    return { id: wagonId, color: null, capacity: 0, label: wagonId };
  }
  return defaults;
}
