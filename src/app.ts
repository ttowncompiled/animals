import { bind, bootstrap, Component, View } from 'angular2/angular2';
import {
  APP_BASE_HREF,
  ROUTER_BINDINGS,
  ROUTER_DIRECTIVES,
  ROUTER_PRIMARY_COMPONENT,
  Router,
  RouteConfig
} from 'angular2/router';

import { MathComponent } from './edit/math';

@Component({
  selector: 'app'
})
@View({
  directives: [ROUTER_DIRECTIVES],
  template: `
    <a [router-link]="['/Math']">Math</a>
    <router-outlet></router-outlet>
  `
})
@RouteConfig([
  { path: '/', redirectTo: '/math' },
  { path: '/math', as: 'Math', component: MathComponent }
])
export class AppComponent {
  constructor(public router: Router) {}
}

bootstrap(AppComponent, [
  ROUTER_BINDINGS,
  bind(ROUTER_PRIMARY_COMPONENT).toValue(AppComponent),
  bind(APP_BASE_HREF).toValue('/')
]);