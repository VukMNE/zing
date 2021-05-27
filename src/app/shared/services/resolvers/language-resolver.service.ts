import { Injectable } from '@angular/core';
import { Subscription, forkJoin, Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LangService } from '../lang.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LanguageResolverService {

  constructor(private translate: TranslateService,
              private langService: LangService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    if(route.params != null && route.params !== undefined) {
      if(route.params.language != null && route.params.language !== undefined) {
        // if language is passed within route
        const lang = route.params.language === 'en' ? 'en' : (route.params.language === 'me' ? 'me' : 'si');
        this.translate.setDefaultLang(lang);
        this.translate.currentLang = lang;
        this.langService.languageChanged.emit(lang);
        return of({language: lang});
      } else {
        // If no language parameter is passed
        this.translate.setDefaultLang('en');
        this.translate.currentLang = 'en';
        this.langService.languageChanged.emit('en');
        return of({language: 'en'});
      }
    } else {
      // If no parameters are passed
      this.translate.setDefaultLang('en');
      this.translate.currentLang = 'en';
      this.langService.languageChanged.emit('en');
      return of({language: 'en'});
    }
    return of(route.params);
  }
}
