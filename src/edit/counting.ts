/// <reference path="../lib/types.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
import { Component, NgFor, View, FORM_DIRECTIVES } from 'angular2/angular2';
import { FirebaseService } from '../lib/firebase';
import { Util } from '../lib/util';
declare var Rx;

@Component({
  selector: 'counting'
})
@View({
  directives: [NgFor, FORM_DIRECTIVES],
  template: `
    <p>counting</p>
    <p>questions</p>
    <ul>
      <li *ng-for="#q of questions">
        <p>question: {{ q.value }}</p>
        <form #f="form">
          <div *ng-for="#animal of q.animals">
            <input type="text" value="{{ animal.name }}">
            <input type="text" value="{{ animal.value }}">
          </div>
        </form>
        <button type="button">add animal</button>
        <button type="button" (click)="remove(q.value)">remove question</button>
      </li>
      <button type="button">add question</button>
    </ul>
  `
})
export class CountingComponent {
  questions: CountingQ[] = [];
  
  constructor(public firebase: FirebaseService) {
    Rx.Observable.create((observer: Rx.Observer<any>) => {
        this.firebase.dataRef.child('counting').on('value', (snapshot: FirebaseDataSnapshot) => {
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
  
  remove(value: number): void {
    this.firebase.dataRef.child(`counting/q${ Util.enumerate(value) }`).remove((error: any) => {
      if (error != null) {
        console.log("error");
        return;
      }
      this.renumberQuestions(value);
    });
  }
  
  private renumberQuestions(value: number): void {
    this.firebase.dataRef.child('counting').once('value', (snapshot: FirebaseDataSnapshot) => {
        var counter: number = value;
        var val: any = snapshot.val();
        var newVal: any = {};
        Object.keys(val).sort().forEach((key: string) => {
          if (key > `q${ Util.enumerate(counter) }`) {
            newVal[`q${ Util.enumerate(counter) }`] = val[key];
            counter++;
          } else {
            newVal[key] = val[key];
          }
        });
        this.firebase.dataRef.child('counting').set(newVal);
      });
  }
}