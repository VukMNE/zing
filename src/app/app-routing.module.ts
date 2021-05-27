import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { GameComponent } from './game/game.component';
import { LanguageResolverService } from './shared/services/resolvers/language-resolver.service';


const routes: Routes = [
  {path: '', component: MenuComponent, resolve: {language: LanguageResolverService}},
  {path: 'game/random', component: GameComponent},
  {path: 'game/monte-carlo', component: GameComponent},
  {path: 'game/basic-heuristic', component: GameComponent},
  {path: 'game/heuristic', component: GameComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
