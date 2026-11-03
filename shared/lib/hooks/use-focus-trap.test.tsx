import { beforeEach, describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { useFocusTrap } from './use-focus-trap';
import { useRef } from 'react';
import { render } from 'vitest-browser-react';

let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  user = userEvent.setup();
});

const TestComponent = ({ isActive }: { isActive: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, isActive);

  return (
    <>
      <button data-testid="outside">Outside</button>
      <div ref={ref} data-testid="container">
        <button data-testid="first">First</button>
        <input data-testid="middle" />
        <button data-testid="last">Last</button>
      </div>
    </>
  );
};

describe('useFocusTrap hook', () => {
  test('focuses first focusable on mount', async () => {
    const screen = await render(<TestComponent isActive />);

    await expect.element(screen.getByTestId('first')).toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByTestId('first').element());
  });

  test('wraps focus forward from last to first', async () => {
    const screen = await render(<TestComponent isActive />);

    screen.getByTestId('last').element().focus();
    await user.keyboard('{Tab}');

    expect(document.activeElement).toBe(screen.getByTestId('first').element());
  });

  test('wraps focus backward from first to last', async () => {
    const screen = await render(<TestComponent isActive />);

    screen.getByTestId('first').element().focus();
    await user.keyboard('{Shift>}{Tab}{/Shift}');

    expect(document.activeElement).toBe(screen.getByTestId('last').element());
  });

  test('does nothing when isActive=false', async () => {
    const screen = await render(<TestComponent isActive={false} />);

    expect(document.activeElement).not.toBe(
      screen.getByTestId('first').element(),
    );
  });

  test('focuses container when there are no focusable elements and stays in focus', async () => {
    const EmptyComponent = () => {
      const ref = useRef<HTMLDivElement>(null);
      useFocusTrap(ref, true);

      return (
        <div ref={ref} data-testid="empty" tabIndex={-1}>
          no focusables
        </div>
      );
    };

    const screen = await render(<EmptyComponent />);

    expect(document.activeElement).toBe(screen.getByTestId('empty').element());

    await user.keyboard('{Tab}');

    expect(document.activeElement).toBe(screen.getByTestId('empty').element());
  });
});
