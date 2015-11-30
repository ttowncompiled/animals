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
import { CountingGameComponent } from './game/counting_game';
import { FirebaseService } from './lib/firebase';

@Component({
  selector: 'app-game'
})
@View({
  directives: [ROUTER_DIRECTIVES, NgClass],
  templateUrl: 'src/app_game.html',
  encapsulation: ViewEncapsulation.None
})
@RouteConfig([
  { path: '/', redirectTo: '/counting' },
  { path: '/counting', as: 'Counting', component: CountingGameComponent }
])
export class AppGameComponent {
  activePage: string = 'counting';
  
  constructor(public router: Router) {}
  
  setActive(page: string): void {
    this.activePage = page;
  }
}

bootstrap(AppGameComponent, [
  ROUTER_BINDINGS,
  bind(ROUTER_PRIMARY_COMPONENT).toValue(AppGameComponent),
  bind(APP_BASE_HREF).toValue('/'),
  bind(LocationStrategy).toClass(HashLocationStrategy),
  FirebaseService
]);