import firebaseAnalytics from '@react-native-firebase/analytics';
import RNConfigReader from 'react-native-config-reader';
import events from './events';

export const isFDroidBuild = RNConfigReader.FDROID_BUILD;

export const isOfficial = RNConfigReader.IS_OFFICIAL;

const analytics = firebaseAnalytics || '';
let reportCrashErrors = true;
let reportAnalyticsEvents = true;

export const getReportCrashErrorsValue = (): boolean => reportCrashErrors;
export const getReportAnalyticsEventsValue = (): boolean => reportAnalyticsEvents;

export { analytics, events };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let metadata = {};

export const logServerVersion = (serverVersion: string): void => {
  metadata = {
    serverVersion,
  };
};

export const logEvent = (eventName: string, payload?: { [key: string]: any }): void => {
  try {
    if (!isFDroidBuild && !__DEV__) {
      analytics().logEvent(eventName, payload);
    }
  } catch {
    // Do nothing
  }
};

export const setCurrentScreen = (currentScreen: string): void => {
  if (!isFDroidBuild && !__DEV__) {
    analytics().logScreenView({
      screen_class: currentScreen,
      screen_name: currentScreen,
    });
  }
};

export const toggleCrashErrorsReport = (value: boolean): boolean => {
  return (reportCrashErrors = value);
};

export const toggleAnalyticsEventsReport = (value: boolean): boolean => {
  analytics().setAnalyticsCollectionEnabled(value);
  return (reportAnalyticsEvents = value);
};

export default (e: any): void => {
  if (e instanceof Error && e.message !== 'Aborted' && !__DEV__) {
  } else {
    console.error(e);
  }
};
