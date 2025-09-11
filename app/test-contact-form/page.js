import ContactForm from '@/components/contactForm'

export const metadata = {
  title: 'Test Contact Form',
  description: 'Isolated page to test contact form email delivery',
}

export default function TestContactFormPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-2xl bg-foreground">
        <ContactForm theme="onDark" forceWebForm={true} />
      </div>
    </div>
  )
}

