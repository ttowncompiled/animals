/// <reference path="../lib/types.d.ts" />
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
  static CHILD: string = 'counting';
  questions: Question[] = [];
  
  constructor(public firebase: FirebaseService) {
    this.firebase.onChild(CountingComponent.CHILD)
      .flatMap((qs: CountingQ[]) => {
        var counter: number = 0;
        return Rx.Observable.from(qs)
          .flatMap((q: CountingQ) => {
            counter++;
            return Rx.Observable.from(Object.keys(q))
              .map((animal: string) => q[animal])
              .map((pair: AnimalCount) => {
                var group: ControlGroup = new ControlGroup({
                  name: new Control(pair.name),
                  count: new Control(pair.count)
                });
                this.firebase.observeChanges(group, CountingComponent.CHILD, counter, pair.name);
                return group;
              })
              .toArray();
          })
          .map((groups: ControlGroup[]) => {
            return { value: counter, animals: groups }
          })
          .toArray();
      })
      .subscribeOnNext((questions: Question[]) => {
        this.questions = questions;
      });
  }
  
  remove(value: number): void {
    var child: string = `${ CountingComponent.CHILD }/${ FirebaseService.questionFormat(value) }`;
    this.firebase.dataRef.child(child).remove((error: any) => {
      if (error != null) {
        console.error(error);
        return;
      }
      this.firebase.renumberQuestions(CountingComponent.CHILD, value);
    });
  }
}