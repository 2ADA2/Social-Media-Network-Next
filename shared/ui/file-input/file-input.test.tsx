import { createFile } from '@/test/create=file';
import { DEFAULT_MAX_SIZE, FileInput } from '.';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';

let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  user = userEvent.setup();
});

const fileName = 'fileName.png';
const maxSize = 2;

const pngFile = createFile({
  name: 'test.png',
  sizeInBytes: 1024,
  type: 'image/png',
});
const pdfFile = createFile({
  name: 'test.pdf',
  sizeInBytes: 1024,
  type: 'application/pdf',
});

describe('FileInput Component', () => {
  describe('FileInput static', () => {
    test('Empty FileInput renders', async () => {
      const screen = await render(<FileInput />);

      await expect
        .element(screen.getByText('fileInput.selectFile', { exact: false }))
        .toBeVisible();
    });

    test('File input provides fileName', async () => {
      const screen = await render(<FileInput fileName={fileName} />);

      await expect.element(screen.getByText(fileName)).toBeVisible();
    });

    test(`File input default maxSize=${DEFAULT_MAX_SIZE}`, async () => {
      const screen = await render(<FileInput />);

      await expect
        .element(screen.getByText(String(DEFAULT_MAX_SIZE), { exact: false }))
        .toBeInTheDocument();
    });

    test('File input provides maxSize', async () => {
      const screen = await render(<FileInput maxSize={maxSize} />);

      await expect
        .element(screen.getByText(String(maxSize), { exact: false }))
        .toBeInTheDocument();
    });

    test('hasPdf=true ( default )', async () => {
      const screen = await render(<FileInput />);

      await expect
        .element(screen.getByText('fileInput.formatsWithPdf', { exact: false }))
        .toBeVisible();
    });

    test('hasPdf=false ( default )', async () => {
      const screen = await render(<FileInput hasPDF={false} />);

      await expect
        .element(screen.getByText('fileInput.formatsWithPdf', { exact: false }))
        .not.toBeInTheDocument();
    });
  });

  describe('FileInput actions', () => {
    test('User can select file', async () => {
      const onChange = vi.fn();
      const screen = await render(<FileInput onChange={onChange} />);

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(pngFile);

      const label = screen.getByTestId('file-input-label').element();
      label.dispatchEvent(
        new DragEvent('dragover ', {
          bubbles: true,
          dataTransfer: dataTransfer,
        }),
      );
      label.dispatchEvent(
        new DragEvent('drop', { bubbles: true, dataTransfer }),
      );

      expect(onChange).toHaveBeenCalledTimes(1);

      const event = onChange.mock.calls[0][0];
      expect(event.target.files[0].name).toBe(pngFile.name);
    });

    test('User can upload another file', async () => {
      const onChange = vi.fn();
      const screen = await render(
        <FileInput onChange={onChange} fileName={fileName} />,
      );

      const dataTransfer1 = new DataTransfer();
      dataTransfer1.items.add(pngFile);

      const label = screen.getByTestId('file-input-label').element();
      label.dispatchEvent(
        new DragEvent('dragover', {
          bubbles: true,
          dataTransfer: dataTransfer1,
        }),
      );
      label.dispatchEvent(
        new DragEvent('drop', { bubbles: true, dataTransfer: dataTransfer1 }),
      );

      const dataTransfer2 = new DataTransfer();
      dataTransfer2.items.add(pdfFile);

      label.dispatchEvent(
        new DragEvent('dragover', {
          bubbles: true,
          dataTransfer: dataTransfer1,
        }),
      );
      label.dispatchEvent(
        new DragEvent('drop', { bubbles: true, dataTransfer: dataTransfer2 }),
      );

      const event = onChange.mock.calls[1][0];
      expect(event.target.files[0].name).toBe(pdfFile.name);
    });

    test('User can remove file if its uploaded', async () => {
      const onChange = vi.fn();
      const screen = await render(
        <FileInput onChange={onChange} fileName={fileName} />,
      );

      await user.click(
        screen.getByRole('button', { name: 'fileInput.remove' }),
      );

      const event = onChange.mock.calls[0][0];
      expect(event.target.value).toBeFalsy();
    });

    test('User can select file on Enter', async () => {
      const onClick = vi.fn();
      await render(<FileInput onClick={onClick} />);

      await user.keyboard('{Tab}');
      await user.keyboard('{Enter}');

      expect(onClick).toHaveBeenCalled();
    });

    test('User can select file on Space', async () => {
      const onClick = vi.fn();
      await render(<FileInput onClick={onClick} />);

      await user.keyboard('{Tab}');
      await user.keyboard(' ');

      expect(onClick).toHaveBeenCalled();
    });

    test('Ignores empty input', async () => {
      const onClick = vi.fn();
      const screen = await render(<FileInput onClick={onClick} />);

      const dataTransfer = new DataTransfer();

      const label = screen.getByTestId('file-input-label').element();
      label.dispatchEvent(
        new DragEvent('dragover', { bubbles: true, dataTransfer }),
      );
      label.dispatchEvent(
        new DragEvent('drop', { bubbles: true, dataTransfer }),
      );

      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
