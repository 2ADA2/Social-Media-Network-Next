import { render } from 'vitest-browser-react';

export function renderWithRouter(children: React.ReactElement) {
  return render(children);
}
