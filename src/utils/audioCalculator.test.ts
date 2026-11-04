import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSplAtDistance,
  calculateDelayMs,
  calculatePowerHeadroom,
  validateLeadForm,
} from './audioCalculator';

test('calculateSplAtDistance calculates correct inverse-square attenuation', () => {
  // At 1 meter, no attenuation
  const at1m = calculateSplAtDistance(132, 1);
  assert.equal(at1m.perceivedSpl, 132);
  assert.equal(at1m.attenuationDb, 0);

  // At 10 meters, attenuation is 20 dB: 132 - 20 = 112 dB
  const at10m = calculateSplAtDistance(132, 10);
  assert.equal(at10m.attenuationDb, 20);
  assert.equal(at10m.perceivedSpl, 112);

  // At 20 meters, attenuation is ~26 dB: 132 - 26 = 106 dB
  const at20m = calculateSplAtDistance(132, 20);
  assert.ok(at20m.perceivedSpl < 112 && at20m.perceivedSpl > 100);
});

test('calculateDelayMs computes correct speed of sound delay at 20°C', () => {
  // Speed of sound at 20°C is ~343.42 m/s
  // At 34.34m, delay should be ~100 ms
  const delay = calculateDelayMs(34.34, 20);
  assert.ok(delay >= 99 && delay <= 101, `Expected ~100ms, got ${delay}`);

  // At 0m, delay is 0ms
  const zeroDelay = calculateDelayMs(0, 20);
  assert.equal(zeroDelay, 0);
});

test('calculatePowerHeadroom computes peak to RMS dynamic margin in dB', () => {
  // 3000W peak vs 750W RMS is a factor of 4 => 10 * log10(4) = ~6 dB headroom
  const headroom = calculatePowerHeadroom(750, 3000);
  assert.equal(headroom, 6);
});

test('validateLeadForm rejects invalid inputs and accepts valid ones', () => {
  const invalid = validateLeadForm({
    name: 'A',
    email: 'not-an-email',
    phone: '123',
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.phone);

  const valid = validateLeadForm({
    name: 'Engenheiro Som Direto',
    email: 'contato@turneaudio.com.br',
    phone: '(11) 98765-4321',
  });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});
