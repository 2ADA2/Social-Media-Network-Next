import { beforeEach, describe, expect, test } from 'vitest';
import { FILLED_LIMIT, TextArea } from '.';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';

let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  user = userEvent.setup();
});

describe('TextArea component', () => {
  const textAreaValue = 'TextArea value';
  const textAreaLabel = 'TextArea label';
  const textAreaInfo = 'TextArea info';
  const textAreaError = 'TextArea error';
  const textPreFilled = 'a'.repeat(FILLED_LIMIT);

  test('TextArea value', async () => {
    const screen = await render(<TextArea value={textAreaValue} />);

    await expect
      .element(screen.getByRole('textbox'))
      .toHaveValue(textAreaValue);
  });

  test('TextArea label', async () => {
    const screen = await render(
      <TextArea value={textAreaValue} label={textAreaLabel} />,
    );

    await expect.element(screen.getByText(textAreaLabel)).toBeVisible();
  });

  test('TextArea shows info on focus', async () => {
    const screen = await render(
      <TextArea
        value={textAreaValue}
        label={textAreaLabel}
        info={textAreaInfo}
      />,
    );

    await user.click(screen.getByRole('textbox'));

    await expect.element(screen.getByText(textAreaInfo)).toBeVisible();
  });

  test('TextArea shows error on focus', async () => {
    const screen = await render(
      <TextArea
        value={textAreaValue}
        label={textAreaLabel}
        info={textAreaInfo}
        errorMessage={textAreaError}
      />,
    );

    await user.click(screen.getByRole('textbox'));

    await expect.element(screen.getByText(textAreaError)).toBeVisible();
    await expect
      .element(screen.getByText(textAreaInfo))
      .not.toBeInTheDocument();
  });

  test(`TextArea expands if value length >${FILLED_LIMIT}`, async () => {
    const screen = await render(
      <TextArea value={textPreFilled} label={textAreaLabel} />,
    );
    await expect
      .element(screen.getByTestId('textarea-label'))
      .not.toHaveClass('filled');

    await screen.rerender(
      <TextArea value={textPreFilled + 'a'} label={textAreaLabel} />,
    );
    await expect
      .element(screen.getByTestId('textarea-label'))
      .toHaveClass('filled');
  });
});
