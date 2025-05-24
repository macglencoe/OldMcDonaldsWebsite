import styles from './footer.module.css'

export const Footer = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.top}>
                <div className={styles.brand}>
                    <h1>Logo here</h1>
                    <div className={styles.socials}>
                        <a href='https://www.facebook.com'>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
                                <path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z"></path>
                            </svg>
                        </a>
                        <a href='https://www.instagram.com'>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24">
                                <path d="M 8 3 C 5.243 3 3 5.243 3 8 L 3 16 C 3 18.757 5.243 21 8 21 L 16 21 C 18.757 21 21 18.757 21 16 L 21 8 C 21 5.243 18.757 3 16 3 L 8 3 z M 8 5 L 16 5 C 17.654 5 19 6.346 19 8 L 19 16 C 19 17.654 17.654 19 16 19 L 8 19 C 6.346 19 5 17.654 5 16 L 5 8 C 5 6.346 6.346 5 8 5 z M 17 6 A 1 1 0 0 0 16 7 A 1 1 0 0 0 17 8 A 1 1 0 0 0 18 7 A 1 1 0 0 0 17 6 z M 12 7 C 9.243 7 7 9.243 7 12 C 7 14.757 9.243 17 12 17 C 14.757 17 17 14.757 17 12 C 17 9.243 14.757 7 12 7 z M 12 9 C 13.654 9 15 10.346 15 12 C 15 13.654 13.654 15 12 15 C 10.346 15 9 13.654 9 12 C 9 10.346 10.346 9 12 9 z"></path>
                            </svg>
                        </a>
                    </div>
                </div>
                <div className={styles.list}>
                    <h2>Quick Links</h2>
                    <a href='/visit'>Visit</a>
                    <a href='/#about'>About</a>
                    <a href='/activities'>Activities</a>
                    <a href='/faq'>FAQ</a>
                </div>
                <div className={styles.list}>
                    <h2>Activities</h2>
                    <a href='/activities/pumpkin-patch'>Pumpkin Patch</a>
                    <a href='/activities/corn-maze'>Corn Maze</a>
                    <a href='/activities/hayrides'>Hayrides</a>
                    <a href='/activities/nature-trails'>Nature Trails</a>
                </div>
                <div className={styles.contactSec}>
                    <a href='tel:304-839-2330'>(304) 839-2330</a>
                </div>
            </div>
            <div className={styles.bottom}>
                <a href='/privacy-policy'>Privacy Policy</a>
                <a href='/attribution'>Attribution</a>
                <span>© 2025 Old McDonalds Pumpkin Patch LLC. All Rights Reserved</span>
            </div>
        </div>
    )
}

export default Footer