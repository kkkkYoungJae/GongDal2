import { format } from 'date-fns';
import _ from 'lodash';
import { Alert, Platform, StatusBar, ToastAndroid } from 'react-native';
import Toast from 'react-native-toast-message';

export const delay = (ms: number = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, ms);
  });
};

export const isIOS = Platform.OS === 'ios';

export const GetTranslucent = (state = true) => {
  Platform.OS === 'android' && StatusBar.setTranslucent(state);
  Platform.OS === 'android' && StatusBar.setBackgroundColor('rgba(0,0,0,0)');
  return Platform.select({ ios: state, android: state });
};

export const showAlert = ({
  title = '',
  content,
  onPress,
}: {
  title?: string;
  content?: string;
  onPress?: () => void;
}) => {
  Alert.alert(title, content, [{ text: '확인', onPress }]);
};

export const showToast = (content: string) => {
  if (isIOS) {
    Toast.show({
      position: 'bottom',
      type: 'success',
      text1: content,
    });
  } else {
    ToastAndroid.show(content || '', ToastAndroid.SHORT);
  }
};

/**
 * 주어진 'YYYYMMDD' 형식의 날짜 문자열을 'YYYY-MM-DD' 형식으로 변환합니다.
 * @param {string} dateString 변환할 날짜 문자열 (YYYYMMDD 형식)
 * @returns {string} 변환된 날짜 문자열 (YYYY-MM-DD 형식)
 * @example
 * formatDate('20201012'); // '2020-10-12'
 */
export const formatDate = (dateString: string) => {
  return dateString.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');
};

/**
 * 주어진 'YYYY-MM-DD' 형식의 날짜 문자열을 'YYYYMMDD' 형식으로 변환합니다.
 * @param {string} dateString 변환할 날짜 문자열 (YYYY-MM-DD 형식)
 * @returns {string} 변환된 날짜 문자열 (YYYYMMDD 형식)
 * @example
 * formatDateReverse('2020-10-12'); // '20201012'
 */
export const formatDateReverse = (dateString: string) => {
  return dateString.replace(/-/g, '');
};

export const parseAxiosError = (error: any, init?: string) => {
  if (error.response) {
    console.log('Response Data:', JSON.stringify(error.response.data));
    console.log('Response Status:', error.response.status);
    console.log('Response Url:', error.response.config.url);

    showAlert({ content: error.response?.data.msg });
  } else if (error.request) {
    console.log('Request made but no response was received:', error.request);
  } else {
    console.log('Error message:', error.message);
  }
};

export const fDate = (value?: string | number | Date) =>
  value ? format(new Date(value), 'yyyy-MM-dd') : '';

export const debounce = (callback: any, _delay = 300): any => _.debounce(callback, _delay);
