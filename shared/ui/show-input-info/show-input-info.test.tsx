import { describe, expect, test } from 'vitest';
import { ShowInputInfo } from '.';
import { render } from 'vitest-browser-react';

describe('TextArea component', () => {
  const infoText = 'info text';
  const errorText = 'error text';

  test('empty init (no in the document)', async () => {
    const screen = await render(<ShowInputInfo />);

    await expect
      .element(screen.getByTestId('input-info'))
      .not.toBeInTheDocument();
  });

  test('shows info', async () => {
    const screen = await render(<ShowInputInfo info={infoText} />);

    await expect
      .element(screen.getByTestId('input-info'))
      .toHaveTextContent(infoText);
    await expect
      .element(screen.getByTestId('input-info'))
      .not.toHaveAttribute('aria-live', 'polite');
  });

  test('shows error', async () => {
    const screen = await render(<ShowInputInfo error={errorText} />);

    await expect
      .element(screen.getByTestId('input-info'))
      .toHaveTextContent(errorText);
    await expect
      .element(screen.getByTestId('input-info'))
      .toHaveAttribute('aria-live', 'polite');
  });

  test('error is more important than info', async () => {
    const screen = await render(
      <ShowInputInfo error={errorText} info={infoText} />,
    );

    await expect.element(screen.getByText(infoText)).not.toBeInTheDocument();
    await expect
      .element(screen.getByTestId('input-info'))
      .toHaveTextContent(errorText);
    await expect
      .element(screen.getByTestId('input-info'))
      .toHaveAttribute('aria-live', 'polite');
  });
});
