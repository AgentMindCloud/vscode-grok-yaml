export interface Debounced<TArgs extends unknown[]> {
  (...args: TArgs): void;
  flush(): void;
  cancel(): void;
}

export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  waitMs: number,
): Debounced<TArgs> {
  let timer: NodeJS.Timeout | undefined;
  let lastArgs: TArgs | undefined;

  const debounced = ((...args: TArgs): void => {
    lastArgs = args;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      const call = lastArgs;
      lastArgs = undefined;
      if (call) fn(...call);
    }, waitMs);
  }) as Debounced<TArgs>;

  debounced.flush = (): void => {
    if (timer && lastArgs) {
      clearTimeout(timer);
      timer = undefined;
      const call = lastArgs;
      lastArgs = undefined;
      fn(...call);
    }
  };

  debounced.cancel = (): void => {
    if (timer) clearTimeout(timer);
    timer = undefined;
    lastArgs = undefined;
  };

  return debounced;
}
