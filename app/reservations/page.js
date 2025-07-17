import Layout from "@/components/layout";
import styles from "./page.module.css";
import { BodyBlock } from "@/components/bodyBlock";

import rentalSlots from "@/public/data/gazeboRentalSlots.json";
import { useMemo } from "react";

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


export const Reservations = () => {

    return (
        <Layout>
            <div className="header">
                <h1>Reservations</h1>
            </div>
            <div className="body basic">
                <h2>Party Gazebo</h2>
                <p className="description">A private party gazebo can be booked for a 2-hour time slot during daytime hours</p>
                <BodyBlock src="/rentalgazebo.jpg">
                    <h3>Pricing</h3>
                    <p>For 2 hours:</p>
                    <p className="big">$75.00</p>
                    <p>You will recieve an <b>email invoice</b> for your rental after booking</p>
                </BodyBlock>
                <BodyBlock>
                    <div className={styles.timeSlots + " font-[Inter]"}>
                        <GazeboRentalTable />
                    </div>
                </BodyBlock>
                <BodyBlock>
                    <h3>What's included</h3>
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
                </BodyBlock>
                <BodyBlock src="/entrance.jpg">
                    <h3>General Admission</h3>
                    <p>All guests must pay <b>General Admission</b> at the gate:</p>
                    <p className="big">$6 per person*</p>
                    <p>* Over the age of 3</p>
                </BodyBlock>
                <div class="max-w-xl mx-auto my-12 p-8 bg-accent/20 text-foreground rounded-3xl shadow-2xl transform hover:scale-[1.02] transition duration-500">
                    <h3 class="text-3xl font-bold text-center mb-6 tracking-wide drop-shadow-md">Ready to book?</h3>

                    <div class="flex flex-col items-center space-y-6">
                        <p class="text-lg font-medium">
                            Call us:
                            <a href="tel:304-839-2330" class="ml-2 inline-block bg-white font-bold px-5 py-2 rounded-full shadow-lg  transition">
                                304-839-2330
                            </a>
                        </p>

                        <div class="relative w-full flex items-center justify-center">
                            <span class="text-sm uppercase tracking-widest font-semibold">OR</span>
                            <span class="absolute left-0 right-0 h-px bg-foreground/20 top-1/2 -z-10"></span>
                        </div>

                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSfUPYvXsF4qcMsmtgOuidB06WPJkKKwlSLmo3uPnNDWgziPsw/viewform?usp=sharing&ouid=100113173059112922558"
                            target="_blank"
                            class="bg-white font-bold text-lg px-6 py-3 rounded-full shadow-lg hover:scale-105  transition duration-300">
                            Fill Out Form
                        </a>
                    </div>
                </div>


            </div>
        </Layout>
    );
}

export default Reservations
