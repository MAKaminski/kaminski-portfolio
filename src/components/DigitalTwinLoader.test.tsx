import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { afterEach, beforeEach, expect, it, jest } from '@jest/globals';
import DigitalTwinLoader from './DigitalTwinLoader';

const mockTrack = jest.fn();
const mockCaptureException = jest.fn();
jest.mock('../utils/track', () => ({ track: (...args: unknown[]) => mockTrack(...args) }));
jest.mock('../utils/posthog', () => ({
  captureException: (...args: unknown[]) => mockCaptureException(...args),
}));

let mockFail = false;
jest.mock('./DigitalTwin', () => {
  if (mockFail) throw new Error('Loading chunk 495 failed.');
  return {
    __esModule: true,
    default: ({ onClose }: { onClose: () => void }) => (
      <div role="dialog" aria-label="Talk to Michael Kaminski's digital twin">
        <button onClick={onClose}>Close twin</button>
      </div>
    ),
  };
});

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

const flush = () => act(() => new Promise((r) => setTimeout(r, 0)));
const dialog = () => container.querySelector('[role="dialog"]')?.getAttribute('aria-label');
const button = (text: string) =>
  Array.from(container.querySelectorAll('button')).find((b) => b.textContent?.includes(text))!;

const render = async (onClose = jest.fn()) => {
  await act(async () => root.render(<DigitalTwinLoader onClose={onClose} />));
  await flush();
  return onClose;
};

beforeEach(() => {
  // The panel's import must hit the mock factory again in every test.
  jest.resetModules();
  mockFail = false;
  mockTrack.mockClear();
  mockCaptureException.mockClear();
  jest.spyOn(console, 'error').mockImplementation(() => {});
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  jest.restoreAllMocks();
});

it('opens the panel and records the load', async () => {
  await render();
  expect(dialog()).toBe("Talk to Michael Kaminski's digital twin");
  expect(mockTrack).toHaveBeenCalledWith('Digital Twin Loaded');
  expect(mockCaptureException).not.toHaveBeenCalled();
});

it('keeps a failed import inside the dialog and reports it', async () => {
  mockFail = true;
  const onClose = await render();
  expect(dialog()).toBe('Digital twin failed to load');
  expect(mockCaptureException).toHaveBeenCalledTimes(1);
  expect(mockTrack).not.toHaveBeenCalled();

  act(() => button('Close').click());
  expect(onClose).toHaveBeenCalled();
});

it('loads the panel when the user tries again', async () => {
  mockFail = true;
  await render();
  expect(dialog()).toBe('Digital twin failed to load');

  mockFail = false;
  act(() => button('Try again').click());
  await flush();
  expect(dialog()).toBe("Talk to Michael Kaminski's digital twin");
});
