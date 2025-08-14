// polyfills.js - 为Edge Runtime提供global变量支持

// 获取全局对象的函数
function getGlobalThis() {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof global !== 'undefined') return global;
  if (typeof window !== 'undefined') return window;
  if (typeof self !== 'undefined') return self;
  // 在Edge Runtime中创建一个基本的全局对象
  return {};
}

// 创建全局对象
const globalObj = getGlobalThis();

// 确保所有全局变量都指向同一个对象
if (typeof globalObj.global === 'undefined') {
  globalObj.global = globalObj;
}
if (typeof globalObj.self === 'undefined') {
  globalObj.self = globalObj;
}
if (typeof globalObj.globalThis === 'undefined') {
  globalObj.globalThis = globalObj;
}

// 添加一些基本的浏览器API模拟
if (typeof globalObj.window === 'undefined') {
  globalObj.window = {
    ...globalObj,
    location: {
      protocol: 'http:',
      host: 'localhost:3000',
      hostname: 'localhost',
      port: '3000',
      pathname: '/',
      search: '',
      hash: '',
      href: 'http://localhost:3000/',
      origin: 'http://localhost:3000'
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
    getComputedStyle: () => ({}),
    matchMedia: () => ({ matches: false, addListener: () => {}, removeListener: () => {} })
  };
}
if (typeof globalObj.document === 'undefined') {
  globalObj.document = {
    createElement: () => ({}),
    addEventListener: () => {},
    removeEventListener: () => {},
  };
}
if (typeof globalObj.navigator === 'undefined') {
  globalObj.navigator = {
    userAgent: 'Edge Runtime',
  };
}

// 添加 SVGElement 和其他 DOM 元素的 polyfill
if (typeof globalObj.SVGElement === 'undefined') {
  globalObj.SVGElement = class SVGElement {
    constructor() {
      this.tagName = 'svg';
      this.children = [];
      this.style = {};
    }
    
    setAttribute() {}
    getAttribute() { return null; }
    appendChild() {}
    removeChild() {}
    querySelector() { return null; }
    querySelectorAll() { return []; }
  };
}

if (typeof globalObj.HTMLElement === 'undefined') {
  globalObj.HTMLElement = class HTMLElement {
    constructor() {
      this.tagName = 'div';
      this.children = [];
      this.style = {};
    }
    
    setAttribute() {}
    getAttribute() { return null; }
    appendChild() {}
    removeChild() {}
    querySelector() { return null; }
    querySelectorAll() { return []; }
  };
}

if (typeof globalObj.Element === 'undefined') {
  globalObj.Element = globalObj.HTMLElement;
}

// 导出全局对象
module.exports = globalObj;