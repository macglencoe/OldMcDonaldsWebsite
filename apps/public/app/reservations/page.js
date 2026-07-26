import Layout from "@/components/layout";
import styles from "./page.module.css";
import { BodyBlock } from "@/components/bodyBlock";

import PageHeader from "@/components/pageHeader";
import { gazeboSlotLabels } from "@/lib/gazeboSlotConfig.mjs";
import { getCurrentOrUpcomingGazeboSeason } from "@/lib/gazeboSlotConfigServer.mjs";
import { getPricingData } from "@/utils/pricingServer";
import ReservationRequestForm from "./reservationRequestForm";

const RENTAL_DAYS = ["Fridays", "Saturdays", "Sundays"];

function GazeboRentalTable({ season }) {
  const labels = gazeboSlotLabels(season ?? undefined);
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b">
          <th className="py-2 pr-4">Day</th>
          <th colSpan={2} className="py-2">
            Time Slots
          </th>
        </tr>
      </thead>

      <tbody>
        {RENTAL_DAYS.map((day) => (
          <tr key={day} className="border-b last:border-0">
            <td className="py-2 pr-4 font-medium">{day}</td>
            {[labels.early, labels.late].map((label) => (
              <td key={label} className="py-2 px-3">
                {label}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const metadata = {
  title: "Reservations",
  description: "Book a private party gazebo at Old McDonald’s Pumpkin Patch in Inwood, WV. Reserve picnic space for birthdays, family gatherings, and special fall events."
}


export const Reservations = async () => {
    const todayParts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
    }).formatToParts(new Date());
    const todayValues = Object.fromEntries(todayParts.map(({ type, value }) => [type, value]));
    const today = `${todayValues.year}-${todayValues.month}-${todayValues.day}`;
    const [pricing, gazeboSeason] = await Promise.all([
      getPricingData(),
      getCurrentOrUpcomingGazeboSeason(today).catch((error) => {
        console.error("Could not load public gazebo season configuration:", error.message);
        return null;
      }),
    ]);
    const gazeboRental = pricing["gazebo-rental"];
    const gazeboPrice = Number(gazeboRental?.amount ?? 0).toFixed(2);
    const admission = pricing.admission;
    const admissionAmount = Number(admission?.amount ?? 0);
    const admissionDisplay = admissionAmount >= 1 ? `$${admissionAmount.toFixed(2)}` : `¢${(admissionAmount * 100).toFixed(0)}`;
    const admissionUnit = admission?.per ?? 'person';

    return (
        <Layout>
            <PageHeader subtitle={gazeboSeason?.season_name ?? "Reservations"}>Reservations</PageHeader>
            <div className="body basic">
                <BodyBlock src='/bonfires.jpg'>
                <h2>Night-time campfire</h2>
                  <p>Rent a campfire for your group at the Night Maze</p>
                  <a href="/activities/night-maze#reservations"><p>See More</p></a>
                </BodyBlock>
                <h2>Party Gazebo</h2>
                <p className="description">A private party gazebo can be booked for a 2-hour time slot during daytime hours</p>
                <BodyBlock src="/rentalgazebo.jpg">
                    <h3>Pricing</h3>
                    <p>For 2 hours:</p>
                    <p className="big">${gazeboPrice}</p>
                    <p>You will recieve an <b>email invoice</b> for your rental after booking</p>
                </BodyBlock>
                <BodyBlock>
                    <div className={styles.timeSlots + " font-[Inter]"}>
                        {gazeboSeason && <p className="mb-3 font-semibold">{gazeboSeason.season_name}: {gazeboSeason.start_date} through {gazeboSeason.end_date}</p>}
                        <GazeboRentalTable season={gazeboSeason} />
                    </div>
                </BodyBlock>
                <BodyBlock>
                    <h3>What&apos;s included</h3>
                    <ul>
                        <li>Two picnic tables under the gazebo</li>
                        <li>You may arrive <b>30 minutes early</b> to decorate</li>
                        <li><b>Wagons</b> available to help transport decorations and supplies</li>
                    </ul>
                    <h3>What to bring</h3>
                    <ul>
                        <li>Outside food or cake (unfortunately, no grills are available)</li>
                        <li>Additional seating if necessary, such as lawn chairs</li>
                    </ul>
                </BodyBlock>
                <BodyBlock src="https://images.unsplash.com/photo-1603321544554-f416a9a11fcf?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                    <h3>Weather Policy</h3>
                    <p>If we have to close due to weather, you will receive a full refund for your gazebo rental</p>
                    <p>Keep this in mind and have a backup plan for your party!</p>
                </BodyBlock>
                <BodyBlock src="/entrance.jpg">
                    <h3>General Admission</h3>
                    <p>All guests must pay <b>General Admission</b> at the gate:</p>
                    <p className="big">{admissionDisplay} per {admissionUnit}*</p>
                    <p>* Over the age of 3</p>
                </BodyBlock>
                <ReservationRequestForm priceDisplay={`$${gazeboPrice}`} />


            </div>
        </Layout>
    );
}

export default Reservations
