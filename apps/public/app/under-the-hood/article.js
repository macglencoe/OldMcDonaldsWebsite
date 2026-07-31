import Link from "next/link";
import Layout from "@/components/layout";
import FarmCoordinateExplorer from "./farmCoordinateExplorer";
import ArticleFeatureLink from "./articleFeatureLink";
import styles from "./page.module.css";

const systems = [
    {
        number: "01",
        label: "The maze game",
        title: "The QR codes keep score",
        copy: "There are four QR codes hidden in the corn maze. Each one opens a URL containing its own code. If the code is valid, the page saves it in the visitor’s browser and sends them back to the game. Once all four have been saved, the entry form appears.",
        code: `const found = JSON.parse(
  localStorage.getItem("maze-game") || "[]"
);

if (!found.includes(code)) {
  found.push(code);
  localStorage.setItem("maze-game", JSON.stringify(found));
}`,
    },
    {
        number: "02",
        label: "The admin site",
        title: "Keeping track of the hay wagons",
        copy: "The hayride screen follows the way hayrides are actually run. It has departure times, four colored wagons, and a head count for each wagon. The usual schedule is generated from a template, so nobody has to create every half-hour slot by hand. Changes for a particular day are stored in the database and merged into that schedule.",
        code: `{
  id: "wagon-blue",
  label: "Blue Wagon",
  capacity: 20,
  filled: 14
}`,
    },
    {
        number: "03",
        label: "Site updates",
        title: "A small, custom content system",
        copy: "I didn’t need a full content management system, but I did need a way to change hours, prices, announcements, FAQs, and calendar dates without editing the site’s code. Those items are stored as structured configuration, with a purpose-built editor for each one in the admin site.",
        code: `const editable = [
  "announcements",
  "calendar_schedule",
  "pricing",
  "weekly-hours",
  "faq"
];`,
    },
    {
        number: "04",
        label: "Site search",
        title: "The website indexes itself",
        copy: "After a production build, a script reads the HTML that Next.js generated. It removes navigation and other repeated page furniture, extracts useful text, and writes a small JSON search index. Fuse.js searches that file directly in the visitor’s browser, so there is no separate search server.",
        code: `postbuild: crawl HTML
           → extract page text
           → search-index.json`,
    },
    {
        number: "05",
        label: "Seasonal controls",
        title: "Features can be switched without a deployment",
        copy: "The farm needs a different website in September than it does in January. Feature flags control things like the maze game, seasonal heroes, countdown, weather, vendors, and form backends. Staff can change what is active without changing the code or rebuilding the site.",
        code: `maze_game_enabled: true
use_fall_hero: true
infostrip_show_weather: false`,
    },
    {
        number: "06",
        label: "Reservation workflow",
        title: "A request is not yet a booking",
        copy: "When a visitor asks to reserve a gazebo, the submission is stored as a reservation request. Staff can review the preferred date, time, alternatives, and price snapshot before converting it into a real booking. The two records remain linked afterward.",
        code: `reservation request
  → staff review
  → tentative or confirmed booking`,
    },
    {
        number: "07",
        label: "Homepage information",
        title: "One strip assembled from several sources",
        copy: "The homepage information strip combines hours, admission, location, weather, and an opening-day countdown. Some values come from editable configuration, some are calculated in the browser, and weather passes through the site’s own API route. Feature flags decide which cards are shown.",
        code: `configured content
+ live weather
+ browser countdown
+ feature flags`,
    },
];

const systemDetails = {
    "01": { id: "maze-game", href: "/maze-game", link: "Open the maze game", flag: "maze_game_enabled" },
    "02": { id: "hayrides" },
    "03": { id: "content-system" },
    "04": { id: "search", href: "/search", link: "Try the site search" },
    "05": { id: "feature-flags" },
    "06": { id: "reservations", href: "/reservations", link: "See the reservation form" },
    "07": { id: "information-strip", href: "/", link: "See the homepage strip" },
};

const contents = [
    ["00", "The farm map", "map"],
    ["01", "Maze game", "maze-game"],
    ["02", "Hayride scheduling", "hayrides"],
    ["03", "Content system", "content-system"],
    ["04", "Search", "search"],
    ["05", "Feature flags", "feature-flags"],
    ["06", "Reservations", "reservations"],
    ["07", "Information strip", "information-strip"],
    ["08", "Architecture", "architecture"],
    ["09", "What runs where", "stack"],
];

function MazeGameGraphic() {
    const discoveries = [
        { name: "Black Cat", symbol: "🐈‍⬛" },
        { name: "Scarecrow", symbol: "🌾" },
        { name: "Tractor", symbol: "🚜" },
    ];

    return (
        <figure className={styles.mazeGraphic}>
            <div className={styles.worlds}>
                <div className={styles.physicalWorld}>
                    <div className={styles.worldLabel}>
                        <span>01</span>
                        <p>In the corn maze</p>
                    </div>
                    <div className={styles.cornScene} aria-label="A QR code sign hidden among rows of corn">
                        <div className={styles.cornRows} aria-hidden="true">
                            <i /><i /><i /><i /><i /><i /><i />
                        </div>
                        <div className={styles.qrSign}>
                            <div className={styles.qrCode} aria-hidden="true">
                                {Array.from({ length: 49 }, (_, index) => <i key={index} />)}
                            </div>
                            <span>SCAN ME</span>
                        </div>
                    </div>
                    <p className={styles.worldCaption}>A printed sign contains one unique URL.</p>
                </div>

                <div className={styles.scanBridge} aria-hidden="true">
                    <span>scan</span>
                    <b>→</b>
                </div>

                <div className={styles.digitalWorld}>
                    <div className={styles.worldLabel}>
                        <span>02</span>
                        <p>In the browser</p>
                    </div>
                    <div className={styles.phone}>
                        <div className={styles.phoneBar}>
                            <i />
                            <span>oldmcdonalds…</span>
                        </div>
                        <code>/maze-game/a7f3…</code>
                        <div className={styles.foundItem}>
                            <span className={styles.foundSymbol} aria-hidden="true">🐈‍⬛</span>
                            <div>
                                <small>Code recognized</small>
                                <strong>You found<br />the Black Cat</strong>
                            </div>
                        </div>
                        <p>Saved on this device ✓</p>
                    </div>
                    <p className={styles.worldCaption}>The code is checked, saved, and shown to the player.</p>
                </div>
            </div>

            <div className={styles.backpack}>
                <div className={styles.backpackIntro}>
                    <p>Browser storage</p>
                    <h4>The browser is the backpack</h4>
                    <span>Progress stays on the visitor&apos;s phone, so the game does not need accounts or logins.</span>
                </div>
                <div className={styles.storageWindow}>
                    <div className={styles.storageBar}>
                        <span>maze-game</span>
                        <code>localStorage</code>
                    </div>
                    <div className={styles.discoveryList}>
                        {discoveries.map((item, index) => (
                            <div key={item.name}>
                                <b>{index + 1}</b>
                                <i className={styles.discoverySymbol} aria-hidden="true">{item.symbol}</i>
                                <span>{item.name}</span>
                                <small>found</small>
                            </div>
                        ))}
                        <div className={styles.emptyDiscovery}>
                            <b>4</b>
                            <i>?</i>
                            <span>One left</span>
                            <small>searching…</small>
                        </div>
                    </div>
                    <div className={styles.storageFooter}>
                        <span><b>3</b> of 4 collected</span>
                        <i><em /></i>
                    </div>
                </div>
            </div>
            <figcaption>
                Nothing is sent to the server while the visitor searches. The server is only needed when the completed entry is submitted.
            </figcaption>
        </figure>
    );
}

function HayrideScheduleGraphic() {
    const times = ["11:30", "12:00", "12:30", "1:00", "1:30", "2:00", "2:30", "3:00"];
    const wagons = [
        { name: "Green", filled: 11, capacity: 15, color: "#4f7f40" },
        { name: "Blue", filled: 14, capacity: 20, color: "#477da5" },
        { name: "Red", filled: 25, capacity: 25, color: "#ad4b3f" },
        { name: "White", filled: 8, capacity: 15, color: "#deded4" },
    ];

    return (
        <figure className={styles.hayrideGraphic}>
            <div className={styles.scheduleGenerator}>
                <div className={styles.generatorRule}>
                    <p>Saturday template</p>
                    <strong>One departure every 30 minutes</strong>
                    <span>11:30 AM through 10:00 PM</span>
                </div>
                <div className={styles.generatorArrow} aria-hidden="true">
                    <span>generate</span>
                    <b>→</b>
                </div>
                <div className={styles.generatedTimes}>
                    <p>A normal day begins as a list of times</p>
                    <div>
                        {times.map((time) => (
                            <span className={time === "2:30" ? styles.selectedTime : ""} key={time}>
                                {time}
                            </span>
                        ))}
                        <i>…</i>
                        <span>10:00</span>
                    </div>
                </div>
            </div>

            <div className={styles.departureDetail}>
                <div className={styles.departureHeading}>
                    <div>
                        <p>One departure</p>
                        <h4>2:30 PM</h4>
                    </div>
                    <span>Saturday · 4 wagons · 75 total seats</span>
                </div>
                <div className={styles.wagonGrid}>
                    {wagons.map((wagon) => {
                        const percentage = `${(wagon.filled / wagon.capacity) * 100}%`;
                        return (
                            <div className={styles.wagonCard} key={wagon.name}>
                                <div className={styles.wagonName}>
                                    <i style={{ backgroundColor: wagon.color }} />
                                    <strong>{wagon.name} Wagon</strong>
                                    {wagon.filled === wagon.capacity && <em>Full</em>}
                                </div>
                                <div className={styles.wagonCount}>
                                    <b>{wagon.filled}</b>
                                    <span>/ {wagon.capacity} riders</span>
                                </div>
                                <div className={styles.wagonFill}>
                                    <i style={{ width: percentage, backgroundColor: wagon.color }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <aside className={styles.versionNote}>
                    <code>version: 7</code>
                    <p>
                        If two staff members change the same wagon at once, the older update is rejected
                        instead of silently overwriting the newer count.
                    </p>
                </aside>
            </div>

            <div className={styles.scheduleMerge}>
                <div>
                    <small>Generated template</small>
                    <strong>Saturday’s usual departures</strong>
                    <span>Times and four empty wagons</span>
                </div>
                <b aria-hidden="true">+</b>
                <div>
                    <small>Saved changes</small>
                    <strong>What has happened today</strong>
                    <span>Rider counts and edited details</span>
                </div>
                <b aria-hidden="true">=</b>
                <div className={styles.mergeResult}>
                    <small>Admin screen</small>
                    <strong>Today’s actual schedule</strong>
                    <span>Defaults and database records merged</span>
                </div>
            </div>
            <figcaption>
                Empty time slots do not have to be entered one at a time. They are generated when the schedule is read; only changes need to be stored.
            </figcaption>
        </figure>
    );
}

function ContentSystemGraphic() {
    const workbenchItems = [
        { name: "Announcements", detail: "Notices and expiration dates", symbol: "!" },
        { name: "Weekly hours", detail: "Friday through Sunday", symbol: "◷", active: true },
        { name: "Pricing", detail: "Admission and group rates", symbol: "$" },
        { name: "Calendar", detail: "Open dates and events", symbol: "▦" },
        { name: "FAQ", detail: "Questions, answers, and search terms", symbol: "?" },
    ];

    return (
        <figure className={styles.contentGraphic}>
            <div className={styles.contentTransformation}>
                <div className={styles.editorMockup}>
                    <div className={styles.mockupTitle}>
                        <span>Admin editor</span>
                        <i>Weekly hours</i>
                    </div>
                    <label>
                        Day
                        <strong>Saturday</strong>
                    </label>
                    <div>
                        <label>
                            Opens
                            <strong>11:00 AM</strong>
                        </label>
                        <label>
                            Closes
                            <strong>6:00 PM</strong>
                        </label>
                    </div>
                    <button type="button" tabIndex="-1">Save hours</button>
                </div>

                <div className={styles.transformArrow} aria-hidden="true">
                    <span>save</span>
                    <b>→</b>
                </div>

                <div className={styles.configMockup}>
                    <div className={styles.mockupTitle}>
                        <span>Structured configuration</span>
                        <i>weekly-hours</i>
                    </div>
                    <pre><code>{`{
  "saturday": {
    "open": "11:00:00",
    "close": "18:00:00"
  }
}`}</code></pre>
                </div>

                <div className={styles.transformArrow} aria-hidden="true">
                    <span>read</span>
                    <b>→</b>
                </div>

                <div className={styles.publicHoursMockup}>
                    <div className={styles.mockupTitle}>
                        <span>Public website</span>
                        <i>Visit</i>
                    </div>
                    <p>Saturday</p>
                    <strong>11 AM–6 PM</strong>
                    <span>Hours are formatted for visitors.</span>
                </div>
            </div>

            <div className={styles.contentWorkbench}>
                <div className={styles.workbenchIntro}>
                    <p>The content workbench</p>
                    <h4>Five editors instead of one giant text box</h4>
                    <span>
                        Each kind of content gets fields that match what it contains. An announcement
                        has an expiration date; a price has an amount; an FAQ has a question and answer.
                    </span>
                </div>
                <div className={styles.workbenchWindow}>
                    <div className={styles.workbenchBar}>
                        <span>Site content</span>
                        <i>Admin</i>
                    </div>
                    <div className={styles.workbenchList}>
                        {workbenchItems.map((item) => (
                            <div className={item.active ? styles.activeWorkbenchItem : ""} key={item.name}>
                                <b>{item.symbol}</b>
                                <span>
                                    <strong>{item.name}</strong>
                                    <small>{item.detail}</small>
                                </span>
                                <i aria-hidden="true">→</i>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.contentPipeline}>
                <div><b>1</b><strong>Edit</strong><span>Purpose-built form</span></div>
                <i aria-hidden="true">→</i>
                <div><b>2</b><strong>Validate</strong><span>Check its schema</span></div>
                <i aria-hidden="true">→</i>
                <div><b>3</b><strong>Save</strong><span>Dynamic config</span></div>
                <i aria-hidden="true">→</i>
                <div className={styles.normalizeStep}>
                    <b>4</b><strong>Normalize</strong><span>One predictable shape</span>
                    <small>Can&apos;t load it? Use built-in defaults.</small>
                </div>
                <i aria-hidden="true">→</i>
                <div><b>5</b><strong>Display</strong><span>Public component</span></div>
            </div>
            <figcaption>
                The editor never changes the page itself. It changes data that the page knows how to display.
            </figcaption>
        </figure>
    );
}

function SearchIndexGraphic() {
    return (
        <figure className={`${styles.compactGraphic} ${styles.searchGraphic}`}>
            <div className={styles.searchBuild}>
                <div className={styles.builtPages}>
                    <p>Finished HTML pages</p>
                    <span><b>Visit</b><small>Hours · directions · policies</small></span>
                    <span><b>Corn Maze</b><small>Activity details · night maze</small></span>
                    <span><b>Reservations</b><small>Gazebo · campfire · request</small></span>
                </div>
                <div className={styles.crawler}>
                    <span>postbuild</span>
                    <strong>HTML crawler</strong>
                    <small>Remove menus and repeated chrome</small>
                    <small>Keep titles, headings, and page text</small>
                    <small>Attach hand-written keywords</small>
                </div>
                <div className={styles.indexFile}>
                    <p>search-index.json</p>
                    <pre>{`{
  url: "/visit",
  title: "Visit",
  content: "…",
  keywords: [...]
}`}</pre>
                </div>
            </div>
            <div className={styles.browserSearch}>
                <div>
                    <span>Visitor types</span>
                    <strong>“wheelchair”</strong>
                </div>
                <b>→</b>
                <div>
                    <span>Fuse.js searches locally</span>
                    <strong>No search server</strong>
                </div>
                <b>→</b>
                <div className={styles.searchResult}>
                    <span>Best match</span>
                    <strong>Visit the Farm</strong>
                    <small>Most areas are accessible, but pathways are gravel or grass…</small>
                </div>
            </div>
            <figcaption>The search index is rebuilt from the finished website each time the public app is built.</figcaption>
        </figure>
    );
}

function FeatureFlagGraphic() {
    const switches = [
        ["Maze game", true],
        ["Fall hero", true],
        ["Opening countdown", false],
        ["Weather card", false],
        ["Vendor promotions", true],
        ["Database forms", true],
    ];

    return (
        <figure className={`${styles.compactGraphic} ${styles.flagGraphic}`}>
            <div className={styles.switchboard}>
                <div className={styles.switchboardHeader}>
                    <span>Seasonal switchboard</span>
                    <code>production</code>
                </div>
                <div className={styles.switchList}>
                    {switches.map(([name, enabled]) => (
                        <div key={name}>
                            <span>{name}</span>
                            <i className={enabled ? styles.switchOn : ""}><b /></i>
                            <small>{enabled ? "ON" : "OFF"}</small>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.flagOutcome}>
                <div>
                    <p>Same deployed code</p>
                    <strong>Fall version</strong>
                    <span>Maze game and seasonal artwork appear</span>
                </div>
                <b>↔</b>
                <div>
                    <p>Different flag values</p>
                    <strong>Off-season version</strong>
                    <span>Seasonal features stay hidden</span>
                </div>
                <aside>
                    <strong>Flag</strong>
                    <span>Should this feature run?</span>
                    <strong>Config</strong>
                    <span>What should this feature say?</span>
                </aside>
            </div>
            <figcaption>Flags alter behavior at runtime; they do not create a second copy of the website.</figcaption>
        </figure>
    );
}

function ReservationWorkflowGraphic() {
    return (
        <figure className={`${styles.compactGraphic} ${styles.reservationGraphic}`}>
            <div className={styles.reservationFlow}>
                <div>
                    <span>01 · Visitor</span>
                    <strong>Request a gazebo</strong>
                    <small>Preferred date, time, fallback dates, and contact details</small>
                </div>
                <b>→</b>
                <div className={styles.requestRecord}>
                    <span>02 · Neon</span>
                    <strong>Reservation request</strong>
                    <small>Price and time-slot rules are saved as a snapshot</small>
                    <em>Waiting for review</em>
                </div>
                <b>→</b>
                <div>
                    <span>03 · Staff</span>
                    <strong>Review in admin</strong>
                    <small>Check availability and confirm the details with the visitor</small>
                </div>
                <b>→</b>
                <div className={styles.bookingRecord}>
                    <span>04 · Neon</span>
                    <strong>Create booking</strong>
                    <small>Tentative or confirmed, still linked to the original request</small>
                </div>
            </div>
            <div className={styles.recordLink}>
                <span>Request #184</span>
                <i />
                <span>Booking #72</span>
                <p>The original request remains available from the booking record.</p>
            </div>
            <figcaption>Submitting the public form starts a conversation; it does not promise that the requested time is available.</figcaption>
        </figure>
    );
}

function InfoStripGraphic() {
    const sources = [
        { name: "Hours", source: "Statsig config", symbol: "◷" },
        { name: "Admission", source: "Pricing config", symbol: "$" },
        { name: "Location", source: "Site content", symbol: "⌖" },
        { name: "Weather", source: "Weather API", symbol: "☁" },
        { name: "Opening day", source: "Browser clock", symbol: "▣" },
    ];

    return (
        <figure className={`${styles.compactGraphic} ${styles.infoGraphic}`}>
            <div className={styles.infoSources}>
                {sources.map((source) => (
                    <div key={source.name}>
                        <b>{source.symbol}</b>
                        <span><strong>{source.name}</strong><small>{source.source}</small></span>
                    </div>
                ))}
            </div>
            <div className={styles.infoAssembler}>
                <span>Flags choose the active cards</span>
                <b>↓</b>
                <strong>InfoStrip component</strong>
                <small>Normalize each source into the same card shape</small>
                <b>↓</b>
            </div>
            <div className={styles.infoOutput}>
                <div><small>Hours</small><strong>Sat. 11–6</strong></div>
                <div><small>Admission</small><strong>$6/person</strong></div>
                <div><small>Location</small><strong>Inwood, WV</strong></div>
                <div className={styles.weatherOutput}><small>Weather</small><strong>72° · Cloudy</strong></div>
            </div>
            <aside className={styles.weatherRoute}>
                <span>Browser</span><b>→</b><span><code>/api/weather</code></span><b>→</b><span>WeatherAPI</span>
                <p>The API key stays on the server instead of being sent to every visitor.</p>
            </aside>
            <figcaption>Each card has a different source, but the homepage presents them as one consistent strip.</figcaption>
        </figure>
    );
}

function RepositoryArchitectureGraphic() {
    return (
        <figure className={styles.repositoryGraphic}>
            <div className={styles.architectureStatement}>
                <span>Together in source.</span>
                <span>Separate in production.</span>
                <span>Connected through data.</span>
            </div>

            <div className={styles.sourceStage}>
                <div className={styles.stageHeading}>
                    <b>01</b>
                    <span>
                        <strong>Development</strong>
                        <small>One repository</small>
                    </span>
                </div>
                <div className={styles.sourceContents}>
                    <div className={styles.sourceApps}>
                        <p><code>apps/</code> Two complete applications</p>
                        <div>
                            <span className={styles.sourcePublic}><code>public/</code><small>visitor website</small></span>
                            <span className={styles.sourceAdmin}><code>admin/</code><small>farm dashboard</small></span>
                        </div>
                    </div>
                    <div className={styles.sourcePackages}>
                        <p><code>packages/</code> Imported where needed</p>
                        <div>
                            <span><code>ui/</code></span>
                            <span><code>db/</code></span>
                            <span><code>public-ui/</code></span>
                        </div>
                    </div>
                    <aside>
                        A shared package is not a third application. Its code becomes part of whichever app imports it.
                    </aside>
                </div>
            </div>

            <div className={styles.buildStage}>
                <div className={styles.stageHeading}>
                    <b>02</b>
                    <span>
                        <strong>Build</strong>
                        <small>Turbo produces two outputs</small>
                    </span>
                </div>
                <div className={styles.buildEquation}>
                    <div>
                        <code>apps/public</code>
                        <span>+ imported packages</span>
                    </div>
                    <b>→</b>
                    <strong>Public build</strong>
                    <i />
                    <div>
                        <code>apps/admin</code>
                        <span>+ imported packages</span>
                    </div>
                    <b>→</b>
                    <strong>Admin build</strong>
                </div>
            </div>

            <div className={styles.runtimeStage}>
                <div className={styles.stageHeading}>
                    <b>03</b>
                    <span>
                        <strong>Production</strong>
                        <small>Two deployments, no direct connection</small>
                    </span>
                </div>
                <div className={styles.runtimeDiagram}>
                    <div className={styles.publicRuntime}>
                        <small>Visitors</small>
                        <strong>Public deployment</strong>
                        <span>Public pages and API routes</span>
                    </div>
                    <div className={styles.runtimeBoundary}>
                        <span>Separate runtime boundary</span>
                        <b>no app-to-app calls</b>
                    </div>
                    <div className={styles.adminRuntime}>
                        <small>Authorized farm staff</small>
                        <strong>Admin deployment</strong>
                        <span>Private pages and API routes</span>
                    </div>
                    <div className={styles.sharedServices}>
                        <p>Shared state</p>
                        <div>
                            <span><strong>Statsig</strong><small>Site configuration</small></span>
                            <span><strong>Neon</strong><small>Operational data</small></span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.dataJourneys}>
                <div className={styles.hoursJourney}>
                    <p><i /> Hours travel from staff to visitors</p>
                    <div>
                        <span>Admin editor</span><b>→</b>
                        <span>Statsig</span><b>→</b>
                        <span>Public reads config</span><b>→</b>
                        <span>Visit page</span>
                    </div>
                </div>
                <div className={styles.reservationJourney}>
                    <p><i /> Reservations travel from visitors to staff</p>
                    <div>
                        <span>Public form</span><b>→</b>
                        <span>Neon</span><b>→</b>
                        <span>Admin reads request</span><b>→</b>
                        <span>Staff dashboard</span>
                    </div>
                </div>
            </div>
            <figcaption>
                The apps coordinate by reading and writing shared state. Neither deployment needs to know where the other one is running.
            </figcaption>
        </figure>
    );
}

function SystemGraphic({ number }) {
    if (number === "01") return <MazeGameGraphic />;
    if (number === "02") return <HayrideScheduleGraphic />;
    if (number === "03") return <ContentSystemGraphic />;
    if (number === "04") return <SearchIndexGraphic />;
    if (number === "05") return <FeatureFlagGraphic />;
    if (number === "06") return <ReservationWorkflowGraphic />;
    if (number === "07") return <InfoStripGraphic />;
    return null;
}

function SystemArticle({ system }) {
    const details = systemDetails[system.number];

    return (
        <article className={styles.system} id={details.id}>
            <div className={styles.systemNumber}>{system.number}</div>
            <div className={styles.systemCopy}>
                <p>{system.label}</p>
                <h3>{system.title}</h3>
                <p>{system.copy}</p>
                {details.href && (
                    <ArticleFeatureLink href={details.href} flag={details.flag}>
                        {details.link}
                    </ArticleFeatureLink>
                )}
            </div>
            <pre><code>{system.code}</code></pre>
            <SystemGraphic number={system.number} />
        </article>
    );
}

export default function UnderTheHood() {
    return (
        <Layout>
            <main className={styles.page}>
                <section className={styles.hero}>
                    <div className={styles.heroGrid} aria-hidden="true" />
                    <div className={styles.heroCopy}>
                        <p className={styles.eyebrow}>Technical field notes</p>
                        <h1>Under the Hood</h1>
                        <p>
                            This site has picked up some unusual features over time: a hand-drawn
                            map of the farm, a QR-code game in the corn maze, and an admin site for
                            handling schedules and reservations. This page explains how some of it works.
                        </p>
                        <a href="#map">Start with the map <span aria-hidden="true">↓</span></a>
                    </div>
                    <aside className={styles.heroTerminal} aria-label="A summary of the website architecture">
                        <div><span /> <span /> <span /></div>
                        <pre>{`old-mcdonalds/
├── public site
├── admin dashboard
├── shared interface
└── farm database

status: growing nicely`}</pre>
                    </aside>
                </section>

                <section className={styles.intro}>
                    <p className={styles.kicker}>About this page</p>
                    <p>
                        Most visitors will never need to know any of this. But if you have ever
                        wondered how the map was made, what happens after you scan a maze code,
                        or how the farm updates its hours, this is the longer answer.
                    </p>
                </section>

                <nav className={styles.contents} aria-label="On this page">
                    <div>
                        <p className={styles.kicker}>On this page</p>
                        <span>Ten stops from the farm map to the finished deployment.</span>
                    </div>
                    <ol>
                        {contents.map(([number, label, id]) => (
                            <li key={id}>
                                <a href={`#${id}`}><span>{number}</span>{label}</a>
                            </li>
                        ))}
                    </ol>
                </nav>

                <section className={styles.mapSection} id="map">
                    <div className={styles.mapCopy}>
                        <p className={styles.sectionNumber}>00 / The map</p>
                        <h2>The farm is drawn from coordinates</h2>
                        <p className={styles.lead}>
                            The map is not an image. Nearly everything on it is drawn by the browser.
                        </p>
                        <p>
                            I traced the boundaries of fields, buildings, parking areas, and other
                            parts of the farm as lists of latitude and longitude coordinates. A closed
                            list becomes a polygon. An open list becomes a line, which works for things
                            like creeks and trails. Individual locations use markers with their own icons.
                        </p>
                        <p>
                            The Leaflet mapping library puts all of those pieces in the right place and
                            keeps them there while the map moves and zooms. This diagram skips the map
                            tiles and projects the same coordinate data directly into an SVG. Select
                            any feature to see the points that define it.
                        </p>
                        <div className={styles.mapRecipe} aria-label="How the farm map is made">
                            <span>coordinates</span><b>→</b><span>shapes</span><b>→</b><span>styled farm</span>
                        </div>
                        <Link href="/map">Explore the finished map <span aria-hidden="true">↗</span></Link>
                    </div>
                    <div>
                        <FarmCoordinateExplorer />
                    </div>
                </section>

                <section className={styles.systems}>
                    <header>
                        <p className={styles.kicker}>The systems</p>
                        <h2>From the field to the office</h2>
                        <p>Some features follow visitors around the farm. Others help run it from behind the counter.</p>
                    </header>
                    <div className={styles.chapter}>
                        <div className={styles.chapterHeading}>
                            <span>Chapter one</span>
                            <h3>Out on the farm</h3>
                            <p>Software that meets visitors in physical places.</p>
                        </div>
                        {systems.slice(0, 2).map((system) => <SystemArticle system={system} key={system.number} />)}
                    </div>
                    <div className={styles.chapter}>
                        <div className={styles.chapterHeading}>
                            <span>Chapter two</span>
                            <h3>Running the website</h3>
                            <p>Content, operations, and the small systems connecting them.</p>
                        </div>
                        {systems.slice(2).map((system) => <SystemArticle system={system} key={system.number} />)}
                    </div>
                </section>

                <section className={styles.architecture} id="architecture">
                    <div className={styles.architectureCopy}>
                        <p className={styles.sectionNumber}>08 / The whole machine</p>
                        <h2>The public site and the admin site</h2>
                        <p>
                            This project is actually two Next.js applications in the same repository.
                            One is the website you are looking at. The other is a private dashboard used
                            to edit content, review form submissions, manage bookings, and keep track of
                            hayrides. They share database code and some interface components, but they
                            are built and deployed separately.
                        </p>
                    </div>
                    <RepositoryArchitectureGraphic />
                </section>

                <section className={styles.stack} id="stack">
                    <header>
                        <p className={styles.kicker}>09 / The short version</p>
                        <h2>What runs where</h2>
                        <p>
                            A tech stack is not one machine. Some parts organize the project, some run
                            on a server, some arrive in the visitor&apos;s browser, and some are services
                            the applications talk to.
                        </p>
                    </header>
                    <div className={styles.stackWorkbench}>
                        <article>
                            <div className={styles.stackGroupHeading}>
                                <span>01</span>
                                <h3>While building</h3>
                            </div>
                            <dl>
                                <div>
                                    <dt>Turbo</dt>
                                    <dd>Coordinates tasks across both apps and the shared packages.</dd>
                                </div>
                                <div>
                                    <dt>npm workspaces</dt>
                                    <dd>Keeps the repository&apos;s apps and packages connected.</dd>
                                </div>
                            </dl>
                        </article>
                        <article>
                            <div className={styles.stackGroupHeading}>
                                <span>02</span>
                                <h3>On the server</h3>
                            </div>
                            <dl>
                                <div>
                                    <dt>Next.js</dt>
                                    <dd>Builds pages, renders them, and handles server requests.</dd>
                                </div>
                                <div>
                                    <dt>API routes</dt>
                                    <dd>Validate forms and connect browser actions to server code.</dd>
                                </div>
                            </dl>
                        </article>
                        <article>
                            <div className={styles.stackGroupHeading}>
                                <span>03</span>
                                <h3>In the browser</h3>
                            </div>
                            <dl>
                                <div>
                                    <dt>React</dt>
                                    <dd>Runs the interactive parts of pages after they load.</dd>
                                </div>
                                <div>
                                    <dt>Leaflet</dt>
                                    <dd>Turns farm coordinates into the map visitors can explore.</dd>
                                </div>
                            </dl>
                        </article>
                        <article>
                            <div className={styles.stackGroupHeading}>
                                <span>04</span>
                                <h3>Hosted services</h3>
                            </div>
                            <dl>
                                <div>
                                    <dt>Neon</dt>
                                    <dd>Stores reservations, submissions, bookings, and schedules.</dd>
                                </div>
                                <div>
                                    <dt>Statsig</dt>
                                    <dd>Stores editable configuration and feature switches.</dd>
                                </div>
                                <div>
                                    <dt>Vercel</dt>
                                    <dd>Builds and runs the two deployed applications.</dd>
                                </div>
                            </dl>
                        </article>
                    </div>
                    <footer className={styles.fieldNoteStamp}>
                        <span>Technical field notes</span>
                        <strong>Snapshot: July 2026</strong>
                        <div>
                            <p><b>7</b> primary tools</p>
                            <p><b>2</b> applications</p>
                            <p><b>1</b> repository</p>
                        </div>
                    </footer>
                    <p className={styles.closingNote}>
                        This website started as a place to post the farm&apos;s hours. Most of these
                        systems were added one practical problem at a time.
                    </p>
                </section>
            </main>
        </Layout>
    );
}
