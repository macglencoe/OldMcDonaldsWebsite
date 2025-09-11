"use client"
import { isFeatureEnabled } from '@/public/lib/featureEvaluator';
import { useEffect, useState } from 'react';

export default function ContactForm({ theme }) {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [responseMessage, setResponseMessage] = useState(null);
    const [formLinks, setFormLinks] = useState({ contact: '' });
    const [forceGoogleFormsClient, setForceGoogleFormsClient] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        fetch('/data/form-links.json')
            .then(res => res.json())
            .then(setFormLinks)
            .catch(() => setFormLinks({ contact: '' }));

        // check local fallback cooldown
        try {
            const untilRaw = localStorage.getItem('email_disabled_until');
            if (untilRaw) {
                const until = parseInt(untilRaw, 10);
                if (!Number.isNaN(until) && Date.now() < until) {
                    setForceGoogleFormsClient(true);
                }
            }
        } catch {}
    }, []);

    const validate = () => {
        const errors = {};
        if (!formData.name) errors.name = "Name is required.";
        if (!formData.email) errors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email address is invalid.";
        if (!formData.message) errors.message = "Message is required.";
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await fetch('/api/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    kind: 'contact',
                    text: `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`,
                    html: `<p>Name: ${formData.name}</p><p>Email: ${formData.email}</p><p>${formData.message}</p>`,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setSubmitted(true);
                setResponseMessage("Thanks for your message! We'll receive an email soon.");
                setFormData({ name: '', email: '', message: '' });
            } else {
                setResponseMessage(`Submission failed: ${data.error || 'Unknown error'}`);
                // enable client-side fallback for 24h on limit errors
                if (response.status === 429 || data?.code === 'LIMIT_EXCEEDED' || /limit|quota|rate|daily/i.test(String(data.error))) {
                    try {
                        const until = Date.now() + 24 * 60 * 60 * 1000; // 24h
                        localStorage.setItem('email_disabled_until', String(until));
                        setForceGoogleFormsClient(true);
                    } catch {}
                }
            }
        } catch (error) {
            console.error('Submission error:', error);
            setResponseMessage('An unexpected error occurred. Please try again later.');
        }

        setErrors({});
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const usingGoogleForms = forceWebForm ? false : (forceGoogleFormsClient || isFeatureEnabled('use_google_forms'));
    const showContactForm = forceWebForm ? true : isFeatureEnabled('show_contact_form');

    if (usingGoogleForms) {
        const href = formLinks.contact || '#';
        const disabled = !formLinks.contact;
        return (
            <div className={`flex flex-col items-center py-6 px-12 m-6 rounded-2xl ` +
                (theme === 'onDark' ? 'bg-background/10' : ' text-foreground')}>
                <h2 className="text-4xl font-bold text-center text-background mb-4">Contact Us</h2>
                {forceGoogleFormsClient ? (
                    <div className="w-full max-w-xl mb-4 p-3 rounded-md bg-accent/80 text-background border border-accent text-center">
                        <strong>High traffic detected:</strong> we switched to our backup form to ensure your message gets through.
                    </div>
                ) : (
                    <p className="text-background mb-4 text-center">
                        Our web form is temporarily routed to Google Forms while we fix some things on our end.
                    </p>
                )}
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-accent hover:bg-background !text-background hover:!text-accent cursor-pointer font-semibold px-5 py-2 rounded-full transition-all duration-200 shadow-sm ${disabled ? 'pointer-events-none opacity-60' : ''}`}
                >
                    Open Contact Form
                </a>
            </div>
        );
    }

    if (!showContactForm) {
        return null;
    }

    return (
        <div className={`flex flex-col items-center py-6 px-12 m-6 rounded-2xl ` +
            (theme === 'onDark' ? 'bg-background/10' : ' text-foreground')}>
            <h2 className="text-4xl font-bold text-center text-background mb-6">Contact Us</h2>
            {!submitted && (
                <form className="w-full max-w-md" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-background font-bold mb-2">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full px-3 py-2 border border-gray-300 text-background rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            value={formData.name}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-background font-bold mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-3 py-2 border border-gray-300 text-background rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            value={formData.email}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="message" className="block text-background font-bold mb-2">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 text-background rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            value={formData.message}
                        ></textarea>
                        {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="bg-accent hover:bg-background !text-background hover:!text-accent cursor-pointer font-semibold px-5 py-2 rounded-full transition-all duration-200 shadow-sm">
                        Submit
                    </button>
                </form>
            )}
            {responseMessage && (
                <p className="mt-6 text-center text-lg text-background">{responseMessage}</p>
            )}
        </div>
    );
}
