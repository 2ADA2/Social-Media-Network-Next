'use client';
import { useServerInsertedHTML } from 'next/navigation';

export function ThemeScript() {
  useServerInsertedHTML(() => {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme-storage');
                if (theme) {
                  var parsed = JSON.parse(theme);
                  var current = parsed.state.theme;
                  if (current === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                }
              } catch (e) {}
            })();
          `,
        }}
      />
    );
  });
  return null;
}