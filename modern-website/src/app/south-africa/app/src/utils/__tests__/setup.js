// Vitest setup file
// Mock browser APIs not available in test environment

import { vi } from 'vitest';

// Mock MediaDevices API
global.navigator.mediaDevices = {
  getUserMedia: vi.fn(() =>
    Promise.resolve({
      getTracks: () => [
        {
          stop: vi.fn(),
        },
      ],
    })
  ),
};

// Mock MediaRecorder API
global.MediaRecorder = vi.fn().mockImplementation(() => ({
  start: vi.fn(),
  stop: vi.fn(),
  ondataavailable: null,
  onstop: null,
  state: 'inactive',
  mimeType: 'audio/webm',
}));

global.MediaRecorder.isTypeSupported = vi.fn((type) => {
  return type === 'audio/webm;codecs=opus';
});

// Mock AudioContext
global.AudioContext = vi.fn().mockImplementation(() => ({
  decodeAudioData: vi.fn(() =>
    Promise.resolve({
      duration: 5,
      numberOfChannels: 1,
      sampleRate: 16000,
      getChannelData: () => new Float32Array(16000 * 5),
    })
  ),
  createBufferSource: vi.fn(() => ({
    buffer: null,
    connect: vi.fn(),
    start: vi.fn(),
  })),
}));

// Mock OfflineAudioContext
global.OfflineAudioContext = vi.fn().mockImplementation(() => ({
  createBufferSource: vi.fn(() => ({
    buffer: null,
    connect: vi.fn(),
    start: vi.fn(),
  })),
  destination: {},
  startRendering: vi.fn(() =>
    Promise.resolve({
      duration: 5,
      numberOfChannels: 1,
      sampleRate: 16000,
      getChannelData: () => new Float32Array(16000 * 5),
    })
  ),
}));

// Mock FileReader
global.FileReader = vi.fn().mockImplementation(() => ({
  readAsDataURL: vi.fn(function (blob) {
    this.onloadend?.({
      target: {
        result: 'data:audio/wav;base64,mock-base64-data',
      },
    });
  }),
  result: null,
  onloadend: null,
  onerror: null,
}));

// Mock Blob
global.Blob = vi.fn().mockImplementation((parts, options) => ({
  size: parts.reduce((acc, part) => acc + (part.length || part.size || 0), 0),
  type: options?.type || '',
  arrayBuffer: vi.fn(() => Promise.resolve(new ArrayBuffer(1000))),
}));

// Mock navigator.vibrate
global.navigator.vibrate = vi.fn();

// Mock navigator.onLine
Object.defineProperty(global.navigator, 'onLine', {
  writable: true,
  value: true,
});

// Mock window.addEventListener for online/offline events
const eventListeners = {};

global.window.addEventListener = vi.fn((event, handler) => {
  if (!eventListeners[event]) {
    eventListeners[event] = [];
  }
  eventListeners[event].push(handler);
});

global.window.removeEventListener = vi.fn((event, handler) => {
  if (eventListeners[event]) {
    eventListeners[event] = eventListeners[event].filter((h) => h !== handler);
  }
});

// Helper to trigger events in tests
global.triggerEvent = (event) => {
  if (eventListeners[event]) {
    eventListeners[event].forEach((handler) => handler());
  }
};


