import { SetStateAction, useState } from 'react';

export default function usePersistent<T>(
  key: string, data: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
  let localData = localStorage.getItem(key);
  if (localData === null){
    data = typeof data === "function" ? (data as Function)() : data;
    localStorage.setItem(key, JSON.stringify(data));
  } else {
    if (localData === 'undefined')
      data = undefined as unknown as T;
    else 
      data = JSON.parse(localData) as T;
  }
  const [ps, setPs] = useState<T>(data);
  
  return [ps, (value: SetStateAction<T>) => {
    localStorage.setItem(key, JSON.stringify(value));
    setPs(value);
  }];
}
