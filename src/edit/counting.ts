/// <reference path="../lib/types.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
import { Component, NgFor, View } from 'angular2/angular2';
import { FirebaseService } from '../lib/firebase';
declare var Rx;

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
    Rx.Observable.create((observer: Rx.Observer<any>) => {
        firebase.dataRef.child('counting').on('value', (snapshot: FirebaseDataSnapshot) => {
          observer.onNext(snapshot.val());
        });
      })
      .flatMap((val: any) => {
        return Rx.Observable.from(Object.keys(val).sort())
          .map((key: string) => val[key])
          .toArray();
      })
      .flatMap((qs: {[animal: string]: AnimalValuePair}[]) => {
        var counting: number = 0;
        return Rx.Observable.from(qs)
          .flatMap((q: {[animal: string]: AnimalValuePair}) => {
            return Rx.Observable.from(Object.keys(q))
              .map((animal: string) => q[animal])
              .toArray();
          })
          .map((pairs: AnimalValuePair[]) => {
            counting++;
            return { value: counting, animals: pairs }
          })
          .toArray();
      })
      .subscribeOnNext((questions: CountingQ[]) => {
        this.questions = questions;
      });
  }
}