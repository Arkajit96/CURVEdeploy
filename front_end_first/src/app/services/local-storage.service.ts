import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  get(key:string) {
    var val = localStorage.getItem(key);
    if (val) {
      return val;
    } else {
      return null
    }
  }

  set(key:string, value:any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  delete(key:string) {
    localStorage.removeItem(key);
  }
}
