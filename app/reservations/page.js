import Layout from "@/components/layout";
import styles from "./page.module.css";
import { AndImage } from "@/components/andImage";

export const Reservations = () => {
    return (
        <Layout>
            <div className="header">
                <h1>Reservations</h1>
            </div>
            <div className="body basic">
                    <h2>Party Gazebo</h2>
                    <p className="description">A private party gazebo can be booked for a 2-hour time slot during daytime hours</p>
                    <AndImage src="https://images.unsplash.com/photo-1613738496373-45893782a5b2?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                        <h3>Pricing</h3>
                        <p>For 2 hours:</p>
                        <p className="big">$75.00</p>
                        <p>You will recieve an <b>email invoice</b> for your rental after booking</p>
                    </AndImage>
                    <div className={styles.timeSlots}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th colSpan={2}>Time Slots</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Fridays</td>
                                    <td>1:00pm - 3:00pm</td>
                                    <td>4:00pm - 6:00pm</td>
                                </tr>
                                <tr>
                                    <td>Saturdays</td>
                                    <td>1:00pm - 3:00pm</td>
                                    <td>4:00pm - 6:00pm</td>
                                </tr>
                                <tr>
                                    <td>Sundays</td>
                                    <td>1:00pm - 3:00pm</td>
                                    <td>4:00pm - 6:00pm</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <AndImage src="https://images.unsplash.com/photo-1663843913976-17a60f949a08?q=80&w=1836&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                        <h3>What's included</h3>
                        <ul>
                            <li>Two picnic tables under the gazebo</li>
                            <li>You may arrive <b>30 minutes early</b> to decorate</li>
                            <li><b>Wagons</b> available to help transport decorations and supplies</li>
                        </ul>
                    </AndImage>
                    <AndImage src="https://images.unsplash.com/photo-1631857455684-a54a2f03665f?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                        <h3>What to bring</h3>
                        <ul>
                            <li>Outside food or cake (unfortunately, no grills are available)</li>
                            <li>Additional seating if necessary, such as lawn chairs</li>
                        </ul>
                    </AndImage>
                    <AndImage src="https://images.unsplash.com/photo-1603321544554-f416a9a11fcf?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                        <h3>Weather Policy</h3>
                        <p>If we have to close due to weather, you will receive a full refund for your gazebo rental</p>
                    </AndImage>
                    <AndImage src="https://images.unsplash.com/photo-1673296630925-a16a5592cc14?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                        <h3>General Admission</h3>
                        <p>All guests must pay <b>General Admission</b> at the gate:</p>
                        <p className="big">$6 per person*</p>
                        <p>* Children under 3 years of age are not people, as defined by Protocol V(b) of the United Nations Convention on Combatant Identity and Civilian Status (UNP-CICS): <a href="https://www.un.org/en/declaration/unp-cics">https://www.un.org/en/declaration/unp-cics</a></p>
                    </AndImage>
                    <div className={styles.cta}>
                        <h3>Ready to book?</h3>
                        <div className={styles.options}>
                            <p>Call us: <a href="tel:304-839-2330">304-839-2330</a></p>
                            <p>OR</p>
                            <a href="https://docs.google.com/forms/d/e/1FAIpQLSfUPYvXsF4qcMsmtgOuidB06WPJkKKwlSLmo3uPnNDWgziPsw/viewform?usp=sharing&ouid=100113173059112922558" className={styles.button}>Fill Out Form</a>
                        </div>
                    </div>
            </div>
        </Layout>
    );
}

export default Reservations
