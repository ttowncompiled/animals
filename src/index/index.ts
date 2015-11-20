import { bind, bootstrap, Component, View } from 'angular2/angular2';
import {
  APP_BASE_HREF,
  ROUTER_BINDINGS,
  ROUTER_DIRECTIVES,
  ROUTER_PRIMARY_COMPONENT,
  Router,
  RouteConfig
} from 'angular2/router';

import { Home } from '../home/home';

@Component({
  selector: 'index'
})
@View({
  directives: [ROUTER_DIRECTIVES],
  template: `
    <div class="row">
      <div class="col s12">
        <a [router-link]="['/Home']">Home</a>
      </div>
    </div>
    <div class="container">
      <div class="center-align">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
@RouteConfig([
  { path: "/", redirectTo: "/home" },
  { path: "/home", as: "Home", component: Home }
])
export class Index {
  constructor(public router: Router) {}
}

bootstrap(Index, [
  ROUTER_BINDINGS,
  bind(ROUTER_PRIMARY_COMPONENT).toValue(Index),
  bind(APP_BASE_HREF).toValue('/')
]);