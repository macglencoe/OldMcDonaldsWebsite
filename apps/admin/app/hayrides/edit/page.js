import HayrideScheduleView from "@/components/hayrides/hayrideScheduleView";

export const metadata = {
  title: "Edit Hayride Schedule | OMPP Admin",
};

export default function EditHayrideSchedulePage() {
  return <HayrideScheduleView isEditable />;
}
