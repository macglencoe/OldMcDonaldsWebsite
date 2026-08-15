import test from 'node:test';
import assert from 'node:assert/strict';

import { parseExpectedHostnames, TURNSTILE_ACTION, verifyVendorTurnstile } from './turnstile.mjs';

const configuration = {
  secretKey: 'test-secret',
  expectedHostnames: 'oldmcdonaldspumpkinpatchwv.com, www.oldmcdonaldspumpkinpatchwv.com, oldmcdonaldspumpkinpatch.com',
};

function verificationResponse(overrides = {}) {
  return {
    ok: true,
    status: 200,
    json: async () => ({
      success: true,
      action: TURNSTILE_ACTION,
      hostname: 'www.oldmcdonaldspumpkinpatchwv.com',
      ...overrides,
    }),
  };
}

test('normalizes the configured hostname allowlist', () => {
  assert.deepEqual(
    [...parseExpectedHostnames(' Example.com, WWW.Example.com ,, ')],
    ['example.com', 'www.example.com'],
  );
});

test('accepts a successful token for the expected action and hostname', async () => {
  let request;
  const result = await verifyVendorTurnstile({
    ...configuration,
    token: 'valid-token',
    remoteIp: '203.0.113.10',
    fetchImpl: async (url, options) => {
      request = { url, options };
      return verificationResponse();
    },
  });

  assert.equal(result.ok, true);
  assert.equal(request.url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.body.get('response'), 'valid-token');
  assert.equal(request.options.body.get('remoteip'), '203.0.113.10');
});

test('rejects failed challenges and mismatched actions or hostnames', async () => {
  const failed = await verifyVendorTurnstile({
    ...configuration, token: 'token', fetchImpl: async () => verificationResponse({ success: false }),
  });
  const wrongAction = await verifyVendorTurnstile({
    ...configuration, token: 'token', fetchImpl: async () => verificationResponse({ action: 'different_form' }),
  });
  const wrongHostname = await verifyVendorTurnstile({
    ...configuration, token: 'token', fetchImpl: async () => verificationResponse({ hostname: 'attacker.example' }),
  });

  assert.equal(failed.category, 'challenge');
  assert.equal(wrongAction.category, 'challenge');
  assert.equal(wrongHostname.category, 'challenge');
});

test('fails closed for missing configuration and verification outages', async () => {
  const missingConfiguration = await verifyVendorTurnstile({ token: 'token', secretKey: '', expectedHostnames: '' });
  const outage = await verifyVendorTurnstile({
    ...configuration,
    token: 'token',
    fetchImpl: async () => { throw new Error('network unavailable'); },
  });

  assert.equal(missingConfiguration.category, 'configuration');
  assert.equal(outage.category, 'unavailable');
});

test('accepts confirmed dummy responses only outside production', async () => {
  const secretKey = '1x0000000000000000000000000000000AA';
  const fetchImpl = async () => verificationResponse({
    action: undefined,
    hostname: 'example.com',
    metadata: { result_with_testing_key: true },
  });
  const development = await verifyVendorTurnstile({
    ...configuration, secretKey, token: 'dummy-token', nodeEnv: 'development', fetchImpl,
  });
  const production = await verifyVendorTurnstile({
    ...configuration, secretKey, token: 'dummy-token', nodeEnv: 'production', fetchImpl,
  });

  assert.equal(development.ok, true);
  assert.equal(production.category, 'configuration');
});
