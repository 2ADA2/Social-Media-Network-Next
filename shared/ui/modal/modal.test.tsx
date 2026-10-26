import { userEvent } from 'vitest/browser';
import { Modal } from '.';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';

let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  user = userEvent.setup();
});

describe('Modal component', () => {
  const ModalChildren = () => (
    <div data-testid="modal-children"> children </div>
  );

  test('Modal renders and provides children', async () => {
    const screen = await render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <ModalChildren />
      </Modal>,
    );

    await expect.element(screen.getByTestId('modal')).toBeInTheDocument();
    await expect
      .element(screen.getByTestId('modal-children'))
      .toBeInTheDocument();
  });

  test('Modal hidden if isOpen=false', async () => {
    const screen = await render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <ModalChildren />
      </Modal>,
    );

    await expect.element(screen.getByTestId('modal')).not.toBeInTheDocument();
    await expect
      .element(screen.getByTestId('modal-children'))
      .not.toBeInTheDocument();
  });

  test('Close button triggers onClose', async () => {
    const onClose = vi.fn();
    const screen = await render(<Modal isOpen={true} onClose={onClose} />);

    await user.click(screen.getByTestId('modal-close'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('Escape key triggers onClose', async () => {
    const onClose = vi.fn();
    await render(<Modal isOpen={true} onClose={onClose} />);

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('Enter key triggers onClose ( auto focus on close button )', async () => {
    const onClose = vi.fn();
    await render(<Modal isOpen={true} onClose={onClose} />);

    await user.keyboard('{Enter}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('Non-Escape key does not trigger onClose', async () => {
    const onClose = vi.fn();
    await render(<Modal isOpen={true} onClose={onClose} />);

    await user.keyboard('{A}');

    expect(onClose).not.toHaveBeenCalled();
  });

  test('Modal provides className', async () => {
    const screen = await render(
      <Modal isOpen={true} onClose={vi.fn()} className="class-name" />,
    );

    await expect.element(screen.getByTestId('modal')).toHaveClass('class-name');
  });

  test('Modal provides title for aria-label', async () => {
    const screen = await render(
      <Modal isOpen={true} onClose={vi.fn()} title="title" />,
    );

    await expect
      .element(screen.getByTestId('modal'))
      .toHaveAttribute('aria-label', 'title');
  });

  test('Modal provides title default', async () => {
    const screen = await render(<Modal isOpen={true} onClose={vi.fn()} />);

    await expect
      .element(screen.getByTestId('modal'))
      .toHaveAttribute('aria-label', 'modal.defaultTitle');
  });
});
