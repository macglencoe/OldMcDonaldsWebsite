import { exportReservationRequests } from '@/lib/reservationRequests.mjs';
import { createReservationCsv, parseSlot } from '@/lib/reservationRequestsView.mjs';
import { parseYear } from '@/lib/mazeEntriesView.mjs';
export const dynamic='force-dynamic';
export async function GET(request){ const rawYear=request.nextUrl.searchParams.get('year'); const rawSlot=request.nextUrl.searchParams.get('slot'); const year=parseYear(rawYear); const slot=parseSlot(rawSlot); if((rawYear&&!year)||(rawSlot&&!slot)) return Response.json({error:'Invalid filter.'},{status:400}); const csv=createReservationCsv(await exportReservationRequests({year,slot})); return new Response(csv,{headers:{'Cache-Control':'no-store','Content-Disposition':`attachment; filename="reservation-requests${year?`-${year}`:''}.csv"`,'Content-Type':'text/csv; charset=utf-8'}}); }
