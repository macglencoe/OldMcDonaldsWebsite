import styles from "./calendar.module.css"

export const Calendar = ({ events, month, year, openDates }) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDay = firstDayOfMonth.getDay();
    
    const weeks = [];
    let currentDay = 1 - startDay;

    while (currentDay <= daysInMonth) {
        const week = [];
        for (let i = 0; i < 7; i++) {
            week.push(currentDay);
            currentDay++;
        }
        weeks.push(week);
    }

    const getEventsForDay = (day) => {
        if (!events || day <= 0 || day > daysInMonth) return [];
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate()+1 === day && eventDate.getMonth()+1 === month && eventDate.getFullYear() === year;
        });
    };


    return (
        <div className={styles.calendarContainer}>
            <h2>{new Date(year, month-1).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h2>
            <table className={styles.calendar}>
                <thead>
                    <tr>
                        <th>S</th>
                        <th>M</th>
                        <th>T</th>
                        <th>W</th>
                        <th>T</th>
                        <th>F</th>
                        <th>S</th>
                    </tr>
                </thead>
                <tbody>
                    {weeks.map((week, weekIndex) => (
                        <tr key={weekIndex}>
                            {week.map((day, dayIndex) => (
                                
                                <td key={dayIndex} className={openDates.includes(day) ? styles.open : styles.closed}>
                                    {day > 0 && day <= daysInMonth ? (
                                        <div>
                                            <span>{day}</span>
                                            <ul>
                                                {getEventsForDay(day).map((event, eventIndex) => (
                                                    <li key={eventIndex}>{event.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : ""}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Calendar