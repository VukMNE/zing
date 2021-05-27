import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { SharedModule } from './shared/shared.module';
import { LangService } from './shared/services/lang.service';
import { LanguageResolverService } from './shared/services/resolvers/language-resolver.service';
import { TranslateService } from '@ngx-translate/core';
import { GameComponent } from './game/game.component';
import { UtilService } from './shared/services/util.service';
import { GameCardComponent } from './components/game-card/game-card.component';
import { GameService } from './shared/services/game.service';
import { PointsBoxComponent } from './components/points-box/points-box.component';
import { DataService } from './shared/services/data.service';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    GameComponent,
    GameCardComponent,
    PointsBoxComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    })
  ],
  providers: [
    HttpClient,
    TranslateService,
    LangService,
    LanguageResolverService,
    UtilService,
    GameService,
    DataService
  ],
  bootstrap: [AppComponent]
})


export class AppModule { }


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
