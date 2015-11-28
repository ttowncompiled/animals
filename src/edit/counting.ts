/// <reference path="../lib/types.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
import { Component, Control, ControlGroup, NgFor, View, FORM_DIRECTIVES } from 'angular2/angular2';
import { FirebaseService } from '../lib/firebase';
declare var Rx;

interface Question {
  value: number;
  animals: ControlGroup[];
}

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
        <div *ng-for="#animal of q.animals">
          <form [ng-form-model]="animal">
            <input type="text" [ng-form-control]="animal.controls['name']">
            <input type="text" [ng-form-control]="animal.controls['count']">
          </form>
        </div>
        <button type="button">add animal</button>
        <button type="button" (click)="remove(q.value)">remove question</button>
      </li>
      <button type="button">add question</button>
    </ul>
  `
})
export class CountingComponent {
  questions: Question[] = [];
  
  constructor(public firebase: FirebaseService) {
    this.firebase.onChild('counting')
      .flatMap((qs: CountingQ[]) => {
        var counter: number = 0;
        return Rx.Observable.from(qs)
          .flatMap((q: CountingQ) => {
            return Rx.Observable.from(Object.keys(q))
              .map((animal: string) => q[animal])
              .map((pair: AnimalCount) => {
                return new ControlGroup({
                  name: new Control(pair.name),
                  count: new Control(pair.count)
                });
              })
              .toArray();
          })
          .map((groups: ControlGroup[]) => {
            counter++;
            return { value: counter, animals: groups }
          })
          .toArray();
      })
      .subscribeOnNext((questions: Question[]) => {
        this.questions = questions;
      });
  }
  
  remove(value: number): void {
    this.firebase.dataRef.child(`counting/${ FirebaseService.questionFormat(value) }`).remove((error: any) => {
      if (error != null) {
        console.log("error");
        return;
      }
      this.firebase.renumberQuestions('counting', value);
    });
  }
}