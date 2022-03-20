import { SetStateAction, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function usePersistent<T>(
  key: string, data: T | (() => T)): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>] {
  const [ps, setPs] = useState<T>();
  useEffect(() => {
    (async () => {
      let localData = await AsyncStorage.getItem(key);
      if (localData === null){
        data = typeof data === "function" ? (data as Function)() : data;
        localStorage.setItem(key, JSON.stringify(data));
      } else {
        if (localData === 'undefined')
          data = undefined as unknown as T;
        else 
          data = JSON.parse(localData) as T;
      }
      setPs(data);
    })();
  }, []);

  return [ps, (value: SetStateAction<T | undefined>) => {
    AsyncStorage.setItem(key, JSON.stringify(value)).finally(() => {
      setPs(value);
    });
  }];
}
