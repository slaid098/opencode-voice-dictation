const mockStore: Record<string, unknown> = {};

export const GM_getValue = (key: string, defaultValue: unknown): unknown => {
  return key in mockStore ? mockStore[key] : defaultValue;
};

export const GM_setValue = (key: string, value: unknown): void => {
  mockStore[key] = value;
};

export const GM_registerMenuCommand = (_name: string, _fn: () => void): void => {};

export const GM_xmlhttpRequest = (_details: unknown): void => {};

export const unsafeWindow = globalThis;

export const monkeyWindow = globalThis;

export const GM_addElement = (): void => {};

export const __resetMockStore = (): void => {
  for (const key of Object.keys(mockStore)) {
    delete mockStore[key];
  }
};
