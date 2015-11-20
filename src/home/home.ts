import { Component, View } from 'angular2/angular2';

@Component({
  selector: 'home'
})
@View({
  template: `
    <a class="waves-effect waves-light btn-large">Edit</a>
    <a class="waves-effect waves-light btn-large">Play</a>
  `
})
export class Home {
  
}