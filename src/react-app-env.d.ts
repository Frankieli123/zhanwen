/// <reference types="react-scripts" />

// 添加缺少模块的类型声明
declare module '*.json' {
  const value: any;
  export default value;
}

// i18next相关模块声明
declare module 'i18next' {
  const i18next: any;
  export default i18next;
}

declare module 'react-i18next' {
  export const initReactI18next: any;
  export const useTranslation: any;
  export const Trans: any;
}

declare module 'i18next-browser-languagedetector' {
  const LanguageDetector: any;
  export default LanguageDetector;
}

// 自定义模块声明
declare module './serviceWorkerRegistration' {
  export function register(config?: {
    onUpdate?: (registration: ServiceWorkerRegistration) => void;
    onSuccess?: () => void;
  }): void;
  export function unregister(): void;
}
