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
import { ANIMALS, COLORS, capitalize, Question } from '../lib/lib';
declare var Rx;

@Component({
  selector: 'color'
})
@View({
  directives: [FORM_DIRECTIVES, NgFor],
  templateUrl: 'src/edit/color.html',
  encapsulation: ViewEncapsulation.None
})
export class ColorComponent {
  static CHILD: string = 'color';
  ANIMAL_NAMES: string[] = ANIMALS.sort();
  COLORS: string[] = Object.keys(COLORS).sort();
  questions: Question[] = [];
  new_question: Control = new Control("");
  
  constructor(public firebase: FirebaseService) {
    this.firebase.onChild(ColorComponent.CHILD)
      .flatMap((qs: ColorQ[]) => {
        var counter: number = 0;
        return Rx.Observable.from(qs)
          .map((q: ColorQ) => {
            return Object.keys(q)
              .map((animal: string) => q[animal])
              .sort((left: AnimalColor, right: AnimalColor) => left.createdAt - right.createdAt)
              .map((pair: AnimalColor) => {
                return  new ControlGroup({
                  name: new Control(pair.name),
                  color: new Control(pair.color),
                  createdAt: new Control(pair.createdAt)
                });
              });
          })
          .map((groups: ControlGroup[]) => {
            counter++;
            groups.forEach((g: ControlGroup) => {
              this.firebase.observeChanges(g, ColorComponent.CHILD, counter, g.controls['name'].value);
            })
            var control: Control = new Control("");
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
  
  listenForNewQuestion(): void {
    this.new_question.valueChanges
      .debounceTime(500)
      .subscribe((name: string) => {
        var value: any = { name: name, color: '', createdAt: Firebase.ServerValue.TIMESTAMP };
        this.firebase.addQuestion(ColorComponent.CHILD, this.questions.length+1, name, value);
        this.new_question = new Control("");
        this.listenForNewQuestion();
      });
  }
  
  removeAnimal(question: number, name: string): void {
    this.firebase.removeAnimal(ColorComponent.CHILD, question, name);
  }
  
  removeQuestion(question: number): void {
    this.firebase.removeQuestion(ColorComponent.CHILD, question);
  }
}