import React, {
  type ChangeEvent,
  type InputHTMLAttributes,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import './file-input.css';
import DownloadIcon from '@/shared/assets/icons/download-file.svg?react';
import CrossIcon from '@/shared/assets/icons/cross.svg?react';

export interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  fileName?: string;
  hasPDF?: boolean;
  maxSize?: number;
}

export const DEFAULT_MAX_SIZE = 10;

export const FileInput = ({
  onChange,
  fileName = '',
  hasPDF = true,
  maxSize = DEFAULT_MAX_SIZE,
  ...props
}: FileInputProps) => {
  const { t } = useTranslation('common');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();

    const files = e?.dataTransfer?.files;
    if (!files || files.length === 0) {
      return;
    }

    const fakeEvent = {
      target: { files },
    } as ChangeEvent<HTMLInputElement>;

    onChange?.(fakeEvent);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    const fakeEvent = {
      target: { files: null, value: '' },
    } as unknown as ChangeEvent<HTMLInputElement>;

    onChange?.(fakeEvent);
  };

  const formats = hasPDF
    ? t('fileInput.formatsWithPdf')
    : t('fileInput.formats');

  return (
    <label
      className="file-input-label"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      data-testid="file-input-label"
    >
      <input
        data-testid="file-input"
        type="file"
        {...props}
        onChange={onChange}
        ref={inputRef}
        aria-label={fileName || t('fileInput.selectFile')}
      />

      <div className="file-input-container">
        {fileName && (
          <button
            type="button"
            className="close-button"
            onClick={handleClear}
            aria-label={t('fileInput.remove')}
          >
            <CrossIcon />
          </button>
        )}

        <div>
          <DownloadIcon />
        </div>

        <div>
          {fileName ? (
            <span>{fileName}</span>
          ) : (
            <div className="file-input-caption">
              <div className="input-title">
                {t('fileInput.selectFile')}{' '}
                <span>{t('fileInput.orDragAndDrop')}</span>
              </div>
              <div>
                {formats} — {t('fileInput.sizeLimit', { size: maxSize })}
              </div>
            </div>
          )}
        </div>
      </div>
    </label>
  );
};
