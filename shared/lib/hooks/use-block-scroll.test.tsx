import { describe, expect, test } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { useBlockScroll } from './use-block-scroll';
import { useState } from 'react';

describe('useBlockScroll hook', () => {
  test('blocks scroll if isOpen=true', async () => {
    await renderHook(() => useBlockScroll(true));

    expect(document.body.style.overflow).toEqual('hidden');
  });

  test('doesnt block scroll if isOpen=false', async () => {
    await renderHook(() => useBlockScroll(false));

    expect(document.body.style.overflow).not.toEqual('hidden');
  });

  test('Blocks / unblocks scroll when state changes', async () => {
    const { result, act } = await renderHook(() => {
      const [hideScroll, setHideScroll] = useState(false);

      useBlockScroll(hideScroll);

      return { setHideScroll, hideScroll };
    });

    expect(document.body.style.overflow).not.toEqual('hidden');

    act(() => result.current.setHideScroll(true));
    expect(document.body.style.overflow).toEqual('hidden');

    act(() => result.current.setHideScroll(false));
    expect(document.body.style.overflow).not.toEqual('hidden');
  });
});
