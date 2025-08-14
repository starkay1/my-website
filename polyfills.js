// Polyfills for server-side rendering
if (typeof global !== 'undefined') {
  if (typeof global.self === 'undefined') {
    global.self = global;
  }
  if (typeof self === 'undefined') {
    global.self = global;
  }
}

// 确保 self 在所有环境中都可用
if (typeof self === 'undefined') {
  if (typeof global !== 'undefined') {
    global.self = global;
  } else if (typeof window !== 'undefined') {
    window.self = window;
  }
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