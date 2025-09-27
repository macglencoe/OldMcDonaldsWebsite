import Timeline from "@/components/timeline";
import hayrideData from "@/data/hayrides.example.json";

export default function Home() {
  const slots = Array.isArray(hayrideData?.slots) ? hayrideData.slots : [];
  const scheduleDate = hayrideData?.date;
  const timezone = hayrideData?.timezone;

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Hayride Schedule</h1>
        {scheduleDate ? (
          <p className="text-sm text-gray-600">
            Date: {scheduleDate}
            {timezone ? ` (${timezone})` : ""}
          </p>
        ) : null}
      </header>

      <Timeline slots={slots} />
    </main>
  );
}
