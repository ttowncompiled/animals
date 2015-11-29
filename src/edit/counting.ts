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
  templateUrl: 'src/edit/counting.html',
  encapsulation: ViewEncapsulation.None
})
export class CountingComponent {
  static CHILD: string = 'counting';
  ANIMAL_NAMES: string[] = ANIMALS.sort();
  questions: Question[] = [];
  new_question: Control = new Control("");
  
  constructor(public firebase: FirebaseService) {
    this.firebase.onChild(CountingComponent.CHILD)
      .flatMap((qs: CountingQ[]) => {
        var counter: number = 0;
        return Rx.Observable.from(qs)
          .map((q: CountingQ) => {
            return Object.keys(q)
              .map((animal: string) => q[animal])
              .sort((left: AnimalCount, right: AnimalCount) => left.createdAt - right.createdAt)
              .map((pair: AnimalCount) => {
                return  new ControlGroup({
                  name: new Control(pair.name),
                  count: new Control(pair.count),
                  flag: new Control(pair.flag),
                  createdAt: new Control(pair.createdAt)
                });
              });
          })
          .map((groups: ControlGroup[]) => {
            counter++;
            groups.forEach((g: ControlGroup) => {
              this.firebase.observeChanges(g, CountingComponent.CHILD, counter, g.controls['name'].value);
            })
            var control: Control = new Control("");
            this.listenForNewAnimal(control, counter);
            return { value: counter, animals: groups, new_animal: control }
          })
          .toArray();
      })
      .subscribeOnNext((questions: Question[]) => {
        if (questions != null) {
          this.questions = questions;
        } else {
          this.questions = [];
        }
      });
    this.listenForNewQuestion();
  }
  
  capitalize(name: string): string {
    return capitalize(name);
  }
  
  listenForNewAnimal(control: Control, question: number): void {
    control.valueChanges
      .debounceTime(500)
      .subscribe((name: string) => {
        var value: any = { name: name, count: 0, flag: false, createdAt: Firebase.ServerValue.TIMESTAMP };
        this.firebase.addAnimal(CountingComponent.CHILD, question, name, value)
      });
  }
  
  listenForNewQuestion(): void {
    this.new_question.valueChanges
      .debounceTime(500)
      .subscribe((name: string) => {
        var value: any = { name: name, count: 0, flag: true, createdAt: Firebase.ServerValue.TIMESTAMP };
        this.firebase.addQuestion(CountingComponent.CHILD, this.questions.length+1, name, value);
        this.new_question = new Control("");
        this.listenForNewQuestion();
      });
  }
  
  removeAnimal(question: number, name: string): void {
    this.firebase.removeAnimal(CountingComponent.CHILD, question, name);
  }
  
  removeQuestion(question: number): void {
    this.firebase.removeQuestion(CountingComponent.CHILD, question);
  }
}