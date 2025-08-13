import { MMKV } from 'react-native-mmkv';

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
