import { bind, bootstrap, Component, View, ViewEncapsulation } from 'angular2/angular2';
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
import { CountingComponent } from './edit/counting';
import { WhatComponent } from './edit/what';
import { FirebaseService } from './lib/firebase';

@Component({
  selector: 'app'
})
@View({
  directives: [ROUTER_DIRECTIVES],
  templateUrl: 'src/app.html',
  encapsulation: ViewEncapsulation.None
})
@RouteConfig([
  { path: '/', redirectTo: '/counting' },
  { path: '/counting', as: 'Counting', component: CountingComponent },
  { path: '/what', as: 'What', component: WhatComponent }
])
export class AppComponent {
  constructor(public router: Router) {}
}

bootstrap(AppComponent, [
  ROUTER_BINDINGS,
  bind(ROUTER_PRIMARY_COMPONENT).toValue(AppComponent),
  bind(APP_BASE_HREF).toValue('/'),
  bind(LocationStrategy).toClass(HashLocationStrategy),
  FirebaseService
]);