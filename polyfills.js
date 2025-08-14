// Polyfills for server-side rendering
if (typeof global !== 'undefined' && typeof global.self === 'undefined') {
  global.self = global;
}

if (typeof window === 'undefined') {
  global.window = {
    location: {
      protocol: 'http:',
      host: 'localhost',
      hostname: 'localhost',
      port: '',
      pathname: '/',
      search: '',
      hash: '',
      href: 'http://localhost/',
      origin: 'http://localhost'
    },
    navigator: {
      userAgent: 'Node.js'
    },
    document: {
      addEventListener: () => {},
      removeEventListener: () => {},
      createElement: () => ({}),
      getElementById: () => null
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    matchMedia: () => ({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {}
    }),
    IntersectionObserver: class {
      constructor() {}
      observe() {}
      disconnect() {}
    },
    scrollY: 0,
    innerWidth: 1024,
    innerHeight: 768
  };
}