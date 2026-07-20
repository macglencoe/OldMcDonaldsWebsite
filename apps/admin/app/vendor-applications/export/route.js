import { exportVendorApplications } from '@/lib/vendorApplications.mjs';
import { createVendorCsv, parseCertification, parseElectricity, parseFood } from '@/lib/vendorApplicationsView.mjs';
export const dynamic = 'force-dynamic';
export async function GET(request) {
  const params = request.nextUrl.searchParams;
  const rawFood = params.get('food'); const rawElectricity = params.get('electricity'); const rawCertification = params.get('certification');
  const food = parseFood(rawFood); const electricity = parseElectricity(rawElectricity); const certification = parseCertification(rawCertification);
  if ((rawFood && food === null) || (rawElectricity && !electricity) || (rawCertification && !certification)) return Response.json({ error: 'Invalid filter.' }, { status: 400 });
  const csv = createVendorCsv(await exportVendorApplications({ food, electricity, certification }));
  return new Response(csv, { headers: { 'Cache-Control': 'no-store', 'Content-Disposition': 'attachment; filename="vendor-applications.csv"', 'Content-Type': 'text/csv; charset=utf-8' } });
}
