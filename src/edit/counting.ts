import { Component, View } from 'angular2/angular2';
import { FirebaseService } from '../services/firebase';

@Component({
  selector: 'counting'
})
@View({
  template: `
    <p>counting</p>
  `
})
export class CountingComponent {
  constructor(public firebase: FirebaseService) {
    console.log("hello world");
    firebase.dataRef.child('counting').on('value', (snapshot: FirebaseDataSnapshot) => {
      console.log(snapshot.val());
    });
  }
}