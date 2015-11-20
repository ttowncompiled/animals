import { Component, View } from 'angular2/angular2';
import { ROUTER_DIRECTIVES } from 'angular2/router';

@Component({
  selector: 'home'
})
@View({
  directives: [ROUTER_DIRECTIVES],
  template: `
    <a class="waves-effect waves-light btn-large" [router-link]="['/Edit']">Edit</a>
    <a class="waves-effect waves-light btn-large">Play</a>
  `
})
export class Home {
  
}