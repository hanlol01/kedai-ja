export function cn(...classes: (string | undefined | Record<string, boolean>)[]) {
  return classes
    .filter(Boolean)
    .map((cls) => {
      if (typeof cls === 'string') {
        return cls;
      }
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(' ');
      }
      return '';
    })
    .filter(Boolean)
    .join(' ');
}