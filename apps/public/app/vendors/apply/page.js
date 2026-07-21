import Layout from '@/components/layout';
import PageHeader from '@/components/pageHeader';
import VendorApplicationForm from './vendorApplicationForm';

export const metadata = {
  title: "Vendor Application | Old McDonald's Pumpkin Patch",
  description: "Apply to be a vendor at Old McDonald's Pumpkin Patch.",
};

export default function VendorApplicationPage() {
  return <Layout>
    <PageHeader subtitle="Join us for the season">Vendor Application</PageHeader>
    <div className="body basic !pb-10">
      <p className="mx-auto max-w-2xl text-center">Apply to vend at Old McDonald&apos;s Pumpkin Patch. Submitting an application does not guarantee approval.</p>
      <VendorApplicationForm />
    </div>
  </Layout>;
}
