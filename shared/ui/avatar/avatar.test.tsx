import { describe, expect, test } from 'vitest';
import { Avatar, DEFAULT_AVATAR } from '.';
import { render } from 'vitest-browser-react';

const size = 24;
const src = '/assets/user-helena.png';
const wrongSrc = '/wrongSrc.png';
const alt = 'avatar-alt';

describe('Avatar component', () => {
  test('Avatar renders with src', async () => {
    const screen = await render(<Avatar src={src} size={size} />);

    await expect.element(screen.getByRole('img')).toHaveAttribute('src', src);
  });

  test('If cant load replaces with default src', async () => {
    const screen = await render(<Avatar src={wrongSrc} size={size} />);

    screen.getByRole('img').element().dispatchEvent(new Event('error'));

    await expect
      .element(screen.getByRole('img'))
      .toHaveAttribute('src', DEFAULT_AVATAR);
  });

  test('If cant load replaces with default src', async () => {
    const screen = await render(<Avatar src={wrongSrc} size={size} />);

    await expect
      .element(screen.getByRole('img'))
      .toHaveAttribute('src', DEFAULT_AVATAR);
  });

  test('has default alt', async () => {
    const screen = await render(<Avatar src={wrongSrc} size={size} />);

    await expect
      .element(screen.getByRole('img'))
      .toHaveAttribute('alt', 'avatar');
  });

  test('provides alt', async () => {
    const screen = await render(
      <Avatar src={wrongSrc} size={size} alt={alt} />,
    );

    await expect.element(screen.getByRole('img')).toHaveAttribute('alt', alt);
  });
});
