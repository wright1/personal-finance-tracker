// jest-e2e.setup.ts
import { randomBytes } from 'crypto';

function generateUUIDv4() {
  const bytes = randomBytes(16);
  // Per RFC 4122 v4: set version and variant bits
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return [
    hex.substring(0, 8),
    hex.substring(8, 12),
    hex.substring(12, 16),
    hex.substring(16, 20),
    hex.substring(20, 32),
  ].join('-');
}

// Build a new crypto namespace on the global
(globalThis as any).crypto = {
  // If some other lib already put crypto there, preserve its other methods:
  ...(globalThis as any).crypto,
  getRandomValues: randomBytes,
  randomUUID: generateUUIDv4,
};
