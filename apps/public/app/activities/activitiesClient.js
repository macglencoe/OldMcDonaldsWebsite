"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Basketball,
    Flower,
    Smiley,
    Strategy,
    Cylinder,
    Football,
    Hamburger,
} from "phosphor-react";
import Image from "next/image";
import { useFlags } from "@/app/FlagsContext";

const iconMap = {
    "Pumpkin Patch": <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--background)" viewBox="0 0 256 256"><path d="M138.54,149.46C106.62,96.25,149.18,43.05,239.63,48.37,245,138.82,191.75,181.39,138.54,149.46ZM16.26,88.26c-3.8,64.61,34.21,95,72.21,72.21C111.27,122.47,80.87,84.46,16.26,88.26Z" opacity="0.2"></path><path d="M247.63,47.89a8,8,0,0,0-7.52-7.52c-51.76-3-93.32,12.74-111.18,42.22-11.8,19.48-11.78,43.16-.16,65.74a71.37,71.37,0,0,0-14.17,26.95L98.33,159c7.82-16.33,7.52-33.36-1-47.49C84.09,89.73,53.62,78,15.79,80.27a8,8,0,0,0-7.52,7.52c-2.23,37.83,9.46,68.3,31.25,81.5A45.82,45.82,0,0,0,63.44,176,54.58,54.58,0,0,0,87,170.33l25,25V224a8,8,0,0,0,16,0V194.51a55.61,55.61,0,0,1,12.27-35,73.91,73.91,0,0,0,33.31,8.4,60.9,60.9,0,0,0,31.83-8.86C234.89,141.21,250.67,99.65,247.63,47.89ZM86.06,146.74l-24.41-24.4a8,8,0,0,0-11.31,11.31l24.41,24.41c-9.61,3.18-18.93,2.39-26.94-2.46C32.47,146.31,23.79,124.32,24,96c28.31-.25,50.31,8.47,59.6,23.81C88.45,127.82,89.24,137.14,86.06,146.74Zm111.06-1.36c-13.4,8.11-29.15,8.73-45.15,2l53.69-53.7a8,8,0,0,0-11.31-11.32L140.65,136c-6.76-16-6.15-31.76,2-45.15,13.94-23,47-35.8,89.33-34.83C232.94,98.34,220.14,131.44,197.12,145.38Z"></path></svg>,
    "Flower Fields": <Flower size={32} fill="var(--background)" weight="duotone" />,
    "Corn Maze": <Strategy size={32} fill="var(--background)" weight="duotone" />,
    "Playground": <Smiley size={32} fill="var(--background)" weight="duotone" />,
    "Tube Slides": <Cylinder size={32} fill="var(--background)" weight="duotone" />,
    "Basketball Wagon": <Basketball size={32} fill="var(--background)" weight="duotone" />,
    "Football Nets": <Football size={32} fill="var(--background)" weight="duotone" />,
    "Corn Hole": <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--background)" viewBox="0 0 256 256"><path d="M152,56a24,24,0,1,1-24-24A24,24,0,0,1,152,56Z" opacity="0.2"></path><path d="M128,88A32,32,0,1,0,96,56,32,32,0,0,0,128,88Zm0-48a16,16,0,1,1-16,16A16,16,0,0,1,128,40ZM48,96a16,16,0,1,1,16,16A16,16,0,0,1,48,96Zm174.24,14.61A8,8,0,0,1,211,111.87c-1.15-.89-23.71-17.7-59.32.61a214.93,214.93,0,0,1-3,30.35l32.43,27a8,8,0,0,1,2.47,8.68l-16,48a8,8,0,0,1-15.18-5.06l14.27-42.82-22.08-18.4a141.86,141.86,0,0,1-5.1,14.33c-13.75,32.74-38.38,54.63-73.2,65.08a8,8,0,0,1-4.6-15.32c60.68-18.21,71.14-72.22,73.42-101.65C108,139.88,86.57,144,72.36,144a59.59,59.59,0,0,1-19.67-3.27A8,8,0,0,1,56,125.4a7.82,7.82,0,0,1,3.31.73s26.76,10.68,72.19-20.2c52.29-35.54,88-7.77,89.51-6.57A8,8,0,0,1,222.24,110.61Z"></path></svg>,
    "Petting Zoo": <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--background)" viewBox="0 0 256 256"><path d="M184,120v80H72V120Z" opacity="0.2"></path><path d="M240,192h-8V130.57l1.49,2.08a8,8,0,1,0,13-9.3l-40-56a8,8,0,0,0-2-1.94L137,18.77l-.1-.07a16,16,0,0,0-17.76,0l-.1.07L51.45,65.42a8,8,0,0,0-2,1.94l-40,56a8,8,0,1,0,13,9.3L24,130.57V192H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM40,108.17,61.7,77.79,128,32l66.3,45.78L216,108.17V192H192V120a8,8,0,0,0-8-8H72a8,8,0,0,0-8,8v72H40Zm88,42L97,128H159Zm48-14.62v48.91L141.76,160ZM114.24,160,80,184.46V135.55ZM128,169.83,159,192H97ZM104,88a8,8,0,0,1,8-8h32a8,8,0,1,1,0,16H112A8,8,0,0,1,104,88Z"></path></svg>,
    "Hayrides": <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--background)" viewBox="0 0 256 256"><path d="M240,188a28,28,0,1,1-28-28A28,28,0,0,1,240,188ZM68,128a44,44,0,1,0,44,44A44,44,0,0,0,68,128Z" opacity="0.2"></path><path d="M240,165.41V134a15.89,15.89,0,0,0-11.4-15.32l-.21-.06L192,108.71V72a8,8,0,0,0-16,0v32.38l-24-6.5V56h8a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16h8V88H40a8,8,0,0,0,0,16H68a68.07,68.07,0,0,1,68,68v12a8,8,0,0,0,8,8h32.23A36,36,0,1,0,240,165.41ZM68,88H64V56h72v66.77A83.92,83.92,0,0,0,68,88Zm84,26.45L224,134v20.1A36,36,0,0,0,178.06,176H152ZM212,208a20,20,0,1,1,20-20A20,20,0,0,1,212,208ZM68,120a52,52,0,1,0,52,52A52.06,52.06,0,0,0,68,120Zm0,88a36,36,0,1,1,36-36A36,36,0,0,1,68,208Zm12-36a12,12,0,1,1-12-12A12,12,0,0,1,80,172Z"></path></svg>,
    "Nature Trails": <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--background)" viewBox="0 0 256 256"><path d="M176,48a24,24,0,1,1-24-24A24,24,0,0,1,176,48ZM44,132l28,12L96,88,68,76Z" opacity="0.2"></path><path d="M152,80a32,32,0,1,0-32-32A32,32,0,0,0,152,80Zm0-48a16,16,0,1,1-16,16A16,16,0,0,1,152,32Zm48,112v88a8,8,0,0,1-16,0V151.66c-25.75-2.25-34.35-15.52-42-27.36-2.85-4.39-5.56-8.57-9.13-12.19l-13.4,30.81,37.2,26.57A8,8,0,0,1,160,176v56a8,8,0,0,1-16,0V180.12l-31.07-22.2L79.34,235.19A8,8,0,0,1,72,240a7.84,7.84,0,0,1-3.19-.67,8,8,0,0,1-4.15-10.52L122.19,96.5a8,8,0,0,1,11-3.92,40.92,40.92,0,0,1,8,5.47c6.37,5.52,10.51,11.91,14.16,17.55,7.68,11.84,13.23,20.4,36.6,20.4A8,8,0,0,1,200,144ZM72,152a8,8,0,0,0,7.36-4.85l24-56a8,8,0,0,0-4.2-10.5l-28-12a8,8,0,0,0-10.5,4.2l-24,56a8,8,0,0,0,4.2,10.5l28,12A8,8,0,0,0,72,152ZM54.51,127.8,72.2,86.5l13.3,5.7L67.8,133.49Z"></path></svg>,
    "Food Vendors & Picnic Tables": <Hamburger size={32} fill="var(--background)" weight="duotone" />,

};

const baseActivities = [
    { size: "large", title: "Pumpkin Patch", image: "/pumpkinlanes.jpg", href: "activities/pumpkin-patch" },
    { size: "medium", title: "Flower Fields", image: "/sunflowerBike.jpg", href: "activities/flower-fields" },
    { size: "large", title: "Corn Maze", image: "/cornMazeLane.jpg", href: "activities/corn-maze" },
    { size: "medium", title: "Playground", image: "/playset.jpg" },
    { size: "small", title: "Tube Slides", image: "/tubeSlides.jpg" },
    { size: "small", title: "Basketball Wagon", image: "/basketballWagon.jpg" },
    { size: "small", title: "Football Nets", image: "https://images.unsplash.com/photo-1566579090262-51cde5ebe92e?q=80..." },
    { size: "small", title: "Corn Hole", image: "https://images.unsplash.com/photo-1636483022717-3eeaa9ff1a4f?q=80..." },
    { size: "medium", title: "Petting Zoo", image: "/pettingZooGoatAndGirl.jpg" },
    { size: "large", title: "Hayrides", image: "/tractorSunset.jpg", href: "activities/hayrides" },
    { size: "medium", title: "Food Vendors & Picnic Tables", image: "/picnicTable.jpg", href: "../vendors", flagKey: "show_vendors" },
    { size: "large", title: "Nature Trails", image: "/natureMazePath.jpg", href: "activities/nature-trails" },
];

const sizeStyle = {
    large: "col-span-1 sm:col-span-2 row-span-2",
    medium: "col-span-1 row-span-1",
    small: "col-span-1 row-span-1",
};

export default function ActivitiesClient() {
    const { isFeatureEnabled } = useFlags();
    const activities = baseActivities.map((activity) => {
        if (activity.flagKey && !isFeatureEnabled(activity.flagKey)) {
            const { flagKey, ...rest } = activity;
            return { ...rest, href: undefined };
        }
        if (activity.flagKey) {
            const { flagKey, ...rest } = activity;
            return rest;
        }
        return activity;
    });
    return (
        <section className="py-5 px-6 max-w-7xl mx-auto">
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px] sm:auto-rows-[220px] md:auto-rows-[250px] lg:auto-rows-[280px] grid-flow-dense">
                {activities.map((activity, i) => (
                    <ActivityCard key={i} {...activity} />
                ))}
            </div>
        </section>
    );
}

function ActivityCard({ size, title, image, href }) {
    const icon = iconMap[title] || <Smiley size={24} weight="duotone" />;
    const sizeClass = sizeStyle[size];

    const content = (
        <motion.a
            whileHover={{ scale: 1.05 }}
            whileFocus={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.random() * 0.3 }}
            className={`relative rounded-xl overflow-hidden shadow-xl border-4 border-background ${sizeClass} group cursor-pointer`}
            aria-label={title + (href ? " -  Learn more" : "")}
            tabIndex={0}
            href={href || undefined}

        >
            <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
            <div className="relative z-20 flex flex-col justify-end h-full p-3 sm:p-4 text-white text-sm sm:text-base">
                <div className="flex items-center gap-2">
                    <div className="text-white">{icon}</div>
                    <h2 className="text-lg sm:text-xl font-bold uppercase">
                        {title}
                    </h2>
                </div>
                {href && (
                    <span className="mt-2 underline underline-offset-2 group-hover:text-accent">
                        Learn more →
                    </span>
                )}
            </div>
        </motion.a>
    );

    return href ? (
        <Link legacyBehavior href={href} className="contents">
            {content}
        </Link>
    ) : (
        content
    );
}
