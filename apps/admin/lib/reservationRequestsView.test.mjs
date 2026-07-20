import assert from 'node:assert/strict'; import test from 'node:test';
import { createReservationCsv, parseSlot } from './reservationRequestsView.mjs';
test('validates reservation slots',()=>{ assert.equal(parseSlot('early'),'early'); assert.equal(parseSlot('bad'),null); });
test('exports approved fields without internal metadata',()=>{ const csv=createReservationCsv([{id:'1',created_at:'2026-07-18T00:00:00Z',email:'a@b.com',name:'Jane',phone:'304-555-0100',preferred_date:'2026-09-18',preferred_time_slot:'early',fallback_dates:null,price_cents_snapshot:7500,policy_version:1,additional_comments:null}]); assert.match(csv,/75\.00/); assert.ok(!/ip_hash|user_agent|meta_json/.test(csv)); });
