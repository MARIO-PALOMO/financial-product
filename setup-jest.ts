import '@angular/compiler';

Object.defineProperty(window, 'CSS', { value: null });
Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
});

if (window.sessionStorage) {
  Object.defineProperty(Object.getPrototypeOf(window.sessionStorage), 'getItem', {
    value: function(key: string) {
      const storage = this as Record<string, string | null>;
      return storage[key] || null;
    },
    writable: true,
    configurable: true
  });
}
