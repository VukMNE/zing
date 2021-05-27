import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LangService {
  public languageChanged = new EventEmitter<string>();

  constructor() { }
}
