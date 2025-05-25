import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.warshipsx.app',
  appName: 'Warships X',
  webDir: 'dist/warships-x/browser',
  server: {
    androidScheme: 'http',
    cleartext: true,
  },
};

export default config;
