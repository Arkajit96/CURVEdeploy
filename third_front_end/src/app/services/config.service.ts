import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public url = 'http://localhost:3000';

  constructor() { }

  public getURL() {
    return this.url;
  }
}
