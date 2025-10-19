"use client"
import { useFlags } from '@/app/FlagsContext';
import { useEffect, useState } from 'react';
import { User, EnvelopeSimple, SpinnerGap } from 'phosphor-react';

export default function ContactForm({ theme }) {
    const { isFeatureEnabled } = useFlags();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [responseMessage, setResponseMessage] = useState(null);
    const [formLinks, setFormLinks] = useState({ contact: '' });
    const [forceGoogleFormsClient, setForceGoogleFormsClient] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const MESSAGE_MAX = 1000;

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
            setIsSubmitting(true);
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
        } finally {
            setIsSubmitting(false);
        }

        setErrors({});
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            // Re-validate this field on change to clear error once fixed
            handleFieldValidation(e.target.name, e.target.value);
        }
    };

    const handleFieldValidation = (name, value) => {
        let msg = undefined;
        if (name === 'name') {
            if (!value) msg = 'Name is required.';
        } else if (name === 'email') {
            if (!value) msg = 'Email is required.';
            else if (!/\S+@\S+\.\S+/.test(value)) msg = 'Email address is invalid.';
        } else if (name === 'message') {
            if (!value) msg = 'Message is required.';
        }
        setErrors(prev => ({ ...prev, [name]: msg }));
    };

    const handleBlur = (e) => {
        handleFieldValidation(e.target.name, e.target.value);
    };

    const usingGoogleForms = isFeatureEnabled('use_google_forms');
    const showContactForm = isFeatureEnabled('show_contact_form');

    if (usingGoogleForms) {
        const href = formLinks.contact || '#';
        const disabled = !formLinks.contact;
        return (
            <div
                className={
                    `flex flex-col items-center m-6 rounded-2xl transition-shadow ` +
                    (theme === 'onDark'
                        ? 'bg-background/10 backdrop-blur border border-white/10 py-6 px-6'
                        : 'bg-white border border-gray-200 shadow-xl hover:shadow-2xl py-8 px-8')
                }
            >
                <h2 className={`text-3xl md:text-4xl font-bold text-center ${theme === 'onDark' ? 'text-background' : 'text-gray-900'} mb-2`}>Contact Us</h2>
                {forceGoogleFormsClient ? (
                    <div className="w-full max-w-xl mb-4 p-3 rounded-md bg-accent/90 text-background border border-accent text-center">
                        <strong>High traffic detected:</strong> we switched to our backup form to ensure your message gets through.
                    </div>
                ) : (
                    null
                )}
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full md:w-auto text-center bg-accent hover:bg-background !text-background hover:!text-accent cursor-pointer font-semibold px-6 py-2.5 rounded-full transition-all duration-200 shadow-sm ${disabled ? 'pointer-events-none opacity-60' : ''}`}
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
        <div
            className={
                `m-6 rounded-2xl transition-shadow ` +
                (theme === 'onDark'
                    ? 'bg-background/10 backdrop-blur border border-white/10 p-6'
                    : 'bg-white border border-gray-200 shadow-xl hover:shadow-2xl p-8')
            }
        >
            <h2 className={`text-3xl md:text-4xl font-bold text-center ${theme === 'onDark' ? 'text-background' : 'text-gray-900'} mb-2`}>Contact Us</h2>
            {!submitted && (
                <form className="w-full max-w-2xl mx-auto" onSubmit={handleSubmit} aria-live="polite">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className={`block text-sm font-medium mb-1 ${theme === 'onDark' ? 'text-background' : 'text-gray-700'}`}>Name</label>
                            <div className="relative">
                                <div className={`pointer-events-none absolute inset-y-0 left-3 flex items-center ${theme === 'onDark' ? 'text-background/70' : 'text-gray-400'}`}>
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    autoComplete="name"
                                    aria-invalid={!!errors.name}
                                    aria-describedby={errors.name ? 'name-error' : undefined}
                                    disabled={isSubmitting}
                                    className={
                                        `w-full pl-9 pr-3 py-2 rounded-lg shadow-sm transition focus-visible:outline-none focus-visible:ring-2 ` +
                                        (theme === 'onDark'
                                            ? 'bg-background/20 border border-white/20 text-background placeholder:text-background/60 focus-visible:ring-accent/60 focus-visible:border-accent/60'
                                            : 'bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-accent/40 focus-visible:border-accent')
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={formData.name}
                                />
                            </div>
                            {errors.name && <p id="name-error" className="mt-1 text-red-600 text-sm">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className={`block text-sm font-medium mb-1 ${theme === 'onDark' ? 'text-background' : 'text-gray-700'}`}>Email</label>
                            <div className="relative">
                                <div className={`pointer-events-none absolute inset-y-0 left-3 flex items-center ${theme === 'onDark' ? 'text-background/70' : 'text-gray-400'}`}>
                                    <EnvelopeSimple size={18} />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    inputMode="email"
                                    spellCheck={false}
                                    aria-invalid={!!errors.email}
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                    disabled={isSubmitting}
                                    className={
                                        `w-full pl-9 pr-3 py-2 rounded-lg shadow-sm transition focus-visible:outline-none focus-visible:ring-2 ` +
                                        (theme === 'onDark'
                                            ? 'bg-background/20 border border-white/20 text-background placeholder:text-background/60 focus-visible:ring-accent/60 focus-visible:border-accent/60'
                                            : 'bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-accent/40 focus-visible:border-accent')
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={formData.email}
                                />
                            </div>
                            {errors.email && <p id="email-error" className="mt-1 text-red-600 text-sm">{errors.email}</p>}
                        </div>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="message" className={`block text-sm font-medium mb-1 ${theme === 'onDark' ? 'text-background' : 'text-gray-700'}`}>Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="5"
                            maxLength={MESSAGE_MAX}
                            aria-invalid={!!errors.message}
                            aria-describedby={errors.message ? 'message-error' : 'message-help'}
                            disabled={isSubmitting}
                            className={
                                `w-full px-3 py-2 rounded-lg shadow-sm transition resize-y min-h-[120px] max-h-[400px] focus-visible:outline-none focus-visible:ring-2 ` +
                                (theme === 'onDark'
                                    ? 'bg-background/20 border border-white/20 text-background placeholder:text-background/60 focus-visible:ring-accent/60 focus-visible:border-accent/60'
                                    : 'bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-accent/40 focus-visible:border-accent')
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={formData.message}
                        />
                        {errors.message && <p id="message-error" className="mt-1 text-red-600 text-sm">{errors.message}</p>}
                        <div id="message-help" className={`mt-1 text-xs ${theme === 'onDark' ? 'text-background/70' : 'text-gray-500'}`} aria-live="polite">
                            {formData.message.length}/{MESSAGE_MAX}
                        </div>
                    </div>
                    <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full md:w-auto inline-flex items-center justify-center bg-accent hover:bg-background !text-background hover:!text-accent cursor-pointer font-semibold px-6 py-2.5 rounded-full transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed`}
                        >
                            {isSubmitting && (
                                <SpinnerGap size={24} weight='bold' className='mr-2 h-4 w-4 animate-spin' />
                            )}
                            {isSubmitting ? 'Sending…' : 'Send Message'}
                        </button>
                        <p className={`text-sm text-center md:text-left ${theme === 'onDark' ? 'text-background/70' : 'text-gray-500'}`}>No spam. Ever.</p>
                    </div>
                </form>
            )}
            {submitted && (
                <div
                    role="status"
                    aria-live="polite"
                    className={`mt-6 w-full max-w-2xl mx-auto rounded-lg border p-5 text-center ${theme === 'onDark' ? 'border-accent/40 text-background' : 'border-green-200 bg-green-50 text-green-800'}`}
                >
                    <p className="text-lg font-medium">Message sent</p>
                    {responseMessage && <p className="mt-1">{responseMessage}</p>}
                    <button
                        type="button"
                        onClick={() => { setSubmitted(false); setResponseMessage(null); }}
                        className={`mt-4 w-full md:w-auto inline-flex items-center justify-center bg-accent hover:bg-background !text-background hover:!text-accent cursor-pointer font-semibold px-5 py-2 rounded-full transition-all duration-200 shadow-sm`}
                    >
                        Send another message
                    </button>
                </div>
            )}
        </div>
    );
}
