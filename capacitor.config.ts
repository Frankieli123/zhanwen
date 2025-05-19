import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zhanwen.app',
  appName: '占问',
  webDir: 'build',
  // 添加服务器配置用于Live Reload
  server: {
    url: 'http://192.168.31.236:3002',
    cleartext: true,
    androidScheme: 'http',
    hostname: 'localhost'
  },
  android: {
    backgroundColor: "#FFFFFF"
  },
  plugins: {
    App: {
      android: {
        // 禁用系统后退按钮的默认行�?        handleBackButton: false
      }
    },
    StatusBar: {
      overlaysWebView: true,
      style: "LIGHT",
      backgroundColor: "#00000030"
    }
  }
};

export default config;
