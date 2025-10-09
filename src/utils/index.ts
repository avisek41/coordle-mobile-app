import { MMKV } from 'react-native-mmkv';
import moment from 'moment';

const storage = new MMKV();

export const setItem = <T>(key: string, value: T) => {
  storage.set(key, JSON.stringify(value) as string);
};

export const getItem = <T>(key: string): T | null => {
  const storedValue = storage.getString(key);
  if (storedValue !== undefined && storedValue !== null) {
    return JSON.parse(storedValue) as T;
  }
  return null;
};

export const removeItem = (key: string) => {
  storage.delete(key);
};

export const formatDateRange = (startDate: string, endDate: string): string => {
  return `${startDate} - ${endDate}`;
};
export const formatTimeRemaining = (closeDateTime: string) => {
  const now = moment();
  const closeDate = moment(closeDateTime);
  const diffMinutes = closeDate.diff(now, 'minutes');
  const diffHours = closeDate.diff(now, 'hours');
  const diffDays = closeDate.diff(now, 'days');
  
  if (diffMinutes <= 0) {
    return 'Expired';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} min`;
  } else if (diffHours < 24) {
    return `${diffHours} hr`;
  } else {
    return `${diffDays} day`;
  }
};
