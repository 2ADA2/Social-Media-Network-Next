interface CreateFileOptions {
  name: string;
  sizeInBytes?: number;
  type?: string;
  content?: string;
}

export function createFile({
  name,
  sizeInBytes = 100,
  type = 'application/octet-stream',
  content,
}: CreateFileOptions): File {
  const data = content ?? new Uint8Array(sizeInBytes);
  return new File([data], name, { type });
}
