import { describe, expect, test, vi } from 'vitest';
import { Toggle } from '.';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';

describe('Toggle component', () => {
  test('Toggle is off', async () => {
    const onChange = vi.fn();
    const screen = await render(<Toggle checked={false} onChange={onChange} />);

    await expect
      .element(screen.getByRole('button'))
      .toHaveAttribute('aria-pressed', 'false');
  });

  test('Toggle is on', async () => {
    const onChange = vi.fn();
    const screen = await render(<Toggle checked={true} onChange={onChange} />);

    await expect
      .element(screen.getByRole('button'))
      .toHaveAttribute('aria-pressed', 'true');
  });

  test('does not call onChange on render', async () => {
    const onChange = vi.fn();
    await render(<Toggle checked={false} onChange={onChange} />);

    expect(onChange).not.toHaveBeenCalled();
  });

  test('Toggle click triggers a function', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const screen = await render(<Toggle checked={false} onChange={onChange} />);
    await user.click(screen.getByRole('button'));

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test('is disabled when disabled prop is set', async () => {
    const onChange = vi.fn();
    const screen = await render(
      <Toggle checked={false} onChange={onChange} disabled />,
    );

    await expect(screen.getByRole('button')).toBeDisabled();
  });
});
