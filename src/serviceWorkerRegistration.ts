// 此可选代码用于注册service worker
// 注册一个service worker以便支持离线功能
// 此文件基于Create React App的service worker配置

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1]是IPv6的localhost地址
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8是本地回环
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config): void {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // URL构造器用于解析URL的路径和确定脚本的origin
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // 如果PUBLIC_URL不在同一origin，我们的service worker不会工作
      // 因为service worker必须和网站同源
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // 这是在本地运行，检查service worker是否仍然存在
        checkValidServiceWorker(swUrl, config);

        // 添加额外的日志用于本地环境
        navigator.serviceWorker.ready.then(() => {
          console.log(
            '此应用正在使用缓存优先策略为本地服务提供缓存支持。'
          );
        });
      } else {
        // 不是localhost，直接注册service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl: string, config?: Config): void {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // 在这时，新的内容已经被获取，但之前缓存的内容仍在用
              console.log(
                '新内容可用，将在所有标签关闭后生效。'
              );

              // 执行回调
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // 在这时，一切都已经预缓存
              console.log('内容已缓存，可用于离线使用。');

              // 执行回调
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: Config): void {
  // 检查service worker是否能找到
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // 确保service worker存在
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // 没找到service worker，可能是不同应用
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // 找到service worker，正常处理
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('无网络连接，应用运行在离线模式。');
    });
}

export function unregister(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
} 