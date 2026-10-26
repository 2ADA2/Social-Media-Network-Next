import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { PasswordInput } from '.';
import { userEvent } from 'vitest/browser';
import { useState } from 'react';

let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  user = userEvent.setup();
});

describe('PasswordInput component', () => {
  const inputValue = 'input-value';
  const inputLabel = 'input-label';
  const inputInfo = 'input-info';
  const inputError = 'input-error';

  test('PasswordInput type=password', async () => {
    const screen = await render(
      <PasswordInput value={inputValue} onChange={vi.fn()} />,
    );

    await expect
      .element(screen.getByRole('textbox'))
      .toHaveAttribute('type', 'password');
  });

  test('PasswordInput renders with init value', async () => {
    const screen = await render(
      <PasswordInput value={inputValue} onChange={vi.fn()} />,
    );

    await expect.element(screen.getByRole('textbox')).toHaveValue(inputValue);
  });

  test('PasswordInput renders with label', async () => {
    const screen = await render(
      <PasswordInput
        value={inputValue}
        label={inputLabel}
        onChange={vi.fn()}
      />,
    );

    await expect.element(screen.getByText(inputLabel)).toBeVisible();
  });

  test('PasswordInput renders with icon', async () => {
    const icon = <svg data-testid="password-input-label-icon" />;
    const screen = await render(
      <PasswordInput value={inputValue} onChange={vi.fn()} icon={icon} />,
    );

    await expect
      .element(screen.getByTestId('password-input-label-icon'))
      .toBeVisible();
  });

  test('PasswordInput works with onChange', async () => {
    function Wrapper() {
      const [value, setValue] = useState('');
      return (
        <PasswordInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      );
    }

    const screen = await render(<Wrapper />);

    await user.type(screen.getByRole('textbox'), inputValue);
    await expect.element(screen.getByRole('textbox')).toHaveValue(inputValue);
  });

  test('Shows info if custom=true', async () => {
    const screen = await render(
      <PasswordInput
        value={inputValue}
        label={inputLabel}
        custom
        info={inputInfo}
        onChange={vi.fn()}
      />,
    );

    await expect.element(screen.getByText(inputInfo)).toBeVisible();
  });

  test("Doesn't show info if custom=false", async () => {
    const screen = await render(
      <PasswordInput value="" info={inputInfo} onChange={vi.fn()} />,
    );

    await expect.element(screen.getByText(inputInfo)).not.toBeInTheDocument();
  });

  test("Shows ok only if custom=true, value isn't empty and no error", async () => {
    const screen = await render(
      <PasswordInput custom value={inputValue} onChange={vi.fn()} />,
    );
    await expect
      .element(screen.getByTestId('password-input-ok-icon'))
      .toBeVisible();
    await expect
      .element(screen.getByRole('textbox'))
      .toHaveAttribute('aria-invalid', 'false');

    await screen.rerender(<PasswordInput custom onChange={vi.fn()} value="" />);
    await expect
      .element(screen.getByTestId('password-input-ok-icon'))
      .not.toBeInTheDocument();

    await screen.rerender(
      <PasswordInput custom error={inputError} onChange={vi.fn()} value="" />,
    );
    await expect
      .element(screen.getByTestId('password-input-ok-icon'))
      .not.toBeInTheDocument();
  });

  test('Shows error', async () => {
    const screen = await render(
      <PasswordInput error={inputError} onChange={vi.fn()} value="" />,
    );

    await expect.element(screen.getByText(inputError)).toBeVisible();
    await expect
      .element(screen.getByTestId('password-input-cross-icon'))
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole('textbox'))
      .toHaveAttribute('aria-invalid', 'true');
  });

  test("has default input-info if it's valid", async () => {
    const screen = await render(
      <PasswordInput custom onChange={vi.fn()} value={inputValue} />,
    );

    await expect
      .element(screen.getByText('passwordInput.defaultInfo'))
      .toBeVisible();
  });

  test('shows and hides value', async () => {
    const screen = await render(
      <PasswordInput custom onChange={vi.fn()} value={inputValue} />,
    );

    await user.click(screen.getByTestId('hide-password-button'));

    await expect
      .element(screen.getByRole('textbox'))
      .toHaveAttribute('type', 'text');

    await user.click(screen.getByTestId('hide-password-button'));

    await expect
      .element(screen.getByRole('textbox'))
      .toHaveAttribute('type', 'password');
  });
});
