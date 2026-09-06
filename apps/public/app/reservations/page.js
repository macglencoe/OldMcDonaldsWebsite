import Layout from "@/components/layout";
import styles from "./page.module.css";
import {
    ArticleCallout,
    ArticleDivider,
    ArticleFacts,
    ArticleLayout,
    ArticleLead,
    ArticleNotice,
    ArticleSection,
    ArticleSteps,
} from "@/components/article";
import { Action } from "@oldmc/ui";

import PageHeader from "@/components/pageHeader";
import { gazeboSlotLabels } from "@/lib/gazeboSlotConfig.mjs";
import { getCurrentOrUpcomingGazeboSeason } from "@/lib/gazeboSlotConfigServer.mjs";
import { getPricingData } from "@/utils/pricingServer";
import ReservationRequestForm from "./reservationRequestForm";

const RENTAL_DAYS = ["Fridays", "Saturdays", "Sundays"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatSeasonDate(date) {
  const [, month, day] = String(date).match(/^\d{4}-(\d{2})-(\d{2})/) ?? [];
  const monthName = MONTH_NAMES[Number(month) - 1];
  const dayNumber = Number(day);

  if (!monthName || !dayNumber) return date;

  const suffix = dayNumber % 100 >= 11 && dayNumber % 100 <= 13
    ? "th"
    : { 1: "st", 2: "nd", 3: "rd" }[dayNumber % 10] ?? "th";

  return `${monthName} ${dayNumber}${suffix}`;
}

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
  description: "Request a private party gazebo at Old McDonald’s Pumpkin Patch in Inwood, WV. Reserve picnic space for birthdays, family gatherings, and special fall events."
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
            <ArticleLayout>
                <ArticleLead
                    image="/rentalgazebo.jpg"
                    imageAlt="A reservable picnic gazebo at Old McDonald's"
                    imageFocalPoint="center 58%"
                    caption="Party Gazebo"
                    eyebrow="Reservations"
                    heading="Party Gazebos"
                >
                    <p>Gazebos A and B can each be reserved for a 2-hour time slot during daytime hours.</p>
                </ArticleLead>

                <ArticleFacts items={[
                    { value: `$${gazeboPrice}`, label: "Price", detail: "For 2 hours" },
                    { value: "2", label: "Hours", detail: "Per time slot" },
                    { value: "2", label: "Picnic tables", detail: "Under each gazebo" }
                ]} />

                <ArticleSteps
                    title="How reservations work"
                    items={[
                        { title: "Fill out the form", description: "Enter your name, phone number, and email address, and any special requests." },
                        { title: "Wait for confirmation", description: "You will receive an email confirmation once your request is reviewed." },
                        { title: "Receive an invoice", description: "You will receive an email invoice for your rental after booking." },
                    ]}
                />

                <ArticleCallout tone="quiet">
                    {gazeboSeason &&
                        <div>
                          <h3 className="font-semibold font-satisfy text-4xl mx-auto text-center">{gazeboSeason.season_name}:</h3>
                          <p className="mx-auto text-center"><b>{formatSeasonDate(gazeboSeason.start_date)}</b> through <b>{formatSeasonDate(gazeboSeason.end_date)}</b></p>
                        </div>
                    }
                    <div className={styles.timeSlots + " font-[Inter]"}>
                        <GazeboRentalTable season={gazeboSeason} />
                    </div>
                </ArticleCallout>

                <ArticleSection image="/picnicTable.jpg" imageAlt="Picnic tables ready for a gathering at the farm" imageRatio="landscape" imageFocalPoint="center 62%">
                    <h2>What&apos;s included</h2>
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
                </ArticleSection>

                <ArticleNotice title="Weather Policy" tone="weather">
                    <p>If we have to close due to weather, you will receive a full refund for your gazebo rental</p>
                    <p>Keep this in mind and have a backup plan for your party!</p>
                </ArticleNotice>

                <ArticleNotice title="General Admission">
                    <p>All guests must pay <b>General Admission</b> at the gate:</p>
                    <p><b className="text-3xl!">{admissionDisplay}</b> per {admissionUnit}*</p>
                    <p>* Over the age of 3</p>
                </ArticleNotice>

                <ReservationRequestForm priceDisplay={`$${gazeboPrice}`} />

                <ArticleNotice
                    title="Night-time campfire"
                    tone="night"
                    action={<Action as="Link" href="/activities/night-maze#reservations" variant="secondary">See More</Action>}
                >
                    <p>Rent a campfire for your group at the Night Maze</p>
                </ArticleNotice>
            </ArticleLayout>
        </Layout>
    );
}

export default Reservations
