"use client";

import { useEffect, useState } from 'react';
import { useFlags } from '@/app/FlagsContext';
import { CERTIFICATION_LABELS, ELECTRICITY_LABELS } from '@/lib/vendorApplication.mjs';

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdNLOwNjhKnsI4QT18MCGOrEvxXP164zfLpXQOZSSBcJQxo3A/viewform?usp=header';
const initialForm = {
  businessName: '', contactName: '', email: '', phone: '', websiteUrl: '',
  electricityRequirement: '', isFoodVendor: '', healthCertificationAcknowledged: false,
  certificationStatus: '', availabilityNotes: '',
};

export default function VendorApplicationForm() {
  const { isFeatureEnabled } = useFlags();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [applicationId, setApplicationId] = useState(null);
  const [forceGoogleForm, setForceGoogleForm] = useState(false);
  useEffect(() => {
    if (Number(localStorage.getItem('vendor_forms_disabled_until') || 0) > Date.now()) setForceGoogleForm(true);
  }, []);
  const useDatabase = isFeatureEnabled('use_db_vendor_applications') && !forceGoogleForm;
  const update = ({ target }) => {
    const value = target.name === 'isFoodVendor' ? target.value === 'true' : target.type === 'checkbox' ? target.checked : target.value;
    setForm(current => {
      const next = { ...current, [target.name]: value };
      if (target.name === 'isFoodVendor' && !value) {
        next.healthCertificationAcknowledged = false;
        next.certificationStatus = '';
      }
      return next;
    });
  };
  const enableFallback = () => {
    localStorage.setItem('vendor_forms_disabled_until', String(Date.now() + 24 * 60 * 60 * 1000));
    setForceGoogleForm(true);
  };
  const submit = async event => {
    event.preventDefault(); setIsSubmitting(true); setMessage('');
    try {
      const response = await fetch('/api/forms/vendor-application', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) { setApplicationId(data.applicationId); setForm(initialForm); }
      else {
        setMessage(data.error || 'The application could not be submitted.');
        if (response.status === 429 || response.status >= 500) enableFallback();
      }
    } catch (error) {
      console.error('Vendor application submission error:', error);
      setMessage('The application service is unavailable. Please use our backup form.');
      enableFallback();
    } finally { setIsSubmitting(false); }
  };
  if (!useDatabase) return <div className="mx-auto my-12 max-w-2xl rounded-xl border border-accent/40 p-8 text-center">
    <h2 className="!text-4xl mb-4">Apply to be a vendor</h2>
    {forceGoogleForm && <p className="mb-4 font-semibold">Our application form is temporarily unavailable. Please use the backup form.</p>}
    <a className="inline-block rounded-lg bg-accent px-5 py-3 !text-white font-semibold" href={GOOGLE_FORM_URL} rel="noopener noreferrer" target="_blank">Open vendor application</a>
  </div>;
  if (applicationId) return <div className="mx-auto my-12 max-w-2xl rounded-xl border border-green-700/30 bg-green-50 p-8 text-center">
    <h2 className="!text-4xl">Application received</h2>
    <p className="mt-3">Your application number is <strong>#{applicationId}</strong>.</p>
    <p>We sent you a receipt. This is not an approval to vend; our team will review your application and contact you.</p>
  </div>;
  const input = 'mt-1 w-full rounded-lg border border-foreground/30 bg-white px-3 py-2';
  const section = 'space-y-4 rounded-xl border border-foreground/20 p-5 sm:p-7';
  return <form className="mx-auto my-10 max-w-2xl space-y-6" onSubmit={submit}>
    <fieldset className={section}><legend className="px-2 text-2xl font-bold">1. Business information</legend>
      <label className="block font-semibold">Business name *<input className={input} maxLength={160} name="businessName" onChange={update} required value={form.businessName} /></label>
      <label className="block font-semibold">Contact person *<input className={input} maxLength={120} name="contactName" onChange={update} required value={form.contactName} /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="font-semibold">Email *<input className={input} maxLength={254} name="email" onChange={update} required type="email" value={form.email} /></label>
        <label className="font-semibold">Phone number *<input className={input} maxLength={40} name="phone" onChange={update} required type="tel" value={form.phone} /></label>
      </div>
      <label className="block font-semibold">Website or social media page<input className={input} maxLength={500} name="websiteUrl" onChange={update} placeholder="https://…" type="url" value={form.websiteUrl} /></label>
    </fieldset>
    <fieldset className={section}><legend className="px-2 text-2xl font-bold">2. Setup</legend>
      <p className="font-semibold">Do you require electricity? *</p>
      {Object.entries(ELECTRICITY_LABELS).map(([value, label]) => <label className="flex gap-3" key={value}><input checked={form.electricityRequirement === value} name="electricityRequirement" onChange={update} required type="radio" value={value} /><span>{label}</span></label>)}
    </fieldset>
    <fieldset className={section}><legend className="px-2 text-2xl font-bold">3. Health Department Certification</legend>
      <p className="font-semibold">Will your business serve food? *</p>
      <label className="mr-6 inline-flex gap-2"><input checked={form.isFoodVendor === true} name="isFoodVendor" onChange={update} required type="radio" value="true" />Yes</label>
      <label className="inline-flex gap-2"><input checked={form.isFoodVendor === false} name="isFoodVendor" onChange={update} required type="radio" value="false" />No</label>
      {form.isFoodVendor === true && <div className="mt-5 space-y-4 rounded-lg bg-foreground/[0.04] p-4">
        <p>West Virginia 64 CSR 17 requires food service establishments to be certified by the health department. Food vendors must comply before vending.</p>
        <label className="flex gap-3 font-semibold"><input checked={form.healthCertificationAcknowledged} name="healthCertificationAcknowledged" onChange={update} required type="checkbox" />I understand</label>
        <p className="font-semibold">Proof of certification *</p>
        {Object.entries(CERTIFICATION_LABELS).map(([value, label]) => <label className="flex gap-3" key={value}><input checked={form.certificationStatus === value} name="certificationStatus" onChange={update} required type="radio" value={value} /><span>{label}</span></label>)}
        <p className="text-sm">No upload is required now. Staff may request your certification during review.</p>
      </div>}
    </fieldset>
    <fieldset className={section}><legend className="px-2 text-2xl font-bold">4. Availability</legend>
      <p>Normal business hours are Friday 1 PM–6 PM, Saturday 11 AM–6 PM, and Sunday 12 PM–6 PM.</p>
      <label className="block font-semibold">Known times or days you cannot vend<textarea className={input} maxLength={2000} name="availabilityNotes" onChange={update} rows={5} value={form.availabilityNotes} /></label>
    </fieldset>
    {message && <p className="rounded-lg bg-red-50 p-3 text-red-800" role="alert">{message}</p>}
    <p className="text-center font-semibold">Submitting this application does not guarantee approval.</p>
    <button className="w-full rounded-lg bg-accent px-5 py-3 font-bold text-white disabled:opacity-60" disabled={isSubmitting} type="submit">{isSubmitting ? 'Submitting…' : 'Submit application'}</button>
  </form>;
}
