import { Buffer } from 'buffer';

// Add Buffer to window
window.Buffer = Buffer;

// Add global to window
if (typeof window.global === 'undefined') {
  window.global = window;
}

// Add process to window
if (typeof window.process === 'undefined') {
  // @ts-ignore - We're just adding a minimal process shim
  window.process = { env: {} };
}
