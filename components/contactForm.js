"use client"
import { useState } from 'react';

export default function ContactForm({ theme }) {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [responseMessage, setResponseMessage] = useState(null);

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
                    to: ['mcpaul1694@gmail.com', 'sgmcdonald2@gmail.com'], // TODO
                    subject: 'Contact Form Submission',
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
