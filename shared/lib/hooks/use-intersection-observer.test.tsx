import { describe, expect, test, vi } from 'vitest';
import { useIntersectionObserver } from './use-intersection-observer';
import { render, renderHook } from 'vitest-browser-react';

let intersectCallback: IntersectionObserverCallback;

const IntersectionObserverMock = vi.fn(
  class {
    constructor(callback: IntersectionObserverCallback) {
      intersectCallback = callback;
    }
    disconnect = vi.fn();
    observe = vi.fn();
    takeRecords = vi.fn();
    unobserve = vi.fn();
  },
);

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

describe('useIntersectionObserver hook', () => {
  test('Doesnt create observer when ref is null', () => {
    const onIntersect = vi.fn();

    renderHook(() => useIntersectionObserver({ onIntersect }));

    expect(IntersectionObserverMock).not.toHaveBeenCalled();
  });

  test('Creates observer when ref is not null', async () => {
    const onIntersect = vi.fn();

    const { result, rerender } = await renderHook(() =>
      useIntersectionObserver({ onIntersect: () => onIntersect }),
    );

    result.current.current = document.createElement('div');

    await rerender({ onIntersect: () => onIntersect });

    expect(IntersectionObserverMock).toHaveBeenCalled();
  });

  test('Triggers callback when intersecting', async () => {
    const onIntersect = vi.fn();

    const TestComponent = () => {
      const ref = useIntersectionObserver({ onIntersect });
      return <div ref={ref} />;
    };

    await render(<TestComponent />);

    intersectCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(onIntersect).toHaveBeenCalled();
  });

  test('Doesnt Trigger callback when not intersecting', async () => {
    const onIntersect = vi.fn();

    const TestComponent = () => {
      const ref = useIntersectionObserver({ onIntersect });
      return <div ref={ref} />;
    };

    await render(<TestComponent />);

    intersectCallback?.(
      [{ isIntersecting: false } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(onIntersect).not.toHaveBeenCalled();
  });

  test('Disconnects observer on unmount', async () => {
    const onIntersect = vi.fn();

    const TestComponent = () => {
      const ref = useIntersectionObserver({ onIntersect });
      return <div ref={ref} />;
    };

    const screen = await render(<TestComponent />);

    const observerInstance = IntersectionObserverMock.mock.instances[0];

    await screen.unmount();

    expect(observerInstance.disconnect).toHaveBeenCalledTimes(1);
  });
});
