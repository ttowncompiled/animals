/// <reference path="../lib/types.d.ts" />
import { Component, NgFor, View } from 'angular2/angular2';
import { FirebaseService } from '../lib/firebase';

@Component({
  selector: 'counting'
})
@View({
  directives: [NgFor],
  template: `
    <p>counting</p>
    <p>questions</p>
    <ul>
      <li *ng-for="#q of questions">
        <p>question: {{ q.value }}</p>
        <div *ng-for="#animal of q.animals">
          <p>name: {{ animal.name }}</p>
          <p>value: {{ animal.value }}</p>
      </li>
    </ul>
  `
})
export class CountingComponent {
  questions: CountingQ[] = [];
  constructor(public firebase: FirebaseService) {
    firebase.dataRef.child('counting').on('value', (snapshot: FirebaseDataSnapshot) => {
      var val: any = snapshot.val();
      var questions: CountingQ[] = [];
      var counter: number = 0;
      Object.keys(val).sort().forEach((key: string) => {
        counter++;
        var pairs: AnimalValuePair[] = [];
        Object.keys(val[key]).forEach((animal: string) => {
          pairs.push(val[key][animal]);
        });
        questions.push({ value: counter, animals: pairs });
      });
      this.questions = questions;
    });
  }
}