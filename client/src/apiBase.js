const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');

if (apiBaseUrl) {
  const nativeFetch = window.fetch.bind(window);

  window.fetch = (input, init) => {
    if (typeof input === 'string' && (input.startsWith('/api') || input.startsWith('/uploads'))) {
      return nativeFetch(`${apiBaseUrl}${input}`, init);
    }

    if (input instanceof Request) {
      const url = new URL(input.url);
      if (url.origin === window.location.origin && (url.pathname.startsWith('/api') || url.pathname.startsWith('/uploads'))) {
        return nativeFetch(new Request(`${apiBaseUrl}${url.pathname}${url.search}`, input), init);
      }
    }

    return nativeFetch(input, init);
  };
}
