import { describe, expect, test } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { useModal } from './use-modal';

describe('useModal hook', () => {
  test('initial value is false', async () => {
    const { result } = await renderHook(() => useModal());
    expect(result.current.isOpen).toBe(false);
  });

  test('open sets isOpen to true', async () => {
    const { result, act } = await renderHook(() => useModal());

    await act(() => result.current.open());

    expect(result.current.isOpen).toBe(true);
  });

  test('close sets isOpen to false after opening', async () => {
    const { result, act } = await renderHook(() => useModal());

    await act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);

    await act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });

  test('extra open calls keep isOpen true', async () => {
    const { result, act } = await renderHook(() => useModal());

    for (let i = 0; i < 3; i++) {
      await act(() => result.current.open());
      expect(result.current.isOpen).toBe(true);
    }
  });

  test('extra close calls keep isOpen false', async () => {
    const { result, act } = await renderHook(() => useModal());

    await act(() => result.current.open());

    for (let i = 0; i < 3; i++) {
      await act(() => result.current.close());
      expect(result.current.isOpen).toBe(false);
    }
  });

  test('open and close functions are stable', async () => {
    const { result, rerender } = await renderHook(() => useModal());
    const { open, close } = result.current;

    await rerender();

    expect(result.current.open).toBe(open);
    expect(result.current.close).toBe(close);
  });
});
