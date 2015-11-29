/// <reference path="../lib/types.d.ts" />
import {
  FORM_DIRECTIVES,
  Component,
  Control,
  ControlGroup,
  NgFor,
  View,
  ViewEncapsulation
} from 'angular2/angular2';
import { FirebaseService } from '../lib/firebase';
import { ANIMALS, capitalize } from '../lib/lib';
declare var Rx;

interface Question {
  value: number;
  animals: ControlGroup[];
  new_animal: Control;
}

@Component({
  selector: 'counting'
})
@View({
  directives: [FORM_DIRECTIVES, NgFor],
  template: `
    <p>counting</p>
    <p>questions</p>
    <ul>
      <li *ng-for="#q of questions">
        <p>question: {{ q.value }}</p>
        <div *ng-for="#animal of q.animals">
          <form [ng-form-model]="animal">
            <select [ng-form-control]="animal.controls['name']">
              <option *ng-for="#name of ANIMAL_NAMES" [value]="name">{{ capitalize(name) }}</option>
            </select>
            <input type="text" [ng-form-control]="animal.controls['count']">
          </form>
        </div>
        <select [ng-form-control]="q.new_animal">
          <option value="none" selected>None</option>
          <option *ng-for="#name of ANIMAL_NAMES" [value]="name">{{ capitalize(name) }}</option>
        </select>
        <button type="button" (click)="remove(q.value)">remove question</button>
      </li>
      <button type="button">add question</button>
    </ul>
  `,
  encapsulation: ViewEncapsulation.None
})
export class CountingComponent {
  static CHILD: string = 'counting';
  ANIMAL_NAMES: string[] = ANIMALS;
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
            var control: Control = new Control("");
            this.listenForNewAnimal(control, counter);
            return { value: counter, animals: groups, new_animal: control }
          })
          .toArray();
      })
      .subscribeOnNext((questions: Question[]) => {
        this.questions = questions;
      });
  }
  
  capitalize(name: string): string {
    return capitalize(name);
  }
  
  listenForNewAnimal(control: Control, question: number): void {
    control.valueChanges.subscribe((name: any) => {
      var value: any = { name: name, count: 0 };
      this.firebase.addAnimal(CountingComponent.CHILD, question, name, value)
    });
  }
  
  remove(value: number): void {
    this.firebase.removeQuestion(CountingComponent.CHILD, value);
  }
}