import { bind, bootstrap, Component, NgClass, View, ViewEncapsulation } from 'angular2/angular2';
import {
  APP_BASE_HREF,
  ROUTER_BINDINGS,
  ROUTER_DIRECTIVES,
  ROUTER_PRIMARY_COMPONENT,
  HashLocationStrategy,
  LocationStrategy,
  Router,
  RouteConfig
} from 'angular2/router';
import { HomeComponent } from './game/home';
import { CountingGameComponent } from './game/counting_game';
import { WhatGameComponent } from './game/what_game';
import { MemoryGameComponent } from './game/memory_game';
import { ColorGameComponent } from './game/color_game';
import { FirebaseService } from './lib/firebase';
import { capitalize } from './lib/lib';

@Component({
  selector: 'app-game'
})
@View({
  directives: [ROUTER_DIRECTIVES, NgClass],
  templateUrl: 'src/app_game.html',
  encapsulation: ViewEncapsulation.None
})
@RouteConfig([
  { path: '/', redirectTo: '/home'},
  { path: '/home', as: 'Home', component: HomeComponent },
  { path: '/counting', as: 'Counting', component: CountingGameComponent },
  { path: '/what', as: 'What', component: WhatGameComponent },
  { path: '/memory', as: 'Memory', component: MemoryGameComponent },
  { path: '/color', as: 'Color', component: ColorGameComponent }
])
export class AppGameComponent {
  activePage: string = '';
  isHome: boolean = true;
  
  constructor(public router: Router) {}
  
  route(link: string): void {
    this.isHome = false;
    this.activePage = link;
  }
  
  setHome(): void {
    this.isHome = true;
    this.activePage = '';
  }
}

bootstrap(AppGameComponent, [
  ROUTER_BINDINGS,
  bind(ROUTER_PRIMARY_COMPONENT).toValue(AppGameComponent),
  bind(APP_BASE_HREF).toValue('/'),
  bind(LocationStrategy).toClass(HashLocationStrategy),
  FirebaseService
]);