import { createCampfireRequestCsv, exportCampfireRequests } from '@/lib/campfireRequests.mjs';
import { parseYear } from '@/lib/mazeEntriesView.mjs';
export const dynamic='force-dynamic';
export async function GET(request){const raw=request.nextUrl.searchParams.get('year');const year=parseYear(raw);if(raw&&!year)return Response.json({error:'Invalid filter.'},{status:400});const csv=createCampfireRequestCsv(await exportCampfireRequests({year}));return new Response(csv,{headers:{'Cache-Control':'no-store','Content-Disposition':`attachment; filename="campfire-requests${year?`-${year}`:''}.csv"`,'Content-Type':'text/csv; charset=utf-8'}});}
