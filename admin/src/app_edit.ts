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
import { CountingComponent } from './edit/counting';
import { WhatComponent } from './edit/what';
import { SightComponent } from './edit/sight';
import { FirebaseService } from './lib/firebase';

@Component({
  selector: 'app-edit'
})
@View({
  directives: [ROUTER_DIRECTIVES, NgClass],
  templateUrl: 'src/app_edit.html',
  encapsulation: ViewEncapsulation.None
})
@RouteConfig([
  { path: '/', redirectTo: '/counting' },
  { path: '/counting', as: 'Counting', component: CountingComponent },
  { path: '/what', as: 'What', component: WhatComponent },
  { path: '/sight', as: 'Sight', component: SightComponent }
])
export class AppEditComponent {
  activePage: string = 'counting';
  
  constructor(public router: Router) {}
  
  setActive(page: string): void {
    this.activePage = page;
  }
}

bootstrap(AppEditComponent, [
  ROUTER_BINDINGS,
  bind(ROUTER_PRIMARY_COMPONENT).toValue(AppEditComponent),
  bind(APP_BASE_HREF).toValue('/'),
  bind(LocationStrategy).toClass(HashLocationStrategy),
  FirebaseService
]);