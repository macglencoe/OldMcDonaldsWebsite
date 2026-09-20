import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_SITE_SETTINGS,
  createDirectionsUrl,
  formatBusinessAddress,
  formatMonthDay,
  formatTime24,
  normalizeSiteSettings,
} from '../../../packages/config/site-settings.mjs';

test('fills missing site settings from checked-in defaults', () => {
  const settings = normalizeSiteSettings({ season: { year: 2027 } });
  assert.equal(settings.season.year, 2027);
  assert.equal(settings.season.timeZone, 'America/New_York');
  assert.equal(settings.nightMaze.closesAt, '22:30');
  assert.equal(settings.business.phone, '+13048392330');
});

test('ignores unknown fields and values of the wrong type', () => {
  const settings = normalizeSiteSettings({
    season: { year: '2027', unknown: 'nope' },
    policies: { freeAdmissionMaxAge: 4 },
    extra: true,
  });
  assert.equal(settings.season.year, DEFAULT_SITE_SETTINGS.season.year);
  assert.equal(settings.policies.freeAdmissionMaxAge, 4);
  assert.equal('unknown' in settings.season, false);
  assert.equal('extra' in settings, false);
});

test('formats shared business, date, and time values', () => {
  assert.equal(formatBusinessAddress(DEFAULT_SITE_SETTINGS), '1597 Arden Nollville Rd\nInwood, WV 25428');
  assert.match(createDirectionsUrl(DEFAULT_SITE_SETTINGS), /destination=1597%20Arden%20Nollville%20Rd%2C%20Inwood%2C%20WV%2025428/);
  assert.equal(formatTime24('22:30'), '10:30 PM');
  assert.equal(formatMonthDay('2026-10-16'), 'October 16');
});
