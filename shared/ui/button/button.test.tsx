import { describe, expect, test, vi } from 'vitest';
import { Button } from '.';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';

const buttonText = 'button text';

describe('Button component', () => {
  test('Button renders with children', async () => {
    const screen = await render(<Button>{buttonText}</Button>);

    await expect.element(screen.getByText(buttonText)).toBeVisible();
  });

  test('Click triggers onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const screen = await render(
      <Button onClick={onClick}>{buttonText}</Button>,
    );

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalled();
  });
});
