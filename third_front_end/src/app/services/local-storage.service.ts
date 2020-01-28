import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  get(key: string) {
    const val = localStorage.getItem(key);
    if (val) {
      return val;
    } else {
      return null;
    }
  }

  set(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  delete(key: string) {
    localStorage.removeItem(key);
  }
}
