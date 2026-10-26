import { useEffect, useRef } from 'react';

interface UseIntersectionObserverOptions {
  onIntersect: () => void;
}

export const useIntersectionObserver = ({
  onIntersect,
}: UseIntersectionObserverOptions) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onIntersect();
      }
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [onIntersect]);

  return ref;
};
