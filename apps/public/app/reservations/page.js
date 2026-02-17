import Layout from "@/components/layout";
import styles from "./page.module.css";
import { BodyBlock } from "@/components/bodyBlock";

import rentalSlots from "@/public/data/gazeboRentalSlots.json";
import { useMemo } from "react";
import PageHeader from "@/components/pageHeader";
import { Action } from "@oldmc/ui";
import { getPricingData } from "@/utils/pricingServer";

/**
 * Renders the gazebo-rental availability table from
 * `@/public/data/gazeboRentalSlots.json`.
 *
 * The JSON schema:
 * [
 *   { "day": "Fridays", "slots": [ { "start": "1:00 PM", "end": "3:00 PM" }, … ] },
 *   …
 * ]
 */
function GazeboRentalTable() {
  const maxCols = useMemo(
    () => Math.max(...rentalSlots.map(({ slots }) => slots.length)),
    [],
  );

  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b">
          <th className="py-2 pr-4">Day</th>
          <th colSpan={maxCols} className="py-2">
            Time Slots
          </th>
        </tr>
      </thead>

      <tbody>
        {rentalSlots.map(({ day, slots }) => (
          <tr key={day} className="border-b last:border-0">
            <td className="py-2 pr-4 font-medium">{day}</td>

            {/* one <td> per slot */}
            {slots.map(({ start, end }) => (
              <td key={`${start}-${end}`} className="py-2 px-3">
                {start} – {end}
              </td>
            ))}

            {/* pad with empty cells if this day has fewer slots than maxCols */}
            {Array.from({ length: maxCols - slots.length }).map((_, idx) => (
              <td key={`pad-${idx}`} />
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
    const pricing = await getPricingData();
    const gazeboRental = pricing["gazebo-rental"];
    const gazeboPrice = Number(gazeboRental?.amount ?? 0).toFixed(2);
    const admission = pricing.admission;
    const admissionAmount = Number(admission?.amount ?? 0);
    const admissionDisplay = admissionAmount >= 1 ? `$${admissionAmount.toFixed(2)}` : `¢${(admissionAmount * 100).toFixed(0)}`;
    const admissionUnit = admission?.per ?? 'person';

    return (
        <Layout>
            <PageHeader subtitle="2025 Season">Reservations</PageHeader>
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
                        <GazeboRentalTable />
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
                <div className="mx-auto my-12 p-8 text-foreground">
                    <h3 className="!text-7xl text-center mb-10 tracking-wide">Ready to book?</h3>

                    <div className="flex flex-col items-center space-y-6 !text-2xl">
                        <p className="font-medium">
                            Call us:
                            <Action as="a" href='tel:304-839-2330' className={'mx-4'} variant="outline-secondary">304-839-2330</Action>
                        </p>

                        <div className="relative w-full flex items-center justify-center">
                            <span className="text-sm uppercase tracking-widest font-semibold bg-background p-2">OR</span>
                            <span className="absolute left-0 right-0 h-px bg-foreground/20 top-1/2 -z-10"></span>
                        </div>
                        <Action as="a" href={'https://docs.google.com/forms/d/e/1FAIpQLSfUPYvXsF4qcMsmtgOuidB06WPJkKKwlSLmo3uPnNDWgziPsw/viewform?usp=sharing&ouid=100113173059112922558'} variant="outline-secondary" className={'mx-4'}>Fill Out Form</Action>
                    </div>
                </div>


            </div>
        </Layout>
    );
}

export default Reservations
