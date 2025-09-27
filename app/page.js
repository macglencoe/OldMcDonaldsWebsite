import HayrideCard from "@/components/hayrideCard";

export default async function Home() {
  return (
    <div>
      <h1>Home</h1>
      <HayrideCard color="green" capacity={20} fill={15} />
      <HayrideCard color="red" capacity={32} fill={20} />
    </div>
  )
}
