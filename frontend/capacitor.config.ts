import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.studentsgate.app',
  appName: 'the students gate',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
