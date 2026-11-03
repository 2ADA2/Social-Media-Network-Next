import { describe, expect, test, vi } from 'vitest';
import { CoverButton } from '.';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';

const Children = () => <div data-testid="children"> children </div>;

describe('CoverButton component', () => {
  test('CoverButton renders with children', async () => {
    const screen = await render(
      <CoverButton>
        <Children />
      </CoverButton>,
    );

    await expect.element(screen.getByRole('button')).toBeVisible();
    await expect.element(screen.getByTestId('children')).toBeVisible();
  });

  test('Click triggers onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const screen = await render(
      <CoverButton onClick={onClick}>
        <Children />
      </CoverButton>,
    );

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalled();
  });
});
