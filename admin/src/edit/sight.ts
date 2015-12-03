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
import { ANIMALS, capitalize, Question } from '../lib/lib';
declare var Rx;

@Component({
  selector: 'sight'
})
@View({
  directives: [FORM_DIRECTIVES, NgFor],
  templateUrl: 'src/edit/sight.html',
  encapsulation: ViewEncapsulation.None
})
export class SightComponent {
  static CHILD: string = 'sight';
  ANIMAL_NAMES: string[] = ANIMALS.sort();
  questions: Question[] = [];
  new_question: Control = new Control("");
  
  constructor(public firebase: FirebaseService) {
    this.firebase.onChild(SightComponent.CHILD)
      .flatMap((qs: SightQ[]) => {
        var counter: number = 0;
        return Rx.Observable.from(qs)
          .map((q: SightQ) => {
            return Object.keys(q)
              .map((animal: string) => q[animal])
              .sort((left: SightWord, right: SightWord) => left.createdAt - right.createdAt)
              .map((pair: SightWord) => {
                return  new ControlGroup({
                  name: new Control(pair.name),
                  createdAt: new Control(pair.createdAt)
                });
              });
          })
          .map((groups: ControlGroup[]) => {
            counter++;
            groups.forEach((g: ControlGroup) => {
              this.firebase.observeChanges(g, SightComponent.CHILD, counter, g.controls['name'].value);
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
        var value: any = { name: name, createdAt: Firebase.ServerValue.TIMESTAMP };
        this.firebase.addAnimal(SightComponent.CHILD, question, name, value)
      });
  }
  
  listenForNewQuestion(): void {
    this.new_question.valueChanges
      .debounceTime(500)
      .subscribe((name: string) => {
        var value: any = { name: name, createdAt: Firebase.ServerValue.TIMESTAMP };
        this.firebase.addQuestion(SightComponent.CHILD, this.questions.length+1, name, value);
        this.new_question = new Control("");
        this.listenForNewQuestion();
      });
  }
  
  removeAnimal(question: number, name: string): void {
    this.firebase.removeAnimal(SightComponent.CHILD, question, name);
  }
  
  removeQuestion(question: number): void {
    this.firebase.removeQuestion(SightComponent.CHILD, question);
  }
}