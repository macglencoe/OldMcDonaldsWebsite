import Layout from '@/components/layout'
import styles from './page.module.css'
import { FAQDrop } from '@/components/faqDrop';

export const FAQ = () => {
    return (
        <Layout>
            <div className='header'>
                <h1>FAQ</h1>
                <span>Frequently Asked Questions</span>
            </div>
            <div className={'body basic' + ' ' + styles.body}>
                <FAQDrop q="Why?">
                    Don't ask questions you don't want the answer to
                </FAQDrop>
                <FAQDrop q="How long will it take me to go through the maze?">
                    Approximately 30 mins per maze
                </FAQDrop>
                <FAQDrop q="Do you have restrooms?">
                    There are portable restrooms and hand sanitizer available.
                </FAQDrop>
                <FAQDrop q="What types of payment do you accept?">
                    We accept cash, card and we will accept checks for large groups/schools.
                </FAQDrop>
                <FAQDrop q="Are pets allowed at the farm?">
                    We are sorry, but pets must be left at home
                </FAQDrop>
                <FAQDrop q="Does the farm close due to weather?">
                    The Farm is only open weather permitting. Muddy ground conditions after rain can force us to stay closed even after the rain has stopped. Weather updates will always be posted on FB page, website and on our phone.
                </FAQDrop>
                <FAQDrop q="Why can't I drink alcoholic beverages on the farm?">
                    This is a family oriented, alcohol free event.
                </FAQDrop>
                <FAQDrop q="Where can I smoke on the farm?">
                    Only in the parking lot
                </FAQDrop>
                <FAQDrop q="When the maze is open during the night time hours, do I need to bring a flashlight?">
                    Yes, you need to bring a flashlight because the maze pathways are not lit up at night
                </FAQDrop>
                <FAQDrop q="Will the maze be haunted?">
                    No
                </FAQDrop>
                <FAQDrop q="Do you provide wagons or strollers for my children to be transported around the farm in?">
                    No, our carts are for hauling pumpkins from the patches and market to your vehicle. We suggest you bring your own stroller/wagon to transport your child in safely.
                </FAQDrop>
                <FAQDrop q="Can we bring in food and have a picnic?">
                    Of course!
                </FAQDrop>
                <FAQDrop q="Does the hayride take me to the patch?">
                    <p>
                        No, the hayride is just a tour of the farm.<br></br>
                        You have to walk out to the patch. Read <a href='activities/pumpkin-patch'>This Page</a>
                    </p>
                </FAQDrop>
                <FAQDrop q="Does admission include a pumpkin?">
                    No. U-pick pumpkins are .50 a lb and are not included in admission.
                </FAQDrop>
            </div>
        </Layout>
    )
}

export default FAQ;